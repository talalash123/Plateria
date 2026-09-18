import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Alert,
  Share,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function FoodDetailsScreen({ route, navigation }) {
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState([]);

  // Default Fallback Data if params not provided
  const food = route.params?.food || {
    id: 'f1',
    title: 'Special Chicken Biryani',
    price: 'RS 450',
    description: 'Authentic Basmati rice cooked with home-ground spices, tender chicken, caramelized onions, and served with traditional raita.',
    rating: 4.9,
    prepTime: '25-30 min',
    category: 'Biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    kitchen: {
      id: 'k1',
      name: "Mom's Spice Craft",
      owner: 'Chef Ayesha',
      rating: 4.8,
      reviewsCount: 320,
      followersCount: 1248,
      deliveryTime: '25-35 min',
      location: 'Sector H-11, Islamabad',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    }
  };

  const kitchen = route.params?.kitchen || food.kitchen;

  // Extract base numerical price for calculations (e.g. "RS 450" -> 450)
  const basePriceNum = parseInt(food.price.replace(/[^0-9]/g, '')) || 0;
  const totalPrice = basePriceNum * quantity;

  // Quick Addon Chips Options
  const addonsOptions = [
    { id: 'a1', name: 'Extra Mint Raita', price: 50 },
    { id: 'a2', name: 'Fresh Salad', price: 40 },
    { id: 'a3', name: 'Extra Gravy / Shorba', price: 80 },
  ];

  const toggleAddon = (addonId) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter((id) => id !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, addonId]);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${food.title} from ${kitchen.name} on Plateria! Price: ${food.price}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = () => {
    Alert.alert(
      '🎉 Added to Basket',
      `${quantity}x ${food.title}\nTotal: RS ${totalPrice}`,
      [
        {
          text: 'View Basket',
          onPress: () => navigation.navigate('CartScreen'),
        },
        {
          text: 'Keep Browsing',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        {/* DISH BANNER IMAGE */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: food.image }} style={styles.image} />
          
          {/* TOP BAR ACTIONS */}
          <View style={styles.topHeaderBar}>
            <TouchableOpacity
              style={styles.circleBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={20} color="#0F172A" />
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                style={styles.circleBtn}
                onPress={handleShare}
                activeOpacity={0.8}
              >
                <Ionicons name="share-social-outline" size={20} color="#0F172A" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.circleBtn}
                onPress={() => setIsFavorite(!isFavorite)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={20}
                  color={isFavorite ? '#EF4444' : '#0F172A'}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.imageBadge}>
            <Ionicons name="time-outline" size={13} color="#FFFFFF" />
            <Text style={styles.imageBadgeText}>{food.prepTime || '20-30 min'}</Text>
          </View>
        </View>

        {/* CONTENT CONTAINER */}
        <View style={styles.contentCard}>
          {/* TITLE & RATING ROW */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>{food.title}</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#EAB308" />
              <Text style={styles.ratingText}>{food.rating}</Text>
            </View>
          </View>

          {/* PRICE */}
          <Text style={styles.priceText}>{food.price}</Text>

          {/* KITCHEN INFO CARD LINK */}
          <TouchableOpacity
            style={styles.kitchenCard}
            onPress={() => navigation.navigate('KitchenProfileScreen', { kitchen })}
            activeOpacity={0.85}
          >
            <Image source={{ uri: kitchen.avatar }} style={styles.kitchenAvatar} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={styles.kitchenTitleRow}>
                <Text style={styles.kitchenName}>{kitchen.name}</Text>
                <Ionicons name="checkmark-circle" size={15} color="#22C55E" />
              </View>
              <Text style={styles.kitchenOwner}>By {kitchen.owner} • {kitchen.location || 'Islamabad'}</Text>
            </View>
            <View style={styles.viewKitchenPill}>
              <Text style={styles.viewKitchenText}>View</Text>
              <Ionicons name="chevron-forward" size={14} color="#CA8A04" />
            </View>
          </TouchableOpacity>

          {/* DESCRIPTION */}
          <Text style={styles.sectionHeader}>Description</Text>
          <Text style={styles.description}>{food.description}</Text>

          {/* HIGHLIGHT TAGS */}
          <View style={styles.tagRow}>
            <View style={styles.featureTag}>
              <Ionicons name="leaf-outline" size={14} color="#166534" />
              <Text style={styles.featureTagText}>Fresh Homecooked</Text>
            </View>
            <View style={styles.featureTag}>
              <Ionicons name="shield-checkmark-outline" size={14} color="#1E40AF" />
              <Text style={styles.featureTagText}>100% Hygienic</Text>
            </View>
          </View>

          {/* ADD-ONS SECTION */}
          <Text style={styles.sectionHeader}>Popular Extras</Text>
          {addonsOptions.map((item) => {
            const isSelected = selectedAddons.includes(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.addonCard, isSelected && styles.addonCardSelected]}
                onPress={() => toggleAddon(item.id)}
                activeOpacity={0.8}
              >
                <View style={styles.addonLeft}>
                  <Ionicons
                    name={isSelected ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={isSelected ? '#EAB308' : '#94A3B8'}
                  />
                  <Text style={styles.addonName}>{item.name}</Text>
                </View>
                <Text style={styles.addonPrice}>+ RS {item.price}</Text>
              </TouchableOpacity>
            );
          })}

          {/* QUANTITY CONTROL */}
          <View style={styles.quantityRow}>
            <Text style={styles.sectionHeader}>Quantity</Text>
            <View style={styles.counterBox}>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                activeOpacity={0.7}
              >
                <Ionicons name="remove" size={18} color="#0F172A" />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => setQuantity(quantity + 1)}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={18} color="#0F172A" />
              </TouchableOpacity>
            </View>
          </View>

          {/* SPECIAL INSTRUCTIONS INPUT */}
          <Text style={styles.sectionHeader}>Special Cooking Instructions</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. Less spicy, well-cooked, separate gravy..."
            value={instructions}
            onChangeText={setInstructions}
            multiline
            numberOfLines={3}
            placeholderTextColor="#94A3B8"
          />
        </View>
      </ScrollView>

      {/* BOTTOM ACTION BAR */}
      <View style={styles.bottomBar}>
        <View style={styles.totalPriceBox}>
          <Text style={styles.totalLabel}>Total Price</Text>
          <Text style={styles.totalValue}>RS {totalPrice}</Text>
        </View>

        <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart} activeOpacity={0.85}>
          <Ionicons name="bag-handle-outline" size={20} color="#0F172A" />
          <Text style={styles.cartBtnText}>Add to Basket</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  imageContainer: {
    height: 300,
    width: '100%',
    position: 'relative',
  },
  image: { width: '100%', height: '100%' },
  topHeaderBar: {
    position: 'absolute',
    top: 48,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'center',
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justify: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  imageBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  imageBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  contentCard: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },
  headerRow: {
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  title: { fontSize: 22, fontWeight: '900', color: '#0F172A', flex: 1, lineHeight: 28 },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  ratingText: { fontSize: 13, fontWeight: '800', color: '#854D0E' },
  priceText: { fontSize: 22, fontWeight: '900', color: '#CA8A04', marginTop: 8 },
  kitchenCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  kitchenAvatar: { width: 44, height: 44, borderRadius: 22 },
  kitchenTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  kitchenName: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  kitchenOwner: { fontSize: 11, color: '#64748B', marginTop: 2 },
  viewKitchenPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#FEF08A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  viewKitchenText: { fontSize: 11, fontWeight: '800', color: '#854D0E' },
  sectionHeader: { fontSize: 15, fontWeight: '800', color: '#0F172A', marginTop: 20, marginBottom: 8 },
  description: { fontSize: 13, color: '#475569', lineHeight: 20 },
  tagRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  featureTagText: { fontSize: 11, fontWeight: '700', color: '#334155' },
  addonCard: {
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  addonCardSelected: { borderColor: '#EAB308', backgroundColor: '#FEFCE8' },
  addonLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  addonName: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  addonPrice: { fontSize: 12, fontWeight: '800', color: '#CA8A04' },
  quantityRow: {
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'center',
  },
  counterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginTop: 12,
  },
  counterBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justify: 'center',
    alignItems: 'center',
    elevation: 1,
  },
  counterValue: { fontSize: 16, fontWeight: '800', marginHorizontal: 16, color: '#0F172A' },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 12,
    fontSize: 13,
    color: '#0F172A',
    textAlignVertical: 'top',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'space-between',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  totalPriceBox: { justifyContent: 'center' },
  totalLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '700' },
  totalValue: { fontSize: 18, fontWeight: '900', color: '#0F172A', marginTop: 1 },
  cartBtn: {
    backgroundColor: '#EAB308',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cartBtnText: { color: '#0F172A', fontSize: 15, fontWeight: '800' },
});