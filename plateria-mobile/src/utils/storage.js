import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveKitchenId = async (id) => {
  try {
    await AsyncStorage.setItem('@vendor_kitchen_id', id);
  } catch (e) {
    console.error('Failed to save kitchen id', e);
  }
};

export const getKitchenId = async () => {
  try {
    return await AsyncStorage.getItem('@vendor_kitchen_id');
  } catch (e) {
    return null;
  }
};