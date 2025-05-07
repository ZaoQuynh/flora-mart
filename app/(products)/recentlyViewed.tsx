import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useSettings from '@/hooks/useSettings';
import { Product } from '@/models/Product';
import ProductList from '@/components/ui/ProductList';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from 'expo-router';
import { useProduct } from '@/hooks/useProduct';

export default function RecentViewedScreen() {
  const navigation = useNavigation();
  const { translation, colors } = useSettings();
  const [products, setProducts] = useState<Product[] | null >([]);
  const { userInfo } = useAuth();
  const [userId, setUserId] = useState<number | null>(null);
  const { handleGetProductRecentlyViewed } = useProduct();

  useEffect(() => {
    userInfo().then(data => {
      if (data) setUserId(data.id);
    });
  }, []);

  const fetchRencentlyViewed = async () => {

    if (!userId) return; 

    try {
      const products = await handleGetProductRecentlyViewed();
      setProducts(products);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

   useEffect(() => {
      if (userId) {
        fetchRencentlyViewed();
      }
    });

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color={colors.text2} />
            </TouchableOpacity>
            <Text style={[styles.headerText, { color: colors.text3 }]}>
                {translation.recentlyViewed || 'Recently Viewed'}
            </Text>
        </View>
      
      <View style={styles.content}>

        
        <ScrollView style={styles.scrollView}>
        
        {products && products.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: colors.text2 }]}>
              {translation.noRecentlyViewed || 'You have no Recently Viewed yet'}
            </Text>
          </View>
        ) : (
          <ProductList
              products={products || []}
              colors={colors}
              translation={translation}
              title={""}
              initialSize={10}
            />
        )}
        
      </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        paddingTop: 30,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#ffffff'
    },
    headerText: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginLeft: 12 
    },

  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyStateText: {
    fontSize: 18,
    marginTop: 16,
  },
  favoriteItem: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    margin: 6,
    maxWidth: '47%',
  },
  favoritesGrid: {
    justifyContent: 'space-between',
  },
});