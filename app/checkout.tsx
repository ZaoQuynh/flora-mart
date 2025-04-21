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
import Icon from "react-native-vector-icons/FontAwesome";
import CartItem from "@/components/ui/CartItem";
import CheckOutItem from "@/components/ui/CheckOutItem";
import useSettings from "@/hooks/useSettings";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/models/User";
import { useCart } from "@/hooks/useCart";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Strings from "@/constants/Strings";
import { useNavigation } from "@react-navigation/native";
import { useVoucher } from "@/hooks/useVoucher";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import ToastHelper from "@/utils/ToastHelper";
import { Voucher } from "@/models/Voucher";
import { TouchableWithoutFeedback } from "react-native";

export default function CheckoutScreen() {
  const { translation, colors } = useSettings();
  const { userInfo } = useAuth();
  const { handleGetItemsCart, handleCheckout } = useCart();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();
  const [cartId, setCartId] = useState<number | null>(null);
  const [address, setAddress] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("Choose payment method");
  const [modalVisible, setModalVisible] = useState(false);
  const [voucherModalVisible, setVoucherModalVisible] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [user, setUser] = useState<any>(null);
  const [voucherList, setVoucherList] = useState<Voucher[]>([]);
  const { handleGetVouchers } = useVoucher();

  useEffect(() => {
    userInfo()
      .then((theUser) => {
        if (theUser?.fullName) {
          setUser(theUser);
        }
      })
      .catch((error) => {
        console.error("Error getting user info:", error);
      });
  }, []);

  useEffect(() => {
    const fetchVouchers = async () => {
      if (!user?.id) return; // Chưa có user.id thì bỏ qua

      try {
        const vouchers = await handleGetVouchers(user.id);
        setVoucherList(vouchers ?? []);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };

    fetchVouchers();
  }, [user]);

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

  const handleVoucherSelect = (voucher: Voucher) => {
    if (selectedVoucher?.id === voucher.id) {
      setSelectedVoucher(null);
    } else {
      setSelectedVoucher(voucher);
    }
  };

  const handleCheckoutPress = () => {
    const paymentType = selectedMethod === "COD (Cash on Delivery)" ? 0 : 1;
    if (!address.trim()) {
      ToastHelper.showError("Lỗi thanh toán", "Vui lòng nhập địa chỉ!!");
      return;
    }

    try {
      if (!cartId) throw new Error("Cart ID is required");
      if (selectedVoucher && !selectedVoucher.id)
        throw new Error("Voucher ID missing");
      const response = handleCheckout(
        cartId,
        address,
        paymentType,
        selectedVoucher?.id ?? 0
      );

      if (!!response) {
        router.push("/checkoutSuccess");
      } else {
        ToastHelper.showError("Lỗi thanh toán", "Vui lòng nhập thử lại!");
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

  const discountAmount = selectedVoucher
    ? selectedVoucher.discount > 0
      ? (selectedVoucher.discount / 100) * totalAmount
      : selectedVoucher.discount
    : 0;

  const minOrderAmount = selectedVoucher?.minOrderAmount || 0;
  const finalAmount = totalAmount - discountAmount;
  const amountToPay = finalAmount >= minOrderAmount ? finalAmount : minOrderAmount;
  const adjustedDiscountAmount = amountToPay > totalAmount ? 0 : discountAmount;
  const finalAmountWithAdjustedDiscount = totalAmount - adjustedDiscountAmount;
  const savedPrice = totalAmount -finalAmountWithAdjustedDiscount;

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={voucherModalVisible}
        onRequestClose={() => setVoucherModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVoucherModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.bottomSheet}>
                <TouchableOpacity
                  style={styles.closeIcon}
                  onPress={() => setVoucherModalVisible(false)}
                >
                  <Text style={styles.closeIconText}>✕</Text>
                </TouchableOpacity>

                <Text style={styles.modalTitle}>Chọn Voucher</Text>
                <FlatList
                  data={voucherList}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.voucherItem}
                      onPress={() => handleVoucherSelect(item)}
                    >
                      <Text style={styles.voucherCode}>{item.code}</Text>
                      <Text style={styles.voucherDesc}>{item.description}</Text>
                      <Text style={styles.voucherDesc}>
                        HSD:{" "}
                        {new Date(item.endDate).toLocaleDateString("vi-VN")}
                      </Text>

                      <View
                        style={[
                          styles.radioButton,
                          selectedVoucher?.id === item.id &&
                            styles.radioButtonSelected,
                        ]}
                      >
                        {selectedVoucher?.id === item.id && (
                          <Icon name="check" size={15} color="green" />
                        )}
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

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
          onPress={() => setVoucherModalVisible(true)}
        >
          <Text style={styles.voucherText}>
            {selectedVoucher
              ? `Voucher: ${selectedVoucher.description}`
              : "Select vouchers"}
          </Text>
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your address"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Payment method</Text>

          <TouchableOpacity
            style={styles.paymentMethodButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.paymentMethodText}>{selectedMethod}</Text>
            <Ionicons name="chevron-forward" size={20} color="gray" />
          </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Payment Method</Text>

                <TouchableOpacity
                  style={styles.paymentOption}
                  onPress={() => {
                    setSelectedMethod("COD (Cash on Delivery)");
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>COD (Cash on Delivery)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.paymentOption}
                  onPress={() => {
                    setSelectedMethod("MOMO (E-Wallet)");
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>MOMO (E-Wallet)</Text>
                </TouchableOpacity>

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
        <View style={styles.priceInfoContainer}>
          <Text style={styles.totalPrice}>
            Total Payment: {finalAmountWithAdjustedDiscount.toLocaleString()} đ
          </Text>
          <Text style={styles.savedAmount}>Saved: {savedPrice.toLocaleString()} đ</Text>
        </View>
        <TouchableOpacity
          style={styles.paymentButton}
          onPress={handleCheckoutPress}
        >
          <Text style={styles.paymentText}>Payment</Text>
        </TouchableOpacity>
      </View>
      <Toast />
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
  voucherContainer: {
    backgroundColor: "#E0E0E0",
    padding: 12,
    justifyContent: "center",
  },
  voucherText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
  },
  voucherMin: {
    fontStyle: "italic",
    fontSize: 12,
    color: "#888",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  bottomSheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  voucherItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  voucherCode: {
    fontWeight: "bold",
    fontSize: 16,
  },
  voucherDesc: {
    color: "gray",
    fontSize: 14,
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 15,
    zIndex: 10,
  },
  closeIconText: {
    fontSize: 22,
    color: "red",
    fontWeight: "bold",
  },
  closeButtonText: {
    color: "#007bff",
    fontSize: 16,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "gray",
    marginLeft: "auto",
  },
  radioButtonSelected: {
    backgroundColor: "#E1EEBC",
  },
  priceInfoContainer: {
    marginBottom: 10,
    alignItems: 'flex-start', // hoặc 'center' nếu muốn căn giữa
  },
  
  savedAmount: {
    fontSize: 14,
    color: 'green',
  },
});
