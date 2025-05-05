import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Order } from "@/models/Order";
import { OrderEnum } from "@/constants/enums/OrderEnum";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { OrderItem as OrderItemModel } from "@/models/OrderItem";

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

// Màu sắc theo trạng thái
const statusColors: {
  [key: string]: { background: string; text: string; icon: string };
} = {
  NEW: {
    background: "#E3F2FD",
    text: "#1976D2",
    icon: "ellipsis-horizontal-circle",
  },
  CONFIRMED: {
    background: "#E8F5E9",
    text: "#388E3C",
    icon: "checkmark-circle",
  },
  PREPARING: { background: "#FFF3E0", text: "#E64A19", icon: "construct" },
  SHIPPING: { background: "#E0F7FA", text: "#0097A7", icon: "bicycle" },
  SHIPPED: { background: "#F3E5F5", text: "#7B1FA2", icon: "cube" },
  DELIVERED: {
    background: "#E8F5E9",
    text: "#388E3C",
    icon: "checkmark-done-circle",
  },
  CANCELED: { background: "#FFEBEE", text: "#D32F2F", icon: "close-circle" },
};

interface OrderItemProps {
  order: Order;
  onCancel?: () => void;
  onReceive?: () => void;
  language?: "en" | "vi" | "ko";
  isLoading?: boolean;
}

const OrderItem: React.FC<OrderItemProps> = ({
  order,
  onCancel,
  onReceive,
  language = "vi",
  isLoading = false,
}) => {
  const router = useRouter();

  const totalPrice = order.orderItems.reduce((total, item) => {
    return total + item.discounted * item.qty;
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

  const formatDate = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${hours}:${minutes}| ${day}/${month}/${year}`;
  };

  const getTranslatedStatus = (
    status: string,
    lang: "en" | "vi" | "ko"
  ): string => {
    return orderStatusTranslations[lang]?.[status] || status;
  };

  const statusStyle = statusColors[order.status] || {
    background: "#F5F5F5",
    text: "#757575",
    icon: "help-circle",
  };

  const navigateToOrderDetails = (item: Order) => {
    router.push({
      pathname: "/(order)/details",
      params: { order: JSON.stringify(item) },
    });
  };

  const navigateToReview = (item: OrderItemModel) => {
    router.push({
      pathname: "/(products)/review",
      params: { orderItem: JSON.stringify(item) },
    });
  };

  const navigateToReviewAll = (item: Order) => {
    router.push({
      pathname: "/(products)/reviewall",
      params: { orderItem: JSON.stringify(item) },
    });
  };

  // Hiển thị tiến trình đơn hàng
  const renderOrderProgress = () => {
    const statuses = [
      OrderEnum.NEW,
      OrderEnum.CONFIRMED,
      OrderEnum.PREPARING,
      OrderEnum.SHIPPING,
      OrderEnum.SHIPPED,
      OrderEnum.DELIVERED,
    ];

    // Xác định bước hiện tại
    const currentStep = statuses.indexOf(order.status as OrderEnum);

    // Nếu đơn hàng đã bị hủy, hiển thị biểu tượng hủy
    if (order.status === OrderEnum.CANCELED) {
      return (
        <View style={styles.canceledContainer}>
          <Ionicons name="close-circle" size={28} color="#D32F2F" />
          <Text style={styles.canceledText}>
            {getTranslatedStatus(OrderEnum.CANCELED, language)}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.progressContainer}>
        {statuses.map((status, index) => {
          const isActive = index <= currentStep;
          const isLast = index === statuses.length - 1;

          return (
            <View key={status} style={styles.progressStep}>
              <View
                style={[
                  styles.progressDot,
                  isActive
                    ? { backgroundColor: "#4CAF50" }
                    : { backgroundColor: "#E0E0E0" },
                ]}
              >
                {isActive && (
                  <Ionicons name="checkmark" size={14} color="white" />
                )}
              </View>

              {!isLast && (
                <View
                  style={[
                    styles.progressLine,
                    index < currentStep
                      ? { backgroundColor: "#4CAF50" }
                      : { backgroundColor: "#E0E0E0" },
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>
    );
  };

  // Nếu đang tải, hiển thị chỉ báo tải
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.orderIdContainer}>
            <Text style={styles.orderId}>ID: #{order.id}</Text>
          </View>
          <View style={styles.dateContainer}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.date}>
              {formatDate(new Date(order.createDate))}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.statusContainer,
            { backgroundColor: statusStyle.background },
          ]}
        >
          <Ionicons
            name={statusStyle.icon as any}
            size={18}
            color={statusStyle.text}
          />
          <Text style={[styles.statusText, { color: statusStyle.text }]}>
            {getTranslatedStatus(order.status, language)}
          </Text>
        </View>

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
      </View>
    );
  }
  const hasReviewedAll = order.orderItems.every(
    (item) => item.review !== null
  );
  const hasNotReviewedAll = order.orderItems.some(
    (item) => item.review === null
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.orderIdContainer}>
          <Text style={styles.orderId}>ID: #{order.id}</Text>
        </View>
        <View style={styles.dateContainer}>
          <Ionicons name="time-outline" size={14} color="#666" />
          <Text style={styles.date}>
            {formatDate(new Date(order.createDate))}
          </Text>
        </View>
      </View>

      {/* Hiển thị trạng thái đơn hàng */}
      <View
        style={[
          styles.statusContainer,
          { backgroundColor: statusStyle.background },
        ]}
      >
        <Ionicons
          name={statusStyle.icon as any}
          size={18}
          color={statusStyle.text}
        />
        <Text style={[styles.statusText, { color: statusStyle.text }]}>
          {getTranslatedStatus(order.status, language)}
        </Text>
      </View>

      {/* Hiển thị tiến trình đơn hàng */}
      {renderOrderProgress()}

      <FlatList
        data={order.orderItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <View style={styles.productRow}>
              <View style={styles.imageContainer}>
                {item.product.plant.img ? (
                  <Image
                    source={{ uri: item.product.plant.img }}
                    style={styles.image}
                  />
                ) : (
                  <View style={styles.placeholderImage} />
                )}
              </View>

              <View style={styles.productInfo}>
                <View style={styles.nameAndQuantity}>
                  <Text style={styles.productName}>
                    {item.product.plant.name}
                  </Text>
                  <Text style={styles.quantity}>x{item.qty}</Text>
                </View>

                <View style={styles.priceContainer}>
                  {item.discounted > 0 && (
                    <Text style={styles.originalPrice}>
                      {item.currentPrice.toLocaleString()} đ
                    </Text>
                  )}
                  <Text style={styles.currentPrice}>
                    {item.discounted.toLocaleString()} đ
                  </Text>

                  {/* <TouchableOpacity
                    style={styles.reviewButton}
                    onPress={() => navigateToReview(item)}
                  >
                    {item.review === null && (
                      <Text style={styles.reviewButtonText}>
                        {language === "en"
                          ? "Review"
                          : language === "ko"
                          ? "리뷰"
                          : "Đánh giá"}
                      </Text>
                    )}
                    {item.review !== null && (
                      <Text style={styles.detailButtonText}>
                        {language === "en"
                          ? "Review"
                          : language === "ko"
                          ? "리뷰"
                          : "Xem Đánh giá"}
                      </Text>
                    )}
                  </TouchableOpacity> */}
                </View>
              </View>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <View style={styles.totalContainer}>
        <View style={styles.row}>
          <Text style={styles.totalLabel}>Tổng tiền hàng:</Text>
          <Text style={styles.totalText}>{totalPrice.toLocaleString()} đ</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.totalLabel}>Ưu đãi:</Text>
          <Text style={[styles.totalText, { color: "green" }]}>
            -{voucherPrice.toLocaleString()} đ
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.totalLabel, { fontWeight: "bold" }]}>
            Thành tiền:
          </Text>
          <Text
            style={[styles.totalText, { fontWeight: "bold", color: "red" }]}
          >
            {finalPrice.toLocaleString()} đ
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.reviewButton}
          onPress={() => navigateToReviewAll(order)}
        >
          {hasNotReviewedAll && (
            <Text style={styles.reviewButtonText}>
              {language === "en"
                ? "Review"
                : language === "ko"
                ? "리뷰"
                : "Đánh giá"}
            </Text>
          )}
          {hasReviewedAll && (
            <Text style={styles.detailButtonText}>
              {language === "en"
                ? "Review"
                : language === "ko"
                ? "리뷰"
                : "Xem Đánh giá"}
            </Text>
          )}
        </TouchableOpacity>
        {order.status === OrderEnum.NEW && (
          <TouchableOpacity
            style={[styles.button, styles.refundButton]}
            onPress={onCancel}
          >
            <Ionicons name="close-circle-outline" size={16} color="#F44336" />
            <Text style={styles.refundButtonText}>Hủy đơn hàng</Text>
          </TouchableOpacity>
        )}

        {order.status === OrderEnum.SHIPPED && (
          <TouchableOpacity
            style={[styles.button, styles.receiveButton]}
            onPress={onReceive}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={16}
              color="#8BC34A"
            />
            <Text style={styles.receiveButtonText}>Xác nhận nhận hàng</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.detailButton}
          onPress={() => navigateToOrderDetails(order)}
        >
          <Text style={styles.detailButtonText}>Chi tiết</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderIdContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderId: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
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
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "500",
    marginLeft: 6,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  progressStep: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  progressDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  progressLine: {
    height: 3,
    flex: 1,
  },
  canceledContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  canceledText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#D32F2F",
    marginLeft: 8,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 4,
  },
  imageContainer: {
    marginRight: 12,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  placeholderImage: {
    width: 64,
    height: 64,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  nameAndQuantity: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  productName: {
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
    color: "#212121",
  },
  quantity: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  originalPrice: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  currentPrice: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "600",
  },
  totalContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 15,
    color: "#757575",
  },
  totalText: {
    fontSize: 15,
    color: "#000",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginLeft: 8,
  },
  refundButton: {
    borderWidth: 1,
    borderColor: "#F44336",
  },
  refundButtonText: {
    color: "#F44336",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  receiveButton: {
    borderWidth: 1,
    borderColor: "#8BC34A",
  },
  receiveButtonText: {
    color: "#8BC34A",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  detailButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginLeft: 8,
    backgroundColor: "#F5F5F5",
  },
  detailButtonText: {
    color: "#424242",
    fontSize: 14,
    fontWeight: "500",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
  },
  loadingText: {
    marginLeft: 12,
    fontSize: 14,
    color: "#757575",
    fontWeight: "500",
  },
  reviewButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginLeft: "auto",
    backgroundColor: "#FFEB3B",
  },
  reviewButtonText: {
    fontSize: 13,
    color: "#000",
    fontWeight: "500",
  },
});

export default OrderItem;
