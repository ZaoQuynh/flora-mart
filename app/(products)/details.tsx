// Component ProductDetailsScreen
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useCart } from "@/hooks/useCart";
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { router, useLocalSearchParams } from "expo-router";
import { Product } from '@/models/Product';
import { useDescriptionGroup } from '@/hooks/useDescriptionGroup';
import { DescriptionGroup } from '@/models/DescriptionGroup';
import ToastHelper from '@/utils/ToastHelper';
import { Review } from '@/models/Review';
import { useReview } from '@/hooks/useReview';
import { useFavorite } from '@/hooks/useFavorite';
import { useAuth } from '@/hooks/useAuth';
import { useProduct } from '@/hooks/useProduct';
import ProductList from '@/components/ui/ProductList';
import useSettings from '@/hooks/useSettings';

const ProductDetailsScreen = () => {
  const { language, theme, translation, colors } = useSettings();
  const params = useLocalSearchParams();
  const navigation = useNavigation();            
  const { handleGetDescriptionGroups } = useDescriptionGroup();
  const [descriptionGroups, setDescriptionGroup] = useState<DescriptionGroup[] | null>(null);
  const { handleAddToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null); 
  const [reviews, setReviews] = useState<Review[] | null>([]); 
  const [userId, setUserId] = useState<number | null>(null);
  const [totalRate, setTotalRate] = useState<number>(0); 
  const {handleGetReviews} = useReview();
  const {userInfo} = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const { handleAddToFavorites, handleRemoveFromFavorites, handleCheckFavorite } = useFavorite(); // Assuming you have these functions in your useReview hook
  const { handleFindTop10SimilarProducts, handleAddToRecentlyViewed } = useProduct();
  const [similarProducts, setSimilarProducts] = useState<Product[] | null>([]);

  const fetchReviews = async (product: Product) => {
    try {
      const reviews = await handleGetReviews(product.id); 
      setReviews(reviews);
      if(reviews) {
        const total = reviews.reduce((acc, review) => acc + review.rate, 0);
        const average = total / reviews.length;
        setTotalRate(average);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const fetchSimilarProducts = async () => {
    try {
      const similarProducts = await handleFindTop10SimilarProducts(product!!.id); 
      setSimilarProducts(similarProducts);
    }
    catch (error) {
      console.error("Error fetching similar products:", error);
    }
  }

  const checkFavorite = async (productId: number) => {

    if (!userId) {
      ToastHelper.showError('Something went wrong', 'Please try again later!');
      return;
    }

    try {
      const response = await handleCheckFavorite(productId, userId); 
      setIsFavorite(response);
    } catch (error) {
      console.error("Error checking favorite:", error);
    }
  }
  
  const toggleFavorite = async () => {
    if (!userId || !product) {
      ToastHelper.showError('Something went wrong', 'Please try again later!');
      return;
    }
  
    const previousState = isFavorite;
    const newState = !isFavorite;
  
    setIsFavorite(newState);
  
    try {
      if (newState) {
        await handleAddToFavorites(product.id, userId);
      } else {
        await handleRemoveFromFavorites(product.id, userId);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
  
      setIsFavorite(previousState);
      ToastHelper.showError('Oops!', 'Something went wrong while updating favorite');
    }
  };
  

  useEffect(() => {
    userInfo().then(data => {
      if (data) setUserId(data.id);
    });
  }, []);
  
  useEffect(() => {
    try {
      const productParam = Array.isArray(params.product)
        ? params.product[0]
        : params.product;
      const parsedProduct: Product | null = productParam ? JSON.parse(productParam) : null;
  
      setProduct(parsedProduct);
  
      if (parsedProduct) {
        fetchReviews(parsedProduct); 
        handleAddToRecentlyViewed(parsedProduct.id);
      }
    } catch (error) {
      console.error("Error parsing product data:", error);
      setProduct(null);
    }
  }, [params.product]);
  
  useEffect(() => {
    if (product && userId) {
      checkFavorite(product.id);
      fetchSimilarProducts(); 
    }
  }, [product, userId]);
  
  
  // useEffect(() => {
  //   const fetchCartId = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem(Strings.AUTH.TOKEN);
  //       if (!token) {
  //         console.error("No auth token found");
  //         return;
  //       }
  
  //       const storedCartId = await AsyncStorage.getItem("cartId");
  //       if (storedCartId) {
  //         setCartId(Number(storedCartId));
  //         return;
  //       }
  
  //       const response = await fetch("http://localhost:8080/api/v1/cart/my-cart", {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch cart ID");
  //       }
  
  //       const data = await response.json();
  //       setCartId(data.id);
  //       await AsyncStorage.setItem("cartId", data.id.toString());
  
  //     } catch (error) {
  //       console.error("Error fetching cart ID:", error);
  //     }
  //   };
  
  //   fetchCartId();
  // }, []);
  
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
  }, []); 
  

  const handleCheckoutPress = () => {
    try {
      const response = handleAddToCart(product!!.id, cartId!!);
      
      if (!!response) {
        router.push("/cart");
      } else {
        ToastHelper.showError('Lỗi thanh toán','Vui lòng nhập thử lại!')
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred during checkout.");
    }
  };

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

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.plant.img }} style={styles.productImage} />
        </View>

        <View style={styles.mainContent}>

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
            <TouchableOpacity onPress={toggleFavorite}>
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={20}
                color={isFavorite ? 'red' : '#666'}
              />
            </TouchableOpacity>
              <Text style={styles.stockQtyText}>| Đã bán: {product.stockQty}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mô tả</Text>
          {descriptionGroups&&descriptionGroups.map((group, index) => (
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
          color={star <= totalRate ? "#FFCE31" : "#CCCCCC"} // vàng nếu star <= rate, xám nếu không
        />
      ))}
    </View>

          {reviews && reviews.map((review, index) => (
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
                <Text style={styles.reviewText}>{review.comment || 'Không có bình luận'}</Text>
              </View>
            </View>
          ))}
        </View>       
        <ProductList
            products={similarProducts || []} 
            colors={colors} 
            translation={translation} 
            title={translation.relatedProducts || 'Related Products'}
            initialSize={5}
          />
          </View>
      </ScrollView>

      {/* Nút thêm vào giỏ hàng */}
      <View style={styles.bottomButton}>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleCheckoutPress}>
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
    fontWeight: 'bold',
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
  stockQtyText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  section: {
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
  bottomButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
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
  scrollContainer: {
    flex: 1,
    marginBottom: 60, 
  },
  mainContent: {
    paddingHorizontal: 16
  },
});

export default ProductDetailsScreen;