import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { OrderEnum } from "@/constants/enums/OrderEnum";

const orderStatusTranslations: { [key: string]: { [key: string]: string } } = {
  en: {
    NEW: "New",
    CONFIRMED: "Confirmed",
    PREPARING: "Preparing",
    SHIPPING: "Shipping",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELED: "Canceled",
  },
  vi: {
    NEW: "Mới",
    CONFIRMED: "Xác nhận",
    PREPARING: "Chuẩn bị",
    SHIPPING: "Giao hàng",
    SHIPPED: "Đã giao",
    DELIVERED: "Đã nhận",
    CANCELED: "Đã hủy",
  },
  ko: {
    NEW: "신규",
    CONFIRMED: "확인",
    PREPARING: "준비",
    SHIPPING: "배송",
    SHIPPED: "배송됨",
    DELIVERED: "수령",
    CANCELED: "취소",
  },
};

interface OrderProgressProps {
  status: string | null;
  language?: "en" | "vi" | "ko";
}

const OrderProgress: React.FC<OrderProgressProps> = ({ 
  status, 
  language = "vi" 
}) => {
  const getTranslatedStatus = (status: string, lang: "en" | "vi" | "ko"): string => {
    return orderStatusTranslations[lang]?.[status] || status;
  };
  
  // Render progress bar
  const renderOrderProgress = () => {
    const statuses = [
      OrderEnum.NEW,
      OrderEnum.CONFIRMED,
      OrderEnum.PREPARING,
      OrderEnum.SHIPPING,
      OrderEnum.SHIPPED,
      OrderEnum.DELIVERED
    ];
    
    // Determine current step
    const currentStep = status ? statuses.indexOf(status as OrderEnum) : -1;
    
    // If order is canceled, show canceled status
    if (status === OrderEnum.CANCELED) {
      return (
        <View style={styles.canceledContainer}>
          <Ionicons name="close-circle" size={28} color="#D32F2F" />
          <Text style={styles.canceledText}>{getTranslatedStatus(OrderEnum.CANCELED, language)}</Text>
        </View>
      );
    }
    
    return (
      <View>
        <View style={styles.progressContainer}>
          {statuses.map((statusItem, index) => {
            const isActive = index <= currentStep;
            const isLast = index === statuses.length - 1;
            
            return (
              <View key={statusItem} style={styles.progressStep}>
                <View style={[
                  styles.progressDot,
                  isActive ? { backgroundColor: "#4CAF50" } : { backgroundColor: "#E0E0E0" }
                ]}>
                  {isActive && <Ionicons name="checkmark" size={14} color="white" />}
                </View>
                
                {!isLast && (
                  <View style={[
                    styles.progressLine,
                    index < currentStep ? { backgroundColor: "#4CAF50" } : { backgroundColor: "#E0E0E0" }
                  ]} />
                )}
              </View>
            );
          })}
        </View>
        
        <View style={styles.labelContainer}>
          {statuses.map((statusItem, index) => (
            <Text 
              key={`label-${statusItem}`} 
              style={[
                styles.statusLabel,
                index <= currentStep ? { color: "#4CAF50", fontWeight: "500" } : { color: "#9E9E9E" }
              ]}
              numberOfLines={1}
            >
              {getTranslatedStatus(statusItem, language)}
            </Text>
          ))}
        </View>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {language === "en" 
          ? "Order Progress" 
          : language === "ko" 
            ? "주문 진행 상황" 
            : "Tiến trình đơn hàng"}
      </Text>
      {renderOrderProgress()}
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
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  progressStep: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  progressDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  progressLine: {
    height: 3,
    flex: 1,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 0,
  },
  statusLabel: {
    fontSize: 10,
    textAlign: "center",
    width: 50,
  },
  canceledContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  canceledText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#D32F2F",
    marginLeft: 8,
  },
});

export default OrderProgress;