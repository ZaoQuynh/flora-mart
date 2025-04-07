import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useSettings from '@/hooks/useSettings';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { User } from '@/models/User';

export default function ProfileScreen() {
  const { translation, colors } = useSettings();
  const { userInfo, handleLogout } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    userInfo()
      .then((theUser) => {
        if (theUser?.fullName) {
          setUser(theUser);
        }
      })
      .catch((error) => {
        console.error("Error getting user info:", error);
      });
  }, [userInfo]);

  const onLogout = async () => {
    try {
      await handleLogout();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navigateToInformation = () => {
    router.push("/(profile)/information");
  }

  const navigateToOrders = () => {
    router.push("/(order)/history");
  };

  const navigateRecentViewed = () => {
    router.push("/(products)/recentlyViewed");
  }

  const navigateToAddresses = () => {
    router.push("/(profile)/addresses");
  };

  const navigateToSettings = () => {
    router.push("/(profile)/settings");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={[styles.headerTitle, { color: colors.background }]}>
          {translation.profile || 'Profile'}
        </Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={[styles.userInfo, { backgroundColor: colors.background }]}>
          <View style={styles.userAvatar}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.text3 }]}>
                <Text style={[styles.avatarInitial, { color: colors.background }]}>
                  {user?.fullName ? user.fullName.charAt(0).toUpperCase() : '?'}
                </Text>
              </View>
            )}
          </View>
          <Text style={[styles.userName, { color: colors.text3 }]}>
            {user?.fullName || translation.guest || 'Guest'}
          </Text>
          <Text style={[styles.userEmail, { color: colors.text2 }]}>
            {user?.email || ''}
          </Text>
        </View>

        <View style={[styles.menuSection, { backgroundColor: colors.background }]}>
          <TouchableOpacity style={styles.menuItem} onPress={navigateToInformation}>
            <Ionicons name="person-outline" size={24} color={colors.text3} />
            <Text style={[styles.menuItemText, { color: colors.text3 }]}>
              {translation.myInformation || 'My Information'}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text3} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={navigateToOrders}>
            <Ionicons name="bag-outline" size={24} color={colors.text3} />
            <Text style={[styles.menuItemText, { color: colors.text3 }]}>
              {translation.myOrders || 'My Orders'}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text3} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={navigateRecentViewed}>
            <Ionicons name="timer-outline" size={24} color={colors.text3} />
            <Text style={[styles.menuItemText, { color: colors.text3 }]}>
              {translation.recentlyViewed || 'Recently Viewed '}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text3} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={navigateToAddresses}>
            <Ionicons name="location-outline" size={24} color={colors.text3} />
            <Text style={[styles.menuItemText, { color: colors.text3 }]}>
              {translation.myAddresses || 'My Addresses'}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text3} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={navigateToSettings}>
            <Ionicons name="settings-outline" size={24} color={colors.text3} />
            <Text style={[styles.menuItemText, { color: colors.text3 }]}>
              {translation.settings || 'Settings'}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text3} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: colors.primary }]}
          onPress={onLogout}
        >
          <Text style={[styles.logoutText, { color: colors.background }]}>
            {translation.logoutButtonText || 'Logout'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  userInfo: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
  },
  menuSection: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  logoutButton: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});