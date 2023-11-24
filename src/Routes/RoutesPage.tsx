import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar} from 'react-native';
import {useState} from 'react';
import TestPage2 from '../Component/TestPage2';
import TestPage3 from '../Component/TestPage3';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MarketPage from '../Component/MarketPage';
import Icon from 'react-native-vector-icons/Ionicons';
import {createDrawerNavigator} from '@react-navigation/drawer';
import GraphScreen from '../Component/GraphScreen/GraphScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={MarketPage}
        options={{
          title: 'Market',
          headerStyle: {
            backgroundColor: '#0d1421',
          },
          headerTintColor: 'white',
          animation: 'fade_from_bottom',
        }}
      />
      <Stack.Screen
        name="TestPage2"
        component={TestPage2}
        options={{
          title: 'Welcome 2',
          headerStyle: {
            backgroundColor: '#0d1421',
          },
        }}
      />
      <Stack.Screen
        name="Graph"
        component={GraphScreen}
        options={{
          title: 'Graph',
          headerStyle: {
            backgroundColor: '#0d1421',
          },
          headerTintColor: 'white',
        }}
      />
    </Stack.Navigator>
  );
};

const DrawerkNavigation = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="DrawerHome"
        component={MarketPage}
        options={{
          title: 'Market',
          headerStyle: {
            backgroundColor: '#0d1421',
          },
          headerTintColor: 'white',
        }}
      />
    </Drawer.Navigator>
  );
};

const TabNavigation = () => {
  return (
    <Tab.Navigator screenOptions={{tabBarStyle: {backgroundColor: '#0d1421'}}}>
      <Tab.Screen
        name="tabHome"
        component={StackNavigation}
        options={{
          title: 'Market',
          headerStyle: {
            backgroundColor: '#0d1421',
          },
          headerTintColor: 'white',
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Icon
              name={focused ? 'bar-chart' : 'bar-chart-outline'}
              size={25}
              color="white"
            />
          ),
        }}
      />
      <Tab.Screen
        name="TestPage2"
        component={TestPage2}
        options={{
          title: 'Search',
          headerStyle: {
            backgroundColor: '#0d1421',
          },
          headerTintColor: 'white',
          tabBarIcon: ({focused}) => (
            <Icon
              name={focused ? 'search' : 'search-outline'}
              size={25}
              color="white"
            />
          ),
        }}
      />
      <Tab.Screen
        name="TestPage3"
        component={TestPage3}
        options={{
          title: 'News Paper',
          headerStyle: {
            backgroundColor: '#0d1421',
          },
          headerTintColor: 'white',
          tabBarIcon: ({focused}) => (
            <Icon
              name={focused ? 'newspaper' : 'newspaper-outline'}
              size={25}
              color="white"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default function RoutePage() {
  return <TabNavigation />;
}
