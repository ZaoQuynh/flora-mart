import React from 'react';
import { Colors } from '@/constants/Colors';
import { View, TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface BottomNavigationProps {
  colors: any;
  translation: any;
  style?: ViewStyle;
  textStyle?: TextStyle;
  activeTab?: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  colors,
  translation,
  style,
  textStyle,
  activeTab = 'home',
}) => {
  const router = useRouter();

  const navigateToHome = () => router.push("/(tabs)/home");
  const navigateToCart = () => router.push("/(tabs)/cart");
  const navigateToFavorites = () => router.push("/(tabs)/favorites");
  const navigateToProfile = () => router.push("/(tabs)/profile");
  const navigateToCategory = () => router.push("/(tabs)/explore");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }, style]}>
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={navigateToHome}
      >
        <Ionicons 
          name={activeTab === 'home' ? "home" : "home-outline"} 
          size={24} 
          color={activeTab === 'home' ? colors.primary : colors.text3} 
        />
        <Text 
          style={[
            styles.navText, 
            { color: activeTab === 'home' ? colors.primary : colors.text3 }, 
            textStyle
          ]}
        >
          {translation.home || 'Home'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={navigateToCategory}
      >
        <Ionicons 
          name={activeTab === 'explore' ? "grid" : "grid-outline"} 
          size={24} 
          color={activeTab === 'explore' ? colors.primary : colors.text3} 
        />
        <Text 
          style={[
            styles.navText, 
            { color: activeTab === 'explore' ? colors.primary : colors.text3 }, 
            textStyle
          ]}
        >
          {translation.explore || 'Explore'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={navigateToCart}
      >
        <Ionicons 
          name={activeTab === 'cart' ? "cart" : "cart-outline"} 
          size={24} 
          color={activeTab === 'cart' ? colors.primary : colors.text3} 
        />
        <Text 
          style={[
            styles.navText, 
            { color: activeTab === 'cart' ? colors.primary : colors.text3 }, 
            textStyle
          ]}
        >
          {translation.cart || 'Cart'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={navigateToFavorites}
      >
        <Ionicons 
          name={activeTab === 'favorites' ? "heart" : "heart-outline"} 
          size={24} 
          color={activeTab === 'favorites' ? colors.primary : colors.text3} 
        />
        <Text 
          style={[
            styles.navText, 
            { color: activeTab === 'favorites' ? colors.primary : colors.text3 }, 
            textStyle
          ]}
        >
          {translation.favorites || 'Favorites'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={navigateToProfile}
      >
        <Ionicons 
          name={activeTab === 'profile' ? "person" : "person-outline"} 
          size={24} 
          color={activeTab === 'profile' ? colors.primary : colors.text3} 
        />
        <Text 
          style={[
            styles.navText, 
            { color: activeTab === 'profile' ? colors.primary : colors.text3 }, 
            textStyle
          ]}
        >
          {translation.profile || 'Profile'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.text3,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
});

export default BottomNavigation;