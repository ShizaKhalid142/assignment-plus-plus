import { useEffect, useState } from 'react';

import { apiFetch } from '../lib/api';

type Notification = { id: number; title: string; message: string; is_read: boolean };

export default function NotificationBar() {
  const [items, setItems] = useState<Notification[]>([]);

  useEffect(() => {
    apiFetch<Notification[]>('/notifications').then(setItems).catch(() => setItems([]));
  }, []);

  const unread = items.filter((n) => !n.is_read).length;
  return (
    <div className="bg-navy-900 text-white px-4 py-2 text-sm flex items-center justify-between">
      <p className="font-medium">🔔 Notifications {unread > 0 ? `(${unread} unread)` : ''}</p>
      <p className="text-white/80 hidden sm:block">Stay updated with assignment deadlines and grading updates</p>
    </div>
  );
}
