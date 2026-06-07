/**
 * Session management utilities for Assignment++
 * Handles token storage, role persistence, and auth state
 */

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

const TOKEN_KEY = 'assignmentpp_token';
const USER_KEY = 'assignmentpp_user';
const ROLE_KEY = 'assignmentpp_role';

/**
 * Store authentication token and user info
 */
export function setAuth(response: AuthResponse) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, response.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    localStorage.setItem(ROLE_KEY, response.user.role);
  }
}

/**
 * Get stored authentication token
 */
export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

/**
 * Get stored user info
 */
export function getUser(): User | null {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }
  return null;
}

/**
 * Get stored user role
 */
export function getRole(): 'student' | 'teacher' | 'admin' | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(ROLE_KEY) as 'student' | 'teacher' | 'admin' | null;
  }
  return null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}

/**
 * Check if user is a teacher
 */
export function isTeacher(): boolean {
  return getRole() === 'teacher';
}

/**
 * Check if user is a student
 */
export function isStudent(): boolean {
  return getRole() === 'student';
}

/**
 * Clear authentication (logout)
 */
export function clearAuth() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ROLE_KEY);
  }
}

export default {
  setAuth,
  getToken,
  getUser,
  getRole,
  isAuthenticated,
  isTeacher,
  isStudent,
  clearAuth,
};
