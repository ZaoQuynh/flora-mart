import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet  } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface CartItemProps {
    cartId: number,
    item: {
      id: number;
      name: string;
      image: string;
      price: number;
      quantity: number;
    };
    removeItem: (id: number) => void;
    decreaseQuantity: (cartId: number, productId: number,currentQuantity: number) => void;
    increaseQuantity: (cartId: number, productId: number,currentQuantity: number) => void;
  }

const CartItem: React.FC<CartItemProps> = ({ cartId ,item, removeItem, decreaseQuantity, increaseQuantity}) => {
  return (
    <View style={styles.cartItem}>
      {/* Hình ảnh sản phẩm */}
      <Image source={{ uri: item.image }} style={styles.image} />
      
      {/* Thông tin sản phẩm */}
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>
          {(item.price * item.quantity).toLocaleString()} $
        </Text>
      </View>

      <TouchableOpacity onPress={() => removeItem(item.id)}>
        <Ionicons name="close-circle-outline" size={24} color="gray" />
      </TouchableOpacity>

      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => decreaseQuantity(cartId ,item.id, item.quantity)} style={styles.quantityButton}>
          <Text style={styles.quantityText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityValue}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => increaseQuantity(cartId, item.id, item.quantity)} style={styles.quantityButton}>
          <Text style={styles.quantityText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
cartItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f8f8f8', 
    borderRadius: 10, 
    padding: 10, 
    marginBottom: 10 
    },
    image: { 
    width: 80, 
    height: 80, 
    borderRadius: 10, 
    marginRight: 10 
    },
    itemInfo: { flex: 1 },
    itemName: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
    itemPrice: { fontSize: 14, color: 'gray' },
    quantityButton: { paddingHorizontal: 8 },
    quantityText: { fontSize: 18 },
    quantityValue: { fontSize: 16, marginHorizontal: 5 },
    quantityContainer: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      borderWidth: 1, 
      borderColor: 'gray', 
      borderRadius: 5, 
      padding: 5, 
      marginLeft: 10 
    },
});

export default CartItem;

