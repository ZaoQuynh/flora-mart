import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { OrderStatus } from "@/constants/enums/OrderEnum";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import useSettings from "@/hooks/useSettings";
import { Order } from "@/models/Order";
import OrderItem from "@/components/ui/OrderItem";
import FlowStatsCard from "@/components/ui/FlowStatsCard";
import { useOrder } from "@/hooks/useOrder";
import { useFocusEffect } from "expo-router";
import { Modal } from "react-native";

const tabOptions = [
  { key: "NEW", label: "Chờ xác nhận" },
  { key: "SHIPPING", label: "Đang giao" },
  { key: "DELIVERED", label: "Đã giao" },
];
type CashflowStats = {
  year: number;
  pendingAmount: number;
  shippingAmount: number;
  deliveredAmount: number;
};

export default function StatisticsScreen() {
  const navigation = useNavigation();
  const { language, translation, colors } = useSettings();
  const { handleGetMyOrders, handleCancelOrder, handleReceiveOrder } =
    useOrder();
  const [orders, setOrders] = useState<Order[]>([]);
  const [statsByYear, setStatsByYear] = useState<CashflowStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOrderId, setLoadingOrderId] = useState<number | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("NEW");
  const [selectedYear, setSelectedYear] = useState(2025);
  const filteredOrders = orders.filter((order) => order.status === selectedTab);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const fetchOrders = async () => {
    setIsInitialLoading(true);
    try {
      const response = await handleGetMyOrders();
      if (response) {
        setOrders(response.orders);
        setStatsByYear(response.statsByYear);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Function to update orders after an action
  const updateOrderList = async () => {
    try {
      const response = await handleGetMyOrders();
      if (response) {
        setOrders(response.orders);
      }
    } catch (err) {
      console.error("Error updating orders:", err);
    }
  };

  // Function to cancel an order
  const cancelOrder = (order: Order) => async () => {
    if (loading) return;

    try {
      setLoading(true);
      setLoadingOrderId(order.id);

      // Show confirmation dialog
      Alert.alert(
        translation.confirmCancel || "Confirm Cancellation",
        translation.cancelOrderConfirmation ||
          `Are you sure you want to cancel order?`,
        [
          {
            text: translation.no || "No",
            style: "cancel",
            onPress: () => {
              setLoading(false);
              setLoadingOrderId(null);
            },
          },
          {
            text: translation.yes || "Yes",
            onPress: async () => {
              try {
                const success = await handleCancelOrder(order.id);
                if (success) {
                  Alert.alert(
                    translation.success || "Success",
                    translation.orderCancelled ||
                      "Order has been cancelled successfully"
                  );
                  // Refresh order list
                  await updateOrderList();
                } else {
                  Alert.alert(
                    translation.error || "Error",
                    translation.cancelFailed || "Failed to cancel order"
                  );
                }
              } catch (error) {
                console.error("Error cancelling order:", error);
                Alert.alert(
                  translation.error || "Error",
                  translation.somethingWentWrong || "Something went wrong"
                );
              } finally {
                setLoading(false);
                setLoadingOrderId(null);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error in cancel order process:", error);
      setLoading(false);
      setLoadingOrderId(null);
      Alert.alert(
        translation.error || "Error",
        translation.somethingWentWrong || "Something went wrong"
      );
    }
  };

  // Function to receive an order
  const receiveOrder = (order: Order) => async () => {
    if (loading) return;

    try {
      setLoading(true);
      setLoadingOrderId(order.id);

      // Show confirmation dialog
      Alert.alert(
        translation.confirmReceived || "Confirm Receipt",
        translation.receiveOrderConfirmation ||
          `Confirm that you've received order #${order.id}?`,
        [
          {
            text: translation.no || "No",
            style: "cancel",
            onPress: () => {
              setLoading(false);
              setLoadingOrderId(null);
            },
          },
          {
            text: translation.yes || "Yes",
            onPress: async () => {
              try {
                const success = await handleReceiveOrder(order.id);
                if (success) {
                  Alert.alert(
                    translation.success || "Success",
                    translation.orderReceived ||
                      "Order has been marked as received"
                  );
                  // Refresh order list
                  await updateOrderList();
                } else {
                  Alert.alert(
                    translation.error || "Error",
                    translation.receiveFailed ||
                      "Failed to mark order as received"
                  );
                }
              } catch (error) {
                console.error("Error receiving order:", error);
                Alert.alert(
                  translation.error || "Error",
                  translation.somethingWentWrong || "Something went wrong"
                );
              } finally {
                setLoading(false);
                setLoadingOrderId(null);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error in receive order process:", error);
      setLoading(false);
      setLoadingOrderId(null);
      Alert.alert(
        translation.error || "Error",
        translation.somethingWentWrong || "Something went wrong"
      );
    }
  };
  const countOrdersByStatus = (status: string) => {
    return orders.filter((order) => {
      const orderYear = new Date(order.createDate).getFullYear();
      return order.status === status && orderYear === selectedYear;
    }).length;
  };

  const filteredOrdersByYearAndTab = filteredOrders.filter((order) => {
    const orderYear = new Date(order.createDate).getFullYear();
    return orderYear === selectedYear && order.status === selectedTab;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text2} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: colors.text3 }]}>
          {translation.myPurchaseHistoryStatistics ||
            "My Purchase History Statistics"}
        </Text>
        <TouchableOpacity
          onPress={() => setShowYearPicker(true)}
          style={[styles.yearBox, { borderColor: colors.primary}]}
        >
          <Text style={[styles.yearText, { color: colors.primary }]}>
            {selectedYear}
          </Text>
        </TouchableOpacity>
        {showYearPicker && (
          <Modal transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.yearPicker}>
                {[2023, 2024, 2025].map((year) => (
                  <TouchableOpacity
                    key={year}
                    onPress={() => {
                      setSelectedYear(year);
                      setShowYearPicker(false);
                    }}
                  >
                    <Text style={styles.yearItem}>{year}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Modal>
        )}
      </View>

      {/* Tab Layout */}
      <View style={styles.tabContainer}>
        {tabOptions.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setSelectedTab(tab.key)}
            style={[
              styles.tabItem,
              selectedTab === tab.key && styles.activeTabItem,
            ]}
          >
            <Text
              style={{
                color: selectedTab === tab.key ? colors.primary : colors.text2,
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Flow Statistics Cards */}
      <View style={styles.statsContainer}>
        {selectedTab === "NEW" && (
          <FlowStatsCard
            title=""
            count={countOrdersByStatus("NEW")}
            amount={
              statsByYear.find((stat) => stat.year === selectedYear)
                ?.pendingAmount || 0
            }
            color="#FFA500" // cam
          />
        )}
        {selectedTab === "SHIPPING" && (
          <FlowStatsCard
            title="Đang giao"
            count={countOrdersByStatus("SHIPPING")}
            amount={
              statsByYear.find((stat) => stat.year === selectedYear)
                ?.shippingAmount || 0
            }
            color="#1E90FF" 
          />
        )}
        {selectedTab === "DELIVERED" && (
          <FlowStatsCard
            title=""
            count={countOrdersByStatus("DELIVERED")}
            amount={
              statsByYear.find((stat) => stat.year === selectedYear)
                ?.deliveredAmount || 0
            }
            color="#32CD32"
          />
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {isInitialLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.text2 }]}>
              {translation.loadingOrders || "Loading orders..."}
            </Text>
          </View>
        ) : filteredOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="receipt"
              size={80}
              color={colors.text3}
              style={{ opacity: 0.5 }}
            />
            <Text style={[styles.emptyStateText, { color: colors.text2 }]}>
              {translation.noOrders || "You have no order to track"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredOrdersByYearAndTab}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <OrderItem
                order={item}
                language={language}
                onCancel={cancelOrder(item)}
                onReceive={receiveOrder(item)}
                isLoading={loading && loadingOrderId === item.id}
              />
            )}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
  },
  headerText: { fontSize: 24, fontWeight: "bold", marginLeft: 12 },
  content: { flex: 1, padding: 16 },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyStateText: { fontSize: 18, marginTop: 16 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 16, marginTop: 12 },
  listContainer: { paddingBottom: 16 },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tabItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  activeTabItem: {
    backgroundColor: "#e0f0ff",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  yearPicker: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: 200,
  },
  yearItem: {
    fontSize: 18,
    paddingVertical: 8,
    textAlign: "center",
  },
  yearBox: {
    marginLeft: 170,
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#fff",
  },
  yearText: {
    fontWeight: "bold",
    textAlign: "center",
  },
});
