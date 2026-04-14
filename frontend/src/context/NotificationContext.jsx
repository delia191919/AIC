import { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Initialize from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('notifications');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setNotifications(parsed);
                setUnreadCount(parsed.filter(n => !n.read).length);
            } catch (e) {
                console.error("Failed to parse notifications", e);
            }
        }
    }, []);

    // Save to localStorage whenever notifications change
    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
        setUnreadCount(notifications.filter(n => !n.read).length);
    }, [notifications]);

    const addNotification = (message, type) => {
        const newNotif = {
            id: Date.now() + Math.random().toString(),
            message,
            type, // 'admin' or 'public'
            date: new Date().toISOString(),
            read: false
        };
        // Avoid duplicate exact messages in a 1 second window
        setNotifications(prev => {
            if (prev.some(n => n.message === message && (new Date() - new Date(n.date)) < 1000)) {
                return prev;
            }
            return [newNotif, ...prev].slice(0, 50); // keep last 50
        });
    };

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearAll }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
