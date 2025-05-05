// src/components/ui/NotificationItem.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useNotifications } from '@/contexts/NotificationContext';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { formatDistanceToNow } from 'date-fns';

const NotificationItem = ({ notification }) => {
  const router = useRouter();
  const { markAsRead } = useNotifications();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ORDER':
        return <Ionicons name="cart-outline" size={24} color={Colors.light.primary} />;
      case 'PROMOTION':
        return <Ionicons name="pricetag-outline" size={24} color={Colors.light.success} />;
      case 'DELIVERY':
        return <Ionicons name="bicycle-outline" size={24} color={Colors.light.info} />;
      case 'SYSTEM':
        return <Ionicons name="information-circle-outline" size={24} color={Colors.light.warning} />;
      default:
        return <Ionicons name="notifications-outline" size={24} color={Colors.light.text} />;
    }
  };

  const handlePress = () => {
    markAsRead(notification.id);
    
    // Navigate based on notification type and screen parameter
    if (notification.screen) {
      const params = notification.params ? notification.params : {};
      router.push({
        pathname: notification.screen,
        params
      });
    }
  };

  const getTimeAgo = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'recently';
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        notification.read ? styles.readContainer : styles.unreadContainer
      ]} 
      onPress={handlePress}
    >
      <View style={styles.iconContainer}>
        {getNotificationIcon(notification.type)}
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {notification.title}
        </Text>
        
        <Text style={styles.message} numberOfLines={2}>
          {notification.message}
        </Text>
        
        <Text style={styles.time}>
          {getTimeAgo(notification.date)}
        </Text>
      </View>
      
      {!notification.read && (
        <View style={styles.unreadIndicator} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  unreadContainer: {
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
  },
  readContainer: {
    backgroundColor: 'transparent',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: Colors.light.text,
  },
  message: {
    fontSize: 14,
    color: Colors.light.text2,
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: Colors.light.text3,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.primary,
    alignSelf: 'center',
    marginLeft: 8,
  },
});

export default NotificationItem;