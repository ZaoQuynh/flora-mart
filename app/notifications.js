import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '@/contexts/NotificationContext';
import NotificationList from '@/components/NotificationList';
import { Colors } from '@/constants/Colors';

export default function NotificationsScreen() {
  const router = useRouter();
  const { markAllAsRead, clearNotifications } = useNotifications();

  const goBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        
        <Text style={styles.title}>Notifications</Text>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={markAllAsRead} style={styles.actionButton}>
            <Ionicons name="checkmark-done-outline" size={22} color={Colors.light.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={clearNotifications} style={styles.actionButton}>
            <Ionicons name="trash-outline" size={22} color={Colors.light.danger} />
          </TouchableOpacity>
        </View>
      </View>
      
      <NotificationList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    padding: 4,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.light.text,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
});