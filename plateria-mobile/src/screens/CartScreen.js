import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function CartScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();

  const initialCart = route?.params?.cart?.length
    ? route.params.cart
    : [
        {
          _id: 'f1',
          title: 'Special Chicken Biryani',
          price: 450,
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
          kitchenName: "Mom's Spice Craft",
        },
        {
          _id: 'f2',
          title: 'Homemade Beef Haleem',
          price: 380,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
          kitchenName: 'Lahore Desi Dera',
        },
      ];

  const [cartItems, setCartItems] = useState(initialCart);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item._id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleClearCart = () => {
    Alert.alert('Clear Cart', 'Are you sure you want to remove all items?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: () => setCartItems([]) },
    ]);
  };

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'PLATERIA10') {
      setDiscount(100);
      Alert.alert('Success', 'Rs. 100 Promo discount applied!');
    } else {
      Alert.alert('Invalid Promo', 'Try using code "PLATERIA10"');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cartItems.length > 0 ? 120 : 0;
  const totalAmount = Math.max(0, subtotal + deliveryFee - discount);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>My Food Cart</Text>
          <Text style={styles.headerSubTitle}>{cartItems.length} items selected</Text>
        </View>
        {cartItems.length > 0 ? (
          <TouchableOpacity style={styles.clearBtn} onPress={handleClearCart} activeOpacity={0.7}>
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 38 }} />
        )}
      </View>

      {/* CART ITEMS LIST */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="bag-handle-outline" size={54} color="#EAB308" />
            </View>
            <Text style={styles.emptyTitle}>Your Cart is Empty!</Text>
            <Text style={styles.emptySubtitle}>
              Looks like you haven't added any fresh home-cooked meals yet.
            </Text>
            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={() => navigation.navigate('MainTabs')}
              activeOpacity={0.85}
            >
              <Text style={styles.exploreBtnTxt}>Explore Delicacies</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Image
              source={{ uri: item.image || 'https://via.placeholder.com/80' }}
              style={styles.itemImg}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
              {item.kitchenName && (
                <Text style={styles.kitchenTxt} numberOfLines={1}>
                  🏠 {item.kitchenName}
                </Text>
              )}
              <Text style={styles.itemPrice}>Rs. {item.price}</Text>
            </View>

            {/* QUANTITY CONTROLS */}
            <View style={styles.qtyContainer}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQuantity(item._id, -1)}
                activeOpacity={0.7}
              >
                <Ionicons name={item.quantity === 1 ? 'trash-outline' : 'remove'} size={14} color={item.quantity === 1 ? '#EF4444' : '#0F172A'} />
              </TouchableOpacity>
              <Text style={styles.qtyTxt}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQuantity(item._id, 1)}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={14} color="#0F172A" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* FOOTER & CHECKOUT SUMMARY */}
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          {/* PROMO BOX */}
          <View style={styles.promoContainer}>
            <Ionicons name="pricetag-outline" size={18} color="#CA8A04" />
            <TextInput
              style={styles.promoInput}
              placeholder="Promo Code (PLATERIA10)"
              placeholderTextColor="#94A3B8"
              value={promoCode}
              onChangeText={setPromoCode}
            />
            <TouchableOpacity style={styles.applyBtn} onPress={applyPromo} activeOpacity={0.8}>
              <Text style={styles.applyBtnTxt}>Apply</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLbl}>Subtotal</Text>
              <Text style={styles.summaryVal}>Rs. {subtotal}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLbl}>Delivery Charge</Text>
              <Text style={styles.summaryVal}>Rs. {deliveryFee}</Text>
            </View>

            {discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLbl, { color: '#16A34A' }]}>Discount</Text>
                <Text style={[styles.summaryVal, { color: '#16A34A' }]}>- Rs. {discount}</Text>
              </View>
            )}

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalLbl}>Total Payment</Text>
              <Text style={styles.totalVal}>Rs. {totalAmount}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={() =>
              navigation.navigate('CheckoutScreen', {
                cart: cartItems,
                subtotal,
                deliveryFee,
                discount,
                totalAmount,
              })
            }
            activeOpacity={0.88}
          >
            <Text style={styles.checkoutTxt}>Proceed to Checkout</Text>
            <Ionicons name="arrow-forward" size={18} color="#0F172A" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    justify: 'center',
    alignItems: 'center',
  },
  clearBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEF2F2',
    justify: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubTitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  itemImg: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  kitchenTxt: {
    fontSize: 11,
    color: '#CA8A04',
    fontWeight: '700',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 6,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 4,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justify: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  qtyTxt: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptyBox: {
    paddingVertical: 60,
    alignItems: 'center',
    justify: 'center',
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FEF9C3',
    justify: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  exploreBtn: {
    marginTop: 20,
    backgroundColor: '#EAB308',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  exploreBtnTxt: {
    fontWeight: '800',
    color: '#0F172A',
    fontSize: 14,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 4,
  },
  promoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  promoInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  applyBtn: {
    backgroundColor: '#EAB308',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  applyBtnTxt: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  summaryBox: {
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryRow: {
    flexDirection: 'row',
    justify: 'space-between',
    marginBottom: 6,
  },
  summaryLbl: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  totalLbl: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#CA8A04',
  },
  checkoutBtn: {
    backgroundColor: '#EAB308',
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'center',
    gap: 8,
  },
  checkoutTxt: {
    fontWeight: '900',
    color: '#0F172A',
    fontSize: 15,
  },
});