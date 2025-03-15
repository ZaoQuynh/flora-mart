import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground , StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import useSettings from '../hooks/useSettings';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/hooks/useAuth';

const SplashScreen = () => {
  const router = useRouter();
  const { language, theme, translation, colors } = useSettings(); 
  const { accessToken } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      checkLogin();
    }, 10000); 

    return () => clearTimeout(timer);
  }, []);

  const checkLogin = async () => {
    const token = await accessToken();
    console.log('Token:', token);
    if(token) {
      router.replace("/home");
    } else {
      router.replace("/onBoarding");
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <ImageBackground 
        style={styles.background}
        source={require('../assets/images/splash.png')}
      />
      <Text style={[styles.appName, { color: colors.appName }]}>
        {translation.appName}
      </Text>
      <Text style={[styles.information, { color: colors.text }]}>
        {translation.information} 
      </Text>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center', 
    alignItems: 'center',      
    marginEnd: 20,               
    marginStart: 20,                
    marginTop: 40,                
    marginBottom: 30,                
    borderRadius: 40,      
    overflow: 'hidden',       
  },
  background: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    margin: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  appName: {
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: 'serif',
    position: 'absolute',
    bottom: 100,
  },
  information: {
    fontSize: 15,
    fontFamily: 'sans-serif',
    position: 'absolute',
    bottom: 30,
  }
});

export default SplashScreen;
