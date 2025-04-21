import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useNotification } from "@/hooks/useNotification";
import { useLocalSearchParams } from "expo-router";

const NotificationScreen = () => {
  const { user } = useLocalSearchParams();

  const parsedUser = user ? JSON.parse(user as string) : null;
  const userId = parsedUser?.id?.toString();

  const notifications = useNotification(userId);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔔 Thông báo mới:</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.notificationCard}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.message}>{item.message}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Không có thông báo nào.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  notificationCard: {
    backgroundColor: "#f2f2f2",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#1e1e1e",
  },
  message: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  empty: {
    marginTop: 20,
    fontStyle: "italic",
    color: "#888",
    textAlign: "center",
  },
});

export default NotificationScreen;
