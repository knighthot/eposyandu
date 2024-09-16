// AppStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import App from '../../App';  // Import the main App component (login/home)
import Login from '../screens/auth/login/Index'; // Import your Login screen

const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator>
      {/* Tambahkan layar login atau home */}
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      {/* Tambahkan layar home atau app utama */}
      <Stack.Screen name="App" component={App} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default AppStack;
