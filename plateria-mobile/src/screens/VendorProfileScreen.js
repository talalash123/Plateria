import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function VendorProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [kitchenName, setKitchenName] = useState('Plateria Central Kitchen');
  const [phone, setPhone] = useState('+92 300 9876543');
  const [address, setAddress] = useState('Campus Food Court, IST');

  const handleSave = () => {
    Alert.alert("Saved", "Profile details updated.");
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 40 }}
    >
      <View style={styles.profileHeader}>
        <View style={styles.iconCircle}>
          <Ionicons name="restaurant" size={36} color="#111827" />
        </View>
        <Text style={styles.kitchenTitle}>{kitchenName}</Text>
        <Text style={styles.vendorRole}>Verified Campus Vendor</Text>
      </View>

      <Text style={styles.label}>Kitchen Name</Text>
      <TextInput style={styles.input} value={kitchenName} onChangeText={setKitchenName} />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

      <Text style={styles.label}>Address / Location</Text>
      <TextInput style={styles.input} value={address} onChangeText={setAddress} />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.logoutBtn, { marginBottom: insets.bottom + 10 }]} 
        onPress={() => navigation.navigate('LoginScreen')}
      >
        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        <Text style={styles.logoutText}>Logout Vendor</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  profileHeader: { alignItems: 'center', backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 20 },
  iconCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#FEF08A', justifyContent: 'center', alignItems: 'center', marginBottom: 10, borderWidth: 2, borderColor: '#EAB308' },
  kitchenTitle: { fontSize: 18, fontWeight: '900', color: '#111827' },
  vendorRole: { fontSize: 12, color: '#6B7280', marginTop: 2, fontWeight: '600' },
  label: { fontSize: 12, fontWeight: '800', color: '#374151', marginBottom: 6, marginTop: 10 },
  input: { backgroundColor: '#FFFFFF', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', fontSize: 14, color: '#111827' },
  saveBtn: { backgroundColor: '#EAB308', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  saveBtnText: { fontWeight: '900', color: '#111827', fontSize: 15 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEF2F2', padding: 16, borderRadius: 12, marginTop: 16, gap: 8 },
  logoutText: { color: '#EF4444', fontWeight: '800', fontSize: 14 }
});