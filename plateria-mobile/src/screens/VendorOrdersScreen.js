import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
  StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const API_BASE_URL = 'https://your-backend-api.com/api/vendor';

// Dynamic status style mapping
const STATUS_CONFIG = {
  New: { bg: '#FEF3C7', text: '#92400E', label: 'New Order', icon: 'sparkles-outline' },
  Accept: { bg: '#E0E7FF', text: '#3730A3', label: 'Accepted', icon: 'checkmark-circle-outline' },
  Preparing: { bg: '#FEF08A', text: '#854D0E', label: 'Preparing', icon: 'restaurant-outline' },
  Ready: { bg: '#D1FAE5', text: '#065F46', label: 'Ready for Pickup', icon: 'gift-outline' },
  'Out for Delivery': { bg: '#DBEAFE', text: '#1E40AF', label: 'On The Way', icon: 'bicycle-outline' },
  Delivered: { bg: '#D1FAE5', text: '#047857', label: 'Delivered', icon: 'checkmark-done-circle-outline' },
  Cancelled: { bg: '#FEE2E2', text: '#991B1B', label: 'Cancelled', icon: 'close-circle-outline' },
};

// Default fallback orders (Dashboard aligned)
const FALLBACK_ORDERS = [
  {
    _id: '8921a',
    customerName: 'Muhammad Ali',
    phone: '+92 300 1234567',
    deliveryAddress: 'House #42, Street 11, F-8/2, Islamabad',
    products: [
      { title: 'Chicken Biryani', qty: 2, price: 400 },
      { title: 'Raita & Salad', qty: 1, price: 150 }
    ],
    totalAmount: 950,
    status: 'Preparing',
    notes: 'Extra spicy, please send extra napkins.'
  },
  {
    _id: '8920b',
    customerName: 'Amina Sheikh',
    phone: '+92 321 9876543',
    deliveryAddress: 'Plaza 14, Commercial Market, Rawalpindi',
    products: [
      { title: 'Zinger Burger Combo', qty: 1, price: 480 },
      { title: 'Large Fries', qty: 1, price: 100 }
    ],
    totalAmount: 580,
    status: 'Ready',
    notes: 'Call on arrival.'
  },
  {
    _id: '8919c',
    customerName: 'Usman Ghani',
    phone: '+92 333 5554433',
    deliveryAddress: 'Apartment 402, G-11/3, Islamabad',
    products: [
      { title: 'Desi Ghee Mutton Karahi', qty: 1, price: 1250 }
    ],
    totalAmount: 1250,
    status: 'Delivered',
    notes: ''
  },
  {
    _id: '8918d',
    customerName: 'Zainab Bibi',
    phone: '+92 312 4441122',
    deliveryAddress: 'Sector I-8/4, Islamabad',
    products: [
      { title: 'Special Chicken Handi', qty: 1, price: 1100 },
      { title: 'Roti', qty: 4, price: 20 }
    ],
    totalAmount: 1180,
    status: 'New',
    notes: 'Less oil please.'
  }
];

export default function VendorOrdersScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const initialData = route?.params?.orders || FALLBACK_ORDERS;
  
  const [orders, setOrders] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for Reject Reason
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/orders`);
      if (res.data && res.data.success && res.data.orders?.length > 0) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.log('Backend sync offline, serving local dashboard state.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus, reason = '') => {
    // Optimistic UI Update
    const updated = orders.map(o => (o._id === orderId ? { ...o, status: newStatus } : o));
    setOrders(updated);

    if (route?.params?.onUpdateOrders) {
      route.params.onUpdateOrders(updated);
    }

    try {
      await axios.patch(`${API_BASE_URL}/orders/${orderId}/status`, {
        status: newStatus,
        rejectReason: reason,
      });
      Alert.alert("Status Updated", `Order updated to: ${newStatus}`);
    } catch (err) {
      // Retain optimistic state while alerting
      Alert.alert("Local Update", `Order status set to ${newStatus}`);
    }
  };

  const handleOpenRejectModal = (orderId) => {
    setSelectedOrderId(orderId);
    setRejectReason('');
    setRejectModalVisible(true);
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      Alert.alert("Reason Required", "Please state a brief reason for rejection.");
      return;
    }
    updateOrderStatus(selectedOrderId, 'Cancelled', rejectReason);
    setRejectModalVisible(false);
  };

  // Dynamic Tabs & Filter Calculations
  const counts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter(o => ['New', 'Accept', 'Preparing'].includes(o.status)).length,
      ready: orders.filter(o => ['Ready', 'Out for Delivery'].includes(o.status)).length,
      history: orders.filter(o => ['Delivered', 'Cancelled'].includes(o.status)).length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesTab =
        activeTab === 'All' ? true :
        activeTab === 'Pending' ? ['New', 'Accept', 'Preparing'].includes(o.status) :
        activeTab === 'Ready' ? ['Ready', 'Out for Delivery'].includes(o.status) :
        ['Delivered', 'Cancelled'].includes(o.status);

      const matchesSearch =
        o._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, searchQuery]);

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'CU';
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#EAB308" />
        <Text style={styles.loadingText}>Fetching Live Orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header Bar */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Order Management</Text>
          <Text style={styles.headerSub}>{orders.length} Orders Active</Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
          <Ionicons name="refresh" size={18} color="#854D0E" />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Order ID or Name..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Modern Filter Chips */}
      <View style={styles.tabBar}>
        {[
          { key: 'All', label: 'All', count: counts.all },
          { key: 'Pending', label: 'Pending', count: counts.pending },
          { key: 'Ready', label: 'Ready', count: counts.ready },
          { key: 'History', label: 'History', count: counts.history },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabItem, isActive && styles.tabItemActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
              <View style={[styles.badgeCount, isActive && styles.badgeCountActive]}>
                <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>
                  {tab.count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Order List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 30,
          paddingTop: 12
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#EAB308']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="receipt-outline" size={38} color="#CA8A04" />
            </View>
            <Text style={styles.emptyTitle}>No Orders Found</Text>
            <Text style={styles.emptySubText}>
              {searchQuery ? 'No matching result for your search.' : `No orders in "${activeTab}" category.`}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const statusStyle = STATUS_CONFIG[item.status] || STATUS_CONFIG.New;

          return (
            <View style={styles.card}>
              {/* Card Header Row */}
              <View style={styles.cardHeader}>
                <View style={styles.profileGroup}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>{getInitials(item.customerName)}</Text>
                  </View>
                  <View>
                    <Text style={styles.customerName}>{item.customerName}</Text>
                    <Text style={styles.orderId}>#ORD-{item._id?.slice(-5).toUpperCase()}</Text>
                  </View>
                </View>

                <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                  <Ionicons name={statusStyle.icon} size={13} color={statusStyle.text} />
                  <Text style={[styles.statusBadgeText, { color: statusStyle.text }]}>
                    {statusStyle.label}
                  </Text>
                </View>
              </View>

              {/* Delivery Details */}
              {item.deliveryAddress && (
                <View style={styles.detailsRow}>
                  <Ionicons name="location-outline" size={15} color="#6B7280" />
                  <Text style={styles.addressText} numberOfLines={2}>
                    {item.deliveryAddress}
                  </Text>
                </View>
              )}

              {item.notes ? (
                <View style={styles.notesRow}>
                  <Ionicons name="chatbox-ellipses-outline" size={14} color="#D97706" />
                  <Text style={styles.notesText}>{item.notes}</Text>
                </View>
              ) : null}

              <View style={styles.divider} />

              {/* Product Breakdown */}
              <View style={styles.productsContainer}>
                {item.products?.map((p, idx) => (
                  <View key={idx} style={styles.productRow}>
                    <Text style={styles.pText}>
                      <Text style={styles.pQty}>{p.qty}x </Text>
                      {p.title}
                    </Text>
                    <Text style={styles.pPrice}>Rs. {p.price * p.qty}</Text>
                  </View>
                ))}
              </View>

              {/* Total Row */}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Payable</Text>
                <Text style={styles.totalVal}>Rs. {item.totalAmount}</Text>
              </View>

              {/* Action Buttons Workflow */}
              <View style={styles.actionGrid}>
                {item.status === 'New' && (
                  <>
                    <TouchableOpacity
                      style={[styles.btn, styles.btnAccept]}
                      onPress={() => updateOrderStatus(item._id, 'Accept')}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="checkmark-sharp" size={16} color="#713F12" />
                      <Text style={styles.btnTextDark}>Accept</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.btn, styles.btnReject]}
                      onPress={() => handleOpenRejectModal(item._id)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="close-sharp" size={16} color="#FFFFFF" />
                      <Text style={styles.btnTextLight}>Reject</Text>
                    </TouchableOpacity>
                  </>
                )}

                {item.status === 'Accept' && (
                  <TouchableOpacity
                    style={styles.btnFull}
                    onPress={() => updateOrderStatus(item._id, 'Preparing')}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="restaurant" size={16} color="#713F12" />
                    <Text style={styles.btnTextDark}>Start Preparing</Text>
                  </TouchableOpacity>
                )}

                {item.status === 'Preparing' && (
                  <TouchableOpacity
                    style={styles.btnFull}
                    onPress={() => updateOrderStatus(item._id, 'Ready')}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="gift-outline" size={16} color="#713F12" />
                    <Text style={styles.btnTextDark}>Mark Ready for Pickup</Text>
                  </TouchableOpacity>
                )}

                {item.status === 'Ready' && (
                  <TouchableOpacity
                    style={styles.btnFull}
                    onPress={() => updateOrderStatus(item._id, 'Out for Delivery')}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="bicycle-outline" size={16} color="#713F12" />
                    <Text style={styles.btnTextDark}>Dispatch (Out for Delivery)</Text>
                  </TouchableOpacity>
                )}

                {item.status === 'Out for Delivery' && (
                  <TouchableOpacity
                    style={[styles.btnFull, { backgroundColor: '#10B981' }]}
                    onPress={() => updateOrderStatus(item._id, 'Delivered')}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="checkmark-done" size={16} color="#FFFFFF" />
                    <Text style={styles.btnTextLight}>Mark as Delivered</Text>
                  </TouchableOpacity>
                )}

                {['Delivered', 'Cancelled'].includes(item.status) && (
                  <View style={styles.completedBanner}>
                    <Ionicons
                      name={item.status === 'Delivered' ? 'checkmark-circle' : 'close-circle'}
                      size={16}
                      color={item.status === 'Delivered' ? '#059669' : '#DC2626'}
                    />
                    <Text style={[
                      styles.completedText,
                      { color: item.status === 'Delivered' ? '#059669' : '#DC2626' }
                    ]}>
                      Order {item.status}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        }}
      />

      {/* Reject Reason Dialog Modal */}
      <Modal visible={rejectModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <Ionicons name="alert-circle" size={24} color="#EF4444" />
              <Text style={styles.modalTitle}>Reject Order</Text>
            </View>
            <Text style={styles.modalSub}>Please enter the reason for rejecting this order:</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Items out of stock, kitchen busy..."
              placeholderTextColor="#9CA3AF"
              value={rejectReason}
              onChangeText={setRejectReason}
              multiline
            />

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setRejectModalVisible(false)}
              >
                <Text style={{ fontWeight: '700', color: '#4B5563' }}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnConfirm]}
                onPress={handleConfirmReject}
              >
                <Text style={{ fontWeight: '800', color: '#FFFFFF' }}>Confirm Rejection</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  headerSub: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 1,
  },
  refreshBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEF9C3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchWrapper: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#111827',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    gap: 4,
  },
  tabItemActive: {
    backgroundColor: '#FACC15',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
  },
  tabTextActive: {
    color: '#713F12',
  },
  badgeCount: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  badgeCountActive: {
    backgroundColor: '#FEF08A',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6B7280',
  },
  badgeTextActive: {
    color: '#854D0E',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FDE047',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  customerName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  orderId: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
  },
  statusBadgeText: {
    fontWeight: '800',
    fontSize: 11,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  addressText: {
    fontSize: 12,
    color: '#4B5563',
    flex: 1,
  },
  notesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    backgroundColor: '#FFFBEB',
    padding: 8,
    borderRadius: 8,
  },
  notesText: {
    fontSize: 12,
    color: '#92400E',
    fontStyle: 'italic',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  productsContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 10,
    gap: 4,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pQty: {
    fontWeight: '800',
    color: '#D97706',
  },
  pText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  pPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#374151',
  },
  totalVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  btnFull: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FACC15',
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  btnAccept: {
    backgroundColor: '#FACC15',
  },
  btnReject: {
    backgroundColor: '#EF4444',
  },
  btnTextDark: {
    fontWeight: '800',
    color: '#713F12',
    fontSize: 12,
  },
  btnTextLight: {
    fontWeight: '800',
    color: '#FFFFFF',
    fontSize: 12,
  },
  completedBanner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    gap: 6,
  },
  completedText: {
    fontSize: 12,
    fontWeight: '800',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF9C3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  emptySubText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    elevation: 6,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#111827',
  },
  modalSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6,
    marginBottom: 14,
  },
  modalInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#111827',
    height: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modalBtnCancel: {
    backgroundColor: '#E5E7EB',
  },
  modalBtnConfirm: {
    backgroundColor: '#EF4444',
  },
});