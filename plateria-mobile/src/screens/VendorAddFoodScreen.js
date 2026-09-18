import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const API_BASE_URL = 'https://your-backend-api.com/api/vendor';

const CATEGORIES = ['Desi', 'Fast Food', 'Beverages', 'BBQ', 'Desserts', 'Snacks'];

export default function VendorAddFoodScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  
  const [title, setTitle] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Desi');
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(false);

  // 1. Pick Image from Gallery
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'Gallery access is required to upload product photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // 2. Save Product Handler
  const handleSaveProduct = async () => {
    if (!title.trim() || !price.trim()) {
      Alert.alert('Missing Details', 'Please enter Title and Price for your dish.');
      return;
    }

    if (!imageUri) {
      Alert.alert('Image Required', 'Please select an image for your food item.');
      return;
    }

    setLoading(true);

    try {
      const newProduct = {
        id: `FOOD-${Date.now()}`,
        title: title.trim(),
        image: imageUri,
        description: description.trim(),
        price: Number(price),
        category,
        isAvailable,
      };

      // API Upload Call (FormData for actual file or JSON payload)
      const formData = new FormData();
      formData.append('title', title);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('isAvailable', isAvailable);
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: `product_${Date.now()}.jpg`,
      });

      // Optional Backend Sync
      // await axios.post(`${API_BASE_URL}/products`, formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' }
      // });

      // Pass new product back to Kitchen Profile if callback exists
      if (route.params?.onAddProduct) {
        route.params.onAddProduct(newProduct);
      }

      Alert.alert('Success 🎉', 'New dish added to your Kitchen Profile!');
      
      // Reset Form
      setTitle('');
      setImageUri(null);
      setDescription('');
      setPrice('');
      
      // Navigate to Kitchen Profile / Back
      navigation.navigate('ProfileTab', { newProduct });

    } catch (err) {
      Alert.alert('Error', 'Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: (insets?.top || 20) + 16, paddingBottom: (insets?.bottom || 20) + 40 }
        ]}
      >
        <Text style={styles.headerTitle}>ADD NEW DISH</Text>

        {/* Image Upload Box */}
        <Text style={styles.label}>PRODUCT PHOTO</Text>
        <TouchableOpacity style={styles.imagePickerBox} onPress={pickImage} activeOpacity={0.8}>
          {imageUri ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
              <View style={styles.changeOverlay}>
                <Ionicons name="camera-outline" size={20} color="#FFFFFF" />
                <Text style={styles.changeText}>Change</Text>
              </View>
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <View style={styles.uploadIconCircle}>
                <Ionicons name="image-outline" size={28} color="#713F12" />
              </View>
              <Text style={styles.uploadMainText}>Tap to select food image</Text>
              <Text style={styles.uploadSubText}>Supports JPG, PNG (Gallery)</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Title Input */}
        <Text style={styles.label}>DISH TITLE *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Special Chicken Biryani"
          placeholderTextColor="#A16207"
          value={title}
          onChangeText={setTitle}
        />

        {/* Price Input */}
        <Text style={styles.label}>PRICE (PKR) *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 450"
          placeholderTextColor="#A16207"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        {/* Category Pills */}
        <Text style={styles.label}>CATEGORY</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryPill, category === cat && styles.categoryPillActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.categoryPillText, category === cat && styles.categoryPillTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Description Input */}
        <Text style={styles.label}>DESCRIPTION</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Describe ingredients, taste, portion size..."
          placeholderTextColor="#A16207"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />

        {/* Availability Switch */}
        <View style={styles.switchCard}>
          <View>
            <Text style={styles.switchTitle}>In Stock / Available</Text>
            <Text style={styles.switchSub}>Visible to customers on menu</Text>
          </View>
          <Switch
            value={isAvailable}
            onValueChange={setIsAvailable}
            trackColor={{ false: '#E5E7EB', true: '#FEF08A' }}
            thumbColor={isAvailable ? '#EAB308' : '#9CA3AF'}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.btn}
          onPress={handleSaveProduct}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.btnText}>Add to Kitchen Profile</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFCE8',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#854D0E',
    letterSpacing: 1,
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#713F12',
    letterSpacing: 0.8,
    marginBottom: 6,
    marginTop: 12,
  },
  imagePickerBox: {
    height: 160,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FEF08A',
    borderStyle: 'dashed',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContainer: {
    alignItems: 'center',
    padding: 16,
  },
  uploadIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF08A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  uploadMainText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#422006',
  },
  uploadSubText: {
    fontSize: 10,
    color: '#A16207',
    marginTop: 2,
  },
  previewContainer: {
    width: '100%',
    height: '100%',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  changeOverlay: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FEF08A',
    fontSize: 14,
    color: '#422006',
    fontWeight: '600',
  },
  multilineInput: {
    height: 80,
  },
  categoryRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FEF08A',
    marginRight: 8,
  },
  categoryPillActive: {
    backgroundColor: '#EAB308',
    borderColor: '#CA8A04',
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#854D0E',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  switchCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FEF08A',
    marginTop: 18,
  },
  switchTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#422006',
  },
  switchSub: {
    fontSize: 10,
    color: '#A16207',
    marginTop: 2,
  },
  btn: {
    backgroundColor: '#EAB308',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 24,
    elevation: 3,
    shadowColor: '#854D0E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  btnText: {
    fontWeight: '900',
    color: '#FFFFFF',
    fontSize: 15,
  },
});