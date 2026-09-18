import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function KitchenProfileScreen({ route, navigation }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(1248);

  const kitchenData = {
    id: 'k1',
    name: 'Mom\'s Spice Craft',
    owner: 'Chef Ayesha',
    rating: 4.8,
    reviewsCount: 320,
    deliveryTime: '25-35 min',
    location: 'Sector H-11, Islamabad',
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  };

  const menuItems = [
    {
      id: 'm1',
      title: 'Special Chicken Biryani',
      price: 'RS 450',
      description: 'Basmati rice with authentic home-ground spices & juicy chicken leg piece.',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 'm2',
      title: 'Homemade Beef Haleem',
      price: 'RS 380',
      description: 'Slow-cooked lentils & shredded beef garnished with fried onions & ginger.',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 'm3',
      title: 'Desi Ghee Palak Paneer',
      price: 'RS 320',
      description: 'Fresh spinach puree with cottage cheese cooked in pure desi ghee.',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=80',
    },
  ];

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
    setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER COVER IMAGE */}
        <View style={styles.coverContainer}>
          <Image source={{ uri: kitchenData.coverImage }} style={styles.coverImage} />
          <View style={styles.coverOverlay} />

          {/* TOP NAV BUTTONS */}
          <View style={styles.headerBar}>
            <TouchableOpacity style={styles.iconCircleBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={20} color="#1E293B" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconCircleBtn} 
              onPress={() => navigation.navigate('ChatScreen', { kitchenName: kitchenData.name })}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={20} color="#1E293B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* KITCHEN INFO CARD */}
        <View style={styles.infoCard}>
          <Image source={{ uri: kitchenData.avatar }} style={styles.avatarImage} />

          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.kitchenName}>{kitchenData.name}</Text>
              <Text style={styles.ownerText}>By {kitchenData.owner}</Text>
            </View>

            <TouchableOpacity
              style={[styles.followBtn, isFollowing && styles.followingBtn]}
              onPress={toggleFollow}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isFollowing ? "checkmark" : "add"}
                size={16}
                color={isFollowing ? "#1E293B" : "#FFFFFF"}
              />
              <Text style={[styles.followBtnText, isFollowing && styles.followingBtnText]}>
                {isFollowing ? "Following" : "Follow"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* STATS STRIP */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{followersCount}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={styles.statItem}
              onPress={() => navigation.navigate('ReviewScreen', { kitchenId: kitchenData.id })}
            >
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="#EAB308" />
                <Text style={styles.ratingText}>{kitchenData.rating}</Text>
              </View>
              <Text style={styles.statLabel}>{kitchenData.reviewsCount} Reviews</Text>
            </TouchableOpacity>

            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{kitchenData.deliveryTime}</Text>
              <Text style={styles.statLabel}>Delivery</Text>
            </View>
          </View>
        </View>

        {/* MENU SECTION */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Featured Home Dishes</Text>

          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.dishCard}
              onPress={() => navigation.navigate('FoodDetailsScreen', { food: item, kitchen: kitchenData })}
              activeOpacity={0.85}
            >
              <Image source={{ uri: item.image }} style={styles.dishImage} />
              <View style={styles.dishDetails}>
                <View style={styles.dishHeader}>
                  <Text style={styles.dishTitle}>{item.title}</Text>
                  <Text style={styles.dishPrice}>{item.price}</Text>
                </View>
                <Text style={styles.dishDesc} numberOfLines={2}>{item.description}</Text>

                <View style={styles.dishFooter}>
                  <View style={styles.miniStar}>
                    <Ionicons name="star" size={12} color="#EAB308" />
                    <Text style={styles.miniRating}>{item.rating}</Text>
                  </View>
                  <View style={styles.addBtn}>
                    <Ionicons name="add" size={16} color="#FFFFFF" />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  coverContainer: { height: 210, width: '100%', position: 'relative' },
  coverImage: { width: '100%', height: '100%' },
  coverOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  headerBar: {
    position: 'absolute',
    top: 45,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: -40,
    borderRadius: 20,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  avatarImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    marginTop: -44,
    alignSelf: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  kitchenName: { fontSize: 20, fontWeight: '800', color: '#0F172A' },
  ownerText: { fontSize: 13, color: '#64748B', marginTop: 2 },
  followBtn: {
    backgroundColor: '#EAB308',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  followingBtn: { backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#CBD5E1' },
  followBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  followingBtnText: { color: '#1E293B' },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  statLabel: { fontSize: 11, color: '#64748B', marginTop: 2 },
  divider: { width: 1, height: 24, backgroundColor: '#E2E8F0' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  menuContainer: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 14 },
  dishCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  dishImage: { width: 90, height: 90, borderRadius: 12 },
  dishDetails: { flex: 1, marginLeft: 12, justifyContent: 'space-between' },
  dishHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dishTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', flex: 1 },
  dishPrice: { fontSize: 14, fontWeight: '800', color: '#CA8A04' },
  dishDesc: { fontSize: 12, color: '#64748B', marginTop: 4 },
  dishFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  miniStar: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  miniRating: { fontSize: 12, fontWeight: '700', color: '#334155' },
  addBtn: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#EAB308', justifyContent: 'center', alignItems: 'center' }
});