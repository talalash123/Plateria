import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import CustomerNavigator from './CustomerNavigator';
import VendorNavigator from './VendorNavigator';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, userToken, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#E63946" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!userToken ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : user?.role === 'vendor' ? (
        <Stack.Screen name="VendorApp" component={VendorNavigator} />
      ) : (
        <Stack.Screen name="CustomerApp" component={CustomerNavigator} />
      )}
    </Stack.Navigator>
  );
}