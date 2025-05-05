// src/contexts/NotificationContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebSocketService from '@/services/WebSocketService';
import NotificationService from '@/services/NotificationService';
import { useAuth } from '@/hooks/useAuth';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { userInfo } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userInfo?.id) {
      connectWebSocket();
      loadNotifications();
      
      // Clean up on unmount
      return () => {
        WebSocketService.disconnect();
      };
    }
  }, [user]);

  const connectWebSocket = () => {
    if (user?.id) {
      WebSocketService.connect(user.id);
      
      const removeListener = WebSocketService.addNotificationListener((notification) => {
        handleNewNotification(notification);
      });
      
      return removeListener;
    }
  };

  const loadNotifications = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const notificationsData = await NotificationService.getUserNotifications(user.id);
      setNotifications(notificationsData);
      
      // Calculate unread count
      const unread = notificationsData.filter(notification => !notification.read).length;
      setUnreadCount(unread);
      
      // Save to AsyncStorage for persistence
      await AsyncStorage.setItem('notifications', JSON.stringify(notificationsData));
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewNotification = (notification) => {
    // Add new notification to the top of the list
    setNotifications(prevNotifications => [notification, ...prevNotifications]);
    
    // Increment unread count
    setUnreadCount(prev => prev + 1);
    
    // Update AsyncStorage
    AsyncStorage.getItem('notifications')
      .then(storedNotifications => {
        const parsedNotifications = storedNotifications ? JSON.parse(storedNotifications) : [];
        const updatedNotifications = [notification, ...parsedNotifications];
        AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      })
      .catch(error => {
        console.error('Error updating stored notifications:', error);
      });
  };

  const markAsRead = async (notificationId) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
    
    // Update unread count
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId ? { ...notification, read: true } : notification
    );
    
    const unread = updatedNotifications.filter(notification => !notification.read).length;
    setUnreadCount(unread);
    
    // Update AsyncStorage
    await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const markAllAsRead = async () => {
    const updatedNotifications = notifications.map(notification => ({ ...notification, read: true }));
    setNotifications(updatedNotifications);
    setUnreadCount(0);
    
    // Update AsyncStorage
    await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const clearNotifications = async () => {
    setNotifications([]);
    setUnreadCount(0);
    await AsyncStorage.removeItem('notifications');
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        loadNotifications,
        markAsRead,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);