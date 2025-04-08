import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Text, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Product } from '@/models/Product';
import ProductCard from '@/components/ui/ProductCard'; // Import the ProductCard component

interface ProductListProps {
  products: Product[];
  colors: any;
  translation: any;
  categoryId?: string;
  searchQuery?: string;
  title?: string;
  initialSize?: number;
}

export default function ProductList({
  products,
  colors,
  translation,
  categoryId,
  searchQuery,
  title = "Tất cả sản phẩm",
  initialSize = 4,
}: ProductListProps) {
  const router = useRouter();
  const [visibleItemCount, setVisibleItemCount] = useState(initialSize);
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

  return (
    <View style={styles.container}>
      {title && (
        <Text style={[styles.sectionTitle, { color: colors.text2}]}>
          {title}
        </Text>
      )}
      
      {renderEmpty()}
      
      <View style={styles.productsGrid}>
        {displayedProducts.map((product) => (
          <View key={product.id} style={styles.cardWrapper}>
            <ProductCard 
              product={product}
              colors={colors}
              onPress={() => handleProductPress(product)}
            />
          </View>
        ))}
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
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 20,
    fontWeight: 'bold',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 16,
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