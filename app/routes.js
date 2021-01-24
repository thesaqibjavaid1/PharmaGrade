import React from 'react';
import {Image} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LoadingScreen from './screens/loading';
import MapScreen from './screens/map';
import ListScreen from './screens/list';
import AboutScreen from './screens/about';
import Icons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Theme from './theme';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
Icons.loadFont();
Foundation.loadFont();
MaterialCommunityIcons.loadFont();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: Theme.secondaryColor,
        inactiveTintColor: 'white',
        style: {backgroundColor: Theme.mainColor},
      }}>
      <Tab.Screen
        name="Pharmacies"
        component={ListScreen}
        options={{
          tabBarLabel: 'Pharmacies',
          tabBarIcon: ({color, size}) => (
            <Icons name="ios-list" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: 'Map',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="google-maps"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="About Us"
        component={AboutScreen}
        options={{
          tabBarLabel: 'About',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="information-variant"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="loading"
          options={{headerShown: false}}
          component={LoadingScreen}
        />
        <Stack.Screen
          name="tab"
          options={{
            headerTitle: () => (
              <Image
                source={require('./resources/logo.png')}
                style={{
                  width: Theme.width * 0.3,
                  height: 50,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                }}
              />
            ),
            headerStyle: {height: 100},
          }}
          component={TabNavigator}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
