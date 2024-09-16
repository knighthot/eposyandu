import { View } from 'react-native';
import React, { useEffect } from 'react';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode'; // Pastikan jwt-decode terinstall

const Splashscreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkTokenAndNavigate = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          // Decode token untuk mendapatkan role
          const decodedToken = jwtDecode(token);
          const role = decodedToken.role;

          // Arahkan sesuai role
          if (role === 'kader') {
            navigation.replace('Kader');
          } else if (role === 'user') {
            navigation.replace('Users');
          }
        } else {
          // Jika tidak ada token, arahkan ke Home (halaman login)
          navigation.replace('Home');
        }
      } catch (error) {
        console.error('Error checking token:', error);
        navigation.replace('Home'); // Jika terjadi error, arahkan ke Home
      }
    };

    // Set delay untuk menampilkan splash screen
    const timeout = setTimeout(() => {
      checkTokenAndNavigate();
    }, 2000);

    return () => clearTimeout(timeout); // Bersihkan timeout jika component di-unmount
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <LottieView 
        source={require('../../assets/lottie/Logo.json')} 
        autoPlay 
        loop={false} 
        style={{ width: 350, height: 350 }} 
      />
    </View>
  );
}

export default Splashscreen;
