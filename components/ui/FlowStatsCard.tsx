import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import useSettings from "@/hooks/useSettings";

type FlowStatsCardProps = {
  title: string;
  count: number;
  amount: number;
  color: string;
};

const FlowStatsCard = ({ count, amount, color }: FlowStatsCardProps) => {
  const { translation, colors } = useSettings();

  return (
    <View style={[styles.statCard, { borderColor: 'white' }]}>
      <View style={styles.statContent}>
        
        {/* Left side */}
        <View style={styles.section}>
          <Ionicons name="receipt-outline" size={30} color={colors.text3} style={styles.icon} />
          <View style={styles.textGroup}>
            <Text style={styles.statCount}>Đơn hàng</Text>
            <Text style={styles.statLabel}>{count}</Text>
          </View>
        </View>
  
        {/* Right side */}
        <View style={styles.section}>
          <Ionicons name="cash-outline" size={30} color={colors.text3} style={styles.icon} />
          <View style={styles.textGroup}>
            <Text style={styles.statCount}>Chi tiêu</Text>
            <Text style={styles.statLabel}>{amount.toLocaleString()}₫</Text>
          </View>
        </View>
  
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 16,
      paddingHorizontal: 16,
    },
    statCard: {
      flex: 1,
      padding: 12,
      marginHorizontal: 4,
      borderWidth: 2,
      borderRadius: 12,
      backgroundColor: '#fff',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      marginTop: 16,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    statTitle: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 4,
    },
    statCount: {
      fontSize: 16,
      fontWeight: '500',
      color: '#333',
    },
    statAmount: {
      fontSize: 14,
      color: '#666',
      marginTop: 2,
    },
    statContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    
    section: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    
    icon: {
      marginRight: 8,
      alignSelf: 'center',
    },
    
    textGroup: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    
    statLabel: {
      fontSize: 14,
      color: '#666',
    },
  });

  export default FlowStatsCard;