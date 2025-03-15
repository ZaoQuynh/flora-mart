import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import ProductCard from '@/components/ui/ProductCard';
import { Product } from '@/models/Product';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductList from '@/components/ui/ProductList';
import useSettings from '@/hooks/useSettings';

export default function CategoryScreen() {
    const { theme, translation, colors } = useSettings();
    const router = useRouter();
    const params = useLocalSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [categoryName, setCategoryName] = useState('');
    const [categoryIcon, setCategoryIcon] = useState('');

    useEffect(() => {
        if (params.products) {
            try {
                const parsedProducts: Product[] = JSON.parse(params.products as string);
                setProducts(parsedProducts);
            } catch (error) {
                console.error('Lỗi khi phân tích dữ liệu sản phẩm:', error);
            }
        }

        if (params.categoryName) {
            setCategoryName(params.categoryName);
        }

        if (params.categoryIcon) {
            setCategoryIcon(params.categoryIcon);
        }
    }, [params.products]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text2} />
                </TouchableOpacity>
                <Ionicons name={categoryIcon as any} size={28} color={colors.primary} style={styles.icon} />
                <Text style={styles.categoryTitle}>{categoryName || 'Unkown'}</Text>
            </View>
            <ScrollView style={styles.scrollView}>
                <ProductList products={products} colors={colors} translation={translation} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollView: {
      flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        elevation: 3,
    },
    backButton: {
        padding: 10,
        borderRadius: 8,
    },
    icon: {
        marginLeft: 8,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 10,
        color: '#333',
    },
});