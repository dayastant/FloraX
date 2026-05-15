import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GardenManagementScreen from './gardenManagement';

const Stack = createNativeStackNavigator();

export default function GardenManagementNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="GardenManagement"
        component={GardenManagementScreen}
      />
    </Stack.Navigator>
  );
}
