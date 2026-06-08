import { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await apiFetch('/notifications');
      setNotifications(data || []);
    } catch (err) {
      console.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-20 right-4 w-96 bg-white rounded-2xl shadow-2xl border border-navy-200 p-4 z-50 max-h-96 overflow-y-auto">
      <h3 className="font-bold text-navy-900 mb-3 flex items-center">
        🔔 Notifications {notifications.length > 0 && <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">{notifications.length}</span>}
      </h3>
      
      {loading ? (
        <p className="text-sm text-gray-600">Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-sm text-gray-600">No notifications</p>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif: any) => (
            <div key={notif.id} className="p-3 bg-navy-50 rounded-lg border-l-4 border-navy-600">
              <p className="font-semibold text-sm text-navy-900">{notif.title}</p>
              <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
