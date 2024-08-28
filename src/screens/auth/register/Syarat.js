import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import Logo from '../../../assets/images/logo_posyandu.png';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
const Syarat = () => {
  const [foto_kk, setFotoKK] = useState(null);
  const [no_ktp, setNoKtp] = useState('');
  const [no_kk, setNoKk] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { no_hp, nama, kata_sandi } = route.params;

  const handleNextBalita = () => {
    // Pass all data to the FormulirScreen
    navigation.navigate('IbuScreen', {
      no_hp,
      nama,
      kata_sandi,
      no_ktp: no_ktp,
      no_kk: no_kk,
      foto_kk: foto_kk,
    });
  };

  const handleNextLansia = () => {
    // Pass all data to the FormulirScreen
    navigation.navigate('LansiaScreen', {
      no_hp,
      nama,
      kata_sandi,
      no_ktp: no_ktp,
      no_kk: no_kk,
      foto_kk: foto_kk,
    });
  };
  const handleImagePick = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 1920, // Full HD width
        maxHeight: 1080, // Full HD height
        quality: 1,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.assets && response.assets[0]) {
          const imageUri = response.assets[0].uri;
          const fileSize = response.assets[0].fileSize;
          const fileType = response.assets[0].type;

          if (fileSize > 2 * 1024 * 1024) { // 2MB file size limit
            Alert.alert('Ukuran file terlalu besar', 'Ukuran file maksimal adalah 2MB');
          } else if (!fileType.startsWith('image/')) {
            Alert.alert('Format file tidak didukung', 'Hanya file gambar yang diizinkan');
          } else {
            setFotoKK(imageUri);
          }
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.Image_container}>
        <Image source={Logo} style={{ width: 100, height: 100 }} />
      </View>
      <Text style={styles.Text_container}>Upload Persyaratan</Text>
      <Text style={styles.SubText_container}>
        Sebelum Melakukan Pendaftar Silakan Mengisi Form Persyaratan Dibawah Ini
      </Text>

      <View style={styles.Input_container}>
        <TextInput
          placeholder="Masukan No Ktp Peserta/Wali"
          placeholderTextColor={'#000000'}
          style={styles.input}
          keyboardType="numeric"
          value={no_ktp}
          onChangeText={setNoKtp}
          maxLength={16}
        />
        <TextInput
          placeholder="Masukan No Kartu Keluarga"
          placeholderTextColor={'#000000'}
          style={styles.input}
          onChangeText={setNoKk}
          keyboardType="numeric"
          value={no_kk}
          maxLength={16}
        />

        <View style={styles.cardImage}>
          <Text style={styles.CardText}>Upload Kartu Keluarga</Text>
          <Text style={styles.SubCartText}>Upload Foto Kartu Keluarga</Text>
          <TouchableOpacity style={styles.CardImageDisplay} onPress={handleImagePick}>
            {foto_kk ? (
              <Image source={{ uri: foto_kk }} style={styles.imagePreview} />
            ) : (
              <>
                <Icon name="image-area" size={50} color="#DFE4EB" />
                <Text style={styles.Upload}>Upload</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flexDirection:'row' , justifyContent:'space-between'}}> 
      <View style={styles.btnContainer}>
        <TouchableOpacity onPress={handleNextBalita} style={styles.btnUpload}>
          <Text style={styles.btnText}>Untuk Bayi</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity onPress={handleNextLansia} style={styles.btnUpload}>
          <Text style={styles.btnText}>Untuk Lansia</Text>
        </TouchableOpacity>
      </View>
      </View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#008EB3',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    marginTop: 10,
    padding: 20,
  },

  Image_container: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 80,
    padding: 10,
  },

  Text_container: {
    color: 'white',
    fontSize: 20,
    marginTop: 10,
    fontFamily: 'PlusJakartaSans-ExtraBold',
  },

  SubText_container: {
    color: 'white',
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
    width: '80%',
    fontFamily: 'PlusJakartaSans-Medium',
  },

  Input_container: {
    width: '100%',
    marginTop: 20,
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

  cardImage: {
    width: '100%',
    height: 300,
    borderRadius: 20,
    padding: 20,
    backgroundColor: 'white',
  },

  CardText: {
    color: 'black',
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },

  SubCartText: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Medium',
  },

  CardImageDisplay: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#DFE4EB',
    marginTop: 20,
    borderStyle: 'dashed',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },

  Upload: {
    color: '#DFE4EB',
    backgroundColor: '#176B87',
    padding: 5,
    fontSize: 12,
    borderRadius: 20,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },

  btnContainer: {
    width: '50%',
    alignItems: 'center',
  },

  btnUpload: {
    width: '80%',
    height: 50,
    backgroundColor: '#176B87',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  btnText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
});

export default Syarat;
