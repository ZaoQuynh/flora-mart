import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useSettings from '@/hooks/useSettings';
import { Order } from '@/models/Order';
import OrderItem from "@/components/ui/OrderItem";
import { useOrder } from '@/hooks/useOrder';
import { useFocusEffect } from 'expo-router';

export default function HistoryScreen() {
  const navigation = useNavigation();
  const {language, translation, colors } = useSettings();
  const {handleGetMyOrders, handleCancelOrder, handleReceiveOrder} = useOrder();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOrderId, setLoadingOrderId] = useState<number | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const fetchOrders = async () => {
    setIsInitialLoading(true);
    try {
        const response = await handleGetMyOrders();
        if (response) {
            setOrders(response);
        }
    } catch (err) {
        console.error("Error fetching orders:", err);
    } finally {
        setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);


  // Function to update orders after an action
  const updateOrderList = async () => {
    try {
      const response = await handleGetMyOrders();
      if (response) {
        setOrders(response);
      }
    } catch (err) {
      console.error("Error updating orders:", err);
    }
  };

  // Function to cancel an order
  const cancelOrder = (order: Order) => async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      setLoadingOrderId(order.id);
      
      // Show confirmation dialog
      Alert.alert(
        translation.confirmCancel || 'Confirm Cancellation',
        translation.cancelOrderConfirmation || `Are you sure you want to cancel order?`,
        [
          {
            text: translation.no || 'No',
            style: 'cancel',
            onPress: () => {
              setLoading(false);
              setLoadingOrderId(null);
            }
          },
          {
            text: translation.yes || 'Yes',
            onPress: async () => {
              try {
                const success = await handleCancelOrder(order.id);
                if (success) {
                  Alert.alert(
                    translation.success || 'Success',
                    translation.orderCancelled || 'Order has been cancelled successfully'
                  );
                  // Refresh order list
                  await updateOrderList();
                } else {
                  Alert.alert(
                    translation.error || 'Error',
                    translation.cancelFailed || 'Failed to cancel order'
                  );
                }
              } catch (error) {
                console.error("Error cancelling order:", error);
                Alert.alert(
                  translation.error || 'Error',
                  translation.somethingWentWrong || 'Something went wrong'
                );
              } finally {
                setLoading(false);
                setLoadingOrderId(null);
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error("Error in cancel order process:", error);
      setLoading(false);
      setLoadingOrderId(null);
      Alert.alert(
        translation.error || 'Error',
        translation.somethingWentWrong || 'Something went wrong'
      );
    }
  };

  // Function to receive an order
  const receiveOrder = (order: Order) => async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      setLoadingOrderId(order.id);
      
      // Show confirmation dialog
      Alert.alert(
        translation.confirmReceived || 'Confirm Receipt',
        translation.receiveOrderConfirmation || `Confirm that you've received order #${order.id}?`,
        [
          {
            text: translation.no || 'No',
            style: 'cancel',
            onPress: () => {
              setLoading(false);
              setLoadingOrderId(null);
            }
          },
          {
            text: translation.yes || 'Yes',
            onPress: async () => {
              try {
                const success = await handleReceiveOrder(order.id);
                if (success) {
                  Alert.alert(
                    translation.success || 'Success',
                    translation.orderReceived || 'Order has been marked as received'
                  );
                  // Refresh order list
                  await updateOrderList();
                } else {
                  Alert.alert(
                    translation.error || 'Error',
                    translation.receiveFailed || 'Failed to mark order as received'
                  );
                }
              } catch (error) {
                console.error("Error receiving order:", error);
                Alert.alert(
                  translation.error || 'Error',
                  translation.somethingWentWrong || 'Something went wrong'
                );
              } finally {
                setLoading(false);
                setLoadingOrderId(null);
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error("Error in receive order process:", error);
      setLoading(false);
      setLoadingOrderId(null);
      Alert.alert(
        translation.error || 'Error',
        translation.somethingWentWrong || 'Something went wrong'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text2} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: colors.text3 }]}>
          {translation.myOrders || 'My Orders'}
        </Text>
      </View>

      <View style={styles.content}>
        {isInitialLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.text2 }]}>
              {translation.loadingOrders || 'Loading orders...'}
            </Text>
          </View>
        ) : orders.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt" size={80} color={colors.text3} style={{ opacity: 0.5 }} />
            <Text style={[styles.emptyStateText, { color: colors.text2 }]}>
              {translation.noOrders || 'You have no order history'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <OrderItem 
                order={item} 
                language={language}
                onCancel={cancelOrder(item)} 
                onReceive={receiveOrder(item)}
                isLoading={loading && loadingOrderId === item.id}
              />
            )}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff'
  },
  headerText: { fontSize: 24, fontWeight: 'bold', marginLeft: 12 },
  content: { flex: 1, padding: 16},
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 100 },
  emptyStateText: { fontSize: 18, marginTop: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16, marginTop: 12 },
  listContainer: { paddingBottom: 16 }
});