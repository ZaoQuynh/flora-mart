import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

interface CartItemProps {
  cartId: number;
  item: {
    id: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
  };
}

const CartItem: React.FC<CartItemProps> = ({ cartId, item }) => {
  return (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>
          {(item.price * item.quantity).toLocaleString()} đ
        </Text>
      </View>

      <View style={styles.quantityContainer}>
        <Text style={styles.quantityValue}>x{item.quantity}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: "bold", marginBottom: 15 },
  itemPrice: { fontSize: 14, color: "gray" },
  quantityButton: { paddingHorizontal: 8 },
  quantityText: { fontSize: 18, color: "gray" },
  quantityValue: { fontSize: 16, color:"gray" },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    marginLeft: 10,
    marginTop: -50,
  },
});

export default CartItem;
