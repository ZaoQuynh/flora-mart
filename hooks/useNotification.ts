import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useState, useEffect } from "react";
import { API_BASE_URL } from '../constants/apiConfig';

interface Notification {
  id?: number;
  type?: "ORDER" | "POST" | "EVENT" | "REVIEW" | "COMMENT";
  title: string;
  message: string;
  screen?: string;
  date: string; 
  params?: Record<string, string>;
  userId?: number;
}

export const useNotification = (userId: string, onReceive?: (notification: Notification) => void) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const client = new Client({
      brokerURL: `${API_BASE_URL}/ws`,
      connectHeaders: {
        userId: userId,
      },
      debug: function (str) {
        console.log(str);
      },
      onConnect: () => {
        console.log("Connected to WebSocket");

        client.subscribe(`/user/${userId}/notification`, (message) => {
          const notification: Notification = JSON.parse(message.body);
          setNotifications((prevNotifications) => [
            notification,
            ...prevNotifications,
          ]);
          if (onReceive) {
            onReceive(notification);
          }
        });

        client.subscribe("/topic/global-notifications", (message) => {
          const notification: Notification = JSON.parse(message.body);
          setNotifications((prev) => [notification, ...prev]);
          if (onReceive) onReceive(notification);
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error", frame);
      },
      webSocketFactory: () => {
        return new SockJS(`${API_BASE_URL}/ws`);
      },
    });

    client.activate();

    return () => {
      if (client.connected) {
        client.deactivate();
      }
    };
  }, [userId]);

  return notifications;
};
