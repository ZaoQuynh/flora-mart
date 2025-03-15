import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Text, Pressable, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Product } from '@/models/Product';

interface ProductListProps {
  products: Product[];
  colors: any;
  translation: any;
  categoryId?: string;
  searchQuery?: string;
}

export default function ProductList({ products, colors, translation, categoryId, searchQuery }: ProductListProps) {
  const router = useRouter();
  const [visibleItemCount, setVisibleItemCount] = useState(4);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Sắp xếp và lọc sản phẩm
  const sortedAndFilteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    let result = [...products].sort((a, b) => a.price - b.price);

    if (categoryId) {
      result = result.filter(p => p.plant.categoryId === categoryId);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.plant.name.toLowerCase().includes(query) || 
        p.plant.description?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [products, categoryId, searchQuery]);

  const handleProductPress = (item: Product) => {
      router.push({
        pathname: "/(products)/details",
        params: { product: JSON.stringify(item) }
      });
  };

  const handleLoadMore = () => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleItemCount(prev => 
        prev + 4 > sortedAndFilteredProducts.length 
        ? sortedAndFilteredProducts.length 
        : prev + 4
      );
      setIsLoadingMore(false);
    }, 1000);
  };

  const displayedProducts = sortedAndFilteredProducts.slice(0, visibleItemCount);
  const hasMoreProducts = visibleItemCount < sortedAndFilteredProducts.length;

  const renderProductItem = (product: Product, index: number) => {
    const isEven = index % 2 === 0;

    return (
      <Pressable 
        key={product.id}
        style={[
          styles.productItem,
          isEven ? styles.leftItem : styles.rightItem
        ]} 
        onPress={() => handleProductPress(product)}
      >
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
      </Pressable>
    );
  };

  const renderLoadMoreIndicator = () => {
    if (!hasMoreProducts) return null;

    return (
      <ActivityIndicator 
        size="large" 
        color={colors.primary} 
        style={{ marginVertical: 16 }} 
      />
    );
  };

  const renderEmpty = () => {
    if (sortedAndFilteredProducts.length > 0) return null;

    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.text2 }]}>
          {translation.noProductsFound || "Không tìm thấy sản phẩm nào"}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text2 }]}>
        {translation.allProducts || "Tất cả sản phẩm"}
      </Text>
      
      {renderEmpty()}
      
      <View style={styles.productsGrid}>
        {displayedProducts.map((product, index) => renderProductItem(product, index))}
      </View>

      {isLoadingMore ? renderLoadMoreIndicator() : hasMoreProducts && (
        <Pressable 
          style={[styles.loadMoreButton, { backgroundColor: colors.primary }]}
          onPress={handleLoadMore}
        >
          <Text style={[styles.loadMoreText, { color: colors.white }]}>
            {translation.viewMore || "Xem thêm"}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productItem: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  leftItem: {
    marginRight: '2%',
  },
  rightItem: {
    marginLeft: '2%',
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
  loadMoreButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    alignSelf: 'center',
  },
  loadMoreText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
