// src/components/ui/NotificationIcon.js
import React from 'react';
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import NotificationBadge from './NotificationBadge';

const NotificationIcon = ({ style }) => {
  const router = useRouter();

  const navigateToNotifications = () => {
    router.push('/notifications');
  };

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={navigateToNotifications}
    >
      <Image 
        source={require('@/assets/images/notification-icon.png')}
        style={styles.icon}
        resizeMode="contain"
      />
      <NotificationBadge />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default NotificationIcon;