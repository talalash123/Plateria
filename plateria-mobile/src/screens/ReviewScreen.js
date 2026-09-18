import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ReviewScreen({ navigation }) {
  const reviews = [
    {
      id: 'r1',
      userName: 'Ahmad Raza',
      userImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      date: '2 days ago',
      comment: 'Authentic home taste! The biryani was fresh, hot, and spicy. Will definitely order again.',
    },
    {
      id: 'r2',
      userName: 'Zainab Fatima',
      userImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      rating: 4,
      date: '1 week ago',
      comment: 'Haleem texture was awesome! Packaging was clean and prompt delivery.',
    },
  ];

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customer Reviews</Text>
        <View style={{ width: 38 }} />
      </View>

      {/* REVIEWS LIST */}
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <View style={styles.userRow}>
              <Image source={{ uri: item.userImage }} style={styles.userAvatar} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.userName}>{item.userName}</Text>
                <Text style={styles.dateText}>{item.date}</Text>
              </View>

              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="#EAB308" />
                <Text style={styles.ratingText}>{item.rating}.0</Text>
              </View>
            </View>

            <Text style={styles.commentText}>{item.comment}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 45,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  userRow: { flexDirection: 'row', alignItems: 'center' },
  userAvatar: { width: 42, height: 42, borderRadius: 21 },
  userName: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  dateText: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FEF9C3', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  ratingText: { fontSize: 12, fontWeight: '800', color: '#713F12' },
  commentText: { fontSize: 13, color: '#334155', marginTop: 10, lineHeight: 18 },
});