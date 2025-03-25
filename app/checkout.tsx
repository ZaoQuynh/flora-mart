import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CartItem from "@/components/ui/CartItem";
import CheckOutItem from "@/components/ui/CheckOutItem";
import useSettings from "@/hooks/useSettings";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/models/User";
import { useCart } from "@/hooks/useCart";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Strings from "@/constants/Strings";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import ToastHelper from "@/utils/ToastHelper";

export default function CheckoutScreen() {
  const { translation, colors } = useSettings();
  const { userInfo } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const { handleGetItemsCart, handleCheckout } = useCart();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();
  const [cartId, setCartId] = useState<number | null>(null);
  const [address, setAddress] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("Choose payment method");
  const [modalVisible, setModalVisible] = useState(false);

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

  const handleCheckoutPress = () => {
    const paymentType = selectedMethod === "COD (Cash on Delivery)" ? 0 : 1;
    if (!address.trim()) {
      ToastHelper.showError('Lỗi thanh toán','Vui lòng nhập địa chỉ!!')
      return;
    }
  
    try {
      const response = handleCheckout(cartId!!, address, paymentType);
      
      if (!!response) {
        router.push("/checkoutSuccess");
      } else {
        ToastHelper.showError('Lỗi thanh toán','Vui lòng nhập thử lại!')
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred during checkout.");
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <View style={styles.container}>
      <View style={styles.cartContainer}>
        <Text style={[styles.headerText, { color: colors.text3 }]}>
          {translation.checkOut || "Checkout"}
        </Text>
        <Text style={styles.itemCount}>{cartItems.length} items</Text>
        <View style={styles.separator} />

        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CheckOutItem cartId={cartId!!} item={item} />
          )}
        />
      </View>

      <View style={styles.paymentContainer}>
        <View style={styles.subtotalContainer}>
          <Text style={styles.subtotalText}>Sub total</Text>
          <Text style={styles.subtotalPrice}>
            {totalAmount.toLocaleString()} đ
          </Text>
        </View>
        <TouchableOpacity
          style={styles.voucherContainer}
          // onPress={handleSelectVoucher}
        >
          <Text style={styles.voucherText}>Select vouchers </Text>
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address</Text>
          <TextInput style={styles.input} placeholder="Enter your address" value={address} onChangeText={setAddress}/>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Payment method</Text>

          {/* Nút chọn phương thức thanh toán */}
          <TouchableOpacity
            style={styles.paymentMethodButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.paymentMethodText}>{selectedMethod}</Text>
            <Ionicons name="chevron-forward" size={20} color="gray" />
          </TouchableOpacity>

          {/* Modal chọn phương thức thanh toán */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Payment Method</Text>

                {/* COD */}
                <TouchableOpacity
                  style={styles.paymentOption}
                  onPress={() => {
                    setSelectedMethod("COD (Cash on Delivery)");
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>COD (Cash on Delivery)</Text>
                </TouchableOpacity>

                {/* MOMO */}
                <TouchableOpacity
                  style={styles.paymentOption}
                  onPress={() => {
                    setSelectedMethod("MOMO (E-Wallet)");
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>MOMO (E-Wallet)</Text>
                </TouchableOpacity>

                {/* Close Button */}
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </View>
      <View style={styles.footerContainer}>
        <Text style={styles.totalPrice}>{totalAmount.toLocaleString()} đ</Text>
        <TouchableOpacity style={styles.paymentButton} onPress={handleCheckoutPress}>
          <Text style={styles.paymentText}>Payment</Text>
        </TouchableOpacity>
      </View>
      <Toast/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flex: 1,
    backgroundColor: "#f8f8f8",
  },

  cartContainer: {
    flex: 0.5,
    padding: 16,
  },

  paymentContainer: {
    flex: 0.5,
    padding: 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputContainer: {
    marginTop: 10,
  },

  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "gray",
  },

  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },

  paymentMethodButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },

  paymentMethodText: {
    fontSize: 14,
    color: "gray",
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
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: "lightgray",
    backgroundColor: "#fff",
  },

  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },

  paymentButton: {
    backgroundColor: "#c9d8b6",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },

  paymentText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  paymentOption: {
    padding: 12,
    width: "100%",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  voucherContainer: {
    backgroundColor: "#E0E0E0",
    padding: 12,
    justifyContent: "center",
  },
  voucherText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
  },
});
