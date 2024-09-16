import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from 'react-native-config';
import { useNavigation } from '@react-navigation/native';

const EditUserAccount = () => {
  const [userId, setUserId] = useState('');
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [no_hp, setNoHp] = useState('');
  const [no_kk, setNoKk] = useState('');
  const [no_ktp, setNoKtp] = useState('');
  const [foto_kk, setFotoKk] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigation = useNavigation();

  useEffect(() => {
    const getUserData = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
      setUserId(storedUserId);
      
      try {
        const response = await axios.get(`${Config.API_URL}/pengguna/${storedUserId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userData = response.data;
        setNama(userData.nama);
        setEmail(userData.email);
        setNoHp(userData.no_hp);
        setNoKk(userData.no_kk);
        setNoKtp(userData.no_ktp);
        setFotoKk(userData.foto_kk);
      } catch (error) {
        Alert.alert('Error', 'Failed to load user data');
      }
    };
    getUserData();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');

    try {
      await axios.put(
        `${Config.API_URL}/pengguna/${userId}`,
        { nama, email, no_hp, no_kk, no_ktp, foto_kk },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Success', 'User account updated successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update user account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Nama</Text>
        <TextInput
          value={nama}
          onChangeText={setNama}
          style={styles.input}
          placeholderTextColor={'black'}
          placeholder="Masukan Nama"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          placeholderTextColor={'black'}
          placeholder="Masukan Email"
        />

        <Text style={styles.label}>No HP</Text>
        <TextInput
          value={no_hp.toString()}
          onChangeText={setNoHp}
          maxLength={12}
          style={styles.input}
          keyboardType="phone-pad"
          placeholder="Masukan Nomor Hp"
          placeholderTextColor={'black'}
        />

        <Text style={styles.label}>No KK</Text>
        <TextInput
          value={no_kk.toString()}
          onChangeText={setNoKk}
          maxLength={16}
          placeholderTextColor={'black'}
          style={styles.input}
          placeholder="Masukan No kk"
        />

        <Text style={styles.label}>No KTP</Text>
        <TextInput
          value={no_ktp.toString()}
          onChangeText={setNoKtp}
          maxLength={16}
          placeholderTextColor={'black'}
          style={styles.input}
          placeholder="Masukan Nomor Handphone"
        />

      
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save Changes</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f4f4f4',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    color:'black',
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditUserAccount;
