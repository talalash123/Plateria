import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Modal,
  FlatList,
  Dimensions,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// SHARED MOCK DATA FOR APP CONSISTENCY
export const INITIAL_KITCHENS = [
  {
    id: 'k1',
    name: "Mom's Spice Craft",
    owner: 'Chef Ayesha',
    rating: 4.8,
    reviewsCount: 320,
    followersCount: 1248,
    deliveryTime: '25-35 min',
    location: 'Sector H-11, Islamabad',
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    isSubscribed: true,
    tag: 'Top Rated',
  },
  {
    id: 'k2',
    name: 'Lahore Desi Dera',
    owner: 'Chef Usman',
    rating: 4.7,
    reviewsCount: 210,
    followersCount: 890,
    deliveryTime: '30-40 min',
    location: 'F-8 Markaz, Islamabad',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    isSubscribed: false,
    tag: 'Popular',
  },
  {
    id: 'k3',
    name: 'Savour Delights',
    owner: 'Chef Fatima',
    rating: 4.9,
    reviewsCount: 450,
    followersCount: 1980,
    deliveryTime: '20-30 min',
    location: 'G-11 Markaz, Islamabad',
    coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    isSubscribed: false,
    tag: 'Super Chef',
  }
];

export const FOOD_DATA = [
  {
    id: 'f1',
    title: 'Special Chicken Biryani',
    price: 'RS 450',
    rating: 4.9,
    prepTime: '25-30 min',
    category: 'Biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    kitchenId: 'k1',
    description: 'Authentic Basmati rice with home-ground spices, caramelized onions, and juicy chicken leg piece.',
    isVeg: false,
  },
  {
    id: 'f2',
    title: 'Homemade Beef Haleem',
    price: 'RS 380',
    rating: 4.7,
    prepTime: '30-40 min',
    category: 'Haleem',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    kitchenId: 'k2',
    description: 'Slow-cooked grains and tender beef garnished with ginger, mint, lemon, and fried onions.',
    isVeg: false,
  },
  {
    id: 'f3',
    title: 'Desi Ghee Palak Paneer',
    price: 'RS 320',
    rating: 4.6,
    prepTime: '20-25 min',
    category: 'Karahi',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    kitchenId: 'k1',
    description: 'Fresh spinach puree with cottage cheese cooked in pure organic desi ghee.',
    isVeg: true,
  },
  {
    id: 'f4',
    title: 'Smokey Chicken Karahi',
    price: 'RS 650',
    rating: 4.8,
    prepTime: '35-40 min',
    category: 'Karahi',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
    kitchenId: 'k3',
    description: 'Traditional wok-cooked chicken with fresh tomatoes, green chilies, and coal smoke flavor.',
    isVeg: false,
  }
];

export default function CustomerHomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [kitchens, setKitchens] = useState(INITIAL_KITCHENS);

  const [notifications, setNotifications] = useState([
    {
      id: 'cn1',
      title: 'Order Dispatched! 🚴',
      body: "Your order from Mom's Spice Craft is on its way. Rider will reach soon.",
      time: '5 mins ago',
      icon: 'bicycle',
      color: '#EAB308',
      read: false,
    },
    {
      id: 'cn2',
      title: 'Exclusive Offer 💥',
      body: 'Get flat 20% OFF on all deals from Lahore Desi Dera today!',
      time: '1 hour ago',
      icon: 'pricetag',
      color: '#22C55E',
      read: false,
    },
    {
      id: 'cn3',
      title: 'Order Confirmed! ✅',
      body: "Mom's Spice Craft has accepted your order #ORD-9921.",
      time: '3 hours ago',
      icon: 'checkmark-circle',
      color: '#3B82F6',
      read: true,
    },
  ]);

  const categories = ['All', 'Biryani', 'Karahi', 'Haleem', 'BBQ', 'Sweets'];

  const toggleSubscribe = (kitchenId) => {
    setKitchens((prevKitchens) =>
      prevKitchens.map((k) => {
        if (k.id === kitchenId) {
          const newSubStatus = !k.isSubscribed;
          
          if (newSubStatus) {
            setNotifications((prev) => [
              {
                id: `sub-${Date.now()}`,
                title: 'Kitchen Subscribed! 🎉',
                body: `You are now following ${k.name}. You will receive updates on their daily specials!`,
                time: 'Just now',
                icon: 'heart',
                color: '#EF4444',
                read: false,
              },
              ...prev,
            ]);
          }

          return {
            ...k,
            isSubscribed: newSubStatus,
            followersCount: newSubStatus ? k.followersCount + 1 : k.followersCount - 1,
          };
        }
        return k;
      })
    );
  };

  const subscribedKitchens = kitchens.filter((k) => k.isSubscribed);

  const filteredDishes = FOOD_DATA.filter((item) =>
    selectedCategory === 'All' ? true : item.category === selectedCategory
  );

  const hasUnread = notifications.some((item) => !item.read);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const getKitchenById = (id) => kitchens.find((k) => k.id === id) || kitchens[0];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* FIXED TOP HEADER - PROPERLY SPACED */}
      <View style={styles.header}>
        {/* Left Side: Deliver Location Info */}
        <View style={styles.locationWrapper}>
          <Text style={styles.deliverText}>DELIVER TO</Text>
          <TouchableOpacity style={styles.locationSelector} activeOpacity={0.7}>
            <Ionicons name="location-sharp" size={17} color="#EAB308" />
            <Text style={styles.locationText} numberOfLines={1}>Sector H-11, Islamabad</Text>
            <Ionicons name="chevron-down" size={14} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Right Side: Notification & Cart Icons aligned with wide gap */}
        <View style={styles.headerIconsGroup}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setIsNotificationVisible(true)}
            activeOpacity={0.75}
          >
            <Ionicons name="notifications-outline" size={21} color="#0F172A" />
            {hasUnread && <View style={styles.badgeDot} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('CartScreen')}
            activeOpacity={0.75}
          >
            <Ionicons name="cart-outline" size={21} color="#0F172A" />
            <View style={styles.cartCountBadge}>
              <Text style={styles.cartCountText}>2</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* SEARCH BAR */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('SearchScreen')}
          activeOpacity={0.9}
        >
          <Ionicons name="search-outline" size={20} color="#94A3B8" />
          <Text style={styles.searchPlaceholder}>Search dishes, chefs, or kitchens...</Text>
          <View style={styles.filterBtn}>
            <Ionicons name="options-outline" size={16} color="#0F172A" />
          </View>
        </TouchableOpacity>

        {/* HERO PROMO BANNER */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerTextContainer}>
            <View style={styles.badgePill}>
              <Ionicons name="sparkles" size={12} color="#EAB308" />
              <Text style={styles.bannerBadge}>Homecooked Special</Text>
            </View>
            <Text style={styles.bannerTitle}>30% OFF First Order</Text>
            <Text style={styles.bannerSubtitle}>Fresh, hygienic & authentic home meals prepared with love.</Text>
          </View>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80' }}
            style={styles.bannerImage}
          />
        </View>

        {/* CATEGORIES HORIZONTAL PILLS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
          {categories.map((cat, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.categoryChip, selectedCategory === cat && styles.activeCategoryChip]}
              onPress={() => setSelectedCategory(cat)}
              activeOpacity={0.8}
            >
              <Text style={[styles.categoryText, selectedCategory === cat && styles.activeCategoryText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* FEATURED KITCHENS SECTION */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Top Home Kitchens</Text>
            <Text style={styles.sectionSubTitle}>Follow your favorite passionate chefs</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('SubscribedKitchensScreen', { kitchens: subscribedKitchens })}
            activeOpacity={0.7}
          >
            <Text style={styles.seeAllText}>Subscribed ({subscribedKitchens.length}) →</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}>
          {kitchens.map((kitchen) => (
            <TouchableOpacity
              key={kitchen.id}
              style={styles.kitchenCard}
              onPress={() => navigation.navigate('KitchenProfileScreen', { kitchen })}
              activeOpacity={0.92}
            >
              <View style={{ position: 'relative' }}>
                <Image source={{ uri: kitchen.coverImage }} style={styles.kitchenCover} />
                <View style={styles.tagBadge}>
                  <Text style={styles.tagBadgeText}>{kitchen.tag}</Text>
                </View>
              </View>

              {/* Follow / Subscribe Action Pill */}
              <TouchableOpacity
                style={[styles.followBtn, kitchen.isSubscribed && styles.followingBtn]}
                onPress={() => toggleSubscribe(kitchen.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={kitchen.isSubscribed ? 'checkmark-circle' : 'add-circle'}
                  size={14}
                  color={kitchen.isSubscribed ? '#0F172A' : '#FFFFFF'}
                />
                <Text style={[styles.followBtnText, kitchen.isSubscribed && styles.followingBtnText]}>
                  {kitchen.isSubscribed ? 'Subscribed' : 'Follow'}
                </Text>
              </TouchableOpacity>

              <View style={styles.kitchenCardBody}>
                <Image source={{ uri: kitchen.avatar }} style={styles.kitchenAvatar} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.kitchenCardName} numberOfLines={1}>{kitchen.name}</Text>
                  <Text style={styles.kitchenOwner}>{kitchen.owner}</Text>
                </View>
              </View>

              <View style={styles.kitchenCardFooter}>
                <View style={styles.miniRating}>
                  <Ionicons name="star" size={13} color="#EAB308" />
                  <Text style={styles.miniRatingText}>{kitchen.rating}</Text>
                  <Text style={styles.reviewsText}>({kitchen.reviewsCount})</Text>
                </View>
                <Text style={styles.followersText}>{kitchen.followersCount} Followers</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* POPULAR DISHES */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Home Dishes</Text>
        </View>

        {filteredDishes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="fast-food-outline" size={48} color="#CBD5E1" />
            <Text style={styles.emptyText}>No dishes available in this category yet!</Text>
          </View>
        ) : (
          filteredDishes.map((item) => {
            const kitchen = getKitchenById(item.kitchenId);
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.foodCard}
                onPress={() => navigation.navigate('FoodDetailsScreen', { food: item, kitchen })}
                activeOpacity={0.92}
              >
                <Image source={{ uri: item.image }} style={styles.foodImage} />
                <View style={styles.foodInfo}>
                  <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={styles.foodTitle}>{item.title}</Text>
                      <View style={[styles.vegIndicator, { borderColor: item.isVeg ? '#22C55E' : '#EF4444' }]}>
                        <View style={[styles.vegDot, { backgroundColor: item.isVeg ? '#22C55E' : '#EF4444' }]} />
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('KitchenProfileScreen', { kitchen })}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.foodKitchenLink}>🏠 {kitchen.name}</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.foodDescription} numberOfLines={1}>
                    {item.description}
                  </Text>

                  <View style={styles.foodMetaRow}>
                    <Text style={styles.foodPrice}>{item.price}</Text>

                    <View style={styles.rightMeta}>
                      <View style={styles.metaBadge}>
                        <Ionicons name="time-outline" size={12} color="#64748B" />
                        <Text style={styles.metaText}>{item.prepTime}</Text>
                      </View>

                      <View style={styles.metaBadge}>
                        <Ionicons name="star" size={12} color="#EAB308" />
                        <Text style={styles.metaText}>{item.rating}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* NOTIFICATION MODAL */}
      <Modal
        visible={isNotificationVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsNotificationVisible(false)}
      >
        <View style={[styles.notifContainer, { paddingTop: insets.top }]}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

          {/* NOTIFICATION HEADER */}
          <View style={styles.notifHeader}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setIsNotificationVisible(false)}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={20} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.notifHeaderTitle}>Notifications</Text>
            <TouchableOpacity onPress={markAllAsRead} activeOpacity={0.7} style={styles.readAllBtn}>
              <Ionicons name="checkmark-done-sharp" size={18} color="#CA8A04" />
              <Text style={styles.readAllText}>Mark read</Text>
            </TouchableOpacity>
          </View>

          {/* NOTIFICATION LIST */}
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
              <View style={[styles.notifCard, !item.read && styles.notifUnreadCard]}>
                <View style={[styles.notifIconCircle, { backgroundColor: `${item.color}15` }]}>
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={styles.notifTitleRow}>
                    <Text style={styles.notifItemTitle}>{item.title}</Text>
                    {!item.read && <View style={styles.notifUnreadDot} />}
                  </View>
                  <Text style={styles.notifItemBody}>{item.body}</Text>
                  <Text style={styles.notifItemTime}>{item.time}</Text>
                </View>
              </View>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  /* FIXED HEADER STYLING */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  locationWrapper: {
    flex: 1, // Ensures location section takes only remaining space without pushing icons
    marginRight: 16,
  },
  deliverText: { fontSize: 10, color: '#94A3B8', fontWeight: '800', letterSpacing: 0.6 },
  locationSelector: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  locationText: { fontSize: 15, fontWeight: '800', color: '#0F172A', maxWidth: '80%' },

  headerIconsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // Distinct gap between Notification & Cart button
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F1F5F9',
    justify: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  badgeDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#EF4444',
    position: 'absolute',
    top: 9,
    right: 9,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  cartCountBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#EAB308',
    borderRadius: 10,
    width: 18,
    height: 18,
    justify: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  cartCountText: { color: '#0F172A', fontSize: 10, fontWeight: '900' },

  /* SEARCH BAR */
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  searchPlaceholder: { flex: 1, marginLeft: 10, color: '#94A3B8', fontSize: 13, fontWeight: '500' },
  filterBtn: {
    backgroundColor: '#EAB308',
    padding: 8,
    borderRadius: 12,
  },

  /* BANNER */
  bannerContainer: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    overflow: 'hidden',
  },
  bannerTextContainer: { flex: 1 },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(234, 179, 8, 0.18)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  bannerBadge: { color: '#EAB308', fontWeight: '800', fontSize: 10, textTransform: 'uppercase' },
  bannerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '900' },
  bannerSubtitle: { color: '#94A3B8', fontSize: 11, marginTop: 4, lineHeight: 15 },
  bannerImage: { width: 85, height: 85, borderRadius: 42.5, marginLeft: 10 },

  /* SECTIONS */
  sectionHeader: {
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginTop: 22,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#0F172A' },
  sectionSubTitle: { fontSize: 11, color: '#64748B', marginTop: 2, fontWeight: '500' },
  seeAllText: { fontSize: 12, fontWeight: '800', color: '#CA8A04' },

  /* CATEGORIES */
  categoryChip: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeCategoryChip: { backgroundColor: '#EAB308', borderColor: '#EAB308' },
  categoryText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  activeCategoryText: { color: '#0F172A', fontWeight: '800' },

  /* KITCHENS */
  kitchenCard: {
    width: 230,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  kitchenCover: { width: '100%', height: 95 },
  tagBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagBadgeText: { color: '#EAB308', fontSize: 9, fontWeight: '800' },
  followBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  followingBtn: {
    backgroundColor: '#FFFFFF',
  },
  followBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  followingBtnText: { color: '#0F172A' },
  kitchenCardBody: { flexDirection: 'row', padding: 10, alignItems: 'center' },
  kitchenAvatar: { width: 38, height: 38, borderRadius: 19, borderWidth: 1.5, borderColor: '#FFFFFF' },
  kitchenCardName: { fontSize: 13, fontWeight: '800', color: '#0F172A' },
  kitchenOwner: { fontSize: 11, color: '#64748B', marginTop: 1 },
  kitchenCardFooter: {
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 2,
  },
  miniRating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  miniRatingText: { fontSize: 12, fontWeight: '800', color: '#0F172A' },
  reviewsText: { fontSize: 11, color: '#94A3B8' },
  followersText: { fontSize: 11, color: '#64748B', fontWeight: '600' },

  /* DISH CARDS */
  foodCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  foodImage: { width: 95, height: 95, borderRadius: 14 },
  foodInfo: { flex: 1, marginLeft: 12, justifyContent: 'space-between' },
  foodTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  vegIndicator: { width: 12, height: 12, borderWidth: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 2 },
  vegDot: { width: 6, height: 6, borderRadius: 3 },
  foodKitchenLink: { fontSize: 12, fontWeight: '700', color: '#CA8A04', marginTop: 2 },
  foodDescription: { fontSize: 11, color: '#64748B', marginTop: 3 },
  foodMetaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  foodPrice: { fontSize: 15, fontWeight: '900', color: '#0F172A' },
  rightMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  metaText: { fontSize: 11, fontWeight: '700', color: '#64748B' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 35 },
  emptyText: { color: '#94A3B8', marginTop: 10, fontSize: 13, fontWeight: '600' },

  /* NOTIFICATION MODAL STYLES */
  notifContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  notifHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justify: 'center',
    alignItems: 'center',
  },
  notifHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  readAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  readAllText: { fontSize: 12, fontWeight: '800', color: '#CA8A04' },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  notifUnreadCard: {
    borderColor: '#FEF08A',
    backgroundColor: '#FEFCE8',
  },
  notifIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justify: 'center',
    alignItems: 'center',
  },
  notifTitleRow: {
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'center',
  },
  notifItemTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  notifUnreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EAB308',
  },
  notifItemBody: {
    fontSize: 12,
    color: '#475569',
    marginTop: 4,
    lineHeight: 18,
  },
  notifItemTime: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 6,
    fontWeight: '600',
  },
});