import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import HeaderKader from '../components/HeaderKader';

// Screens
import DashboardLansia from '../screens/Kader/lansia/Dashboard';

import DataLansia from '../screens/Kader/lansia/dataLansia/DataLansia';
import DashboardBalita from '../screens/Kader/balita/Dashboard';
import DataAnak from '../screens/Kader/balita/dataAnak/DataAnak';
import DataOrtu from '../screens/Kader/balita/dataOrangTua/DataOrtu';
import Kegiatan from '../screens/Kader/kegiatan/Kegiatan';
import JadwalPosyandu from '../screens/Kader/kegiatan/JadwalPosyandu';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

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

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="DashboardBalita"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60,
          position: 'absolute',
        },
      }}
    >
      <Tab.Screen
        name="Balita"
        component={DashboardBalita}
        options={{
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
      <Tab.Screen
        name="Lansia"
        component={DashboardLansia}
        options={{
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
    </Tab.Navigator>
  );
};

// Stack Navigator
const StackNavigator = () => {
  return (
    <Stack.Navigator  screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
      <Stack.Screen name="DataAnak" component={DataAnak} />
      <Stack.Screen name="DataOrtu" component={DataOrtu} />
      <Stack.Screen name="DataLansia" component={DataLansia} />

    </Stack.Navigator>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        header: ({ navigation }) => (
          <HeaderKader
            openDrawer={() => navigation.openDrawer()}
          />
        ),
      }}
    >
      <Drawer.Screen name="Home" component={StackNavigator} />
      <Drawer.Screen name="Jadwal Posyandu" component={JadwalPosyandu} />
      <Drawer.Screen name="Kegiatan" component={Kegiatan} />
    </Drawer.Navigator>
  );
};

const Kader = () => {
  return (
    <NavigationContainer independent = {true}>
      <DrawerNavigator />
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
});

export default Kader;
