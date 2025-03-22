import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { User } from "@/models/User";

interface OrderShippingInfoProps {
  customer: User;
  address: string;
  language: string;
  showFullInfo: boolean;
  toggleShowFullInfo: () => void;
}

const OrderShippingInfo: React.FC<OrderShippingInfoProps> = ({ 
  customer, 
  address, 
  language, 
  showFullInfo,
  toggleShowFullInfo
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <Ionicons name="person-outline" size={24} color="#757575" />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>
            {language === "en" 
              ? "Customer" 
              : language === "ko" 
                ? "고객" 
                : "Khách hàng"}:
          </Text>
          <Text style={styles.value}>{customer.lastName}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <Ionicons name="mail-outline" size={24} color="#757575" />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>
            {language === "en" 
              ? "Email" 
              : language === "ko" 
                ? "이메일" 
                : "Email"}:
          </Text>
          <Text style={styles.value}>{customer.email}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.addressRow}>
        <View style={styles.iconContainer}>
          <Ionicons name="location-outline" size={24} color="#757575" />
        </View>
        <View style={styles.addressContainer}>
          <Text style={styles.label}>
            {language === "en" 
              ? "Shipping Address" 
              : language === "ko" 
                ? "배송 주소" 
                : "Địa chỉ giao hàng"}:
          </Text>
          <Text style={styles.addressValue}>{address}</Text>
        </View>
      </View>

      {showFullInfo && (
        <>
          <View style={styles.divider} />
          <View style={styles.row}>
            <View style={styles.iconContainer}>
              <Ionicons name="call-outline" size={24} color="#757575" />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>
                {language === "en" 
                  ? "Phone" 
                  : language === "ko" 
                    ? "전화번호" 
                    : "Số điện thoại"}:
              </Text>
              <Text style={styles.value}>+84 xxx xxx xxx</Text>
            </View>
          </View>

          <View style={styles.divider} />
          <View style={styles.row}>
            <View style={styles.iconContainer}>
              <Ionicons name="information-circle-outline" size={24} color="#757575" />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>
                {language === "en" 
                  ? "Customer ID" 
                  : language === "ko" 
                    ? "고객 ID" 
                    : "Mã khách hàng"}:
              </Text>
              <Text style={styles.value}>{customer.id}</Text>
            </View>
          </View>
        </>
      )}

      <TouchableOpacity 
        style={styles.showMoreButton} 
        onPress={toggleShowFullInfo}
      >
        <Text style={styles.showMoreText}>
          {showFullInfo 
            ? (language === "en" 
                ? "Show less" 
                : language === "ko" 
                  ? "간략히 보기" 
                  : "Thu gọn")
            : (language === "en" 
                ? "Show more" 
                : language === "ko" 
                  ? "더 보기" 
                  : "Xem thêm")
          }
        </Text>
        <Ionicons 
          name={showFullInfo ? "chevron-up-outline" : "chevron-down-outline"} 
          size={16} 
          color="#2196F3" 
        />
      </TouchableOpacity>
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
  addressRow: {
    flexDirection: "row",
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
  addressContainer: {
    flex: 1,
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
  addressValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#212121",
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 8,
    marginLeft: 40,
  },
  showMoreButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    marginTop: 8,
  },
  showMoreText: {
    fontSize: 14,
    color: "#2196F3",
    marginRight: 4,
  },
});

export default OrderShippingInfo;