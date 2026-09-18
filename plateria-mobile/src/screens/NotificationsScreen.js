import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Realistic Vendor Dummy Notifications Data
const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'order',
    category: 'Orders',
    title: 'New Order Received! 🍔',
    body: 'Muhammad Ali placed a new order ORD-8921 for 2x Chicken Biryani & 1x Raita (PKR 950).',
    time: '2 mins ago',
    isRead: false,
    icon: 'bag-handle',
    iconBg: '#FEF3C7',
    iconColor: '#B45309',
  },
  {
    id: 'notif-2',
    type: 'status',
    category: 'Orders',
    title: 'Order Status Updated 🛵',
    body: 'Order ORD-8920 (Amina Sheikh) has been picked up by the delivery rider.',
    time: '15 mins ago',
    isRead: false,
    icon: 'checkmark-circle',
    iconBg: '#D1FAE5',
    iconColor: '#047857',
  },
  {
    id: 'notif-3',
    type: 'payment',
    category: 'System',
    title: 'Payout Deposited 💰',
    body: 'Weekly payout of PKR 42,500 has been transferred to your connected bank account.',
    time: '2 hours ago',
    isRead: true,
    icon: 'wallet',
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
  },
  {
    id: 'notif-4',
    type: 'review',
    category: 'Orders',
    title: 'New 5-Star Rating ⭐',
    body: 'Usman Ghani left a 5-star review: "Desi Ghee Mutton Karahi was extremely delicious!"',
    time: '5 hours ago',
    isRead: true,
    icon: 'star',
    iconBg: '#FEF9C3',
    iconColor: '#CA8A04',
  },
  {
    id: 'notif-5',
    type: 'system',
    category: 'System',
    title: 'Peak Hour Demand Alert 📈',
    body: 'High demand detected in your area! Keep kitchen status active to maximize sales.',
    time: '1 day ago',
    isRead: true,
    icon: 'trending-up',
    iconBg: '#FEF3C7',
    iconColor: '#B45309',
  },
];

export default function NotificationsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  // Unread Count
  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  // Filter List based on Category
  const filteredNotifications = useMemo(() => {
    if (activeTab === 'All') return notifications;
    return notifications.filter(n => n.category === activeTab);
  }, [notifications, activeTab]);

  // Actions
  const handleMarkAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(item => (item.id === id ? { ...item, isRead: true } : item))
    );
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setNotifications(prev => prev.map(item => ({ ...item, isRead: true })));
    Alert.alert('Success', 'All notifications marked as read.');
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1200);
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, !item.isRead && styles.unreadCard]}
      activeOpacity={0.88}
      onPress={() => handleMarkAsRead(item.id)}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
        <Ionicons name={item.icon} size={20} color={item.iconColor} />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.cardHeader}>
          <Text style={[styles.title, !item.isRead && styles.unreadTitle]}>{item.title}</Text>
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.body}>{item.body}</Text>
        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={13} color="#A16207" />
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Modern Yellow Gradient Hero Header */}
      <LinearGradient
        colors={['#FACC15', '#EAB308', '#CA8A04']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: (insets?.top || 20) + 12 }]}
      >
        <View style={styles.headerTopRow}>
          <View style={styles.headerLeft}>
            {navigation?.canGoBack?.() && (
              <TouchableOpacity 
                style={styles.backBtn} 
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={20} color="#713F12" />
              </TouchableOpacity>
            )}
            <View>
              <View style={styles.titleRow}>
                <Text style={styles.headerTitle}>Notifications</Text>
                {unreadCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadCount} NEW</Text>
                  </View>
                )}
              </View>
              <Text style={styles.headerSubtitle}>Real-time updates for your kitchen</Text>
            </View>
          </View>

          {unreadCount > 0 && (
            <TouchableOpacity onPress={handleMarkAllRead} activeOpacity={0.85}>
              <View style={styles.markAllPill}>
                <Ionicons name="checkmark-done" size={14} color="#713F12" />
                <Text style={styles.markAllText}>Clear All</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Main Content Sheet */}
      <View style={styles.mainSheetContainer}>
        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          {['All', 'Orders', 'System'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabBtn, activeTab === tab && styles.activeTabBtn]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notifications List */}
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingHorizontal: 18,
            paddingBottom: (insets?.bottom || 20) + 30,
            paddingTop: 6,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#EAB308" />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="notifications-off-outline" size={36} color="#CA8A04" />
              </View>
              <Text style={styles.emptyTitle}>All Caught Up!</Text>
              <Text style={styles.emptySub}>No notifications available in this section right now.</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAB308',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#713F12',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#854D0E',
    marginTop: 2,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: '#713F12',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    color: '#FACC15',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  markAllPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  markAllText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#713F12',
  },
  mainSheetContainer: {
    flex: 1,
    backgroundColor: '#FEFCE8',
    marginTop: -16,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    elevation: 12,
    shadowColor: '#854D0E',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    gap: 8,
  },
  tabBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 24,
    backgroundColor: '#FEF08A',
    borderWidth: 1,
    borderColor: '#FDE047',
  },
  activeTabBtn: {
    backgroundColor: '#EAB308',
    borderColor: '#CA8A04',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#854D0E',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#FEF08A',
    elevation: 2,
    shadowColor: '#CA8A04',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  unreadCard: {
    borderColor: '#FDE047',
    backgroundColor: '#FFFBEB',
    borderWidth: 1.5,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  contentContainer: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: '#451A03',
    flex: 1,
  },
  unreadTitle: {
    color: '#713F12',
    fontWeight: '900',
  },
  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#EAB308',
  },
  body: {
    fontSize: 12,
    color: '#78350F',
    marginTop: 4,
    lineHeight: 18,
    fontWeight: '500',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  timeText: {
    fontSize: 11,
    color: '#A16207',
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF08A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#713F12',
  },
  emptySub: {
    fontSize: 12,
    color: '#854D0E',
    marginTop: 4,
  },
});