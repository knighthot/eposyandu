import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Config from 'react-native-config'; // Assume you have API URL in env

// Axios instance
const api = axios.create({
  baseURL: `${Config.API_URL}`,
});

// Interceptor to check for token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const navigation = useNavigation();
    
    if (error.response?.status === 401) {
      // Token expired, remove from AsyncStorage
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userRole');
      await AsyncStorage.removeItem('userName');
      await AsyncStorage.removeItem('userEmail');
      
      // Navigate to Login screen
      navigation.navigate('Login');
    }

    return Promise.reject(error);
  }
);

export default api;
