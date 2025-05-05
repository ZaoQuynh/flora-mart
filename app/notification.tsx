import React from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity, StatusBar } from "react-native";
import { useNotification } from "@/hooks/useNotification";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale"; // Vietnamese locale for date formatting
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const NotificationScreen = () => {
  const { user } = useLocalSearchParams();
  const [refreshing, setRefreshing] = React.useState(false);
  const router = useRouter();
  
  const parsedUser = user ? JSON.parse(user as string) : null;
  const userId = parsedUser?.id?.toString();

  const { notifications, loading, error } = useNotification(userId);

  // Format the date to relative time (e.g., "2 hours ago")
  const formatNotificationDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: vi });
    } catch (error) {
      return "";
    }
  };

  // Handle pull-to-refresh
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // In a real implementation, you would re-fetch notifications here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Handle back button press
  const handleBack = () => {
    router.back();
  };

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Header handleBack={handleBack} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.light.text2} />
          <Text style={styles.errorText}>
            Đã xảy ra lỗi khi tải thông báo
          </Text>
          <Text style={styles.errorDetail}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <Header handleBack={handleBack} />
      
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.button} />
          <Text style={styles.loadingText}>Đang tải thông báo...</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              colors={[Colors.light.button]} 
              tintColor={Colors.light.button}
            />
          }
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <NotificationItem item={item} formatDate={formatNotificationDate} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={64} color={Colors.light.text2} />
              <Text style={styles.empty}>Không có thông báo nào</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

// Header component with back button
const Header = ({ handleBack }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
      <Ionicons name="arrow-back" size={24} color={Colors.light.text2} />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>Thông báo</Text>
    <View style={styles.rightPlaceholder} />
  </View>
);

// Notification item component
const NotificationItem = ({ item, formatDate }) => (
  <View style={styles.notificationCard}>
    <View style={[styles.notificationIndicator, getIndicatorStyle(item.type)]} />
    <View style={styles.notificationContent}>
      <View style={styles.notificationHeader}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        {item.type && (
          <View style={[styles.badge, getBadgeStyle(item.type)]}>
            <Text style={styles.badgeText}>{getTypeLabel(item.type)}</Text>
          </View>
        )}
      </View>
      <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
      {item.date && (
        <Text style={styles.date}>{formatDate(item.date)}</Text>
      )}
    </View>
  </View>
);

// Helper function to get badge style based on notification type
const getBadgeStyle = (type) => {
  switch (type) {
    case "ORDER":
      return styles.orderBadge;
    case "POST":
      return styles.postBadge;
    case "EVENT":
      return styles.eventBadge;
    case "REVIEW":
      return styles.reviewBadge;
    case "COMMENT":
      return styles.commentBadge;
    default:
      return {};
  }
};

// Helper function to get indicator style based on notification type
const getIndicatorStyle = (type) => {
  switch (type) {
    case "ORDER":
      return styles.orderIndicator;
    case "POST":
      return styles.postIndicator;
    case "EVENT":
      return styles.eventIndicator;
    case "REVIEW":
      return styles.reviewIndicator;
    case "COMMENT":
      return styles.commentIndicator;
    default:
      return styles.defaultIndicator;
  }
};

// Helper function to get readable type label
const getTypeLabel = (type) => {
  switch (type) {
    case "ORDER":
      return "Đơn hàng";
    case "POST":
      return "Bài viết";
    case "EVENT":
      return "Sự kiện";
    case "REVIEW":
      return "Đánh giá";
    case "COMMENT":
      return "Bình luận";
    default:
      return type;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.title,
  },
  rightPlaceholder: {
    width: 24,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: Colors.light.text2,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: "#ffffff",
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  notificationIndicator: {
    width: 4,
    height: '100%',
  },
  notificationContent: {
    flex: 1,
    padding: 16,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  message: {
    fontSize: 14,
    color: Colors.light.text2,
    marginTop: 4,
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    color: Colors.light.text2,
    marginTop: 8,
    opacity: 0.8,
  },
  empty: {
    fontSize: 16,
    fontStyle: "italic",
    color: Colors.light.text2,
    marginTop: 12,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#333",
    marginTop: 16,
    textAlign: "center",
  },
  errorDetail: {
    fontSize: 14,
    color: Colors.light.text2,
    marginTop: 8,
    textAlign: "center",
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#fff",
  },
  // Badge colors
  orderBadge: {
    backgroundColor: "#FF9800",
  },
  postBadge: {
    backgroundColor: "#2196F3",
  },
  eventBadge: {
    backgroundColor: "#9C27B0",
  },
  reviewBadge: {
    backgroundColor: "#F44336",
  },
  commentBadge: {
    backgroundColor: "#607D8B",
  },
  // Indicator colors
  orderIndicator: {
    backgroundColor: "#FF9800",
  },
  postIndicator: {
    backgroundColor: "#2196F3",
  },
  eventIndicator: {
    backgroundColor: "#9C27B0", 
  },
  reviewIndicator: {
    backgroundColor: "#F44336",
  },
  commentIndicator: {
    backgroundColor: "#607D8B",
  },
  defaultIndicator: {
    backgroundColor: Colors.light.button,
  }
});

export default NotificationScreen;