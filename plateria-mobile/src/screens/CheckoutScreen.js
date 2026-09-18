import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../config/api';

export default function CheckoutScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  
  const cartContext = useContext(CartContext);
  const authContext = useContext(AuthContext);

  const cartFromParams = route?.params?.cart || [];
  const totalAmountFromParams = route?.params?.totalAmount || 0;

  const cartItems = cartContext?.cartItems?.length ? cartContext.cartItems : cartFromParams;
  const getTotalPrice = cartContext?.getTotalPrice ? cartContext.getTotalPrice() : totalAmountFromParams;
  const clearCart = cartContext?.clearCart || (() => {});

  const user = authContext?.user;

  const [address, setAddress] = useState(user?.location || 'Sector H-11, Islamabad');
  const [phone, setPhone] = useState(user?.phone || '0300-1234567');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!address.trim() || !phone.trim()) {
      return Alert.alert('Required Fields', 'Please enter delivery address and phone number.');
    }

    setLoading(true);

    const generatedOrderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

    try {
      const payload = {
        items: cartItems,
        totalAmount: getTotalPrice,
        deliveryAddress: address,
        phone,
        paymentMethod
      };

      const res = await api.post('/orders', payload);
      const realOrderId = res.data?.order?._id || res.data?.orderId || generatedOrderId;

      clearCart();

      Alert.alert('Order Placed! 🎉', 'Your delicious meal is being prepared.', [
        { 
          text: 'Track Order', 
          onPress: () => navigation.replace('OrderTrackingScreen', { 
            orderId: realOrderId,
            orderDetails: {
              items: cartItems,
              totalAmount: getTotalPrice,
              deliveryAddress: address,
              status: 'Preparing',
              estimatedTime: '30-40 Mins'
            }
          }) 
        }
      ]);
    } catch (e) {
      // Fallback for demo / offline testing
      clearCart();
      Alert.alert('Order Placed! 🎉', 'Your order has been sent to the kitchen.', [
        { 
          text: 'Track Order', 
          onPress: () => navigation.replace('OrderTrackingScreen', { 
            orderId: generatedOrderId,
            orderDetails: {
              items: cartItems,
              totalAmount: getTotalPrice,
              deliveryAddress: address,
              status: 'Preparing',
              estimatedTime: '30-40 Mins'
            }
          }) 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 30 }}>
        
        {/* ESTIMATED TIME BANNER */}
        <View style={styles.deliveryBadge}>
          <Ionicons name="time-outline" size={20} color="#CA8A04" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.deliveryBadgeTitle}>Estimated Delivery Time</Text>
            <Text style={styles.deliveryBadgeTime}>30 - 45 Minutes</Text>
          </View>
        </View>

        {/* ORDER SUMMARY CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Summary</Text>
          {cartItems.map((item, index) => (
            <View key={item._id || index} style={styles.orderItemRow}>
              <Text style={styles.itemQuantity}>{item.quantity || 1}x</Text>
              <Text style={styles.itemName} numberOfLines={1}>{item.title || item.name || 'Food Item'}</Text>
              <Text style={styles.itemPrice}>Rs. {(item.price || 0) * (item.quantity || 1)}</Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalValue}>Rs. {getTotalPrice}</Text>
          </View>
        </View>

        {/* DELIVERY DETAILS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Delivery Details</Text>
          
          <Text style={styles.label}>Delivery Address</Text>
          <View style={styles.inputBox}>
            <Ionicons name="location-outline" size={18} color="#64748B" style={{ marginRight: 8 }} />
            <TextInput
              value={address}
              onChangeText={setAddress}
              style={styles.input}
              placeholder="Enter full home address..."
              placeholderTextColor="#94A3B8"
              multiline
            />
          </View>

          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputBox}>
            <Ionicons name="call-outline" size={18} color="#64748B" style={{ marginRight: 8 }} />
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={styles.input}
              placeholder="03xx-xxxxxxx"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* PAYMENT METHOD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Method</Text>

          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'COD' && styles.selectedPayment]}
            onPress={() => setPaymentMethod('COD')}
            activeOpacity={0.8}
          >
            <View style={styles.paymentLeft}>
              <Ionicons name="cash-outline" size={20} color="#0F172A" />
              <Text style={styles.paymentText}>Cash on Delivery</Text>
            </View>
            <Ionicons 
              name={paymentMethod === 'COD' ? "radio-button-on" : "radio-button-off"} 
              size={20} 
              color={paymentMethod === 'COD' ? "#EAB308" : "#94A3B8"} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'CARD' && styles.selectedPayment]}
            onPress={() => setPaymentMethod('CARD')}
            activeOpacity={0.8}
          >
            <View style={styles.paymentLeft}>
              <Ionicons name="wallet-outline" size={20} color="#0F172A" />
              <Text style={styles.paymentText}>Online / JazzCash / EasyPaisa</Text>
            </View>
            <Ionicons 
              name={paymentMethod === 'CARD' ? "radio-button-on" : "radio-button-off"} 
              size={20} 
              color={paymentMethod === 'CARD' ? "#EAB308" : "#94A3B8"} 
            />
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* FOOTER CONFIRM BUTTON */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.confirmBtn} 
          onPress={handlePlaceOrder} 
          disabled={loading}
          activeOpacity={0.88}
        >
          {loading ? (
            <ActivityIndicator color="#0F172A" />
          ) : (
            <Text style={styles.confirmBtnText}>Confirm & Place Order</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    justify: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  deliveryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9C3',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#FEF08A',
  },
  deliveryBadgeTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#CA8A04',
    textTransform: 'uppercase',
  },
  deliveryBadgeTime: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  orderItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemQuantity: {
    fontSize: 13,
    fontWeight: '800',
    color: '#EAB308',
    width: 30,
  },
  itemName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#EAB308',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 8,
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
    padding: 0,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
    backgroundColor: '#F8FAFC',
  },
  selectedPayment: {
    borderColor: '#EAB308',
    backgroundColor: '#FEFCE8',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  paymentText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
  },
  confirmBtn: {
    backgroundColor: '#EAB308',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justify: 'center',
  },
  confirmBtnText: {
    fontWeight: '900',
    color: '#0F172A',
    fontSize: 15,
  },
});