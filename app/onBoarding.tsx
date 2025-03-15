import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import useSettings from '@/hooks/useSettings';

export default function OnboardingScreen() {
  const router = useRouter();
  const { language, theme, translation, colors } = useSettings();

  const [index, setIndex] = useState(0); 
  const steps = [
    {
      image: require('@/assets/images/step1.png'),
      title: translation.onboardingStep1Title || 'Welcome to Flora Mart!',
      description: translation.onboardingStep1Description || 'Explore our wide range of plants and gardening tips.',
    },
    {
      image: require('@/assets/images/step2.png'),
      title: translation.onboardingStep2Title || 'Learn How to Care for Plants',
      description: translation.onboardingStep2Description || 'Get personalized plant care tips for every type of plant.',
    },
    {
      image: require('@/assets/images/step3.png'),
      title: translation.onboardingStep3Title || 'Join the Community',
      description: translation.onboardingStep3Description || 'Connect with other plant enthusiasts and share your gardening journey.',
    },
  ];

  const onNext = () => {
    if (index < steps.length - 1) {
      setIndex(index + 1);
    } else {
      router.replace('/(auth)/login'); 
    }
  };

  const onSkip = () => {
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.step}>
          <Image source={steps[index].image} style={styles.image} />
          <Text style={styles.title}>{steps[index].title}</Text>
          <Text style={styles.description}>{steps[index].description}</Text>
        </View>
      </ScrollView>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, styles.skipButton]} onPress={onSkip}>
          <Text style={styles.buttonText}>{translation.onboardingSkipButtonText || 'Skip'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {backgroundColor:colors.button}]} onPress={onNext}>
          <Text style={styles.buttonText}>{translation.onboardingNextButtonText || 'Next Step'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', 
    backgroundColor: '#fff',
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  step: {
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#777',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 100, 
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 30,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButton: {
    backgroundColor: '#ddd',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
