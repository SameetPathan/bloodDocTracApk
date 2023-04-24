import React from 'react';
import BloodStockList from './BloodStockList';
import BloodDonarList from './BloodDonarList';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

const Tab = createMaterialBottomTabNavigator();

const SeekerHome = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Blood Bank"  component={BloodStockList}  />
      <Tab.Screen name="Donars"  component={BloodDonarList}  />
    </Tab.Navigator>
  );
}

export default SeekerHome