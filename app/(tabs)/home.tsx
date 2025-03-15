import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TextStyle } from 'react-native';
import HomeHeader from '@/components/ui/HomeHeader';
import CategoryList from '@/components/ui/CategoryList';
import BestsellingProducts from '@/components/ui/BestsellingProducts';
import useSettings from '@/hooks/useSettings';
import { useAuth } from '@/hooks/useAuth';
import { useAttribute } from '@/hooks/useAttribute';
import ToastHelper from '@/utils/ToastHelper';
import { User } from '@/models/User';
import { Attribute } from '@/models/Attribute';
import { Product } from '@/models/Product';
import { useProduct } from '@/hooks/useProduct';
import ProductList from '@/components/ui/ProductList';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { language, theme, translation, colors } = useSettings();
  const { userInfo } = useAuth();
  const { handleGetAttributes } = useAttribute();
  const { handleGetProducts } = useProduct();
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Attribute[] | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const textStyleH1v1: TextStyle = {
    fontWeight: 'bold',
    color: colors.text2,
  };
  
  const textStyleH1v2: TextStyle = {
    fontWeight: 'bold',
    color: colors.text3,
  };

  const textStyle: TextStyle = {
    color: colors.text2,
  };

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const attributes = await handleGetAttributes(); 
        setCategories(attributes);
      } catch (error) {
        console.error("Error fetching attributes:", error);
      }
    };
  
    fetchAttributes();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await handleGetProducts(); 
        setProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  
    fetchProducts();
  }, []);

  useEffect(() => {
    userInfo()
      .then((theUser) => {
        if (theUser?.fullName) {
          setUser(theUser);
          ToastHelper.showSuccess(
            translation.loginSuccess || 'Login Success',
            translation.welcomeBack + (theUser.fullName || 'User')
          );
        }
      })
      .catch((error) => {
        console.error("Error getting user info:", error);
      });
  }, [userInfo, translation]);

  return (
    <View style={styles.container}>
      <HomeHeader 
        user={user}
        products={products || []}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        colors={colors}
        translation={translation}
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.welcomeSection}>
          <View>
            <Text style={[styles.welcomeText, { color: colors.text3 }, textStyleH1v1]}>
              {translation.hello || 'Hello'},
            </Text>
            <Text style={[styles.welcomeText, { color: colors.text3 }, textStyleH1v2]}>
              {user?.fullName || translation.guest || 'Guest'}!
            </Text>
          </View>
          <Text style={[styles.subtitleText, { color: colors.text2 }, textStyle]}>
            {translation.findYourPlant || 'Find your perfect plant today'}
          </Text>
        </View>

        <CategoryList 
          categories={categories || []}
          products={products || []}
          colors={colors}
          translation={translation}
          language={language}
          textStyle={textStyle}
        />

        <BestsellingProducts 
          products={products || []}
          colors={colors}
          translation={translation}
        />

        <ProductList
          products={products || []}
          colors={colors}
          translation={translation}
        />
      </ScrollView>
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
  welcomeSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
  },
});