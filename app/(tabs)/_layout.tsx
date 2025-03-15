import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Slot, useRouter, usePathname } from 'expo-router';
import BottomNavigation from '@/components/ui/BottomNavigation';
import useSettings from '@/hooks/useSettings';

export default function AppLayout() {
  const { colors, translation } = useSettings();
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname === '/' || pathname.includes('home')) return 'home';
    if (pathname.includes('explore') || pathname.includes('category')) return 'explore';
    if (pathname.includes('cart')) return 'cart';
    if (pathname.includes('favorites')) return 'favorites';
    if (pathname.includes('profile')) return 'profile';
    return 'home';
  };

  const activeTab = getActiveTab();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Slot />
      </View>
      
      <BottomNavigation 
        colors={colors}
        translation={translation}
        activeTab={activeTab}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  content: {
    flex: 1,
  }
});