import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FOOD_DATA } from './CustomerHomeScreen';

const RECENT_SEARCHES = ['Biryani', 'Burger', 'Karahi', 'Pizza', 'Momos'];
const POPULAR_TAGS = ['🔥 Trending', '🍔 Fast Food', '🍛 Desi Special', '🍕 Italian', '🍰 Desserts'];

export default function SearchScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const filteredData = FOOD_DATA.filter((item) => {
    const titleMatch = item.title?.toLowerCase().includes(query.toLowerCase());
    const kitchenMatch = item.kitchen?.name?.toLowerCase().includes(query.toLowerCase());
    return titleMatch || kitchenMatch;
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* SEARCH HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#0F172A" />
        </TouchableOpacity>

        <View style={styles.inputWrapper}>
          <Ionicons name="search" size={18} color="#EAB308" />
          <TextInput
            style={styles.textInput}
            placeholder="Search dish or home kitchen..."
            value={query}
            onChangeText={setQuery}
            autoFocus
            placeholderTextColor="#94A3B8"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* WHEN NO QUERY: SHOW RECENT & TRENDING TAGS */}
      {query.trim().length === 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 18 }}
        >
          {/* Quick Categories / Tags */}
          <Text style={styles.sectionTitle}>Popular Categories</Text>
          <View style={styles.tagsContainer}>
            {POPULAR_TAGS.map((tag, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.tagChip}
                onPress={() => setQuery(tag.replace(/[^a-zA-Z]/g, '').trim())}
                activeOpacity={0.8}
              >
                <Text style={styles.tagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Recent Searches */}
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Recent Searches</Text>
          {RECENT_SEARCHES.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.recentItem}
              onPress={() => setQuery(item)}
              activeOpacity={0.7}
            >
              <View style={styles.recentLeft}>
                <Ionicons name="time-outline" size={18} color="#94A3B8" />
                <Text style={styles.recentText}>{item}</Text>
              </View>
              <Ionicons name="arrow-forward" size={16} color="#CBD5E1" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        /* RESULTS LIST */
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyBox}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="search-outline" size={38} color="#EAB308" />
              </View>
              <Text style={styles.emptyTitle}>No Results Found</Text>
              <Text style={styles.emptySubtitle}>
                We couldn't find any dish or kitchen matching "{query}".
              </Text>
              <TouchableOpacity style={styles.clearSearchBtn} onPress={() => setQuery('')}>
                <Text style={styles.clearSearchTxt}>Clear Search</Text>
              </TouchableOpacity>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate('FoodDetailsScreen', {
                  food: item,
                  kitchen: item.kitchen,
                })
              }
              activeOpacity={0.9}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              
              <View style={styles.details}>
                <View style={styles.cardHeader}>
                  <Text style={styles.title} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color="#EAB308" />
                    <Text style={styles.ratingText}>{item.rating || '4.5'}</Text>
                  </View>
                </View>

                {item.kitchen && (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('KitchenProfileScreen', {
                        kitchen: item.kitchen,
                      })
                    }
                    style={styles.kitchenRow}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="restaurant-outline" size={13} color="#CA8A04" />
                    <Text style={styles.kitchenText} numberOfLines={1}>
                      {item.kitchen.name}
                    </Text>
                  </TouchableOpacity>
                )}

                <View style={styles.priceRow}>
                  <Text style={styles.priceTag}>
                    {typeof item.price === 'number' ? `Rs. ${item.price}` : item.price}
                  </Text>
                  <View style={styles.viewBadge}>
                    <Text style={styles.viewBadgeText}>View Details</Text>
                    <Ionicons name="chevron-forward" size={12} color="#EAB308" />
                  </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justify: 'center',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  recentItem: {
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  recentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  recentText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
  },
  emptyBox: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
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
    marginTop: 6,
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  clearSearchBtn: {
    marginTop: 18,
    backgroundColor: '#EAB308',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  clearSearchTxt: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 13,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  image: {
    width: 84,
    height: 84,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  details: {
    flex: 1,
    marginLeft: 12,
    justify: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginRight: 6,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#854D0E',
  },
  kitchenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  kitchenText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#CA8A04',
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  priceTag: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  viewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EAB308',
  },
});