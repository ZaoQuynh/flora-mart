// src/services/WebSocketService.js
import { Client } from '@stomp/stompjs';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/Config';

class WebSocketService {
  constructor() {
    this.client = null;
    this.subscriptions = [];
    this.listeners = [];
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  async connect(userId) {
    if (!userId) {
      console.log('No user ID provided for WebSocket connection');
      return;
    }

    try {
      if (this.client && this.client.connected) {
        console.log('WebSocket already connected');
        return;
      }

      const token = await AsyncStorage.getItem('userToken');
      
      const wsUrl = API_URL.replace(/^http/, 'ws') + '/api/v1/ws';
      console.log('Connecting to WebSocket at:', wsUrl);

      this.client = new Client({
        brokerURL: wsUrl,
        connectHeaders: {
          Authorization: token ? `Bearer ${token}` : '',
        },
        debug: function(str) {
          console.log('STOMP: ' + str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      this.client.onConnect = (frame) => {
        console.log('WebSocket Connected:', frame);
        this.reconnectAttempts = 0;
        
        // Subscribe to personal notifications
        this.subscribeToUserNotifications(userId);
        
        // Subscribe to global notifications
        this.subscribeToGlobalNotifications();
      };

      this.client.onStompError = (frame) => {
        console.error('WebSocket Error:', frame);
      };

      this.client.onWebSocketClose = () => {
        console.log('WebSocket connection closed');
        this.handleReconnect(userId);
      };

      this.client.activate();
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.handleReconnect(userId);
    }
  }

  handleReconnect(userId) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connect(userId);
      }, 5000 * this.reconnectAttempts); // Exponential backoff
    } else {
      console.log('Max reconnection attempts reached');
    }
  }

  subscribeToUserNotifications(userId) {
    if (!this.client || !this.client.connected) {
      console.error('WebSocket not connected');
      return;
    }

    const subscription = this.client.subscribe(`/user/${userId}/notification`, (message) => {
      try {
        const notification = JSON.parse(message.body);
        console.log('Received user notification:', notification);
        this.notifyListeners(notification);
      } catch (error) {
        console.error('Error processing notification:', error);
      }
    });

    this.subscriptions.push(subscription);
  }

  subscribeToGlobalNotifications() {
    if (!this.client || !this.client.connected) {
      console.error('WebSocket not connected');
      return;
    }

    const subscription = this.client.subscribe('/topic/global-notifications', (message) => {
      try {
        const notification = JSON.parse(message.body);
        console.log('Received global notification:', notification);
        this.notifyListeners(notification);
      } catch (error) {
        console.error('Error processing global notification:', error);
      }
    });

    this.subscriptions.push(subscription);
  }

  addNotificationListener(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners(notification) {
    this.listeners.forEach(listener => listener(notification));
  }

  disconnect() {
    this.subscriptions.forEach(subscription => {
      if (subscription && subscription.unsubscribe) {
        subscription.unsubscribe();
      }
    });
    
    this.subscriptions = [];
    
    if (this.client && this.client.connected) {
      this.client.deactivate();
      console.log('WebSocket disconnected');
    }
  }
}

export default new WebSocketService();