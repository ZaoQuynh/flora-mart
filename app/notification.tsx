import React from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNotification } from "@/hooks/useNotification";
import { useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const NotificationScreen = () => {
  const { user } = useLocalSearchParams();

  const parsedUser = user ? JSON.parse(user as string) : null;
  const userId = parsedUser?.id?.toString();

  const notifications = useNotification(userId);

  // Hàm để định dạng thời gian thông báo
  const getTimeDisplay = (timestamp) => {
    if (!timestamp) return "";
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Hôm nay";
    } else if (diffDays === 1) {
      return "Hôm qua";
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    } else {
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
  };

  // Render mỗi mục thông báo
  const renderNotificationItem = ({ item }) => {
    // Xác định icon dựa trên loại thông báo
    let iconName = "notifications";
    let iconColor = "#4A90E2";
    
    if (item.type === "warning") {
      iconName = "warning";
      iconColor = "#FFC107";
    } else if (item.type === "success") {
      iconName = "check-circle";
      iconColor = "#4CAF50";
    } else if (item.type === "error") {
      iconName = "error";
      iconColor = "#F44336";
    } else if (item.type === "info") {
      iconName = "info";
      iconColor = "#2196F3";
    }

    return (
      <SafeAreaView>
        <TouchableOpacity style={styles.notificationCard}>
          <View style={styles.iconContainer}>
            <MaterialIcons name={iconName} size={24} color={iconColor} />
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.time}>{getTimeDisplay(item.timestamp)}</Text>
            </View>
            <Text style={styles.message}>{item.message}</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Thông báo</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <MaterialIcons name="settings" size={24} color="#555" />
        </TouchableOpacity>
      </View>
      
      {notifications && notifications.length > 0 && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {notifications.length} thông báo
          </Text>
          <TouchableOpacity>
            <Text style={styles.markAllButton}>Đánh dấu đã đọc</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <FlatList
        data={notifications}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="notifications-off" size={70} color="#CCCCCC" />
            <Text style={styles.empty}>Không có thông báo nào</Text>
            <Text style={styles.emptySubtitle}>Bạn sẽ nhận được thông báo khi có hoạt động mới</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  settingsButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  statsText: {
    fontSize: 14,
    color: "#666666",
  },
  markAllButton: {
    fontSize: 14,
    color: "#4A90E2",
    fontWeight: "500",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  notificationCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginVertical: 6,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    color: "#1A1A1A",
    flex: 1,
  },
  time: {
    fontSize: 12,
    color: "#999999",
  },
  message: {
    fontSize: 14,
    color: "#444444",
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    marginTop: 40,
  },
  empty: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
    color: "#666666",
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#999999",
    textAlign: "center",
  },
});

export default NotificationScreen;