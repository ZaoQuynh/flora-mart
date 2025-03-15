import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Product } from '@/models/Product';

interface ProductCardProps {
  product: Product;
  colors: any;
  onPress: () => void;
}

export default function ProductCard({ product, colors, onPress }: ProductCardProps) {
  return (
    <TouchableOpacity style={styles.productItem} onPress={onPress}>
      <Image source={{ uri: product.plant.img }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: colors.text2 }]} numberOfLines={1}>
          {product.plant.name}
        </Text>
        <View style={styles.priceContainer}>
          {product.discount > 0 ? (
            <>
              <Text style={[styles.discountedPrice, { color: colors.primary }]}>
                ${(product.price - product.discount).toFixed(2)}
              </Text>
              <Text style={styles.originalPrice}>${product.price.toFixed(2)}</Text>
            </>
          ) : (
            <Text style={[styles.price, { color: colors.primary }]}>
              ${product.price.toFixed(2)}
            </Text>
          )}
        </View>
        <Text style={[styles.stockText, { color: product.stockQty > 0 ? colors.success : colors.error }]}>
          {product.stockQty > 0 ? 'In Stock' : 'Out of Stock'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  productItem: {
    width: 160,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: '100%',
    height: 160,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});
