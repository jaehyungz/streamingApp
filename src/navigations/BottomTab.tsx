import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';

import Board from '../screen/Board';
import MiniGame from '../screen/MiniGame';
import Profile from '../screen/Profile';
import LiveStack from './LiveStack';
import {View} from 'react-native';
import BroadCast from '../screen/BroadCast';
import BroadCastStack from './BroadCastStack';
import MyPageStack from './MyPageStack';

export type BottomTabParamList = {
  LiveStack: undefined;
  MyPageStack: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

function BottomTab() {
  return (
    <Tab.Navigator
      screenOptions={({}) => ({
        // tabBarIcon: ({focused}) => {
        //   let source: string;
        //   if (route.name === '') {
        //     source = 'wifi';
        //   } else if (route.name === 'MiniGame') {
        //     source = 'dribbble';
        //   } else if (route.name === 'BroadCast') {
        //     return (
        //         <View>
        //             <Text>hello</Text>
        //         </View>
        //     //   <Icon
        //     //     name="pluscircle"
        //     //     size={50}
        //     //     color="#f56410"
        //     //     style={{
        //     //       position: 'absolute',
        //     //       top: -10,
        //     //     }}
        //     //   />
        //     );
        //   } else if (route.name === 'Board') {
        //     source = 'file1';
        //   } else {
        //     source = 'user';
        //   }
        //   return (
        //     // <Icon
        //     //   name={source}
        //     //   size={24}
        //     //   color={focused ? '#f56410' : '#ccc'}
        //     // />
        //   );
        // },
        tabBarActiveTintColor: '#f56410',
        tabBarInactiveTintColor: '#ccc',
        tabBarLabelStyle: {fontSize: 12},
        tabBarStyle: {backgroundColor: '#202020'},
        // headerShown: false,
      })}>
      <Tab.Screen
        name="LiveStack"
        component={LiveStack}
        options={{tabBarLabel: '라이브', headerShown: false}}
      />
      <Tab.Screen
        name="MyPageStack"
        component={MyPageStack}
        options={{tabBarLabel: '마이페이지', headerShown: false}}
      />
      {/* <Tab.Screen
        name="MiniGame"
        component={MiniGame}
        options={{tabBarLabel: '미니게임'}}
      />

      <Tab.Screen
        name="BroadCastStack"
        component={BroadCastStack}
        options={{tabBarLabel: '방송', headerShown: false}}
      />

      <Tab.Screen
        name="Board"
        component={Board}
        options={{tabBarLabel: '게시판'}}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{tabBarLabel: '프로필'}}
      /> */}
    </Tab.Navigator>
  );
}

export default BottomTab;
