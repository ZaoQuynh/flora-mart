import { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import * as Localization from 'expo-localization';  
import { translations } from '../constants/translations';
import { Colors } from '../constants/Colors';

type TranslationKey = keyof typeof translations;

const useSettings = () => {
  const colorScheme = useColorScheme(); 
  const [language, setLanguage] = useState<TranslationKey>('en');

  useEffect(() => {
    const userLanguage = Localization.locale.split('-')[0] || 'en';  
    setLanguage(userLanguage as TranslationKey);
  }, []);

  const theme = colorScheme || 'light'; 

  return {
    language,
    theme,
    translation: translations[language],
    colors: Colors[theme],
  };
};

export default useSettings;
