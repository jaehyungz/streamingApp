import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import BottomTab from './BottomTab';

export type RootStackParamList = {
  BottomTab: undefined;
  LiveDetail: {id: string};
};
const Stack = createNativeStackNavigator<RootStackParamList>();

function Navigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          headerShadowVisible: false,
          headerTitleAlign: 'center',
        }}>
        {/* <Stack.Group> */}
        <Stack.Screen name="BottomTab" component={BottomTab} />
        {/* </Stack.Group> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigator;
