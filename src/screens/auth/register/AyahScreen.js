import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet, Touchable, FlatList } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Header from '../../../components/Header';
import moment from 'moment';
import 'moment/locale/id'; // Import Indonesian locale

moment.locale('id'); // Set the locale to Indonesian

const AyahScreen = ({ route }) => {
  const navigation = useNavigation();
  const [openAyah, setOpenAyah] = useState(false);
  const [isDatePickerOpenAyah, setDatePickerOpenAyah] = useState(false);
  const [ayahData, setAyahData] = useState({
    nik_ayah: '', nama_ayah: '', jenis_kelamin_ayah: '', tempat_lahir_ayah: '', tanggal_lahir_ayah: null, alamat_ktp_ayah: '', kelurahan_ktp_ayah: '',
    kecamatan_ktp_ayah: '', kota_ktp_ayah: '', provinsi_ktp_ayah: '', alamat_domisili_ayah: '', kelurahan_domisili_ayah: '',
    kecamatan_domisili_ayah: '', kota_domisili_ayah: '', provinsi_domisili_ayah: '', no_hp_ayah: '', email_ayah: '',
    pekerjaan_ayah: '', pendidikan_ayah: ''
  });
  const { ibuData, ...userData } = route.params;

  console.log(ibuData);

  console.log(userData,"data");

  const [items, setItems] = useState([
    { label: 'Laki-Laki', value: 'l' },
    { label: 'Perempuan', value: 'P' }
  ]);

  const handleSubmit = async () => {
    try {
      console.log('Saving balitaData locally...');
      // Save balitaData locally
      await AsyncStorage.setItem('balitaData', JSON.stringify(userData));
      console.log('users saved:', userData);

      console.log('Saving ibuData locally...');
      // Save ibuData locally
      await AsyncStorage.setItem('ibuData', JSON.stringify(ibuData));
      console.log('ibuData saved:', ibuData);

      console.log('Saving ayahData locally...');
      // Save ayahData locally

      const formattedAyahData = {
        ...ayahData,
        tanggal_lahir_ayah: ayahData.tanggal_lahir_ayah ? ayahData.tanggal_lahir_ayah.toISOString() : null,
      };
  
      await AsyncStorage.setItem('ayahData', JSON.stringify(formattedAyahData));
      console.log('ayahData saved:', ayahData);

      console.log('All data saved locally successfully');

      // Optionally, navigate to another screen or display a success message
      navigation.navigate('SplashScreen', { message: 'Data saved locally!' });
    } catch (error) {
      console.error('Error saving data locally:', error);
      // Handle errors, such as showing an alert
      Alert.alert('Error', 'Failed to save data locally');
    }
  };

  // Comment out or block the axios API calls
  /*
  const handleSubmit = async () => {
    try {
      // API calls here
    } catch (error) {
      console.error('Error submitting data:', error);
      Alert.alert('Error', error.message);
    }
  };
  */

  const formatDate = (date) => {
    return moment(date).format('LL'); // 'LL' format gives a localized long date
  };


  const renderForm = () => (
    <View>
      <View style={styles.scene}>
        <Text style={styles.title}>Data Diri Ayah</Text>
        <TextInput
          style={styles.input}
          placeholder="NIK Ayah"
          placeholderTextColor="#000"
          value={ayahData.nik_ayah}
          onChangeText={(text) => setAyahData({ ...ayahData, nik_ayah: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Nama Ayah"
          placeholderTextColor="#000"
          value={ayahData.nama_ayah}
          onChangeText={(text) => setAyahData({ ...ayahData, nama_ayah: text })}
        />
        <DropDownPicker
          open={openAyah}
          value={ayahData.jenis_kelamin_ayah}
          items={items}
          setOpen={setOpenAyah}
          onSelectItem={(item) => setAyahData({ ...ayahData, jenis_kelamin_ayah: item.value })}
          setItems={setItems}
          placeholder="Pilih Jenis Kelamin"
          containerStyle={styles.dropdownContainer}
          style={styles.dropdown}
          dropDownStyle={styles.dropdown}
        />

        <TextInput
          style={styles.input}
          placeholder="Tempat Lahir Ayah"
          placeholderTextColor="#000"
          value={ayahData.tempat_lahir_ayah}
          onChangeText={(text) => setAyahData({ ...ayahData, tempat_lahir_ayah: text })}
        />

        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setDatePickerOpenAyah(true)}
        >
          <Text style={styles.datePickerButtonText}>
            {ayahData.tanggal_lahir_ayah ? formatDate(ayahData.tanggal_lahir_ayah) : 'Pilih Tanggal Lahir Ayah'}
          </Text>
        </TouchableOpacity>
        <DatePicker
          modal
          style={styles.datePicker}
          open={isDatePickerOpenAyah}
          date={ayahData.tanggal_lahir_ayah || new Date()}
          mode="date"
          onConfirm={(date) => {
            setDatePickerOpenAyah(false);
            setAyahData({ ...ayahData, tanggal_lahir_ayah: date });
            console.log('Selected date:', date);  // Log the selected date
          }}
          onCancel={() => {
            setDatePickerOpenAyah(false);
            console.log('Date picker cancelled');
          }}
        />

        <TextInput
          style={styles.input}
          placeholder="Alamat KTP Ayah"
          placeholderTextColor="#000"
          value={ayahData.alamat_ktp_ayah}
          onChangeText={(text) => setAyahData({ ...ayahData, alamat_ktp_ayah: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Kelurahan KTP Ayah"
          placeholderTextColor="#000"
          value={ayahData.kelurahan_ktp_ayah}
          onChangeText={(text) => setAyahData({ ...ayahData, kelurahan_ktp_ayah: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Kecamatan KTP Ayah"
          placeholderTextColor="#000"
          value={ayahData.kecamatan_ktp_ayah}
          onChangeText={(text) => setAyahData({ ...ayahData, kecamatan_ktp_ayah: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Kota KTP Ayah"
          placeholderTextColor="#000"
          value={ayahData.kota_ktp_ayah}
          onChangeText={(text) => setAyahData({ ...ayahData, kota_ktp_ayah: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Provinsi KTP Ayah"
          placeholderTextColor="#000"
          value={ayahData.provinsi_ktp_ayah}
          onChangeText={(text) => setAyahData({ ...ayahData, provinsi_ktp_ayah: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Alamat Domisili Ayah"
          placeholderTextColor="#000"
          value={ayahData.alamat_domisili_ayah}
          onChangeText={(text) => setAyahData({ ...ayahData, alamat_domisili_ayah: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Kelurahan Domisili Ayah"
          placeholderTextColor="#000"
          value={ayahData.kelurahan_domisili_ayah}
          onChangeText={(text) => setAyahData({ ...ayahData, kelurahan_domisili_ayah: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Kecamatan Domisili Ayah"
          placeholderTextColor="#000"
          value={ayahData.kecamatan_domisili_ayah}
          onChangeText={(text) => setAyahData({ ...ayahData, kecamatan_domisili_ayah: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Kota Domisili Ayah"
          placeholderTextColor="#000"
          value={ayahData.kota_domisili_ayah}
          onChangeText={(text) => setAyahData({ ...ayahData, kota_domisili_ayah: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Provinsi Domisili Ayah"
          placeholderTextColor="#000"
          value={ayahData.provinsi_domisili_ayah}
          onChangeText={(text) => setAyahData({ ...ayahData, provinsi_domisili_ayah: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="No. HP Ayah"
          placeholderTextColor="#000"
          value={ayahData.no_hp_ayah}
          onChangeText={(text) => setAyahData({ ...ayahData, no_hp_ayah: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Email Ayah"
          placeholderTextColor="#000"
          value={ayahData.email_ayah}
          onChangeText={(text) => setAyahData({ ...ayahData, email_ayah: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Pekerjaan Ayah"
          placeholderTextColor="#000"
          value={ayahData.pekerjaan_ayah}
          onChangeText={(text) => setAyahData({ ...ayahData, pekerjaan_ayah: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Pendidikan Ayah"
          placeholderTextColor="#000"
          value={ayahData.pendidikan_ayah}
          onChangeText={(text) => setAyahData({ ...ayahData, pendidikan_ayah: text })}
        />

        <TouchableOpacity style={styles.btnNext} onPress={handleSubmit}>
          <Text style={styles.btnText}>Selesai</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title="Formulir Pendaftaran" onLeftPress={() => navigation.goBack()} />
      <View style={styles.container}>

        <FlatList
          data={[{ key: 'form' }]}
          renderItem={renderForm}
          keyExtractor={(item) => item.key}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  scene: {
    padding: 20,
    backgroundColor: '#fff',
  },

  container: {
    flex: 1,
    paddingVertical: 20,
  },

  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#008EB3',
  },
  input: {
    backgroundColor: '#DFE4EB',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: '#000',
  },
  dropdownContainer: {
    height: 50,
    marginBottom: 20,
  },
  dropdown: {
    backgroundColor: '#DFE4EB',
    borderColor: '#ccc',
  },
  datePicker: {
    backgroundColor: '#DFE4EB',
    borderColor: '#ccc',
    width: 50,
    height: 50,
  },
  datePickerText: {
    color: '#000',
  },
  datePickerButton: {
    backgroundColor: '#DFE4EB',
    borderColor: '#ccc',
    marginBottom: 10,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
  },
  datePickerButtonText: {
    color: '#000',
    marginLeft: 20,
  },

  btnNext: {
    backgroundColor: '#008EB3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
  },

  buttonContainer: {
    paddingBottom: 30,

  },
});

export default AyahScreen;
