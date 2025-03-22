import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface OrderHeaderProps {
  orderId: number;
  createDate: Date;
  language?: "en" | "vi" | "ko";
}

const OrderHeader: React.FC<OrderHeaderProps> = ({ 
  orderId, 
  createDate, 
  language = "vi" 
}) => {
  
  const formatDate = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${hours}:${minutes}| ${day}/${month}/${year}`;
  };
  
  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <View style={styles.orderIdContainer}>
          <Text style={styles.orderIdLabel}>
            {language === "en" ? "Order ID" : language === "ko" ? "주문 ID" : "Mã đơn hàng"}:
          </Text>
          <Text style={styles.orderId}>#{orderId}</Text>
        </View>
        <View style={styles.dateContainer}>
          <Ionicons name="time-outline" size={14} color="#666" />
          <Text style={styles.date}>{formatDate(new Date(createDate))}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderIdContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderIdLabel: {
    fontSize: 14,
    color: "#616161",
    marginRight: 4,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  date: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
});

export default OrderHeader;