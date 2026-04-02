import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast } from 'react-toastify';

export const connectWebSocket = (user, addNotification, onConnected) => {
    if (!user || (!user.token && !user.accessToken)) return null;

    const token = user.token || user.accessToken;

    const client = new Client({
        webSocketFactory: () => new SockJS('http://localhost:8082/ws'),
        connectHeaders: {
            Authorization: `Bearer ${token}`
        },
        debug: function (str) {
            console.log('STOMP: ' + str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000
    });

    client.onConnect = function (frame) {
        console.log('Connected to WebSockets', frame);
        
        // Check if user is expert/admin
        const isAdminOrExpert = user?.roles?.some(role => role === 'ROLE_ADMIN' || role === 'ADMIN' || role === 'ROLE_EXPERT' || role === 'EXPERT');

        // Toate persoanele se abonează la admin, dar afișăm doar dacă au rol
        client.subscribe('/topic/admin', (message) => {
            if (message.body && isAdminOrExpert) {
                let displayMessage = message.body;
                
                // Verificăm dacă mesajul are un destinatar specific
                if (message.body.startsWith('TARGET:')) {
                    const parts = message.body.split('|MSG:');
                    if (parts.length === 2) {
                        const target = parts[0].replace('TARGET:', '');
                        const actualMsg = parts[1];
                        
                        // Dacă e pentru un singur om și nu suntem noi, ignorăm
                        if (target !== 'ALL' && target !== user.username) {
                            return;
                        }
                        displayMessage = actualMsg;
                    }
                }

                toast.info(`🔔 Notificare Admin: ${displayMessage}`, { toastId: displayMessage });
                if (addNotification) addNotification(displayMessage, 'admin');
            }
        });

        client.subscribe('/topic/users', (message) => {
            if (message.body) {
                toast.success(`🏔️ Notificare publică: ${message.body}`, { toastId: message.body });
                if (addNotification) addNotification(message.body, 'public');
            }
        });

        if (onConnected) onConnected(client);
    };

    client.onStompError = function (frame) {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
    };

    client.activate();
    return client;
};
