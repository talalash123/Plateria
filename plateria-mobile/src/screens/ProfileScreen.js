import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../context/AuthContext';
import api from '../config/api';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, setUser, logout } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [profileImage, setProfileImage] = useState(
    user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  );
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      base64: true,
    });
    if (!result.canceled) {
      setProfileImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = { name, phone, location, profileImage };
      const res = await api.put('/auth/profile', payload);
      setUser(res.data.user);
      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditing(false);
    } catch (e) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => setIsEditing(!isEditing)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isEditing ? 'close-outline' : 'create-outline'}
            size={22}
            color="#0F172A"
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        {/* AVATAR SECTION */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            onPress={isEditing ? pickImage : null}
            activeOpacity={isEditing ? 0.8 : 1}
            style={styles.avatarWrapper}
          >
            <Image source={{ uri: profileImage }} style={styles.avatar} />
            {isEditing && (
              <View style={styles.cameraBadge}>
                <Ionicons name="camera" size={16} color="#0F172A" />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.userName}>{user?.name || 'Customer'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'customer@plateria.com'}</Text>
        </View>

        {/* DETAILS CARD */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionHeader}>Personal Info</Text>

          {/* Full Name Field */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="person-outline" size={16} color="#CA8A04" />
              <Text style={styles.fieldLabel}>Full Name</Text>
            </View>
            {isEditing ? (
              <TextInput
                value={name}
                onChangeText={setName}
                style={styles.input}
                placeholder="Enter full name"
                placeholderTextColor="#94A3B8"
              />
            ) : (
              <Text style={styles.fieldValue}>{user?.name || 'Not provided'}</Text>
            )}
          </View>

          {/* Phone Field */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="call-outline" size={16} color="#CA8A04" />
              <Text style={styles.fieldLabel}>Phone Number</Text>
            </View>
            {isEditing ? (
              <TextInput
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
                keyboardType="phone-pad"
                placeholder="Enter phone number"
                placeholderTextColor="#94A3B8"
              />
            ) : (
              <Text style={styles.fieldValue}>{user?.phone || 'Not provided'}</Text>
            )}
          </View>

          {/* Location Field */}
          <View style={[styles.inputGroup, { borderBottomWidth: 0 }]}>
            <View style={styles.labelRow}>
              <Ionicons name="location-outline" size={16} color="#CA8A04" />
              <Text style={styles.fieldLabel}>Delivery Address / City</Text>
            </View>
            {isEditing ? (
              <TextInput
                value={location}
                onChangeText={setLocation}
                style={styles.input}
                placeholder="Enter delivery location"
                placeholderTextColor="#94A3B8"
              />
            ) : (
              <Text style={styles.fieldValue}>{user?.location || 'Not provided'}</Text>
            )}
          </View>
        </View>

        {/* ACTION BUTTONS */}
        {isEditing ? (
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.88}
          >
            {loading ? (
              <ActivityIndicator color="#0F172A" />
            ) : (
              <>
                <Ionicons name="checkmark-done" size={18} color="#0F172A" />
                <Text style={styles.saveBtnTxt}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => setIsEditing(true)}
            activeOpacity={0.88}
          >
            <Ionicons name="create-outline" size={18} color="#0F172A" />
            <Text style={styles.editBtnTxt}>Edit Profile</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={18} color="#EF4444" />
          <Text style={styles.logoutBtnTxt}>Logout Account</Text>
        </TouchableOpacity>
      </ScrollView>
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
    justify: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    justify: 'center',
    alignItems: 'center',
  },
  scrollBody: {
    padding: 18,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 10,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F1F5F9',
    borderWidth: 3,
    borderColor: '#FEF08A',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#EAB308',
    width: 30,
    height: 30,
    borderRadius: 15,
    justify: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 10,
  },
  userEmail: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  inputGroup: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginLeft: 22,
  },
  input: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 4,
  },
  saveBtn: {
    backgroundColor: '#EAB308',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justify: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
  },
  saveBtnTxt: {
    fontWeight: '800',
    color: '#0F172A',
    fontSize: 15,
  },
  editBtn: {
    backgroundColor: '#FEF08A',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justify: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
  },
  editBtnTxt: {
    fontWeight: '800',
    color: '#0F172A',
    fontSize: 15,
  },
  logoutBtn: {
    backgroundColor: '#FEF2F2',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justify: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutBtnTxt: {
    color: '#EF4444',
    fontWeight: '800',
    fontSize: 15,
  },
});