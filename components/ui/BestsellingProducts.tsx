import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import ProductCard from '@/components/ui/ProductCard';
import { Product } from '@/models/Product';

interface BestSellingProps {
  products: Product[];
  colors: any;
  translation: any;
}

export default function BestSelling({ products, colors, translation }: BestSellingProps) {
  const router = useRouter();

  const navigateToProductDetail = (item: Product) => {
    router.push({
      pathname: "/(products)/details",
      params: { product: JSON.stringify(item) }
    });
  };

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text2 }]}>
        {translation.bestselling || 'Bestselling Plants'}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsContainer}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            colors={colors}
            onPress={() => navigateToProductDetail(product)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 26,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  productsContainer: {
    marginBottom: 24,
    paddingVertical: 8,
  },
});
