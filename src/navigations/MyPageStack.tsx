import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import MyPage from '../screens/MyPage';

export type MyPageStackParamList = {
  MyPage: undefined;
};

const Stack = createNativeStackNavigator<MyPageStackParamList>();

function LiveStack() {
  return (
    <Stack.Navigator
      initialRouteName="MyPage"
      screenOptions={{
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerShown: true,
      }}>
      <Stack.Screen name="MyPage" component={MyPage} />
    </Stack.Navigator>
  );
}

export default LiveStack;
