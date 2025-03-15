import { checkEmail, checkUsername, login, register, verify, resetPassword } from '@/scripts/authApi';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Strings from "../constants/Strings"
import { User } from '@/models/User';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await login(email, password);
      setLoading(false);
      if(data.accessToken){
        await AsyncStorage.setItem(Strings.AUTH.TOKEN, data.accessToken);
        await AsyncStorage.setItem(Strings.AUTH.USER_INFO, JSON.stringify(data.user));
        return data
      }
    } catch (err) {
      setLoading(false);
      setError('Failed to login');
      throw err;
    }
  };

  const handleRegister = async (fullName: string, email: string, username: string, phoneNumber: string, password: string) => {
    setLoading(true);
    try {
      const data = await register(fullName, email, username, phoneNumber, password);
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      setError('Failed to register');
      throw err;
    }
  };

  const handleVerify = async (email: string) => {
    setLoading(true);
    try {
      const data = await verify(email);
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      setError('Failed to verify');
      throw err;
    }
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem(Strings.AUTH.TOKEN);
      await AsyncStorage.removeItem(Strings.AUTH.USER_INFO);
    } catch (err) {
      console.error('Logout Failed');
      console.error(err);
    }
  };

  const handleResetPassword = async (email: string, newPassword: string) => {
    setLoading(true);
    try {
      const data = await resetPassword(email, newPassword);
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      setError('Failed to reset password');
      throw err;
    }
  }

  const userInfo = async (): Promise<User | null> => {
    try {
      const user = await AsyncStorage.getItem(Strings.AUTH.USER_INFO);
      return user ? (JSON.parse(user) as User) : null;
    } catch (err) {
      console.error('Get User Info Failed', err);
      return null;
    }
  };

  const accessToken = async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(Strings.AUTH.TOKEN);
    } catch (err) {
      console.error('Get Access Token Failed');
      console.error(err);
      return null;
    }
  }

  const checkEmailExist = async (email: string) => {
    try {
      const data = await checkEmail(email);
      return data;
    } catch (err) {
      setError('Failed to check email');
      throw err;
    }
  }

  const checkUsernameExist = async (username: string) => {
    try {
      const data = await checkUsername(username);
      return data;
    } catch (err) {
      setError('Failed to check username');
      throw err;
    }
  }

  return { handleLogin, handleRegister, handleVerify, handleLogout, handleResetPassword, userInfo, accessToken, checkEmailExist, checkUsernameExist, loading, error };
};
