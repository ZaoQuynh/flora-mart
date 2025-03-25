import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function CheckoutSuccessScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Payment Completed</Text>

      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle-outline" size={80} color="#9BA97C" />
      </View>

      <Text style={styles.successText}>Order successfully</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/home")}>
        <Text style={styles.buttonText}>Continue shopping</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    backgroundColor: "#fff",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#9BA97C",
    marginBottom: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  successText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#9BA97C",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
});
