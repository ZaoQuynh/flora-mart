import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeHeader from '@/components/ui/HomeHeader';
import useSettings from '@/hooks/useSettings';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/models/User';
import { Product } from '@/models/Product';

export default function FavoritesScreen() {
  const { translation, colors } = useSettings();
  const { userInfo } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <View style={styles.container}>
      
      <View style={styles.content}>
        <Text style={[styles.headerText, { color: colors.text3 }]}>
          {translation.myFavorites || 'My Favorites'}
        </Text>
        
        {favorites.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="heart" size={80} color={colors.text3} style={{ opacity: 0.5 }} />
            <Text style={[styles.emptyStateText, { color: colors.text2 }]}>
              {translation.noFavorites || 'You have no favorites yet'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.favoriteItem}>
                {/* Favorite item rendering */}
              </View>
            )}
            numColumns={2}
            columnWrapperStyle={styles.favoritesGrid}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  content: {
    flex: 1,
    padding: 16,
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