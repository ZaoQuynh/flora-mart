import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { Product } from "@/models/Product";
import SearchItem from "@/components/ui/SearchItem";
import Filter from "@/components/ui/Filter";
import { useAttributeGroup } from '@/hooks/useAttributeGroup';
import { AttributeGroup } from "@/models/AttributeGroup";
import useSettings from '@/hooks/useSettings';

const SearchScreen = () => {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const { language, theme, translation, colors } = useSettings();
  const { handleGetAttributeGroups } = useAttributeGroup();
  const [query, setQuery] = useState<string>(params.query || "");
  const [filteredData, setFilteredData] = useState<Product[]>([]);
  const [attributeGroups, setAttributeGroups] = useState<AttributeGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [productData, setProductData] = useState<Product[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);

  useEffect(() => {
    if (params.products) {
      try {
        const parsedProducts: Product[] = JSON.parse(params.products as string);
        const activeProducts = parsedProducts.filter((p) => !p.isDeleted);
        setProductData(activeProducts);
        setFilteredData(activeProducts);
      } catch (error) {
        console.error("Lỗi khi phân tích dữ liệu sản phẩm:", error);
      }
    }
  }, [params.products]);

  useEffect(() => {
    handleSearch(query);
  }, [query, productData, selectedAttributes]);

  useEffect(() => {
    
    const fetchAttributeGroups = async () => {
      try {
        const attributeGroups = await handleGetAttributeGroups(); 
        setAttributeGroups(attributeGroups);
      } catch (error) {
        console.error("Error fetching attribute groups:", error);
      }
    };
  
    fetchAttributeGroups();
  })

  const handleSearch = (text: string) => {
    let filtered = productData;
    if (text.trim()) {
      filtered = filtered.filter((item) =>
        item.plant.name.toLowerCase().includes(text.toLowerCase())
      );
    }
    if (selectedAttributes.length > 0) {
      filtered = filtered.filter((item) =>
        selectedAttributes.every(attr => item.plant.attributes.some(a => a.name === attr))
      );
    }
    setFilteredData(filtered);
  };

  const handleSelectAttribute = (attribute: string) => {
    setSelectedAttributes((prev) =>
      prev.includes(attribute) ? prev.filter((attr) => attr !== attribute) : [...prev, attribute]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBox}
            placeholder="Tìm kiếm sản phẩm..."
            value={query}
            onChangeText={setQuery}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <Filter attributeGroups={attributeGroups} selectedAttributes={selectedAttributes} onSelectAttribute={handleSelectAttribute} language={language} />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <SearchItem item={item} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={50} color="#999" />
              <Text style={styles.empty}>Không tìm thấy sản phẩm</Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 5,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    marginLeft: 10,
  },
  searchIcon: {
    marginLeft: 15,
  },
  searchBox: {
    flex: 1,
    height: 45,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#333",
  },
  listContent: {
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  empty: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    marginTop: 10,
  },
});

export default SearchScreen;
