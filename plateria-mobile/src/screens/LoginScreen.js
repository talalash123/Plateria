import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const [role, setRole] = useState('customer'); // 'customer' | 'vendor'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Plateria Theme Palette
  const theme = {
    primary: '#EAB308',         // Amber Gold
    primaryDark: '#CA8A04',     // Deep Gold
    primaryLight: '#FEF08A',    // Soft Gold Light
    textDark: '#0F172A',
    textMuted: '#64748B',
    bg: '#F8FAFC',
    cardBg: '#FFFFFF',
    border: '#E2E8F0',
  };

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Please enter your email and password.');
      return;
    }

    if (role === 'vendor') {
      navigation.replace('VendorDashboardScreen');
    } else {
      navigation.replace('CustomerHome');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor={theme.bg} />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* LOGO HEADER */}
        <View style={styles.logoBox}>
          <View style={[styles.logoCircle, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
            <Ionicons name="restaurant" size={44} color={theme.primaryDark} />
          </View>
          <Text style={[styles.appName, { color: theme.textDark }]}>Plateria</Text>
          <Text style={[styles.subTitle, { color: theme.textMuted }]}>
            Homecooked & Fresh Meals Delivered
          </Text>
        </View>

        {/* ROLE TOGGLE */}
        <View style={styles.roleSegmentContainer}>
          <TouchableOpacity
            style={[styles.roleSegmentBtn, role === 'customer' && styles.activeSegmentBtn]}
            onPress={() => setRole('customer')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="person"
              size={16}
              color={role === 'customer' ? theme.textDark : theme.textMuted}
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
              name="storefront"
              size={16}
              color={role === 'vendor' ? theme.textDark : theme.textMuted}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.roleSegmentText, role === 'vendor' && styles.activeSegmentText]}>
              Kitchen Vendor
            </Text>
          </TouchableOpacity>
        </View>

        {/* FORM CARD */}
        <View style={styles.formCard}>
          {/* Email Address Input */}
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="talal@plateria.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Password Input */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
              style={[styles.textInput, { flex: 1 }]}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#94A3B8"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={18}
                color="#94A3B8"
              />
            </TouchableOpacity>
          </View>

          {/* LOGIN BUTTON */}
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
            onPress={handleLogin}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>
              Login as {role === 'vendor' ? 'Kitchen Vendor' : 'Customer'}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#0F172A" />
          </TouchableOpacity>
        </View>

        {/* REGISTER NAVIGATION LINK */}
        <TouchableOpacity
          style={styles.linkBox}
          onPress={() => navigation.navigate('Register')}
          activeOpacity={0.7}
        >
          <Text style={styles.linkText}>
            Don't have an account?{' '}
            <Text style={{ color: theme.primaryDark, fontWeight: '800' }}>Register Now</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 22,
    paddingTop: 50,
    paddingBottom: 30,
    justifyContent: 'center',
    minHeight: '100%',
  },
  logoBox: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  appName: {
    fontSize: 30,
    fontWeight: '900',
    marginTop: 12,
    letterSpacing: -0.5,
  },
  subTitle: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  roleSegmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 14,
    padding: 4,
    marginBottom: 18,
  },
  roleSegmentBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  activeSegmentBtn: {
    backgroundColor: '#EAB308',
    elevation: 2,
    shadowColor: '#EAB308',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  roleSegmentText: {
    color: '#64748B',
    fontWeight: '700',
    fontSize: 13,
  },
  activeSegmentText: {
    color: '#0F172A',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
    marginTop: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    fontSize: 14,
    color: '#0F172A',
    height: '100%',
  },
  primaryBtn: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
    elevation: 2,
  },
  primaryBtnText: {
    fontWeight: '800',
    color: '#0F172A',
    fontSize: 15,
  },
  linkBox: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkText: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 13,
  },
});