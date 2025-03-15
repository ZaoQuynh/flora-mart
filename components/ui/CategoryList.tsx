// File: components/Categories.tsx
import React from 'react';
import { Colors } from '@/constants/Colors';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Attribute } from '@/models/Attribute';
import { Product } from '@/models/Product';

const translations: { [key: string]: { [key: string]: string } } = {
  en: {
    SMALL: "Small",
    LARGE: "Large",
    INDOOR: "Indoor",
    OUTDOOR: "Outdoor",
    DECORATION: "Decoration",
    EDIBLE: "Edible",
    MEDICINAL: "Medicinal",
    LIVING_ROOM: "Living Room",
    OFFICE: "Office",
    GARDEN: "Garden",
    BALCONY: "Balcony",
  },
  vi: {
    SMALL: "Nhỏ",
    LARGE: "Lớn",
    INDOOR: "Trong nhà",
    OUTDOOR: "Ngoài trời",
    DECORATION: "Trang trí",
    EDIBLE: "Ăn được",
    MEDICINAL: "Dược liệu",
    LIVING_ROOM: "Phòng khách",
    OFFICE: "Văn phòng",
    GARDEN: "Khu vườn",
    BALCONY: "Ban công",
  },
  ko: {
    SMALL: "소형",
    LARGE: "대형",
    INDOOR: "실내용",
    OUTDOOR: "야외용",
    DECORATION: "장식용",
    EDIBLE: "식용",
    MEDICINAL: "약용",
    LIVING_ROOM: "거실용",
    OFFICE: "사무실용",
    GARDEN: "정원용",
    BALCONY: "발코니용",
  }
};

interface CategoriesProps {
  categories: Attribute[];
  products: Product[];
  colors: any;
  translation: any;
  language: "en" | "vi" | "ko";
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Categories: React.FC<CategoriesProps> = ({
  categories,
  products,
  colors,
  translation,
  language,
  style,
  textStyle,
}) => {
  const router = useRouter();

  const filterProductsByCategory = (category: Attribute): Product[] => {
    return products.filter(product => {
      return product.plant.attributes?.some(attr => attr.id === category.id);
    });
  };

  const navigateToCategory = (category: Attribute) => {
    const filteredProducts = filterProductsByCategory(category);
    router.push({
      pathname: "/(products)/category",
      params: { 
        products: JSON.stringify(filteredProducts),
        categoryName: getTranslatedName(category.name),
        categoryIcon: category.icon
      }
    });
  };

  const getTranslatedName = (categoryName: string): string => {
    const key = categoryName.toUpperCase();
    return translations[language]?.[key] || categoryName;
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.sectionTitle, { color: colors.text2 }, textStyle]}>
        {translation.categories || 'Categories'}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryItem}
            onPress={() => navigateToCategory(category)}
          >
            <View style={[styles.categoryIcon, { backgroundColor: colors.background }]}>
              <Ionicons name={category.icon as any} size={28} color={colors.text2} />
            </View>
            <Text style={[styles.categoryName, { color: colors.text2 }, textStyle]}>
              {getTranslatedName(category.name)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 70,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 50,
    backgroundColor: Colors.light.text3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  categoryName: {
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '700',
  },
});

export default Categories;
