import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Screen Imports
import VendorDashboardScreen from '../screens/VendorDashboardScreen';
import VendorOrdersScreen from '../screens/VendorOrdersScreen';
import VendorAddFoodScreen from '../screens/VendorAddFoodScreen';
import KitchenProfileScreen from '../screens/KitchenProfileScreen';
import VendorProfileScreen from '../screens/VendorProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import FoodDetailsScreen from '../screens/FoodDetailsScreen';
import ChatScreen from '../screens/ChatScreen';
import SubscribedKitchensScreen from '../screens/SubscribedKitchensScreen';
import ReviewScreen from '../screens/ReviewScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Floating Notification Button Component
function FloatingNotificationButton({ navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.floatingNotificationWrapper, { top: (insets?.top || 20) + 8 }]} pointerEvents="box-none">
      <TouchableOpacity
        onPress={() => navigation.navigate('Notifications')}
        style={styles.floatingNotificationBtn}
        activeOpacity={0.8}
      >
        <Ionicons name="notifications-outline" size={22} color="#713F12" />
      </TouchableOpacity>
    </View>
  );
}

function VendorTabs({ navigation }) {
  return (
    <View style={styles.flexOne}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false, // Hide all top header bars
          tabBarActiveTintColor: '#CA8A04',
          tabBarInactiveTintColor: '#8D99AE',
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIcon: ({ focused, color }) => {
            let iconName;

            if (route.name === 'DashboardTab') {
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
            } else if (route.name === 'OrdersTab') {
              iconName = focused ? 'clipboard' : 'clipboard-outline';
            } else if (route.name === 'ProductsTab') {
              iconName = focused ? 'fast-food' : 'fast-food-outline';
            } else if (route.name === 'ProfileTab') {
              iconName = focused ? 'storefront' : 'storefront-outline';
            }

            return <Ionicons name={iconName} size={focused ? 24 : 22} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="DashboardTab"
          component={VendorDashboardScreen}
          options={{
            tabBarLabel: 'Dashboard',
          }}
        />
        <Tab.Screen
          name="OrdersTab"
          component={VendorOrdersScreen}
          options={{
            tabBarLabel: 'Orders',
          }}
        />
        <Tab.Screen
          name="ProductsTab"
          component={VendorAddFoodScreen}
          options={{
            tabBarLabel: 'Products',
          }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={KitchenProfileScreen}
          options={{
            tabBarLabel: 'Profile',
          }}
        />
      </Tab.Navigator>

      {/* Floating Notification Icon on top right */}
      <FloatingNotificationButton navigation={navigation} />
    </View>
  );
}

export default function VendorNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Default: hide headers across all stack screens
      }}
    >
      <Stack.Screen
        name="VendorTabs"
        component={VendorTabs}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
      />
      <Stack.Screen
        name="FoodDetails"
        component={FoodDetailsScreen}
      />
      <Stack.Screen
        name="VendorProfile"
        component={VendorProfileScreen}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
      />
      <Stack.Screen
        name="SubscribedKitchens"
        component={SubscribedKitchensScreen}
      />
      <Stack.Screen
        name="ReviewScreen"
        component={ReviewScreen}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  tabBar: {
    height: 65,
    paddingBottom: 10,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#FEF08A',
    elevation: 8,
    shadowColor: '#854D0E',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  floatingNotificationWrapper: {
    position: 'absolute',
    right: 16,
    zIndex: 999,
  },
  floatingNotificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEF08A',
    elevation: 5,
    shadowColor: '#854D0E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
});