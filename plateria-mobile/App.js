import React from 'react';
import { TouchableOpacity, Pressable, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';

// Safe hitSlop Converter (Array -> Object)
const safeHitSlop = (hitSlop) => {
  if (Array.isArray(hitSlop)) {
    const [top = 0, right = 0, bottom = 0, left = 0] = hitSlop;
    return { top, right, bottom, left };
  }
  return hitSlop;
};

// Global Patching for React Native Core Components
const patchComponent = (Component) => {
  if (Component && Component.render) {
    const originalRender = Component.render;
    Component.render = function (props, ref) {
      if (props?.hitSlop) {
        props = { ...props, hitSlop: safeHitSlop(props.hitSlop) };
      }
      return originalRender.call(this, props, ref);
    };
  }
};

// Apply patches to touchable elements
patchComponent(TouchableOpacity);
patchComponent(Pressable);

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <AuthProvider>
          <CartProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </CartProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});