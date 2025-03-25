import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { OrderEnum } from "@/constants/enums/OrderEnum";

const orderStatusTranslations: { [key: string]: { [key: string]: string } } = {
  en: {
    NEW: "New Order",
    CONFIRMED: "Confirmed",
    PREPARING: "Preparing",
    SHIPPING: "Shipping",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELED: "Canceled",
  },
  vi: {
    NEW: "Đơn mới",
    CONFIRMED: "Đã xác nhận",
    PREPARING: "Đang chuẩn bị",
    SHIPPING: "Đang giao hàng",
    SHIPPED: "Đã giao hàng",
    DELIVERED: "Đã nhận hàng",
    CANCELED: "Đã hủy",
  },
  ko: {
    NEW: "새 주문",
    CONFIRMED: "확인됨",
    PREPARING: "준비 중",
    SHIPPING: "배송 중",
    SHIPPED: "배송 완료",
    DELIVERED: "수령 완료",
    CANCELED: "취소됨",
  },
};

// Status colors
const statusColors: { [key: string]: { background: string; text: string; icon: string } } = {
  NEW: { background: "#E3F2FD", text: "#1976D2", icon: "ellipsis-horizontal-circle" },
  CONFIRMED: { background: "#E8F5E9", text: "#388E3C", icon: "checkmark-circle" },
  PREPARING: { background: "#FFF3E0", text: "#E64A19", icon: "construct" },
  SHIPPING: { background: "#E0F7FA", text: "#0097A7", icon: "bicycle" },
  SHIPPED: { background: "#F3E5F5", text: "#7B1FA2", icon: "cube" },
  DELIVERED: { background: "#E8F5E9", text: "#388E3C", icon: "checkmark-done-circle" },
  CANCELED: { background: "#FFEBEE", text: "#D32F2F", icon: "close-circle" },
};

interface OrderStatusProps {
  status: string | null;
  language?: "en" | "vi" | "ko";
}

const OrderStatus: React.FC<OrderStatusProps> = ({ 
  status, 
  language = "vi" 
}) => {
  const getTranslatedStatus = (status: string | null, lang: "en" | "vi" | "ko"): string => {
    if (!status) return "";
    return orderStatusTranslations[lang]?.[status] || status;
  };

  const statusStyle = status ? statusColors[status] : { 
    background: "#F5F5F5", 
    text: "#757575", 
    icon: "help-circle" 
  };
  
  return (
    <View style={styles.container}>
      <View style={[styles.statusContainer, { backgroundColor: statusStyle.background }]}>
        <Ionicons name={statusStyle.icon as any} size={18} color={statusStyle.text} />
        <Text style={[styles.statusText, { color: statusStyle.text }]}>
          {getTranslatedStatus(status, language)}
        </Text>
      </View>
      
      {status === OrderEnum.CANCELED && (
        <View style={styles.statusMessage}>
          <Text style={styles.statusMessageText}>
            {language === "en" 
              ? "This order has been canceled" 
              : language === "ko" 
                ? "이 주문은 취소되었습니다" 
                : "Đơn hàng này đã bị hủy"}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
  },
  statusMessage: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  statusMessageText: {
    fontSize: 14,
    color: "#D32F2F",
    textAlign: "center",
  },
});

export default OrderStatus;