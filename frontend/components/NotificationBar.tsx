import { useEffect, useState } from 'react';

import { apiFetch } from '../lib/api';

type Notification = { id: number; title: string; message: string; is_read: boolean };

export default function NotificationBar() {
  const [items, setItems] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await apiFetch<Notification[]>('/notifications');
        setItems(data || []);
      } catch (err) {
        console.error('Failed to load notifications');
      }
    };

    loadNotifications();
    const interval = setInterval(loadNotifications, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const unread = items.filter((n) => !n.is_read).length;
  
  const markAsRead = async (notificationId: number) => {
    try {
      await apiFetch(`/notifications/${notificationId}/read`, { method: 'PUT' });
      setItems(items.map(n => n.id === notificationId ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error('Failed to mark notification as read');
    }
  };

  return (
    <div className="bg-navy-900 text-white px-4 py-2 text-sm flex items-center justify-between relative">
      <p className="font-medium">🔔 Notifications {unread > 0 ? `(${unread} unread)` : ''}</p>
      <div className="relative">
        <button onClick={() => setShowDropdown(!showDropdown)} className="hover:bg-navy-800 px-3 py-1 rounded transition">
          View
        </button>
        {showDropdown && (
          <div className="absolute top-full right-0 bg-white text-navy-900 rounded-lg shadow-xl border border-navy-200 w-80 max-h-96 overflow-y-auto z-50 mt-2">
            {items.length === 0 ? (
              <div className="p-4 text-center text-gray-600">No notifications</div>
            ) : (
              items.map(notif => (
                <div key={notif.id} onClick={() => markAsRead(notif.id)} className={`p-4 border-b border-navy-100 cursor-pointer hover:bg-navy-50 transition ${!notif.is_read ? 'bg-blue-50' : ''}`}>
                  <p className="font-semibold text-sm">{notif.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
