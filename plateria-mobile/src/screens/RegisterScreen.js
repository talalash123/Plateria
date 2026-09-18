import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { register } = useContext(AuthContext);
  const [role, setRole] = useState('customer'); // 'customer' or 'vendor'
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [kitchenName, setKitchenName] = useState('');

  // Design Theme Palette
  const theme = {
    primary: '#E63946',
    primaryDark: '#C5221F',
    primaryLight: '#FFE8E8',
    darkText: '#1D3557',
    mutedText: '#6C757D',
    bg: '#F8F9FA',
    cardBg: '#FFFFFF',
    border: '#E9ECEF',
    inputBg: '#F1F3F5',
  };

  const handleRegister = async () => {
    if (!name || !phone || !email || !password || !location) {
      return Alert.alert('Validation Error', 'Please fill in all mandatory fields.');
    }
    if (role === 'vendor' && !kitchenName) {
      return Alert.alert('Validation Error', 'Kitchen / Brand Name is mandatory for vendors.');
    }

    setLoading(true);
    try {
      const payload = { 
        name: name.trim(), 
        phone: phone.trim(), 
        email: email.trim(), 
        password, 
        location: location.trim(), 
        role, 
        kitchenName: role === 'vendor' ? kitchenName.trim() : '' 
      };
      
      await register(payload);
      
      // Auto-Navigation Fallback if AuthContext state listener isn't instantly toggling
      if (navigation && navigation.canGoBack()) {
        navigation.reset({
          index: 0,
          routes: [{ name: role === 'vendor' ? 'VendorHome' : 'CustomerHome' }],
        });
      }
    } catch (e) {
      Alert.alert(
        'Registration Error', 
        e.response?.data?.message || 'Failed to register account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.flex, { backgroundColor: theme.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor={theme.bg} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* TOP BRAND HEADER */}
        <View style={styles.headerBox}>
          <View style={[styles.logoIconBadge, { backgroundColor: theme.primaryLight }]}>
            <Ionicons name="restaurant" size={32} color={theme.primary} />
          </View>
          <Text style={[styles.brandTitle, { color: theme.darkText }]}>Join Plateria</Text>
          <Text style={styles.brandSubTitle}>Create an account to start ordering or selling food</Text>
        </View>

        {/* ROLE SELECTION SEGMENT SWITCH */}
        <View style={styles.roleSegmentContainer}>
          <TouchableOpacity
            style={[styles.roleSegmentBtn, role === 'customer' && styles.activeSegmentBtn]}
            onPress={() => setRole('customer')}
            activeOpacity={0.8}
          >
            <Ionicons 
              name="person-outline" 
              size={18} 
              color={role === 'customer' ? '#FFFFFF' : theme.mutedText} 
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.roleSegmentText, role === 'customer' && styles.activeSegmentText]}>
              Customer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleSegmentBtn, role === 'vendor' && styles.activeSegmentBtn]}
            onPress={() => setRole('vendor')}
            activeOpacity={0.8}
          >
            <Ionicons 
              name="storefront-outline" 
              size={18} 
              color={role === 'vendor' ? '#FFFFFF' : theme.mutedText} 
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.roleSegmentText, role === 'vendor' && styles.activeSegmentText]}>
              Vendor / Kitchen
            </Text>
          </TouchableOpacity>
        </View>

        {/* FORM CARD CONTAINER */}
        <View style={styles.formCard}>
          {/* Full Name Input */}
          <Text style={styles.inputLabel}>
            {role === 'vendor' ? 'Kitchen Owner Name' : 'Full Name'} *
          </Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person" size={18} color="#95A5A6" style={styles.inputIcon} />
            <TextInput
              placeholder={role === 'vendor' ? "e.g. Talal Ashraf" : "e.g. John Doe"}
              placeholderTextColor="#ADB5BD"
              value={name}
              onChangeText={setName}
              style={styles.textInput}
            />
          </View>

          {/* Kitchen Name (Vendor Only) */}
          {role === 'vendor' && (
            <View>
              <Text style={styles.inputLabel}>Kitchen / Brand Name *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="fast-food" size={18} color="#95A5A6" style={styles.inputIcon} />
                <TextInput
                  placeholder="e.g. Royal Spice Craft"
                  placeholderTextColor="#ADB5BD"
                  value={kitchenName}
                  onChangeText={setKitchenName}
                  style={styles.textInput}
                />
              </View>
            </View>
          )}

          {/* Phone Number */}
          <Text style={styles.inputLabel}>Phone Number *</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="call" size={18} color="#95A5A6" style={styles.inputIcon} />
            <TextInput
              placeholder="e.g. 0300 1234567"
              placeholderTextColor="#ADB5BD"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={styles.textInput}
            />
          </View>

          {/* Email Address */}
          <Text style={styles.inputLabel}>Email Address *</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail" size={18} color="#95A5A6" style={styles.inputIcon} />
            <TextInput
              placeholder="name@domain.com"
              placeholderTextColor="#ADB5BD"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.textInput}
            />
          </View>

          {/* Password Input */}
          <Text style={styles.inputLabel}>Password *</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed" size={18} color="#95A5A6" style={styles.inputIcon} />
            <TextInput
              placeholder="••••••••"
              placeholderTextColor="#ADB5BD"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={[styles.textInput, { flex: 1 }]}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={18} 
                color="#95A5A6" 
              />
            </TouchableOpacity>
          </View>

          {/* City / Location */}
          <Text style={styles.inputLabel}>City / Delivery Area *</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="location" size={18} color="#95A5A6" style={styles.inputIcon} />
            <TextInput
              placeholder="e.g. Islamabad, Sector H-11"
              placeholderTextColor="#ADB5BD"
              value={location}
              onChangeText={setLocation}
              style={styles.textInput}
            />
          </View>

          {/* REGISTER SUBMIT BUTTON */}
          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: theme.primary }]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.btnRow}>
                <Text style={styles.submitBtnText}>Complete Registration</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* BOTTOM NAV LINK */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('Login')} 
          style={styles.footerLink}
          activeOpacity={0.7}
        >
          <Text style={styles.footerLinkText}>
            Already registered? <Text style={[styles.loginHighlight, { color: theme.primary }]}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  brandSubTitle: {
    fontSize: 13,
    color: '#6C757D',
    marginTop: 4,
    textAlign: 'center',
  },
  roleSegmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#E9ECEF',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  roleSegmentBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  activeSegmentBtn: {
    backgroundColor: '#E63946',
    elevation: 3,
    shadowColor: '#E63946',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  roleSegmentText: {
    color: '#495057',
    fontWeight: '700',
    fontSize: 13,
  },
  activeSegmentText: {
    color: '#FFFFFF',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#343A40',
    marginBottom: 6,
    marginTop: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#212529',
  },
  submitBtn: {
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    elevation: 2,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  footerLink: {
    marginTop: 22,
    alignItems: 'center',
  },
  footerLinkText: {
    color: '#6C757D',
    fontSize: 14,
  },
  loginHighlight: {
    fontWeight: '800',
  },
});