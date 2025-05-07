import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import useSettings from "@/hooks/useSettings";
import { useReview } from "@/hooks/useReview";
import { useLocalSearchParams } from "expo-router";
import { OrderItem } from "@/models/OrderItem";
import { Order } from "@/models/Order";
import { Image } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/models/User";
import { ScrollView } from "react-native";
import { set } from "date-fns";

const ReviewScreen = () => {
  const navigation = useNavigation();
  const { colors, translation } = useSettings();
  const params = useLocalSearchParams();
  const { handleSubmitReview, handleSubmitReviewAll } = useReview();
  const { userInfo } = useAuth();

  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [comments, setComments] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [orderItem, setOrderItem] = useState<OrderItem | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [currentDate, setCurrentDate] = useState("");
  const [hasExistingReview, setHasExistingReview] = useState(false);

  useEffect(() => {
    const date = new Date();
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
    setCurrentDate(formattedDate);

    try {
      // Accessing the correct key 'orderItem' in params
      const orderParam = Array.isArray(params.orderItem)
        ? params.orderItem[0]
        : params.orderItem;

      // Check if orderParam is a string, then parse it
      const parsedOrder: Order | null =
        typeof orderParam === "string" ? JSON.parse(orderParam) : orderParam;

      if (parsedOrder) {
        setOrder(parsedOrder);

        if (parsedOrder.customer) {
          console.log(parsedOrder.customer.fullName); // This will log "Hoang C Manh"
        } else {
          console.error("Customer data is missing in parsed order");
        }

        if (parsedOrder.orderItems && parsedOrder.orderItems.length > 0) {
          const initialRatings: Record<number, number> = {};
          const initialComments: Record<number, string> = {};

          parsedOrder.orderItems.forEach((item) => {
            if (item.review) {
              initialRatings[item.id] = item.review.rate || 0;
              initialComments[item.id] = item.review.comment || "";
            } else {
              initialRatings[item.id] = 0;
              initialComments[item.id] = "";
            }
          });

          setRatings(initialRatings);
          setComments(initialComments);

          const hasReview = parsedOrder.orderItems.every(
            (item) => item.review !== null
          );
          setHasExistingReview(hasReview);
        }
      } else {
        console.error("Parsed order is null or invalid");
        setOrder(null);
      }
    } catch (error) {
      console.error("Error parsing order data:", error);
      setOrder(null);
    }
  }, [params.order]);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await userInfo();
      setUser(data);
    };

    fetchUser();
  }, []);

  const onSubmit = async () => {
    if (!order) {
      Alert.alert(
        translation.error || "Error",
        translation.invalidOrder || "Invalid order"
      );
      return;
    }

    if (!user) {
      Alert.alert(
        translation.error || "Error",
        translation.invalidUser || "Invalid user"
      );
      return;
    }

    // Kiểm tra nếu không có sản phẩm nào được đánh giá
    const hasAtLeastOneReview = order.orderItems.every((item) => {
      const rate = ratings[item.id] || 0;
      const comment = comments[item.id] || "";
      return rate > 0 && comment.trim() !== "";
    });

    if (!hasAtLeastOneReview) {
      Alert.alert(
        translation.error || "Error",
        translation.fillAllFields || "Please rate and write all comment"
      );
      return;
    }

    try {
      setSubmitting(true);

      const submittedReviews = await handleSubmitReviewAll(
        order,
        user,
        ratings,
        comments
      );

      if (submittedReviews.length > 0) {
        Alert.alert(
          translation.success || "Success",
          translation.reviewSubmitted || "Review(s) submitted successfully",
          [{ text: "OK", onPress: () => navigation.popToTop() }]
        );
      } else {
        throw new Error("No reviews were submitted");
      }
    } catch (err) {
      Alert.alert(
        translation.error || "Error",
        err.message || "Failed to submit reviews"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (itemId: number) => {
    const currentRate = ratings[itemId] || 0;

    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((i) => (
          <TouchableOpacity
            key={i}
            onPress={() =>
              !hasExistingReview &&
              setRatings((prev) => ({ ...prev, [itemId]: i }))
            }
            disabled={hasExistingReview}
          >
            <Ionicons
              name={i <= currentRate ? "star" : "star-outline"}
              size={24}
              color={i <= currentRate ? "#FFD700" : "#CCCCCC"}
              style={styles.star}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text2} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: colors.text3 }]}>
          {hasExistingReview
            ? translation.yourReview || "Your Review"
            : translation.comment || "Comment"}
        </Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 50 }}>

        {/* Product Details Card */}
        {order?.orderItems.map((item) => (
          <View key={item.id} style={styles.detailsCard}>
            <View style={styles.detailsHeader}>
              <Text style={[styles.detailsHeaderText, { color: colors.text3 }]}>
                {translation.details || "Details"}
              </Text>
            </View>
            <View style={styles.productInfoContainer}>
              <View style={styles.productImageContainer}>
                <Image
                  source={{ uri: item.product.plant.img }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.orderItemDetails}>
                <View style={styles.productDetails}>
                  <Text style={styles.productName}>
                    {item.product.plant.name}
                  </Text>
                  <Text>x{item.qty}</Text>
                </View>

                <View style={styles.priceContainer}>
                  <Text style={styles.originalPrice}>
                    {formatPrice(item.currentPrice)}.₫
                  </Text>
                  <Text style={styles.discountedPrice}>
                    {formatPrice(item.discounted)}.₫
                  </Text>
                </View>
              </View>
            </View>
            {/* Product image, name, qty, prices */}

            {/* Star Rating */}
            <View style={styles.starContainer}>
              {[1, 2, 3, 4, 5].map((i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() =>
                    !item.review &&
                    setRatings((prev) => ({ ...prev, [item.id]: i }))
                  }
                >
                  <Ionicons
                    name={
                      i <= (ratings[item.id] || 0) ? "star" : "star-outline"
                    }
                    size={24}
                    color={i <= (ratings[item.id] || 0) ? "#FFD700" : "#CCCCCC"}
                  />
                </TouchableOpacity>
              ))}
            </View>
            {hasExistingReview && item.review?.date && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>
                  {translation.date || " Date"}
                </Text>
                <Text style={styles.dateValue}>
                  {new Date(item.review.date).toLocaleTimeString()} |{" "}
                  {new Date(item.review.date).toLocaleDateString()}
                </Text>
              </View>
            )}

            {/* Comment Input */}
            <TextInput
              value={comments[item.id] || ""}
              onChangeText={(text) =>
                setComments((prev) => ({ ...prev, [item.id]: text }))
              }
              editable={!item.review} // Chỉ cho phép nhập nếu chưa có review
              placeholder="Write your comment..."
              multiline
              style={[styles.commentInput, item.review && styles.disabledInput]}
            />
          </View>
        ))}

        {/* Display existing review notice if applicable */}
        {hasExistingReview && (
          <View style={styles.existingReviewBanner}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color="#22c55e"
              style={styles.checkIcon}
            />
            <Text style={styles.existingReviewText}>
              {translation.alreadyReviewed ||
                "You have already rated and reviewed all products"}
            </Text>
          </View>
        )}

        {/* Date Section */}
        {hasExistingReview && orderItem?.review?.date && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {translation.date || " Date"}
            </Text>
            <Text style={styles.dateValue}>
              {new Date(orderItem.review.date).toLocaleTimeString()} |{" "}
              {new Date(orderItem.review.date).toLocaleDateString()}
            </Text>
          </View>
        )}

        {hasExistingReview && orderItem?.review?.feedback && (
          <View style={styles.commentSection}>
            <Text style={styles.sectionLabel}>
              {translation.feedback || "Feedback"}
            </Text>

            <Text style={[styles.commentInput, styles.disabledInput]}>
              {orderItem.review.feedback}
            </Text>
          </View>
        )}

        {/* Submit Button - Only show if no existing review */}
        {!hasExistingReview && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={onSubmit}
              disabled={submitting}
            >
              <Text style={styles.submitButtonText}>
                {submitting
                  ? translation.sending || "Sending..."
                  : translation.send || "Send"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Back Button - Only show if has existing review */}
        {hasExistingReview && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>
                {translation.back || "Back"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

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
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: "#9ca3af",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  detailsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  detailsHeader: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  detailsHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
  },
  timestampContainer: {
    alignItems: "flex-end",
  },
  timestamp: {
    fontSize: 12,
    color: "#9ca3af",
  },
  productInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  productImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    overflow: "hidden",
    marginRight: 12,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  orderItemDetails: {
    flex: 1,
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
  },
  productDetails: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 12,
    color: "#6b7280",
  },
  priceContainer: {
    alignItems: "flex-end",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  originalPrice: {
    fontSize: 12,
    color: "#9ca3af",
    textDecorationLine: "line-through",
    marginEnd: 8,
  },
  discountedPrice: {
    fontSize: 14,
    color: "#1f2937",
  },
  totalPrice: {
    flex: 1,
    textAlign: "right",
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
  },
  section: {
    marginBottom: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  commentSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 8,
  },
  starContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  star: {
    marginRight: 8,
  },
  dateValue: {
    fontSize: 14,
    color: "#4b5563",
  },
  commentInput: {
    height: 100,
    borderColor: "#e5e7eb",
    borderWidth: 1,
    borderRadius: 25,
    padding: 12,
    backgroundColor: "#fff",
    textAlignVertical: "top",
    fontSize: 14,
    color: "#4b5563",
  },
  disabledInput: {
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  submitButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: "#a3e635",
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  existingReviewBanner: {
    backgroundColor: "#ecfdf5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  checkIcon: {
    marginRight: 8,
  },
  existingReviewText: {
    color: "#065f46",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default ReviewScreen;
