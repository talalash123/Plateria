import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Linking
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function OrderTrackingScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const orderId = route?.params?.orderId || 'ORD-982341';
  const orderDetails = route?.params?.orderDetails || null;

  const [loading, setLoading] = useState(!orderDetails);
  const [order, setOrder] = useState(
    orderDetails || {
      status: 'Preparing',
      totalAmount: 950,
      deliveryAddress: 'Sector H-11, Islamabad',
      estimatedTime: '25-35 Mins',
      items: [
        { title: 'Chicken Biryani', quantity: 2, price: 450 },
      ],
    }
  );

  const BASE_URL = 'http://192.168.1.100:5000/api/customer';

  const steps = [
    { label: 'Order Placed', desc: 'We have received your order', key: 'Placed', icon: 'document-text-outline' },
    { label: 'Preparing Food', desc: 'The kitchen is preparing your meal', key: 'Preparing', icon: 'restaurant-outline' },
    { label: 'Out for Delivery', desc: 'Rider is on the way to your address', key: 'Out for Delivery', icon: 'bicycle-outline' },
    { label: 'Delivered', desc: 'Order successfully delivered', key: 'Delivered', icon: 'checkmark-circle-outline' },
  ];

  const getStepIndex = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
      case 'placed':
      case 'accepted':
        return 0;
      case 'preparing':
      case 'cooking':
        return 1;
      case 'out for delivery':
      case 'delivering':
      case 'on way':
        return 2;
      case 'delivered':
      case 'completed':
        return 3;
      default:
        return 1;
    }
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${BASE_URL}/order/status/${orderId}`);
        const json = await res.json();
        if (json.success) setOrder(json.data);
      } catch (err) {
        // Fallback for live offline mode
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#EAB308" />
        <Text style={styles.loadingTxt}>Fetching Live Order Status...</Text>
      </View>
    );
  }

  const currentStep = getStepIndex(order?.status);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Order Tracking</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        
        {/* STATUS CARD */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeaderRow}>
            <View>
              <Text style={styles.estimatedLbl}>Estimated Delivery</Text>
              <Text style={styles.estimatedVal}>{order?.estimatedTime || '25-35 Mins'}</Text>
            </View>
            <View style={styles.liveBadge}>
              <View style={styles.greenDot} />
              <Text style={styles.liveTxt}>LIVE</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoMetaRow}>
            <Text style={styles.orderIdTxt}>Order ID: #{orderId}</Text>
            <Text style={styles.totalTxt}>Rs. {order?.totalAmount || 0}</Text>
          </View>
        </View>

        {/* TRACKING TIMELINE */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Progress</Text>

          <View style={{ marginTop: 10 }}>
            {steps.map((step, idx) => {
              const isActive = idx <= currentStep;
              const isCurrent = idx === currentStep;

              return (
                <View key={step.key} style={styles.timelineRow}>
                  {/* Left Column: Line & Circle */}
                  <View style={styles.timelineGraphic}>
                    <View
                      style={[
                        styles.timelineCircle,
                        isActive && styles.activeCircle,
                        isCurrent && styles.currentCircle,
                      ]}
                    >
                      <Ionicons
                        name={step.icon}
                        size={18}
                        color={isActive ? '#0F172A' : '#94A3B8'}
                      />
                    </View>
                    {idx < steps.length - 1 && (
                      <View
                        style={[
                          styles.timelineLine,
                          idx < currentStep && styles.activeLine,
                        ]}
                      />
                    )}
                  </View>

                  {/* Right Column: Step Text */}
                  <View style={styles.timelineContent}>
                    <Text style={[styles.stepTitle, isActive && styles.activeStepTitle]}>
                      {step.label}
                    </Text>
                    <Text style={styles.stepDesc}>{step.desc}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* DELIVERY ADDRESS */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="location" size={20} color="#EAB308" />
            <Text style={styles.cardTitleInline}>Delivery Destination</Text>
          </View>
          <Text style={styles.addressTxt}>{order?.deliveryAddress || 'Sector H-11, Islamabad'}</Text>
        </View>

        {/* RIDER & SUPPORT CALL */}
        <View style={styles.riderCard}>
          <View style={styles.riderInfo}>
            <Ionicons name="person-circle-outline" size={42} color="#0F172A" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.riderName}>Delivery Partner</Text>
              <Text style={styles.riderSub}>Assigned & On Standby</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.callBtn}
            onPress={() => Linking.openURL('tel:03001234567')}
            activeOpacity={0.8}
          >
            <Ionicons name="call" size={18} color="#0F172A" />
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* FOOTER BUTTON */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate('MainTabs')}
          activeOpacity={0.88}
        >
          <Text style={styles.homeTxt}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  center: {
    flex: 1,
    justify: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingTxt: {
    marginTop: 10,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'space-between',
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
    justify: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    elevation: 2,
  },
  statusHeaderRow: {
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'center',
  },
  estimatedLbl: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  estimatedVal: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16A34A',
  },
  liveTxt: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16A34A',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  infoMetaRow: {
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'center',
  },
  orderIdTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  totalTxt: {
    fontSize: 15,
    fontWeight: '900',
    color: '#EAB308',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  cardTitleInline: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  addressTxt: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
    lineHeight: 18,
  },
  timelineRow: {
    flexDirection: 'row',
    minHeight: 64,
  },
  timelineGraphic: {
    alignItems: 'center',
    width: 40,
  },
  timelineCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justify: 'center',
    alignItems: 'center',
  },
  activeCircle: {
    backgroundColor: '#EAB308',
  },
  currentCircle: {
    borderWidth: 3,
    borderColor: '#FEF08A',
  },
  timelineLine: {
    width: 3,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  activeLine: {
    backgroundColor: '#EAB308',
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 12,
    paddingTop: 4,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
  },
  activeStepTitle: {
    color: '#0F172A',
    fontWeight: '800',
  },
  stepDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  riderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  riderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riderName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  riderSub: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF08A',
    justify: 'center',
    alignItems: 'center',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
  },
  homeBtn: {
    backgroundColor: '#EAB308',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  homeTxt: {
    fontWeight: '900',
    color: '#0F172A',
    fontSize: 15,
  },
});