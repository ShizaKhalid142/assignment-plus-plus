/**
 * API utility for communicating with the Assignment++ backend
 * Handles authentication tokens and error handling
 */

const DEFAULT_API_PORT = 8000;
const browserHost = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (typeof window !== 'undefined'
    ? `${window.location.protocol}//${browserHost}:${DEFAULT_API_PORT}`
    : `http://${browserHost}:${DEFAULT_API_PORT}`);

export interface ApiError {
  detail: string;
  status: number;
}

/**
 * Centralized API fetch function with token-aware headers
 */
export async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  // Normalize API endpoint paths: backend routes are all mounted under /api
  if (!path.startsWith('/api') && !path.startsWith('http')) {
    path = path.startsWith('/') ? `/api${path}` : `/api/${path}`;
  }

  // Get token from localStorage if available
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('assignmentpp_token') 
    : null;

  // Build headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  // Add authorization header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Make the request
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Handle errors
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    // FastAPI validation errors come as detail: [{type, loc, msg, ...}]
    let detail = body.detail;
    if (Array.isArray(detail)) {
      detail = detail.map((e: any) => `${e.msg || ''} (${(e.loc || []).join(' → ')})`).join('; ');
    }
    const message = detail || body.message || `HTTP ${response.status}: ${response.statusText}`;
    const error = new Error(message) as Error & { status?: number; detail?: string };
    error.status = response.status;
    error.detail = typeof detail === 'string' ? detail : String(detail || '');
    throw error;
  }

  // Return JSON response
  return response.json() as Promise<T>;
}

/**
 * Session management functions
 */
export function saveSession(token: string, role: 'student' | 'teacher' | 'admin', userId?: number) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('assignmentpp_token', token);
    localStorage.setItem('assignmentpp_role', role);
    if (userId) localStorage.setItem('assignmentpp_userId', userId.toString());
  }
}

export function clearSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('assignmentpp_token');
    localStorage.removeItem('assignmentpp_role');
    localStorage.removeItem('assignmentpp_userId');
  }
}

export function getSession() {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('assignmentpp_token');
  const role = localStorage.getItem('assignmentpp_role') as 'student' | 'teacher' | 'admin' | null;
  const userId = localStorage.getItem('assignmentpp_userId');
  return token ? { token, role, userId: userId ? parseInt(userId) : undefined } : null;
}

export function getRole(): 'student' | 'teacher' | 'admin' | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('assignmentpp_role') as 'student' | 'teacher' | 'admin' | null;
}

export function getUserId(): number | null {
  if (typeof window === 'undefined') return null;
  const userId = localStorage.getItem('assignmentpp_userId');
  return userId ? parseInt(userId) : null;
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('assignmentpp_token');
}

/**
 * Authentication API calls
 */
export const authApi = {
  register: (data: { email: string; password: string; name: string; role: 'student' | 'teacher' }) =>
    apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (email: string, password: string) =>
    apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    apiFetch('/api/auth/logout', { method: 'POST' }),

  getProfile: () =>
    apiFetch('/api/auth/profile'),

  updateProfile: (data: any) =>
    apiFetch('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  changePassword: (oldPassword: string, newPassword: string) =>
    apiFetch('/api/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
    }),

  forgotPassword: (email: string) =>
    apiFetch('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, newPassword: string) =>
    apiFetch('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, new_password: newPassword }),
    }),
};

/**
 * Courses API calls
 */
export const coursesApi = {
  list: () =>
    apiFetch('/api/courses'),

  get: (courseId: number) =>
    apiFetch(`/api/courses/${courseId}`),

  create: (data: any) =>
    apiFetch('/api/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (courseId: number, data: any) =>
    apiFetch(`/api/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (courseId: number) =>
    apiFetch(`/api/courses/${courseId}`, { method: 'DELETE' }),

  enroll: (courseId: number) =>
    apiFetch(`/api/courses/${courseId}/enroll`, { method: 'POST' }),

  registerStudent: (courseId: number, studentId: number) =>
    apiFetch(`/api/courses/${courseId}/register-student`, {
      method: 'POST',
      body: JSON.stringify({ student_id: studentId }),
    }),

  getStudents: (courseId: number) =>
    apiFetch(`/api/courses/${courseId}/students`),

  getAnalytics: (courseId: number) =>
    apiFetch(`/api/courses/${courseId}/analytics`),
};

/**
 * Assignments API calls
 */
export const assignmentsApi = {
  list: (courseId?: number) => {
    const params = courseId ? `?course_id=${courseId}` : '';
    return apiFetch(`/api/assignments${params}`);
  },

  get: (assignmentId: number) =>
    apiFetch(`/api/assignments/${assignmentId}`),

  create: (data: any) =>
    apiFetch('/api/assignments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (assignmentId: number, data: any) =>
    apiFetch(`/api/assignments/${assignmentId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (assignmentId: number) =>
    apiFetch(`/api/assignments/${assignmentId}`, { method: 'DELETE' }),
};

/**
 * Submissions API calls
 */
export const submissionsApi = {
  list: (assignmentId?: number) => {
    const params = assignmentId ? `?assignment_id=${assignmentId}` : '';
    return apiFetch(`/api/submissions${params}`);
  },

  get: (submissionId: number) =>
    apiFetch(`/api/submissions/${submissionId}`),

  create: (data: any) =>
    apiFetch('/api/submissions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (submissionId: number, data: any) =>
    apiFetch(`/api/submissions/${submissionId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getPlagiarism: (submissionId: number) =>
    apiFetch(`/api/submissions/${submissionId}/plagiarism`),

  getDraftFeedback: (submissionId: number) =>
    apiFetch(`/api/submissions/${submissionId}/draft-feedback`, {
      method: 'POST',
    }),
};

/**
 * Grades API calls
 */
export const gradesApi = {
  create: (data: any) =>
    apiFetch('/api/grades', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  get: (submissionId: number) =>
    apiFetch(`/api/grades/${submissionId}`),
};

/**
 * Feedback API calls
 */
export const feedbackApi = {
  create: (data: any) =>
    apiFetch('/api/feedback', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  get: (submissionId: number) =>
    apiFetch(`/api/feedback/${submissionId}`),
};

/**
 * Notifications API calls
 */
export const notificationsApi = {
  list: () =>
    apiFetch('/api/notifications'),

  markAsRead: (notificationId: number) =>
    apiFetch(`/api/notifications/${notificationId}/read`, {
      method: 'PUT',
    }),

  delete: (notificationId: number) =>
    apiFetch(`/api/notifications/${notificationId}`, { method: 'DELETE' }),
};

/**
 * AI Services API calls
 */
export const aiApi = {
  getHints: (question: string, assignmentId?: number) =>
    apiFetch('/api/ai/hints', {
      method: 'POST',
      body: JSON.stringify({ question, assignment_id: assignmentId }),
    }),

  getDraftGrade: (submissionId: number) =>
    apiFetch('/api/ai/grade-draft', {
      method: 'POST',
      body: JSON.stringify({ submission_id: submissionId }),
    }),

  generateFeedback: (submissionId: number) =>
    apiFetch('/api/ai/feedback', {
      method: 'POST',
      body: JSON.stringify({ submission_id: submissionId }),
    }),
};

/**
 * Dashboard API calls
 */
export const dashboardApi = {
  getTeacherStats: () =>
    apiFetch('/api/dashboard/teacher'),

  getStudentStats: () =>
    apiFetch('/api/dashboard/student'),
};

/**
 * Policies API calls
 */
export const policiesApi = {
  // Submission policies
  getSubmissionPolicy: (assignmentId: number) =>
    apiFetch(`/api/policies/submission/${assignmentId}`),

  createSubmissionPolicy: (data: {
    assignment_id: number;
    allowed_resources?: string;
    hint_only_mode?: boolean;
    citation_required?: boolean;
  }) =>
    apiFetch('/api/policies/submission', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateSubmissionPolicy: (assignmentId: number, data: {
    allowed_resources?: string;
    hint_only_mode?: boolean;
    citation_required?: boolean;
  }) =>
    apiFetch(`/api/policies/submission/${assignmentId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  checkPolicyCompliance: (assignmentId: number) =>
    apiFetch(`/api/policies/submission/${assignmentId}/check`),

  // Grading policies / Feedback templates
  listGradingPolicies: () =>
    apiFetch('/api/policies/grading'),

  getGradingPolicy: (policyId: number) =>
    apiFetch(`/api/policies/grading/${policyId}`),

  createGradingPolicy: (data: {
    name: string;
    feedback_template: string;
    late_penalty_percent?: number;
  }) =>
    apiFetch('/api/policies/grading', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateGradingPolicy: (policyId: number, data: {
    name?: string;
    feedback_template?: string;
    late_penalty_percent?: number;
  }) =>
    apiFetch(`/api/policies/grading/${policyId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteGradingPolicy: (policyId: number) =>
    apiFetch(`/api/policies/grading/${policyId}`, { method: 'DELETE' }),

  applyTemplate: (gradingPolicyId: number, submissionId: number) =>
    apiFetch('/api/policies/grading/apply-template', {
      method: 'POST',
      body: JSON.stringify({
        grading_policy_id: gradingPolicyId,
        submission_id: submissionId,
      }),
    }),
};

/**
 * Export API calls
 */
export const exportApi = {
  exportCourse: (courseId: number, format: 'csv' | 'excel' | 'json' = 'csv') =>
    apiFetch('/api/export', {
      method: 'POST',
      body: JSON.stringify({ course_id: courseId, format }),
    }),

  exportSubmissions: (assignmentId: number, format: 'csv' | 'excel' | 'json' = 'csv') =>
    apiFetch(`/api/export/submissions/${assignmentId}`, {
      method: 'POST',
      body: JSON.stringify({ format }),
    }),
};

/**
 * Peer Review API calls
 */
export const peerReviewApi = {
  create: (data: { submission_id: number; reviewer_id: number; score: number; comments: string }) =>
    apiFetch('/api/peer-reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  list: (submissionId: number) =>
    apiFetch(`/api/peer-reviews/${submissionId}`),

  getStats: (submissionId: number) =>
    apiFetch(`/api/peer-reviews/${submissionId}/stats`),
};

export default apiFetch;
