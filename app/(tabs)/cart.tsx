import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CartItem from "@/components/ui/CartItem";
import ToastHelper from '@/utils/ToastHelper';
import useSettings from "@/hooks/useSettings";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/models/User";
import { useCart } from "@/hooks/useCart";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Strings from "@/constants/Strings";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

export default function CartScreen() {
  const { translation, colors } = useSettings();
  const { userInfo } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const { handleGetItemsCart } = useCart();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();
  const [cartId, setCartId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = await AsyncStorage.getItem(Strings.AUTH.TOKEN);

        if (!token) {
          console.error("No auth token found");
          return;
        }

        const response = await fetch(
          "http://localhost:8080/api/v1/cart/my-cart",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();

        console.log("Fetched data:", data);

        if (data.orderItems && Array.isArray(data.orderItems)) {
          const items = data.orderItems.map((item: any) => ({
            id: item.product?.id,
            name: item.product?.plant.name,
            price: item.currentPrice,
            quantity: item.qty,
            image: item.product?.plant.img,
          }));
          setCartId(data.id);
          setCartItems(items);
        } else {
          console.error("orderItems is not an array:", data.orderItems);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  const navigateCheckout = () => {
    if(cartItems.length!=0){
      router.push("/checkout");
    }
    else{
      ToastHelper.showError('Lỗi thanh toán', 'Giỏ hàng của bạn trống, vui lòng bổ xung!!');
    }
  };

  const updateCartQuantity = async (
    cartId: number,
    productId: number,
    newQuantity: number
  ) => {
    try {
      const token = await AsyncStorage.getItem(Strings.AUTH.TOKEN);
      if (!token) {
        console.error("No auth token found");
        return;
      }
      const requestBody = {
        cartId,
        productId: productId,
        quantity: newQuantity,
      };
      console.log(JSON.stringify(requestBody, null, 2))
      const response = await fetch(
        "http://localhost:8080/api/v1/cart/update-quantity",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            cartId,
            productId: productId,
            quantity: newQuantity,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update cart quantity");
      }

      console.log("Updated cart item successfully!");
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };

  const increaseQuantity = (
    cartId: number,
    productId: number,
    currentQuantity: number
  ) => {
    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: currentQuantity + 1 }
          : item
      )
    );

    updateCartQuantity(cartId, productId, currentQuantity + 1);
    console.log("Increased quantity successfully!");
  };

  const decreaseQuantity = (
    cartId: number,
    productId: number,
    currentQuantity: number
  ) => {
    if (currentQuantity > 1) {
      // Cập nhật ngay trên FE
      setCartItems((prevCart) =>
        prevCart.map((item) =>
          item.id === productId
            ? { ...item, quantity: currentQuantity - 1 }
            : item
        )
      );

      // Gửi API cập nhật số lượng
      updateCartQuantity(cartId, productId, currentQuantity - 1);
    } else {
      removeItem(productId);
      updateCartQuantity(cartId, productId, currentQuantity - 1);
    }
  };

  const removeItem = async (cartItemId: number) => {
    try {
      setCartItems((prevCart) =>
        prevCart.filter((item) => item.id !== cartItemId)
      );

      console.log("Removed item successfully!");
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={[styles.headerText, { color: colors.text3 }]}>
          {translation.myCart || "My Cart"}
        </Text>
        <Text style={styles.itemCount}>{cartItems.length} items</Text>
        <View style={styles.separator} />

        {cartItems.length === 0 ? (
          <View style={styles.emptyCart}>
            <Ionicons
              name="cart"
              size={80}
              color={colors.text3}
              style={{ opacity: 0.5 }}
            />
            <Text style={[styles.emptyCartText, { color: colors.text2 }]}>
              {translation.cartEmpty || "Your cart is empty"}
            </Text>
            <TouchableOpacity
              style={[styles.shopButton, { backgroundColor: colors.primary }]} onPress={() => router.push("/home")}
            >
              <Text
                style={[styles.shopButtonText, { color: colors.background }]}
              >
                {translation.startShopping || "Start Shopping"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CartItem
                cartId={cartId!!}
                item={item}
                removeItem={removeItem}
                decreaseQuantity={decreaseQuantity}
                increaseQuantity={increaseQuantity}
              />
            )}
          />
        )}

        <View style={styles.subtotalContainer}>
          <Text style={styles.subtotalText}>Sub total</Text>
          <Text style={styles.subtotalPrice}>
            {totalAmount.toLocaleString()} $
          </Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={navigateCheckout}
        >
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      </View>
      {/* <Toast/> */}
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  itemCount: { fontSize: 16, color: "gray", marginBottom: 10 },
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
  content: {
    flex: 1,
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    fontWeight: "600",
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: "bold", marginBottom: 15 },
  itemPrice: { fontSize: 14, color: "gray" },
  quantityButton: { paddingHorizontal: 8 },
  quantityText: { fontSize: 18 },
  quantityValue: { fontSize: 16, marginHorizontal: 5 },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 5,
    marginLeft: 10,
  },
  subtotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: "lightgray",
  },
  subtotalText: { fontSize: 18, fontWeight: "bold" },
  subtotalPrice: { fontSize: 18, fontWeight: "bold" },

  checkoutButton: {
    backgroundColor: "#8da474",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: "lightgray",
  },

  checkoutText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
});
