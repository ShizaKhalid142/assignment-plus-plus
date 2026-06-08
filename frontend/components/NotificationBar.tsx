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
    <div style={{ background: 'var(--dark-blue)', color: 'white', padding: '12px 16px', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
      <p style={{ fontWeight: 600 }}>🔔 Notifications {unread > 0 ? `(${unread} unread)` : ''}</p>
      <div style={{ position: 'relative' }}>
        <button onClick={() => setShowDropdown(!showDropdown)} style={{ background: 'transparent', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', transition: 'opacity 0.2s ease' }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}>
          View
        </button>
        {showDropdown && (
          <div style={{ position: 'absolute', top: '100%', right: 0, background: 'rgba(15, 23, 42, 0.95)', color: 'white', borderRadius: '16px', boxShadow: '0 24px 80px rgba(0, 0, 0, 0.35)', border: '1px solid rgba(255, 255, 255, 0.12)', width: '320px', maxHeight: '384px', overflowY: 'auto', zIndex: 50, marginTop: '8px' }}>
            {items.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: 'rgba(255,255,255,0.65)' }}>No notifications</div>
            ) : (
              items.map(notif => (
                <div key={notif.id} onClick={() => markAsRead(notif.id)} style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', background: !notif.is_read ? 'rgba(88, 204, 2, 0.08)' : 'rgba(255,255,255,0.03)', transition: 'background-color 0.2s ease' }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(88, 204, 2, 0.12)')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = !notif.is_read ? 'rgba(88, 204, 2, 0.08)' : 'rgba(255,255,255,0.03)')}>
                  <p style={{ fontWeight: 600, fontSize: '14px', color: 'white' }}>{notif.title}</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginTop: '4px' }}>{notif.message}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
