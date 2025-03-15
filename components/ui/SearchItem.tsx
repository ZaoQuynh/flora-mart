import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Product } from "@/models/Product";
import { useRouter } from "expo-router";

interface SearchItemProps {
  item: Product;
}

const SearchItem: React.FC<SearchItemProps> = ({ item }) => {
  const router = useRouter();

  const navigateToProductDetail = () => {
    router.push({ 
      pathname: "/(products)/details",
      params: { product: JSON.stringify(item) } 
    } );
  };

  return (
    <TouchableOpacity style={styles.item} onPress={navigateToProductDetail}>
      <Image source={{ uri: item.plant.img }} style={styles.image} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={styles.title}>{item.plant.name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {(item.price * (1 - item.discount / 100)).toLocaleString()}đ
          </Text>
          <Text style={styles.originalPrice}>{item.price.toLocaleString()}đ</Text>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{item.discount}%</Text>
          </View>
        </View>
        <Text style={styles.stock}>{item.stockQty > 0 ? `Còn ${item.stockQty} sản phẩm` : "Hết hàng"}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontWeight: "600",
    fontSize: 18,
    color: "#333",
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 5,
  },
  price: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  originalPrice: {
    color: "#999",
    fontSize: 14,
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  discountBadge: {
    backgroundColor: "#FF5722",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  stock: {
    fontSize: 13,
    color: "#666",
  },
});

export default SearchItem;
