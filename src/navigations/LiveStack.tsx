import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Live from '../screens/Live';
import LiveDetail from '../screens/LiveDetail';

export type LiveStackParamList = {
  Live: undefined;
  LiveDetail: {id: number};
};

const Stack = createNativeStackNavigator<LiveStackParamList>();

function LiveStack() {
  return (
    <Stack.Navigator
      initialRouteName="Live"
      screenOptions={{
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerShown: true,
      }}>
      <Stack.Screen name="Live" component={Live} />
      <Stack.Screen name="LiveDetail" component={LiveDetail} />
    </Stack.Navigator>
  );
}

export default LiveStack;
