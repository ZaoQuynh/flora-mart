import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { OrderEnum } from "@/constants/enums/OrderEnum";
import { useOrder } from "@/hooks/useOrder";

interface OrderActionsProps {
  orderId: number;
  orderStatus: string;
  language: string;
  onOrderUpdated?: () => Promise<void>;
}

const OrderActions: React.FC<OrderActionsProps> = ({ 
  orderId,
  orderStatus, 
  language,
  onOrderUpdated
}) => {
  const { handleCancelOrder, handleReceiveOrder } = useOrder();
  const [loading, setLoading] = React.useState(false);

  // Check if order can be canceled (only NEW status)
  const canCancel = orderStatus === OrderEnum.NEW;

  // Check if delivery can be confirmed (only SHIPPED status)
  const canConfirmDelivery = orderStatus === OrderEnum.SHIPPED;

  // Translation object for various messages
  const translations = {
    en: {
      cancelOrder: "Cancel Order",
      confirmDelivery: "Confirm Delivery",
      cancelConfirmation: "Are you sure you want to cancel this order?",
      deliveryConfirmation: "Confirm that you have received this order?",
      no: "No",
      yes: "Yes, Cancel",
      notYet: "Not yet",
      received: "Yes, Received",
      success: "Success",
      error: "Error",
      orderCancelled: "Order has been cancelled successfully",
      orderReceived: "Order has been marked as received",
      cancelFailed: "Failed to cancel order",
      receiveFailed: "Failed to mark order as received",
      somethingWentWrong: "Something went wrong"
    },
    vi: {
      cancelOrder: "Hủy đơn hàng",
      confirmDelivery: "Xác nhận đã nhận hàng",
      cancelConfirmation: "Bạn có chắc chắn muốn hủy đơn hàng này không?",
      deliveryConfirmation: "Xác nhận bạn đã nhận được đơn hàng này?",
      no: "Không",
      yes: "Có, Hủy đơn",
      notYet: "Chưa nhận",
      received: "Đã nhận hàng",
      success: "Thành công",
      error: "Lỗi",
      orderCancelled: "Đơn hàng đã được hủy thành công",
      orderReceived: "Đơn hàng đã được đánh dấu là đã nhận",
      cancelFailed: "Không thể hủy đơn hàng",
      receiveFailed: "Không thể đánh dấu đơn hàng là đã nhận",
      somethingWentWrong: "Đã xảy ra lỗi"
    },
    ko: {
      cancelOrder: "주문 취소",
      confirmDelivery: "배송 확인",
      cancelConfirmation: "이 주문을 취소하시겠습니까?",
      deliveryConfirmation: "이 주문을 받았다고 확인하시겠습니까?",
      no: "아니오",
      yes: "네, 취소합니다",
      notYet: "아직 아닙니다",
      received: "네, 받았습니다",
      success: "성공",
      error: "오류",
      orderCancelled: "주문이 성공적으로 취소되었습니다",
      orderReceived: "주문이 수령 완료로 표시되었습니다",
      cancelFailed: "주문 취소에 실패했습니다",
      receiveFailed: "주문을 수령 완료로 표시하지 못했습니다",
      somethingWentWrong: "문제가 발생했습니다"
    }
  };

  // Get translations based on language or default to Vietnamese
  const trans = translations[language as keyof typeof translations] || translations.vi;

  // Show cancel confirmation dialog
  const handleCancelPress = async () => {
    if (!canCancel || loading) return;
    
    Alert.alert(
      trans.cancelOrder,
      trans.cancelConfirmation,
      [
        {
          text: trans.no,
          style: "cancel"
        },
        { 
          text: trans.yes, 
          onPress: async () => {
            try {
              setLoading(true);
              const success = await handleCancelOrder(orderId);
              if (success) {
                Alert.alert(
                  trans.success,
                  trans.orderCancelled
                );
                
                if (onOrderUpdated) {
                  await onOrderUpdated();
                }
              } else {
                Alert.alert(
                  trans.error,
                  trans.cancelFailed
                );
              }
            } catch (error) {
              console.error("Error cancelling order:", error);
              Alert.alert(
                trans.error,
                trans.somethingWentWrong
              );
            } finally {
              setLoading(false);
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  // Show delivery confirmation dialog
  const handleConfirmDeliveryPress = async () => {
    if (!canConfirmDelivery || loading) return;
    
    Alert.alert(
      trans.confirmDelivery,
      trans.deliveryConfirmation,
      [
        {
          text: trans.notYet,
          style: "cancel"
        },
        { 
          text: trans.received, 
          onPress: async () => {
            try {
              setLoading(true);
              const success = await handleReceiveOrder(orderId);
              if (success) {
                Alert.alert(
                  trans.success,
                  trans.orderReceived
                );
                // Refresh order list if callback is provided
                if (onOrderUpdated) {
                  await onOrderUpdated();
                }
              } else {
                Alert.alert(
                  trans.error,
                  trans.receiveFailed
                );
              }
            } catch (error) {
              console.error("Error receiving order:", error);
              Alert.alert(
                trans.error,
                trans.somethingWentWrong
              );
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  if (!canCancel && !canConfirmDelivery) {
    return null;
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#4CAF50" />
          <Text style={styles.loadingText}>
            {language === "en" 
              ? "Processing..." 
              : language === "ko" 
                ? "처리 중..." 
                : "Đang xử lý..."}
          </Text>
        </View>
      ) : (
        <>
          {canCancel && (
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={handleCancelPress}
              disabled={loading}
            >
              <Ionicons name="close-circle-outline" size={20} color="#ffffff" />
              <Text style={styles.cancelButtonText}>
                {trans.cancelOrder}
              </Text>
            </TouchableOpacity>
          )}

          {canConfirmDelivery && (
            <TouchableOpacity 
              style={styles.confirmButton} 
              onPress={handleConfirmDeliveryPress}
              disabled={loading}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color="#ffffff" />
              <Text style={styles.confirmButtonText}>
                {trans.confirmDelivery}
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  cancelButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F44336",
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 12,
  },
  cancelButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    marginLeft: 8,
  },
  confirmButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 12,
  },
  confirmButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  loadingText: {
    marginLeft: 12,
    fontSize: 14,
    color: "#757575",
    fontWeight: "500",
  },
});

export default OrderActions;