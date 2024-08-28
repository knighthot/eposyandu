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

const WaliScreen = ({ route }) => {
  const navigation = useNavigation();
  const [openWali, setOpenWali] = useState(false);
  const [isDatePickerOpenWali, setDatePickerOpenWali] = useState(false);
  const [waliData, setWaliData] = useState({
    nik_wali: '', nama_wali: '', jenis_kelamin_wali: '', tempat_lahir_wali: '', tanggal_lahir_wali: null, alamat_ktp_wali: '', kelurahan_ktp_wali: '',
    kecamatan_ktp_wali: '', kota_ktp_wali: '', provinsi_ktp_wali: '', alamat_domisili_wali: '', kelurahan_domisili_wali: '',
    kecamatan_domisili_wali: '', kota_domisili_wali: '', provinsi_domisili_wali: '', no_hp_wali: '', email_wali: '',
    pekerjaan_wali: '', pendidikan_wali: ''
  });
  const { userData, ...lansiaData } = route.params;


  console.log(userData,"data");

  const [items, setItems] = useState([
    { label: 'Laki-Laki', value: 'l' },
    { label: 'Perempuan', value: 'P' }
  ]);

  const handleSubmit = async () => {
    try {
      console.log('Saving userData locally...');
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      console.log('users saved:', userData);
      console.log('Saving userData locally...');
    
      await AsyncStorage.setItem('lansiaData', JSON.stringify(lansiaData));
      console.log('lansiaData saved:', waliData);
      console.log('All data saved locally successfully');

      await AsyncStorage.setItem('waliData', JSON.stringify(formattedWaliData));
      console.log('waliData saved:', waliData);
      console.log('All data saved locally successfully');

      // Optionally, navigate to another screen or display a success message
      navigation.navigate('SplashScreen', { message: 'Data saved locally!' });
    } catch (error) {
      console.error('Error saving data locally:', error);
      // Handle errors, such as showing an alert
      Alert.alert('Error', 'Failed to save data locally');
    }
  };

  const formattedWaliData = {
    ...waliData,
    tanggal_lahir_lansia: waliData.tanggal_lahir_wali ? waliData.tanggal_lahir_wali.toISOString() : null,
  };

  const formatDate = (date) => {
    return moment(date).format('LL'); // 'LL' format gives a localized long date
  };

  const renderForm = () => (
    <View>
      <View style={styles.scene}>
        <Text style={styles.title}>Data Diri Wali</Text>
        <TextInput
          style={styles.input}
          placeholder="NIK Wali"
          placeholderTextColor="#000"
          value={waliData.nik_wali}
          onChangeText={(text) => setWaliData({ ...waliData, nik_wali: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Nama Wali"
          placeholderTextColor="#000"
          value={waliData.nama_wali}
          onChangeText={(text) => setWaliData({ ...waliData, nama_wali: text })}
        />
        <DropDownPicker
          open={openWali}
          value={waliData.jenis_kelamin_wali}
          items={items}
          setOpen={setOpenWali}
          onSelectItem={(item) => setWaliData({ ...waliData, jenis_kelamin_wali: item.value })}
          setItems={setItems}
          placeholder="Pilih Jenis Kelamin"
          containerStyle={styles.dropdownContainer}
          style={styles.dropdown}
          dropDownStyle={styles.dropdown}
        />

        <TextInput
          style={styles.input}
          placeholder="Tempat Lahir Wali"
          placeholderTextColor="#000"
          value={waliData.tempat_lahir_wali}
          onChangeText={(text) => setWaliData({ ...waliData, tempat_lahir_wali: text })}
        />

        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setDatePickerOpenWali(true)}
        >
          <Text style={styles.datePickerButtonText}>
            {waliData.tanggal_lahir_wali ? formatDate(waliData.tanggal_lahir_wali) : 'Pilih Tanggal Lahir Wali'}
          </Text>
        </TouchableOpacity>
        <DatePicker
          modal
          style={styles.datePicker}
          open={isDatePickerOpenWali}
          date={waliData.tanggal_lahir_wali || new Date()}
          mode="date"
          onConfirm={(date) => {
            setDatePickerOpenWali(false);
            setWaliData({ ...waliData, tanggal_lahir_wali: date });
            console.log('Selected date:', date);  // Log the selected date
          }}
          onCancel={() => {
            setDatePickerOpenWali(false);
            console.log('Date picker cancelled');
          }}
        />

        <TextInput
          style={styles.input}
          placeholder="Alamat KTP Wali"
          placeholderTextColor="#000"
          value={waliData.alamat_ktp_wali}
          onChangeText={(text) => setWaliData({ ...waliData, alamat_ktp_wali: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Kelurahan KTP Wali"
          placeholderTextColor="#000"
          value={waliData.kelurahan_ktp_wali}
          onChangeText={(text) => setWaliData({ ...waliData, kelurahan_ktp_wali: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Kecamatan KTP Wali"
          placeholderTextColor="#000"
          value={waliData.kecamatan_ktp_wali}
          onChangeText={(text) => setWaliData({ ...waliData, kecamatan_ktp_wali: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Kota KTP Wali"
          placeholderTextColor="#000"
          value={waliData.kota_ktp_wali}
          onChangeText={(text) => setWaliData({ ...waliData, kota_ktp_wali: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Provinsi KTP Wali"
          placeholderTextColor="#000"
          value={waliData.provinsi_ktp_wali}
          onChangeText={(text) => setWaliData({ ...waliData, provinsi_ktp_wali: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Alamat Domisili Wali"
          placeholderTextColor="#000"
          value={waliData.alamat_domisili_wali}
          onChangeText={(text) => setWaliData({ ...waliData, alamat_domisili_wali: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Kelurahan Domisili Wali"
          placeholderTextColor="#000"
          value={waliData.kelurahan_domisili_wali}
          onChangeText={(text) => setWaliData({ ...waliData, kelurahan_domisili_wali: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Kecamatan Domisili Wali"
          placeholderTextColor="#000"
          value={waliData.kecamatan_domisili_wali}
          onChangeText={(text) => setWaliData({ ...waliData, kecamatan_domisili_wali: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Kota Domisili Wali"
          placeholderTextColor="#000"
          value={waliData.kota_domisili_wali}
          onChangeText={(text) => setWaliData({ ...waliData, kota_domisili_wali: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Provinsi Domisili Wali"
          placeholderTextColor="#000"
          value={waliData.provinsi_domisili_wali}
          onChangeText={(text) => setWaliData({ ...waliData, provinsi_domisili_wali: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="No. HP Wali"
          placeholderTextColor="#000"
          value={waliData.no_hp_wali}
          onChangeText={(text) => setWaliData({ ...waliData, no_hp_wali: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Email Wali"
          placeholderTextColor="#000"
          value={waliData.email_wali}
          onChangeText={(text) => setWaliData({ ...waliData, email_wali: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Pekerjaan Wali"
          placeholderTextColor="#000"
          value={waliData.pekerjaan_wali}
          onChangeText={(text) => setWaliData({ ...waliData, pekerjaan_wali: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Pendidikan Wali"
          placeholderTextColor="#000"
          value={waliData.pendidikan_wali}
          onChangeText={(text) => setWaliData({ ...waliData, pendidikan_wali: text })}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.btnNext} onPress={handleSubmit}>
            <Text style={styles.btnText}>Selesai</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title="Formulir Pendaftaran Lansia" onLeftPress={() => navigation.goBack()} />
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
    marginBottom: 10,
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
  },
  buttonContainer: {
    paddingBottom: 30,
  },
});

export default WaliScreen;

