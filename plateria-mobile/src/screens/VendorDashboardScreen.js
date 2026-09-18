import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

// Safe Asset Loader
let APP_LOGO;
try {
  APP_LOGO = require('../../assets/logo.png');
} catch (e) {
  APP_LOGO = null;
}

// Initial Mock Orders
const INITIAL_ORDERS = [
  {
    id: 'ORD-8921',
    customerName: 'Muhammad Ali',
    items: '2x Chicken Biryani, 1x Raita',
    totalAmount: '950',
    status: 'Preparing',
    time: '5 mins ago',
    paymentMethod: 'Cash on Delivery'
  },
  {
    id: 'ORD-8920',
    customerName: 'Amina Sheikh',
    items: '1x Zinger Burger Combo, 1x Fries',
    totalAmount: '580',
    status: 'Ready for Pickup',
    time: '12 mins ago',
    paymentMethod: 'Paid Online'
  },
  {
    id: 'ORD-8919',
    customerName: 'Usman Ghani',
    items: '1x Desi Ghee Mutton Karahi',
    totalAmount: '1250',
    status: 'Delivered',
    time: '28 mins ago',
    paymentMethod: 'Paid Online'
  }
];

// Sub-Component: Metric Card
const StatCard = React.memo(({ icon, iconBg, iconColor, changeText, changeColor, value, title, onPress }) => (
  <TouchableOpacity style={styles.statCard} activeOpacity={0.85} onPress={onPress}>
    <View style={styles.statTopRow}>
      <View style={[styles.statIconBox, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <Text style={[styles.statChangeText, changeColor ? { color: changeColor } : null]}>{changeText}</Text>
    </View>
    <Text style={styles.statValueText}>{value}</Text>
    <Text style={styles.statTitleText}>{title}</Text>
  </TouchableOpacity>
));

// Sub-Component: Quick Action Button
const QuickAction = React.memo(({ icon, title, colors, iconColor, onPress }) => (
  <TouchableOpacity style={styles.actionCard} activeOpacity={0.85} onPress={onPress}>
    <LinearGradient colors={colors} style={styles.actionGradient}>
      <Ionicons name={icon} size={20} color={iconColor} />
      <Text style={styles.actionCardText}>{title}</Text>
    </LinearGradient>
  </TouchableOpacity>
));

// Sub-Component: Order Card
const OrderCard = React.memo(({ order, onUpdateStatus }) => {
  const isPreparing = order.status === 'Preparing';
  const isReady = order.status === 'Ready for Pickup';

  const badgeBg = isPreparing ? '#FEF3C7' : isReady ? '#D1FAE5' : '#F3F4F6';
  const badgeTextColor = isPreparing ? '#854D0E' : isReady ? '#065F46' : '#4B5563';

  return (
    <View style={[styles.orderCard, isPreparing && styles.unreadOrderCard]}>
      <View style={styles.orderHeaderRow}>
        <View>
          <Text style={styles.orderIdText}>{order.id}</Text>
          <Text style={styles.customerNameText}>{order.customerName}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: badgeBg }]}>
          <Text style={[styles.statusBadgeText, { color: badgeTextColor }]}>
            {order.status}
          </Text>
        </View>
      </View>

      <View style={styles.orderDivider} />
      <Text style={styles.orderItemsText}>{order.items}</Text>

      <View style={styles.orderFooterRow}>
        <View>
          <Text style={styles.orderPriceText}>PKR {order.totalAmount}</Text>
          <Text style={styles.paymentMethodText}>{order.paymentMethod} • {order.time}</Text>
        </View>

        {isPreparing && (
          <TouchableOpacity 
            style={styles.actionBtnPrimary} 
            activeOpacity={0.8}
            onPress={() => onUpdateStatus(order.id, 'Ready for Pickup')}
          >
            <Text style={styles.actionBtnPrimaryText}>Mark Ready</Text>
          </TouchableOpacity>
        )}

        {isReady && (
          <TouchableOpacity 
            style={[styles.actionBtnPrimary, { backgroundColor: '#059669' }]} 
            activeOpacity={0.8}
            onPress={() => onUpdateStatus(order.id, 'Delivered')}
          >
            <Text style={[styles.actionBtnPrimaryText, { color: '#FFFFFF' }]}>Complete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
});

export default function VendorDashboardScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('All');
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  // Status Handler
  const handleUpdateStatus = useCallback((orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    Alert.alert('Order Updated', `Order ${orderId} marked as ${newStatus}`);
  }, []);

  // Filtered List Optimization
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      if (activeTab === 'Preparing') return order.status === 'Preparing';
      if (activeTab === 'Ready') return order.status === 'Ready for Pickup';
      return true;
    });
  }, [orders, activeTab]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Hero Section */}
      <LinearGradient
        colors={['#FACC15', '#EAB308', '#CA8A04']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.topHeroGradient, { paddingTop: (insets?.top || 20) + 12 }]}
      >
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            {APP_LOGO ? (
              <Image source={APP_LOGO} style={styles.appLogoStyle} resizeMode="cover" />
            ) : (
              <Ionicons name="restaurant" size={30} color="#713F12" />
            )}
          </View>
          <Text style={styles.greetingText}>WELCOME BACK 👋</Text>
          <Text style={styles.kitchenTitleText}>Royal Spice Craft</Text>
        </View>
      </LinearGradient>

      {/* Main Sheet Container */}
      <View style={styles.mainSheetContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: (insets?.bottom || 20) + 40, paddingTop: 12 }}
        >
          <View style={styles.sheetHandle} />

          {/* Business Overview */}
          <Text style={styles.sectionHeaderTitle}>BUSINESS OVERVIEW</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="wallet"
              iconBg="#FEF3C7"
              iconColor="#B45309"
              changeText="+14%"
              value="PKR 18,450"
              title="Today's Revenue"
              onPress={() => Alert.alert('Revenue', 'Today Total: PKR 18,450')}
            />
            <StatCard
              icon="time"
              iconBg="#D1FAE5"
              iconColor="#047857"
              changeText="4 Cooking"
              changeColor="#047857"
              value="8 Pending"
              title="Active Orders"
              onPress={() => setActiveTab('Preparing')}
            />
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionHeaderTitle}>QUICK ACTIONS</Text>
          <View style={styles.quickActionsRow}>
            <QuickAction
              icon="book"
              title="Manage Menu"
              colors={['#FEF08A', '#FDE047']}
              iconColor="#713F12"
              onPress={() => navigation?.navigate?.('MenuManagement')}
            />
            <QuickAction
              icon="receipt"
              title="Live Orders"
              colors={['#A7F3D0', '#6EE7B7']}
              iconColor="#065F46"
              onPress={() => navigation?.navigate?.('OrdersList')}
            />
            <QuickAction
              icon="star"
              title="Reviews"
              colors={['#FEF3C7', '#FDE68A']}
              iconColor="#B45309"
              onPress={() => navigation?.navigate?.('Reviews')}
            />
          </View>

          {/* Incoming Orders Section */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionHeaderTitle}>LIVE INCOMING ORDERS</Text>
          </View>

          {/* Filter Tabs */}
          <View style={styles.filterTabContainer}>
            {['All', 'Preparing', 'Ready'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.filterTabBtn, activeTab === tab && styles.filterTabBtnActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.filterTabText, activeTab === tab && styles.filterTabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Orders Feed */}
          {filteredOrders.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="cube-outline" size={38} color="#CA8A04" />
              <Text style={styles.emptyText}>No orders available</Text>
            </View>
          ) : (
            filteredOrders.map(ord => (
              <OrderCard key={ord.id} order={ord} onUpdateStatus={handleUpdateStatus} />
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAB308',
  },
  topHeroGradient: {
    height: height * 0.26,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoBadge: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#854D0E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FEF08A',
  },
  appLogoStyle: {
    width: '100%',
    height: '100%',
  },
  greetingText: {
    fontSize: 10,
    color: '#713F12',
    fontWeight: '800',
    letterSpacing: 1,
  },
  kitchenTitleText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#422006',
    marginTop: 2,
  },
  mainSheetContainer: {
    flex: 1,
    backgroundColor: '#FEFCE8',
    marginTop: -20,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    elevation: 12,
    shadowColor: '#854D0E',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  sheetHandle: {
    width: 38,
    height: 4,
    backgroundColor: '#FEF08A',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sectionHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#854D0E',
    letterSpacing: 0.9,
    marginBottom: 10,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FEF08A',
    elevation: 2,
    shadowColor: '#CA8A04',
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },
  statTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statChangeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  statValueText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#422006',
  },
  statTitleText: {
    fontSize: 11,
    color: '#78350F',
    marginTop: 2,
    fontWeight: '600',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    gap: 10,
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#CA8A04',
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  actionGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 16,
  },
  actionCardText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#713F12',
  },
  filterTabContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
    marginTop: 4,
  },
  filterTabBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FEF08A',
    borderWidth: 1,
    borderColor: '#FDE047',
  },
  filterTabBtnActive: {
    backgroundColor: '#EAB308',
    borderColor: '#CA8A04',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#854D0E',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FEF08A',
    elevation: 2,
    shadowColor: '#CA8A04',
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },
  unreadOrderCard: {
    borderColor: '#FDE047',
    backgroundColor: '#FFFBEB',
    borderWidth: 1.5,
  },
  orderHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderIdText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  customerNameText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#422006',
    marginTop: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  orderDivider: {
    height: 1,
    backgroundColor: '#FEF08A',
    marginVertical: 10,
  },
  orderItemsText: {
    fontSize: 13,
    color: '#78350F',
    fontWeight: '500',
  },
  orderFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  orderPriceText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#422006',
  },
  paymentMethodText: {
    fontSize: 10,
    color: '#A16207',
    marginTop: 1,
    fontWeight: '600',
  },
  actionBtnPrimary: {
    backgroundColor: '#EAB308',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  actionBtnPrimaryText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  emptyText: {
    fontSize: 12,
    color: '#854D0E',
    fontWeight: '600',
  },
});