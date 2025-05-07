import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  RefreshControl 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import useSettings from "@/hooks/useSettings";
import { useAuth } from "@/hooks/useAuth";
import { Order } from "@/models/Order";
import { OrderEnum } from "@/constants/enums/OrderEnum";
import { useOrder } from "@/hooks/useOrder"; // Import useOrder hook

// Component imports
import OrderHeader from "@/components/ui/OrderHeader";
import OrderStatus from "@/components/ui/OrderStatus";
import OrderProgress from "@/components/ui/OrderProgress";
import OrderItems from "@/components/ui/OrderItems";
import OrderPaymentInfo from "@/components/ui/OrderPaymentInfo";
import OrderShippingInfo from "@/components/ui/OrderShippingInfo";
import OrderActions from "@/components/ui/OrderActions";
import { useLocalSearchParams } from "expo-router";

export default function OrderDetailScreen() {
  const router = useRoute();
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const { language, translation, colors } = useSettings();
  const [order, setOrder] = useState<Order | null>(null);
  const [showFullInfo, setShowFullInfo] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { getOrderById } = useOrder();
  
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;

  const loadOrderData = async () => {
    try {
      setIsRefreshing(true);
      
      if (params.order) {
        const orderParam = Array.isArray(params.order) ? params.order[0] : params.order;
        const theOrder: Order | null = orderParam ? JSON.parse(orderParam) : null;
        if (theOrder) {
          setOrder(theOrder);
          setIsRefreshing(false);
          return;
        }
      }
      
      if (orderId) {
        const fetchedOrder = await getOrderById(Number(orderId));
        if (fetchedOrder) {
          setOrder(fetchedOrder);
        } else {
          // Show error if order couldn't be loaded
          Alert.alert(
            translation.error || 'Error',
            translation.failedToLoadOrder || 'Failed to load order details'
          );
        }
      }
    } catch (error) {
      console.error("Error loading order data:", error);
      Alert.alert(
        translation.error || 'Error',
        translation.somethingWentWrong || 'Something went wrong'
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [orderId]);

  const refreshOrderData = async () => {
    if (orderId) {
      try {
        setIsRefreshing(true);
        
        // Fetch fresh data
        const refreshedOrder = await getOrderById(Number(orderId));
        
        if (refreshedOrder) {
          console.log("Updating order state:", refreshedOrder);
          setOrder({...refreshedOrder});
          console.log("New order state set successfully");
        }
      } catch (error) {
        console.error("Failed to refresh order data:", error);
        Alert.alert(
          translation.error || 'Error',
          translation.failedToRefresh || 'Failed to refresh order data'
        );
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  if (!order || isRefreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text2} />
          </TouchableOpacity>
          <Text style={[styles.headerText, { color: colors.text3 }]}>
            {translation.orderDetails || 'Order Details'}
          </Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text2 }]}>
            {translation.loading || 'Loading...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalPrice = order.orderItems.reduce((total, item) => {
    return total + item.currentPrice * item.qty;
  }, 0);

  const totalItems = order.orderItems.reduce((total, item) => {
    return total + item.qty;
  }, 0);
  
  let voucherPrice = 0;

  if (order.vouchers && order.vouchers.length > 0) {
    const voucher = order.vouchers[0]; // giả sử chỉ dùng 1 voucher
    const discount = voucher.discount ?? 0; // phần trăm giảm, ví dụ: 0.1
    const maxDiscount = voucher.maxDiscount ?? null;
    const minOrderAmount = voucher.minOrderAmount ?? 0;

    if (totalPrice >= minOrderAmount) {
      let discountAmount = (totalPrice * discount) / 100;
      if (maxDiscount !== null) {
        voucherPrice = Math.min(discountAmount, maxDiscount);
      } else {
        voucherPrice = discountAmount;
      }
    }
  }

  const finalPrice = totalPrice - voucherPrice;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text2} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: colors.text3 }]}>
          {translation.orderDetails || 'Order Details'}
        </Text>
      </View>
      
      <ScrollView style={styles.scrollView}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refreshOrderData}
          colors={[colors.primary]}
        />
      }>
        <View style={styles.content}>
          <OrderHeader 
            orderId={order.id} 
            createDate={order.createDate} 
            language={language} 
          />
          
          <OrderStatus 
            status={order.status} 
            language={language} 
          />
          
          <OrderProgress 
            status={order.status} 
            language={language} 
          />
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text3 }]}>
              {language === "en" ? "Order Items" : language === "ko" ? "주문 항목" : "Sản phẩm đã đặt"}
            </Text>
            <OrderItems 
              orderItems={order.orderItems} 
              showReviewButton={order.status === OrderEnum.DELIVERED}
              language={language} 
            />
            
            <View style={styles.orderSummary}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.text2 }]}>
                  {language === "en" ? "Total Items" : language === "ko" ? "총 항목" : "Tổng sản phẩm"}:
                </Text>
                <Text style={[styles.summaryValue, { color: colors.text3 }]}>{totalItems}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.text2 }]}>
                  {language === "en" ? "Total Items" : language === "ko" ? "총 항목" : "Tổng tiền hàng"}:
                </Text>
                <Text style={[styles.summaryValue, { color: colors.text3 }]}>{totalPrice}</Text>
              </View>
              
              {voucherPrice > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: colors.text2 }]}>
                    {language === "en" ? "Discount" : language === "ko" ? "할인" : "Giảm giá"}:
                  </Text>
                  <Text style={styles.discountValue}>-{voucherPrice.toLocaleString()} đ</Text>
                </View>
              )}
              
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { color: colors.text3 }]}>
                  {language === "en" ? "Order Total" : language === "ko" ? "주문 총액" : "Tổng tiền"}:
                </Text>
                <Text style={styles.totalValue}>{finalPrice.toLocaleString()} đ</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text3 }]}>
              {language === "en" ? "Payment Information" : language === "ko" ? "결제 정보" : "Thông tin thanh toán"}
            </Text>
            <OrderPaymentInfo 
              payment={order.payment} 
              language={language} 
            />
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text3 }]}>
              {language === "en" ? "Shipping Information" : language === "ko" ? "배송 정보" : "Thông tin giao hàng"}
            </Text>
            <OrderShippingInfo 
              customer={order.customer} 
              address={order.address} 
              language={language} 
              showFullInfo={showFullInfo}
              toggleShowFullInfo={() => setShowFullInfo(!showFullInfo)}
            />
          </View>
          
          <OrderActions 
            orderId={order.id}
            orderStatus={order.status} 
            language={language} 
            onOrderUpdated={refreshOrderData}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Keep existing styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff'
  },
  headerText: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginLeft: 12 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    fontSize: 18
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  orderSummary: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  discountValue: {
    fontSize: 14,
    color: "#F44336",
    fontWeight: "500",
  },
  voucherText: {
    fontSize: 14,
    color: "#9C27B0",
    fontWeight: "500",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4CAF50",
  },
});