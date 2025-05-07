import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useSettings from '@/hooks/useSettings';
import { Product } from '@/models/Product';
import ProductList from '@/components/ui/ProductList';
import { useFavorite } from '@/hooks/useFavorite';
import { useAuth } from '@/hooks/useAuth';

export default function FavoritesScreen() {
  const { translation, colors } = useSettings();
  const [favorites, setFavorites] = useState<Product[] | null >([]);
  const { userInfo } = useAuth();
  const [userId, setUserId] = useState<number | null>(null);
  const { handleGetFavorites } = useFavorite(); 

  useEffect(() => {
    userInfo().then(data => {
      if (data) setUserId(data.id);
    });
  }, []);

  const fetchFavorites = async () => {

    if (!userId) return; 

    try {
      const favoriteProducts = await handleGetFavorites(userId);
      setFavorites(favoriteProducts);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

   useEffect(() => {
      if (userId) {
        fetchFavorites();
      }
    }, [favorites, userId]);

  return (
    <View style={styles.container}>
      
      <View style={styles.content}>
        <Text style={[styles.headerText, { color: colors.text3 }]}>
          {translation.myFavorites || 'My Favorites'}
        </Text>

        
        <ScrollView style={styles.scrollView}>
        
        {favorites && favorites.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="heart" size={80} color={colors.text3} style={{ opacity: 0.5 }} />
            <Text style={[styles.emptyStateText, { color: colors.text2 }]}>
              {translation.noFavorites || 'You have no favorites yet'}
            </Text>
          </View>
        ) : (
          <ProductList
              products={favorites || []}
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
    backgroundColor: '#f8f8f8',
  },
  
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
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