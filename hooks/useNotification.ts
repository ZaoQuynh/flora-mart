import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useState, useEffect } from "react";
import { API_BASE_URL } from '../constants/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Strings from "../constants/Strings";

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

export const useNotification = (onReceive?: (notification: Notification) => void) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch userId from AsyncStorage
  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem(Strings.AUTH.USER_ID);
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          // Try to get from user info if USER_ID is not directly stored
          const userInfo = await AsyncStorage.getItem(Strings.AUTH.USER_INFO);
          if (userInfo) {
            const user = JSON.parse(userInfo);
            if (user && user.id) {
              setUserId(user.id.toString());
            }
          }
        }
      } catch (err) {
        console.error("Error fetching user ID:", err);
        setError("Failed to get user ID");
      }
    };

    getUserId();
  }, []);

  // Fetch initial notifications when userId is available
  useEffect(() => {
    if (!userId) {
      return;
    }

    const fetchInitialNotifications = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/notification/user/${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        
        const data = await response.json();
        setNotifications(data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialNotifications();
  }, [userId]);

  // Set up WebSocket connection for real-time updates when userId is available
  useEffect(() => {
    if (!userId) return;

    const client = new Client({
      brokerURL: `${API_BASE_URL}/ws`,
      connectHeaders: {
        userId: userId,
      },
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000, // Try to reconnect after 5 seconds
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log("Connected to WebSocket");

        // Subscribe to personal notifications
client.subscribe(`/user/${userId}/notification`, (message) => {
          try {
            const notification: Notification = JSON.parse(message.body);
            setNotifications((prevNotifications) => [
              notification,
              ...prevNotifications,
            ]);
            if (onReceive) {
              onReceive(notification);
            }
          } catch (err) {
            console.error("Error processing notification:", err);
          }
        });

        // Subscribe to global notifications
        client.subscribe("/topic/global-notifications", (message) => {
          try {
            const notification: Notification = JSON.parse(message.body);
            setNotifications((prev) => [notification, ...prev]);
            if (onReceive) onReceive(notification);
          } catch (err) {
            console.error("Error processing global notification:", err);
          }
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error", frame);
        setError(`WebSocket error: ${frame.headers?.message || 'Unknown error'}`);
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
  }, [userId, onReceive]);

  return { notifications, loading, error, userId };
};