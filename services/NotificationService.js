// src/services/NotificationService.js
import axios from 'axios';
import { API_BASE_URL } from '@/constants/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

class NotificationService {
  async getHeaders() {
    const token = await AsyncStorage.getItem('userToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  async getUserNotifications(userId) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(
        `${API_BASE_URL}/notification/user/${userId}`,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  async sendUserNotification(userId, notification) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.post(
        `${API_BASE_URL}/notification/user/${userId}`,
        notification,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  async sendGlobalNotification(notification) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.post(
        `${API_BASE_URL}/notification/all`,
        notification,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending global notification:', error);
      throw error;
    }
  }
}

export default new NotificationService();