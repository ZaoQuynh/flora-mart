import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from "react-native";
import { OrderItem as OrderItemType } from "@/models/Order";

interface OrderItemsProps {
  orderItems: OrderItemType[];
  onReviewOrder?: (orderItemId: number) => void;
  showReviewButton?: boolean;
  language?: "en" | "vi" | "ko";
}

const OrderItems: React.FC<OrderItemsProps> = ({ 
  orderItems, 
  onReviewOrder,
  showReviewButton = false,
  language = "vi" 
}) => {
  
  const renderOrderItem = ({ item }: { item: OrderItemType }) => {
    return (
      <View style={styles.productRow}>      
        <View style={styles.imageContainer}>
          {item.product.plant.img ? (
            <Image source={{ uri: item.product.plant.img }} style={styles.image} />
          ) : (
            <View style={styles.placeholderImage} />
          )}
        </View>
        
        <View style={styles.productInfo}>
          <View style={styles.nameAndQuantity}>
            <Text style={styles.productName}>{item.product.plant.name}</Text>
            <Text style={styles.quantity}>x{item.qty}</Text>
          </View>
          
          <View style={styles.middleRow}>
            <View style={styles.attributeContainer}>
              {/* {item.product.plant.attributes.slice(0, 2).map((attribute, index) => (
                <View key={attribute.id} style={styles.attribute}>
                  {attribute.icon && (
                    <Image 
                      source={{ uri: attribute.icon }} 
                      style={styles.attributeIcon} 
                    />
                  )}
                  <Text style={styles.attributeName}>{attribute.name}</Text>
                </View>
              ))} */}
            </View>
          </View>
          
          <View style={styles.bottomRow}>
            <View style={styles.priceContainer}>
              {item.discounted > 0 && (
                <Text style={styles.originalPrice}>
                  {(item.currentPrice + item.discounted).toLocaleString()} đ
                </Text>
              )}
              <Text style={styles.currentPrice}>{item.currentPrice.toLocaleString()} đ</Text>
            </View>
            
            {showReviewButton && !item.review && onReviewOrder && (
              <TouchableOpacity 
                style={styles.reviewButton}
                onPress={() => onReviewOrder(item.id)}
              >
                <Text style={styles.reviewButtonText}>
                  {language === "en" ? "Review" : language === "ko" ? "리뷰" : "Đánh giá"}
                </Text>
              </TouchableOpacity>
            )}
            
            {item.review && (
              <View style={styles.reviewedBadge}>
                <Text style={styles.reviewedText}>
                  {language === "en" ? "Reviewed" : language === "ko" ? "리뷰됨" : "Đã đánh giá"}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };
  
  return (
    <FlatList
      data={orderItems}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderOrderItem}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      scrollEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
  productRow: {
    flexDirection: "row",
    paddingVertical: 12,
  },
  separator: {
    height: 1,
    backgroundColor: "#f0f0f0",
  },
  imageContainer: {
    marginRight: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  placeholderImage: {
    width: 80,
    height: 80,
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
    marginLeft: 8,
  },
  middleRow: {
    marginBottom: 8,
  },
  attributeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  attribute: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  attributeIcon: {
    width: 14,
    height: 14,
    marginRight: 4,
  },
  attributeName: {
    fontSize: 12,
    color: "#757575",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  reviewButton: {
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  reviewButtonText: {
    fontSize: 12,
    color: "#E64A19",
    fontWeight: "500",
  },
  reviewedBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  reviewedText: {
    fontSize: 12,
    color: "#388E3C",
    fontWeight: "500",
  },
});

export default OrderItems;