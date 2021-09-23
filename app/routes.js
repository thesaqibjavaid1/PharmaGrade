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

const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: Theme.secondaryColor,
        inactiveTintColor: Theme.grey,
        style: {
          backgroundColor: Theme.whiteColor,
          height: 70,
          paddingBottom: 10,
        },
      }}>
      <Tab.Screen
        name="Pharmacies"
        component={ListScreen}
        options={{
          tabBarLabel: 'Pharmacies',
          tabBarIcon: ({color, size}) => (
            <Icons name="list" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: 'Explorer',
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
        name="À propos"
        component={AboutScreen}
        options={{
          tabBarLabel: 'À propos',
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
                  width: Theme.width * 0.25,
                  height: 40,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                }}
              />
            ),
            headerStyle: {height: 70},
          }}
          component={TabNavigator}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
