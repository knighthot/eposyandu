import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import Logo from '../../../assets/images/logo_posyandu.png';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For storing the token
import Config from 'react-native-config';
import ErrorModal from '../../../components/modals/ErrorModal';
import SuccessModal from '../../../components/modals/SuccessModal ';
import LoadingModal from '../../../components/modals/LoadingModal';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const validatePhoneNumber = (phone) => {
  return phone.length >= 10 && !isNaN(phone);
};

const Index = () => {
  const navigation = useNavigation();
  const [no_hp, setIdentifier] = useState(''); // To hold either phone number or email
  const [kataSandi, setKataSandi] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    setLoadingVisible(true);
    const currentErrors = [];
  
    if (no_hp.trim() === '') {
      currentErrors.push('- Nomor telepon diperlukan');
    } 
    if (kataSandi.trim() === '') {
      currentErrors.push('- Password diperlukan.');
    }
  
    if (currentErrors.length > 0) {
      setErrorMessage(currentErrors.join('\n')); // Combine the errors into a single string
      setLoadingVisible(false);
      setErrorVisible(true); // Show the error modal
      return;
    }
  
    try {
      // Send login request to the backend
      const response = await axios.post(`${Config.API_URL}/pengguna/login`, {
        no_hp: no_hp,
        kata_sandi: kataSandi,
      });

      const token = response.data.token;
      console.log(token);
      const decodedToken = jwtDecode(token);
      const id = decodedToken.id;
  console.log(id);
      // Store the token and user information in AsyncStorage
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userRole', response.data.role);
      await AsyncStorage.setItem('userName', response.data.userName);
      await AsyncStorage.setItem('userNoHp', response.data.userNoHp.toString());
      await AsyncStorage.setItem('userId', id.toString());
    
      setLoadingVisible(false);
      setSuccessVisible(true);
  
      // Navigate based on the user's role
      setTimeout(() => {
        setSuccessVisible(false);
        if (response.data.role === 'kader') {
          navigation.navigate('Kader');
        } else if (response.data.role === 'user') {
          navigation.navigate('Users');
        }
      }, 1000);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Terjadi kesalahan. Silakan coba lagi.');
      setErrorVisible(true);
      setLoadingVisible(false);
    
    }
  }


  // const handleLogin = async () => {

  //  setLoadingVisible(true);
  //    const currentErrors = [];

  //    if (identifier.trim() === '') {
  //      currentErrors.push('- Nomor telepon atau email diperlukan');
  //    } else if (!validateEmail(identifier) && !validatePhoneNumber(identifier)) {
  //      currentErrors.push('- Masukkan nomor telepon atau email yang valid.');
  //    }

  //    if (kataSandi.trim() === '') {
  //      currentErrors.push('- Password diperlukan.');
  //    }

  //    if (currentErrors.length > 0) {
  //     setErrorMessage(currentErrors.join('\n')); // Combine the errors into a single string
  //      setLoadingVisible(false);
  //      setErrorVisible(true); // Show the error modal
  //     return;
  //    }

  //   // // Continue with login logic if no errors
  //    try {
  //      // Hardcoded dummy credentials for testing
  //      const dummyEmail = 'dummyuser@example.com'; // replace with a dummy email
  //      const dummyNoHp = '081277001868'; // replace with a dummy phone number
  //     const dummyPassword = '1'; // replace with a dummy password
  //     const dummyRole = 'kader'; // you can change this to 'users' for testing

  //      // Check credentials
  //     if ((identifier === dummyEmail || identifier === dummyNoHp) && kataSandi === dummyPassword) {
  //      // Store dummy data in AsyncStorage
  //       await AsyncStorage.setItem('token', 'dummyToken');
  //       await AsyncStorage.setItem('userRole', dummyRole);
  //        await AsyncStorage.setItem('userName', 'Dummy User');
  //       await AsyncStorage.setItem('userEmail', dummyEmail);
  
  //      setLoadingVisible(false);
  //        setSuccessVisible(true);
  
  //        // Navigate based on the dummy role
  //        setTimeout(() => {
  //          setSuccessVisible(false);
  //        if (dummyRole === 'kader') {
  //            navigation.navigate('Kader');
  //          } else if (dummyRole === 'user') {
  //            navigation.navigate('Users');
  //          }
  //        }, 1000);
  //      } else {
  //        setErrorMessage('Email/nomor HP atau Password tidak sesuai. Silakan coba lagi.');
  //        setErrorVisible(true);
  //        setLoadingVisible(false);
  //      }
  //    } catch (error) {
  //      setErrorMessage('Terjadi kesalahan. Silakan coba lagi.');
  //      setErrorVisible(true);
  //      setLoadingVisible(false);
  //    }
  // };
  
  return (
    <View style={styles.container}>
      {/* Loading Modal */}
      <LoadingModal visible={loadingVisible} />
      
      {/* Error Modal */}
      <ErrorModal 
        visible={errorVisible} 
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />

      {/* Success Modal */}
      <SuccessModal 
        visible={successVisible} 
        message="Login successful!"
        onClose={() => setSuccessVisible(false)}
      />

      <View style={styles.logoContainer}>
        <Image source={Logo} style={styles.logo} />
        <Text style={styles.TextLogo}>E-Posyandu</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Masuk Ke E-Posyandu</Text>
        <TextInput
          placeholder="No Handphone"
          placeholderTextColor={'#000000'}
          style={styles.input}
          keyboardType='phone-pad'
          value={no_hp}
          onChangeText={setIdentifier}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Kata Sandi"
            placeholderTextColor={'#000000'}
            secureTextEntry={!passwordVisible}
            style={styles.inputPassword}
            value={kataSandi}
            onChangeText={setKataSandi}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <MaterialCommunityIcons
              name={passwordVisible ? 'eye-off' : 'eye'}
              size={24}
              color="#000"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
          <Text style={styles.forget}>Lupa Kata Sandi?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loadingVisible}>
          <Text style={styles.buttonText}>{loadingVisible ? 'Loading...' : 'Masuk'}</Text>
        </TouchableOpacity>

        <Text style={styles.titleRegis}>Belum Punya Akun?, Silakan Tekan Tombol Dibawah</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.buttonText}>Daftar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 90,
  },
  TextLogo: {
    fontSize: 30,
    color: '#404258',
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-ExtraBold',
  },
  logo: {
    width: 150,
    height: 150,
  },
  card: {
    flex: 1,
    padding: 20,
    backgroundColor: '#008EB3',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    shadowColor: '#000',
    shadowOpacity: 0.2,
  },
  title: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#ffffff',
    marginVertical: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#ffffff',
    color: '#404258',
    height: 50,
    fontFamily: 'PlusJakartaSans-Regular',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  inputPassword: {
    flex: 1,
    color: '#404258',
    height: 50,
    paddingHorizontal: 5,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  button: {
    backgroundColor: '#176B87',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '50%',
    alignSelf: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontFamily: 'PlusJakartaSans-ExtraBold',
  },
  titleRegis: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#ffffff',
    marginVertical: 10,
    textAlign: 'center',
  },
  forget: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'right',
  },
});

export default Index;
