// Component ProductDetailsScreen
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useLocalSearchParams } from "expo-router";
import { Product } from '@/models/Product';
import { useDescriptionGroup } from '@/hooks/useDescriptionGroup';
import { DescriptionGroup } from '@/models/DescriptionGroup';

const ProductDetailsScreen = () => {
  const params = useLocalSearchParams();
  const navigation = useNavigation();  
  const route = useRoute();           
  const { handleGetDescriptionGroups } = useDescriptionGroup();
  const [descriptionGroups, setDescriptionGroup] = useState<DescriptionGroup[]>([]); 
  const [product, setProduct] = useState<Product | null>(null); 
  const [newComment, setNewComment] = useState(''); 

  useEffect(() => {
    try {
      const productParam = Array.isArray(params.product) ? params.product[0] : params.product;
      const product: Product | null = productParam ? JSON.parse(productParam) : null;
      setProduct(product);
    } catch (error) {
      console.error("Lỗi khi parse dữ liệu sản phẩm:", error);
      setProduct(null);
    }
  }, [params.product]);

  useEffect(() => {
    const fetchDescriptionGroups = async () => {
      try {
        const descriptionGroup = await handleGetDescriptionGroups();
        setDescriptionGroup(descriptionGroup);
      } catch (error) {
        console.error("Lỗi khi lấy nhóm mô tả:", error);
      }
    };
    
    fetchDescriptionGroups();
  }, [handleGetDescriptionGroups]);

  if (!product) {
    return (
      <View>
        <Text>Không tìm thấy sản phẩm.</Text>
      </View>
    );
  }
  
  const discountedPrice = product.price - (product.price * (product.discount / 100));

  const attributes = product.plant.attributes.slice(0, 2);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết sản phẩm</Text>
        <TouchableOpacity style={styles.cartButton}>
          <Ionicons name="cart-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.plant.img }} style={styles.productImage} />
        </View>

        <View style={styles.chipsContainer}>
          {attributes.map((attribute, index) => (
            <View key={index} style={styles.chip}>
              <Text style={styles.chipText}>{attribute.name}</Text>
            </View>
          ))}
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.plant.name}</Text>
          <View style={styles.priceRow}>
            <View style={styles.priceContainer}>
              <Text style={styles.discountedPrice}>
                {discountedPrice.toLocaleString()} đ
              </Text>
              {product.discount > 0 && (
                <Text style={styles.originalPrice}>
                  {product.price.toLocaleString()} đ
                </Text>
              )}
            </View>
            <View style={styles.favoriteContainer}>
              <Ionicons name="heart-outline" size={20} color="#666" />
              <Text style={styles.favoriteText}>| Đã bán: {product.stockQty}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mô tả</Text>
          {descriptionGroups.map((group, index) => (
            <View key={index} style={styles.descriptionGroup}>
              <View style={styles.descriptionGroupHeader}>
                <Ionicons 
                  name={group.icon as any || "information-circle-outline"} 
                  size={16} 
                  color="#666" 
                />
                <Text style={styles.descriptionGroupTitle}>{group.name}</Text>
              </View>
              <View style={styles.descriptionList}>
                {group.descriptions.map((desc, i) => (
                  <View key={i} style={styles.descriptionItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.descriptionText}>{desc.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
          
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đánh giá</Text>
          <View style={styles.ratingStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons 
                key={star} 
                name="star" 
                size={24} 
                color="#FFCE31" 
              />
            ))}
          </View>

          {product.reviews.map((review, index) => (
            <View key={index} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewUser}>
                  <View style={styles.avatarContainer}>
                    {review.customer.avatar ? (
                      <Image source={{ uri: review.customer.avatar }} style={styles.avatar} />
                    ) : (
                      <View style={styles.avatarPlaceholder} />
                    )}
                  </View>
                  <Text style={styles.reviewerName}>{review.customer.fullName}</Text>
                </View>
                <View style={styles.reviewRating}>
                  <Text style={styles.ratingText}>{review.rate}/5</Text>
                </View>
              </View>
              <View style={styles.reviewDetails}>
                <Text style={styles.reviewTime}>
                  {review.date ? format(new Date(review.date), 'HH:mm | dd/MM/yyyy') : 'Không có ngày'}
                </Text>
                <Text style={styles.reviewText}>{review.commnent || 'Không có bình luận'}</Text>
              </View>
            </View>
          ))}

        </View>
      </ScrollView>

      {/* Nút thêm vào giỏ hàng */}
      <View style={styles.bottomButton}>
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    color: '#AABC8C',
    fontWeight: '500',
  },
  cartButton: {
    padding: 5,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#F0F0F0',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  chipsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 15,
  },
  chip: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  chipText: {
    fontSize: 12,
    color: '#666',
  },
  productInfo: {
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#AABC8C',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountedPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  favoriteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  section: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 5,
    borderTopColor: '#F5F5F5',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  descriptionGroup: {
    marginBottom: 12,
  },
  descriptionGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  descriptionGroupTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginLeft: 5,
  },
  descriptionList: {
    paddingLeft: 5,
  },
  descriptionItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  bulletPoint: {
    fontSize: 14,
    marginRight: 5,
    color: '#666',
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  descriptionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 10,
    marginTop: 5,
  },
  descriptionFooterText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  ratingStars: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  reviewItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  reviewUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  avatarPlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  reviewDetails: {
    marginLeft: 40,
  },
  reviewTime: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  reviewText: {
    fontSize: 14,
    color: '#333',
  },
  commentInputContainer: {
    marginTop: 10,
    marginBottom: 60,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  bottomButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  addToCartButton: {
    backgroundColor: '#AABC8C',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ProductDetailsScreen;