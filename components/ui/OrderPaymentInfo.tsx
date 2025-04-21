import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Payment } from "@/models/Payment";
import { PaymentStatusEnum } from "@/constants/enums/PaymentStatusEnum";
import { PaymentTypeEnum } from "@/constants/enums/PaymentTypeEnum";

interface OrderPaymentInfoProps {
  payment: Payment;
  language: string;
}

const OrderPaymentInfo: React.FC<OrderPaymentInfoProps> = ({ payment, language }) => {
  // Return null if payment is null
  if (!payment) {
    return null;
  }

  // Get translated payment status
  const getPaymentStatusText = (status: string) => {
    if (!status) return "";
    
    switch (status) {
      case PaymentStatusEnum.PENDING:
        return language === "en" 
          ? "Pending" 
          : language === "ko" 
            ? "대기 중" 
            : "Đang chờ";
      case PaymentStatusEnum.SUCCESS:
        return language === "en" 
          ? "Paid" 
          : language === "ko" 
            ? "지불됨" 
            : "Đã thanh toán";
      case PaymentStatusEnum.FAILED:
        return language === "en" 
          ? "Failed" 
          : language === "ko" 
            ? "실패" 
            : "Thất bại";
      default:
        return status;
    }
  };

  // Get translated payment type
  const getPaymentTypeText = (type: string) => {
    if (!type) return "";
    
    switch (type) {
      case PaymentTypeEnum.COD:
        return language === "en" 
          ? "Cash on Delivery" 
          : language === "ko" 
            ? "배송 시 현금 결제" 
            : "Thanh toán khi nhận hàng";
      case PaymentTypeEnum.MOMO:
        return "MoMo";
      default:
        return type;
    }
  };

  // Format date according to language
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "";
  
    const parsedDate = new Date(date); // Ensures it's a Date object
  
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    if (language === "en") {
      return parsedDate.toLocaleDateString('en-US', options);
    } else if (language === "ko") {
      return parsedDate.toLocaleDateString('ko-KR', options);
    } else {
      return parsedDate.toLocaleDateString('vi-VN', options);
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    if (!status) return "#757575";
    
    switch (status) {
      case PaymentStatusEnum.SUCCESS:
        return "#4CAF50";
      case PaymentStatusEnum.PENDING:
        return "#FF9800";
      case PaymentStatusEnum.FAILED:
        return "#F44336";
      default:
        return "#757575";
    }
  };

  // Get payment method icon
  const getPaymentIcon = (type: string) => {
    if (!type) return "card-outline";
    
    switch (type) {
      case PaymentTypeEnum.COD:
        return "cash-outline";
      case PaymentTypeEnum.MOMO:
        return "wallet-outline";
      default:
        return "card-outline";
    }
  };

  return (
    <View style={styles.container}>
      {payment.type && (
        <>
          <View style={styles.row}>
            <View style={styles.iconContainer}>
              <Ionicons 
                name={getPaymentIcon(payment.type)} 
                size={24} 
                color="#757575" 
              />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>
                {language === "en" 
                  ? "Payment Method" 
                  : language === "ko" 
                    ? "결제 방법" 
                    : "Phương thức thanh toán"}:
              </Text>
              <Text style={styles.value}>{getPaymentTypeText(payment.type)}</Text>
            </View>
          </View>
          <View style={styles.divider} />
        </>
      )}

      {payment.paymentDate && (
        <>
          <View style={styles.row}>
            <View style={styles.iconContainer}>
              <Ionicons name="time-outline" size={24} color="#757575" />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>
                {language === "en" 
                  ? "Payment Date" 
                  : language === "ko" 
                    ? "결제일" 
                    : "Ngày thanh toán"}:
              </Text>
              <Text style={styles.value}>{formatDate(payment.paymentDate)}</Text>
            </View>
          </View>
          <View style={styles.divider} />
        </>
      )}

      {payment.status && (
        <View style={styles.row}>
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#757575" />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>
              {language === "en" 
                ? "Payment Status" 
                : language === "ko" 
                  ? "결제 상태" 
                  : "Trạng thái thanh toán"}:
            </Text>
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(payment.status) }]} />
              <Text style={[styles.statusText, { color: getStatusColor(payment.status) }]}>
                {getPaymentStatusText(payment.status)}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  iconContainer: {
    width: 40,
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: "#757575",
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
    color: "#212121",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 8,
    marginLeft: 40,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default OrderPaymentInfo;