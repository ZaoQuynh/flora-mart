import React from 'react';
import { Colors } from '@/constants/Colors';
import { View, StyleSheet, TextInput, TouchableOpacity, ViewStyle, Alert, BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { User } from '@/models/User';
import Button from '@/components/ui/Button';
import AvatarButton from '@/components/ui/AvatarButton';
import { Product } from '@/models/Product';

interface HomeHeaderProps {
  user: User | null;
  products: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  colors: any;
  translation: any;
  style?: ViewStyle;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  user,
  products,
  searchQuery,
  setSearchQuery,
  colors,
  translation,
  style,
}) => {
  const router = useRouter();

  const navigateToProfile = () => {
    router.push({
      pathname: "/(profile)/information",
      params: { user: JSON.stringify(user) }
    });
  };

  const navigateToSearch = () => {
    console.log('Searching for:', searchQuery);
    router.push({
      pathname: "/(products)/search",
      params: { query: searchQuery, 
                products: JSON.stringify(products)
      }
    });
  };

  const backAction = () => {
    Alert.alert("Thoát ứng dụng", "Bạn có chắc muốn thoát?", [
      { text: "Hủy", style: "cancel" },
      { text: "Thoát", onPress: () => BackHandler.exitApp() },
    ]);
    return true; 
  };


  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={() => backAction()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={colors.text2} />
      </TouchableOpacity>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.placeholder} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={translation.search || "Search plants..."}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={navigateToSearch}
          placeholderTextColor={colors.placeholder}
        />
      </View>

      <Button
        title=""
        onPress={navigateToProfile}
        color="#fff"
        icon={require('../../assets/images/notification-icon.png')}
        style={styles.circleButton}
      />
      
      <AvatarButton
      onPress={navigateToProfile}
      avatar={user?.avatar ? { uri: user.avatar } : require("../../assets/images/temp-user.png")}
      size={40} 
      style={{ margin: 10 }}
    />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 2,
    backgroundColor: Colors.light.background,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    marginRight: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    marginHorizontal: 8,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    padding: 0,
    backgroundColor: 'transparent', 
  },
  circleButton: {
    width: 40,
    height: 40,
    marginLeft: 8,
    padding: 0,
    paddingLeft: 25,
    overflow: 'hidden',
  },
});

export default HomeHeader;