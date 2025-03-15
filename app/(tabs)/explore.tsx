import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import HomeHeader from '@/components/ui/HomeHeader';
import CategoryList from '@/components/ui/CategoryList';
import useSettings from '@/hooks/useSettings';
import { useAuth } from '@/hooks/useAuth';
import { useAttribute } from '@/hooks/useAttribute';
import { User } from '@/models/User';
import { Attribute } from '@/models/Attribute';

export default function ExploreScreen() {
  const { language, theme, translation, colors } = useSettings();
  const { userInfo } = useAuth();
  const { handleGetAttributes } = useAttribute();
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Attribute[] | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const textStyle = {
    color: colors.text2,
  };

  return (
    <View style={styles.container}>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.headerSection}>
          <Text style={[styles.headerText, { color: colors.text3 }]}>
            {translation.explorePlants || 'Explore Plants'}
          </Text>
          <Text style={[styles.subtitleText, { color: colors.text2 }]}>
            {translation.browseAllCategories || 'Browse all categories'}
          </Text>
        </View>

        <CategoryList 
          categories={categories || []}
          colors={colors}
          translation={translation}
          language={language}
          textStyle={textStyle}
          displayAsGrid={true}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollView: {
    flex: 1,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
  },
});