import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DashboardBalita from '../screens/users/DashboardBalita';
import DashboardLansia from '../screens/users/DashboardLansia';
import axios from 'axios';
import Config from 'react-native-config';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabButton = ({ name, label, bgColor, activeColor, inactiveColor, onPress, accessibilityState }) => {
  const focused = accessibilityState.selected;
  const viewRef = React.useRef(null);
  const textViewRef = React.useRef(null);

  React.useEffect(() => {
    if (focused) {
      viewRef.current.animate({ 0: { scale: 0 }, 1: { scale: 1 } });
      textViewRef.current.animate({ 0: { scale: 0 }, 1: { scale: 1 } });
    } else {
      viewRef.current.animate({ 0: { scale: 1 }, 1: { scale: 0 } });
      textViewRef.current.animate({ 0: { scale: 1 }, 1: { scale: 0 } });
    }
  }, [focused]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={1} style={[styles.container, { flex: focused ? 1 : 0.65 }]}>
      <View>
        <Animatable.View
          ref={viewRef}
          style={[StyleSheet.absoluteFillObject, { backgroundColor: bgColor, borderRadius: 16 }]}
        />
        <View style={[styles.btn, { backgroundColor: focused ? null : 'transparent' }]}>
          <MaterialCommunityIcons name={name} color={focused ? activeColor : inactiveColor} size={30} />
          <Animatable.View ref={textViewRef}>
            {focused && (
              <Text style={{ color: activeColor, paddingHorizontal: 8 }}>
                {label}
              </Text>
            )}
          </Animatable.View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Fallback component when no tabs are available
const NoTabsAvailable = () => (
  <View style={styles.fallbackContainer}>
    <Text style={styles.fallbackText}>No tabs available. Please ensure user data is complete.</Text>
  </View>
);

// Modify TabNavigator to accept conditions
const TabNavigator = ({ hasOrangTua, hasWali }) => {
  if (!hasOrangTua && !hasWali) {
    return <NoTabsAvailable />;
  }

  return (
    <Tab.Navigator
      initialRouteName="DashboardBalita"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60,
          position: 'absolute',
        },
      }}
    >
      {hasOrangTua && (
        <Tab.Screen
          name="Balita"
          component={DashboardBalita}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarButton: (props) => (
              <TabButton
                {...props}
                name="home"
                label="Balita"
                bgColor="rgba(0, 0, 255, 0.1)"
                activeColor="#0000FF"
                inactiveColor="grey"
              />
            ),
          }}
        />
      )}
      {hasWali && (
        <Tab.Screen
          name="Lansia"
          component={DashboardLansia}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarButton: (props) => (
              <TabButton
                {...props}
                name="bell"
                label="Lansia"
                bgColor="rgba(0, 255, 0, 0.1)"
                activeColor="#00FF00"
                inactiveColor="grey"
              />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
};

const Users = () => {
  const [hasOrangTua, setHasOrangTua] = useState(false);
  const [hasWali, setHasWali] = useState(false);
  
  
  // Simulating fetching user data and checking fields
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
      console.log(token)
      try {
        if (!userId || !token) {
          console.error('User ID or authentication token is missing');
          return;
        }

        // Make the API request with the token included in the headers
        const response = await axios.get(`${Config.API_URL}/pengguna/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = response;

        setHasOrangTua(userData.orangtua !== null);
        setHasWali(userData.wali !== null);
      } catch (error) {
        console.error('Error fetching user data:', error.massage);
      }
    };

    fetchUserData();
  }, []);
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Dashboard'>
          {() => <TabNavigator hasOrangTua={hasOrangTua} hasWali={hasWali} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    fontSize: 18,
    color: 'grey',
  },
});

export default Users;
