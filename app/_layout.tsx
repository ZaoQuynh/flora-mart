import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import useSettings from '@/hooks/useSettings'; 
import Toast from 'react-native-toast-message';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { theme } = useSettings(); 
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index"/>
        <Stack.Screen name="onBoarding"/>
        <Stack.Screen name="(auth)/login"/>
        <Stack.Screen name="(auth)/register"/>
        <Stack.Screen name="(auth)/registerOtp"/>
        <Stack.Screen name="(auth)/forgotPassword"/>
        <Stack.Screen name="(profile)/information"/>
        <Stack.Screen name="(profile)/edit"/>
        <Stack.Screen name="(profile)/changeContact"/>
        <Stack.Screen name="(products)/search"/>
        <Stack.Screen name="(products)/details"/>
        <Stack.Screen name="(products)/category"/>
        <Stack.Screen name="(tabs)/_layout"/>
        <Stack.Screen name="(tabs)/home"/>
        <Stack.Screen name="(tabs)/explore"/>
        <Stack.Screen name="(tabs)/cart"/>
        <Stack.Screen name="(tabs)/favorites"/>
        <Stack.Screen name="(tabs)/profile"/>
      </Stack>
      <StatusBar style="auto" />
      <Toast/>
    </ThemeProvider>
  );
}
