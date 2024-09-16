import React, { useEffect, useRef,lazy, Suspense } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';

import splashscreen from './src/screens/splashscreen/Splashscreen';
import Homescreen from './src/screens/Homescreen';

//auth screen
import Login from './src/screens/auth/login/Index';
import Register from './src/screens/auth/register/Index';
import Syarat from './src/screens/auth/register/Syarat';



import IbuScreen from './src/screens/auth/register/IbuScreen';
import AyahScreen from './src/screens/auth/register/AyahScreen';
import LansiaScreen from './src/screens/auth/register/LansiaScreen';
import WaliScreen from './src/screens/auth/register/WaliScreen';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Kader = lazy(() => import('./src/routes/Kader'));
const Users = lazy(() => import('./src/routes/Users'));


const TabButton = ({ name, label, bgColor, activeColor, inactiveColor, onPress, accessibilityState, navigation }) => {
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);
  const textViewRef = useRef(null);

  useEffect(() => {
    if (focused) {
      viewRef.current.animate({ 0: { scale: 0 }, 1: { scale: 1 } });
      textViewRef.current.animate({ 0: { scale: 0 }, 1: { scale: 1 } });
    } else {
      viewRef.current.animate({ 0: { scale: 1 }, 1: { scale: 0 } });
      textViewRef.current.animate({ 0: { scale: 1 }, 1: { scale: 0 } });
    }
  }, [focused]);
 
  navigation = useNavigation();
  const handlePress = () => {
    if (name === 'login') {
      navigation.navigate('Login');
    } else {
      onPress();
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={1} style={[styles.container, { flex: focused ? 1 : 0.65 }]}>
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
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 60,
            position: 'absolute',
          },
        }}
      >
        <Tab.Screen
          name="Homescreen"
          component={Homescreen}
          options={{
            tabBarShowLabel: false,
            tabBarButton: (props) => (
              <TabButton
                {...props}
                name="home"
                label="Home"
                bgColor="rgba(0, 0, 255, 0.1)"
                activeColor="#0000FF"
                inactiveColor="grey"
              />
            ),
          }}
        />
        <Tab.Screen
          name="LoginScreen"
          component={Homescreen}
          options={{
            tabBarShowLabel: false,
            tabBarButton: (props) => (
              <TabButton
                {...props}
                name="login"
                label="Login"
                bgColor="rgba(0, 255, 0, 0.1)"
                activeColor="#00FF00"
                inactiveColor="grey"
              
              />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const App = () => {
  return (
    <NavigationContainer independent={true} >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
     
    <Stack.Screen name="SplashScreen" component={splashscreen} />
        <Stack.Screen name="Home" component={TabNavigator} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Syarat" component={Syarat} />
        <Stack.Screen name="IbuScreen" component={IbuScreen} />
        <Stack.Screen name="AyahScreen" component={AyahScreen} />
        <Stack.Screen name="LansiaScreen" component={LansiaScreen} />
        <Stack.Screen name="WaliScreen" component={WaliScreen} />
        <Stack.Screen name="Kader">
          {() => (
            <Suspense fallback={<Text>Loading...</Text>}>
              <Kader />
            </Suspense>
          )}
        </Stack.Screen>
        <Stack.Screen name="Users">
          {() => (
            <Suspense fallback={<Text>Loading...</Text>}>
              <Users />
            </Suspense>
          )}
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
});

export default App;
