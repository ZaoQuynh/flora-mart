import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeHeader from '@/components/ui/HomeHeader';
import useSettings from '@/hooks/useSettings';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/models/User';

export default function CartScreen() {
  const { translation, colors } = useSettings();
  const { userInfo } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <View style={styles.container}>
      
      <View style={styles.content}>
        <Text style={[styles.headerText, { color: colors.text3 }]}>
          {translation.myCart || 'My Cart'}
        </Text>
        
        {cartItems.length === 0 ? (
          <View style={styles.emptyCart}>
            <Ionicons name="cart" size={80} color={colors.text3} style={{ opacity: 0.5 }} />
            <Text style={[styles.emptyCartText, { color: colors.text2 }]}>
              {translation.cartEmpty || 'Your cart is empty'}
            </Text>
            <TouchableOpacity 
              style={[styles.shopButton, { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.shopButtonText, { color: colors.background }]}>
                {translation.startShopping || 'Start Shopping'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                {/* Cart item rendering */}
              </View>
            )}
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
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyCartText: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 24,
  },
  shopButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
});