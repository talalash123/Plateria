import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api';

// SHARED KITCHENS FROM MAIN HOME PAGE FOR CONSISTENCY
const INITIAL_SUBSCRIBED_KITCHENS = [
  {
    _id: 'k1',
    id: 'k1',
    name: "Mom's Spice Craft",
    kitchenName: "Mom's Spice Craft",
    owner: 'Chef Ayesha',
    rating: 4.8,
    reviewsCount: 320,
    followersCount: 1248,
    subscribersCount: 1248,
    deliveryTime: '25-35 min',
    location: 'Sector H-11, Islamabad',
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    description: 'Specialized in traditional home-cooked Biryani, Karahi, and authentic Pakistani spices.'
  },
  {
    _id: 'k2',
    id: 'k2',
    name: 'Lahore Desi Dera',
    kitchenName: 'Lahore Desi Dera',
    owner: 'Chef Usman',
    rating: 4.7,
    reviewsCount: 210,
    followersCount: 890,
    subscribersCount: 890,
    deliveryTime: '30-40 min',
    location: 'F-8 Markaz, Islamabad',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    description: 'Famous for slow-cooked Haleem, Desi Ghee items, and clay oven Naans.'
  }
];

export default function SubscribedKitchensScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [kitchens, setKitchens] = useState(INITIAL_SUBSCRIBED_KITCHENS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/kitchens/subscribed');
      if (res.data?.kitchens && res.data.kitchens.length > 0) {
        setKitchens(res.data.kitchens);
      }
    } catch (e) {
      // API fail honed par UI fallback mock list se chalti rahegi
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = (kitchenId) => {
    setKitchens((prev) => prev.filter((item) => (item._id || item.id) !== kitchenId));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscribed Kitchens</Text>
        <View style={{ width: 38 }} />
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#EAB308" />
        </View>
      ) : (
        <FlatList
          data={kitchens}
          keyExtractor={(item) => item._id || item.id}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="heart-dislike-outline" size={56} color="#94A3B8" />
              </View>
              <Text style={styles.emptyTitle}>No Subscribed Kitchens</Text>
              <Text style={styles.emptySubtitle}>
                You haven't subscribed to any kitchens yet. Follow your favorite home chefs to see them here!
              </Text>
              <TouchableOpacity
                style={styles.exploreBtn}
                onPress={() => navigation.navigate('MainTabs')}
              >
                <Text style={styles.exploreBtnTxt}>Discover Kitchens</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.88}
              onPress={() =>
                navigation.navigate('KitchenProfileScreen', {
                  kitchen: item,
                  kitchenId: item._id || item.id
                })
              }
            >
              {/* COVER & AVATAR BANNER */}
              <View style={styles.coverContainer}>
                <Image
                  source={{ uri: item.coverImage || 'https://via.placeholder.com/400x120' }}
                  style={styles.coverImg}
                />
                <Image
                  source={{ uri: item.avatar || 'https://via.placeholder.com/100' }}
                  style={styles.avatarImg}
                />
              </View>

              {/* CARD DETAILS */}
              <View style={styles.cardContent}>
                <View style={styles.titleRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.kitchenName}>{item.kitchenName || item.name}</Text>
                    <Text style={styles.ownerText}>By {item.owner || 'Home Chef'}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.subBadge}
                    onPress={() => handleUnsubscribe(item._id || item.id)}
                  >
                    <Ionicons name="heart" size={14} color="#EF4444" />
                    <Text style={styles.subBadgeText}>Subscribed</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.metaRow}>
                  <View style={styles.metaBadge}>
                    <Ionicons name="star" size={12} color="#EAB308" />
                    <Text style={styles.metaText}>{item.rating || 4.5}</Text>
                  </View>

                  <Text style={styles.dotSeparator}>•</Text>

                  <View style={styles.metaBadge}>
                    <Ionicons name="people" size={12} color="#64748B" />
                    <Text style={styles.metaText}>
                      {item.subscribersCount || item.followersCount || 0} Subscribers
                    </Text>
                  </View>

                  <Text style={styles.dotSeparator}>•</Text>

                  <View style={styles.metaBadge}>
                    <Ionicons name="time-outline" size={12} color="#64748B" />
                    <Text style={styles.metaText}>{item.deliveryTime || '25-35 min'}</Text>
                  </View>
                </View>

                {item.location && (
                  <Text style={styles.locationTxt}>📍 {item.location}</Text>
                )}

                {/* ACTION BUTTONS */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.viewBtn}
                    onPress={() =>
                      navigation.navigate('KitchenProfileScreen', {
                        kitchen: item,
                        kitchenId: item._id || item.id
                      })
                    }
                  >
                    <Text style={styles.viewBtnTxt}>View Menu</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.chatBtn}
                    onPress={() =>
                      navigation.navigate('ChatScreen', {
                        kitchen: item,
                        kitchenId: item._id || item.id
                      })
                    }
                  >
                    <Ionicons name="chatbubble-ellipses-outline" size={16} color="#0F172A" />
                    <Text style={styles.chatBtnTxt}>Chat</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
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
    justifyContent: 'space-between',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  coverContainer: {
    position: 'relative',
    height: 110,
    backgroundColor: '#F1F5F9',
  },
  coverImg: {
    width: '100%',
    height: '100%',
  },
  avatarImg: {
    position: 'absolute',
    bottom: -20,
    left: 14,
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  cardContent: {
    padding: 14,
    paddingTop: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  kitchenName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  ownerText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },
  subBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  subBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EF4444',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  dotSeparator: {
    color: '#CBD5E1',
    fontSize: 12,
  },
  locationTxt: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 8,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  viewBtn: {
    flex: 1,
    backgroundColor: '#EAB308',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  viewBtnTxt: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chatBtnTxt: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptyBox: {
    paddingVertical: 60,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
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
});