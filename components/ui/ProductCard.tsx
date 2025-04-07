import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Product } from '@/models/Product';
import { FontAwesome } from '@expo/vector-icons';

interface ProductCardProps {
  product: Product;
  colors: any;
  onPress: () => void;
}

export default function ProductCard({ product, colors, onPress }: ProductCardProps) {
  const discountPercentage = product.discount > 0 
    ? Math.round((product.discount / product.price) * 100) 
    : 0;

  return (
    <TouchableOpacity 
      style={[styles.productItem, { borderColor: colors.border }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: product.plant.img }} 
          style={styles.productImage} 
          resizeMode="cover"
        />
        {product.discount > 0 && (
          <View style={[styles.discountBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.discountText}>-{discountPercentage}%</Text>
          </View>
        )}
      </View>
      
      <View style={styles.productInfo}>
        <Text 
          style={[styles.productName, { color: colors.text2 }]} 
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {product.plant.name}
        </Text>
        
        <View style={styles.priceContainer}>
          {product.discount > 0 ? (
            <>
              <Text style={[styles.discountedPrice, { color: colors.primary }]}>
                ${(product.price - product.discount).toFixed(2)}
              </Text>
              <Text style={[styles.originalPrice, { color: colors.text3 }]}>
                ${product.price.toFixed(2)}
              </Text>
            </>
          ) : (
            <Text style={[styles.price, { color: colors.primary }]}>
              ${product.price.toFixed(2)}
            </Text>
          )}
        </View>
        
        <View style={styles.bottomContainer}>
          <View style={[
            styles.stockIndicator, 
            { backgroundColor: product.stockQty > 0 ? colors.success + '20' : colors.error + '20' }
          ]}>
            <Text style={[
              styles.stockText, 
              { color: product.stockQty > 0 ? colors.success : colors.error }
            ]}>
              {product.stockQty > 0 ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>
          
          <View style={styles.soldContainer}>
            <FontAwesome name="shopping-bag" size={10} color={colors.text3} />
            <Text style={[styles.soldText, { color: colors.text3 }]}>
              {product.soldQty ?? 0}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  productItem: {
    width: 180,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 165,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
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
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  stockIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  stockText: {
    fontSize: 10,
    fontWeight: '600',
  },
  soldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  soldText: {
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 4,
  },
});