import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet, Touchable, FlatList } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Header from '../../../../components/Header';
import moment from 'moment';
import 'moment/locale/id'; // Import Indonesian locale
import Config from 'react-native-config';
import axios from 'axios';
import ErrorModal from '../../../../components/modals/ErrorModal';
import ConfirmationModal from '../../../../components/modals/ConfirmationModal';
moment.locale('id'); // Set the locale to Indonesian

const AyahForm = ({ route }) => {
  const navigation = useNavigation();
  const [openAyah, setOpenAyah] = useState(false);
  const [isDatePickerOpenAyah, setDatePickerOpenAyah] = useState(false);
  const [ayahData, setAyahData] = useState({
    nik_ayah: '', nama_ayah: '', jenis_kelamin_ayah: '', tempat_lahir_ayah: '', tanggal_lahir_ayah: null, alamat_ktp_ayah: '', kelurahan_ktp_ayah: '',
    kecamatan_ktp_ayah: '', kota_ktp_ayah: '', provinsi_ktp_ayah: '', alamat_domisili_ayah: '', kelurahan_domisili_ayah: '',
    kecamatan_domisili_ayah: '', kota_domisili_ayah: '', provinsi_domisili_ayah: '', no_hp_ayah: '', email_ayah: '',
    pekerjaan_ayah: '', pendidikan_ayah: ''
  });
  const [pekerjaanOptions, setPekerjaanOptions] = useState([]);
  const [pendidikanOptions, setPendidikanOptions] = useState([]);
  const [openPekerjaanAyah, setOpenPekerjaanAyah] = useState(false);
  const [openPendidikanAyah, setOpenPendidikanAyah] = useState(false);
  const { ibuData } = route.params;
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);

const [errorMessages, setErrorMessages] = useState([]);

  console.log(ibuData);

      
  const [items, setItems] = useState([
    { label: 'Laki-Laki', value: 'l' },
    { label: 'Perempuan', value: 'P' }
  ]);

  useEffect(() => {
    const fetchPekerjaan = async () => {
      try {
        const response = await axios.get(`${Config.API_URL}/pekerjaan/`); // Adjust the API path as needed
        setPekerjaanOptions(response.data); 
        console.log(response.data);
      } catch (error) {
        console.error('Failed to fetch Pekerjaan data:', error);
      }
    };

    const fetchPendidikan = async () => {
      try {
        const response = await axios.get(`${Config.API_URL}/pendidikan/`); // Adjust the API path as needed
        setPendidikanOptions(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Failed to fetch Pendidikan data:', error);
      }
    };

    fetchPekerjaan();
    fetchPendidikan();
  }, []);
  const validateForm = () => {
    let errors = [];
  
    if (!ayahData.nik_ayah) {
      errors.push('- NIK Ayah tidak boleh kosong');
    } else if (!/^\d{16}$/.test(ayahData.nik_ayah)) {
      errors.push('- NIK Ayah harus 16 angka');
    }
  
    if (!ayahData.nama_ayah) {
      errors.push('- Nama Ayah tidak boleh kosong');
    }
  
    if (!ayahData.tempat_lahir_ayah) {
      errors.push('- Tempat Lahir Ayah tidak boleh kosong');
    }
  
    if (!ayahData.tanggal_lahir_ayah) {
      errors.push('- Tanggal Lahir Ayah tidak boleh kosong');
    }
  
    if (!ayahData.pekerjaan_ayah) {
      errors.push('- Pekerjaan Ayah tidak boleh kosong');
    }
  
    if (!ayahData.pendidikan_ayah) {
      errors.push('- Pendidikan Ayah tidak boleh kosong');
    }
  
    if (!ayahData.alamat_ktp_ayah) {
      errors.push('- Alamat KTP Ayah tidak boleh kosong');
    }
  
    if (!ayahData.kelurahan_ktp_ayah) {
      errors.push('- Kelurahan KTP Ayah tidak boleh kosong');
    }
  
    if (!ayahData.kecamatan_ktp_ayah) {
      errors.push('- Kecamatan KTP Ayah tidak boleh kosong');
    }
  
    if (!ayahData.kota_ktp_ayah) {
      errors.push('- Kota KTP Ayah tidak boleh kosong');
    }
  
    if (!ayahData.provinsi_ktp_ayah) {
      errors.push('- Provinsi KTP Ayah tidak boleh kosong');
    }
  
    if (!ayahData.alamat_domisili_ayah) {
      errors.push('- Alamat Domisili Ayah tidak boleh kosong');
    }
  
    if (!ayahData.kelurahan_domisili_ayah) {
      errors.push('- Kelurahan Domisili Ayah tidak boleh kosong');
    }
  
    if (!ayahData.kecamatan_domisili_ayah) {
      errors.push('- Kecamatan Domisili Ayah tidak boleh kosong');
    }
  
    if (!ayahData.kota_domisili_ayah) {
      errors.push('- Kota Domisili Ayah tidak boleh kosong');
    }
  
    if (!ayahData.provinsi_domisili_ayah) {
      errors.push('- Provinsi Domisili Ayah tidak boleh kosong');
    }
  
    if (!ayahData.no_hp_ayah) {
      errors.push('- Nomor HP Ayah tidak boleh kosong');
    } else if (!/^\d{12}$/.test(ayahData.no_hp_ayah)) {
      errors.push('- Nomor HP Ayah harus 12 angka');
    }
  
    if (!ayahData.email_ayah) {
      errors.push('- Email Ayah tidak boleh kosong');
    } else if (!/\S+@\S+\.\S+/.test(ayahData.email_ayah)) {
      errors.push('- Email Ayah tidak valid');
    }
  
    return errors;
  };
  
  const handleSubmit = async () => {
   
    const errors = validateForm();
    if (errors.length > 0) {
      setErrorMessages(errors);
      setIsErrorModalVisible(true); // Show modal for errors
      return;
    }
    setIsConfirmationModalVisible(true); // Show confirmation modal before submission
  };
  
  const confirmSubmit = async () => {
    setIsConfirmationModalVisible(false); // Hide modal when confirmed
  console.log(ayahData, "data ayah");
  console.log(ibuData, "data ibu");

    try {
      const formattedAyahData = {
        ...ayahData,
        tanggal_lahir_ayah: ayahData.tanggal_lahir_ayah ? new Date(ayahData.tanggal_lahir_ayah).toISOString() : null,
        nik_ayah: !isNaN(parseInt(ayahData.nik_ayah, 10)) ? parseInt(ayahData.nik_ayah, 10) : null,
        
      };
  
      const orangTuaResponse = await axios.post(`${Config.API_URL}/orangtua`, {
        no_kk: ibuData.no_kk,
        nik_ibu: ibuData.nik_ibu,
        nama_ibu: ibuData.nama_ibu,
        tempat_lahir_ibu: ibuData.tempat_lahir_ibu,
        tanggal_lahir_ibu: ibuData.tanggal_lahir_ibu,
        alamat_ktp_ibu: ibuData.alamat_ktp_ibu,
        kelurahan_ktp_ibu: ibuData.kelurahan_ktp_ibu,
        kecamatan_ktp_ibu: ibuData.kecamatan_ktp_ibu,
        kota_ktp_ibu: ibuData.kota_ktp_ibu,
        provinsi_ktp_ibu: ibuData.provinsi_ktp_ibu,
        alamat_domisili_ibu: ibuData.alamat_domisili_ibu,
        kelurahan_domisili_ibu: ibuData.kelurahan_domisili_ibu,
        kecamatan_domisili_ibu: ibuData.kecamatan_domisili_ibu,
        kota_domisili_ibu: ibuData.kota_domisili_ibu,
        provinsi_domisili_ibu: ibuData.provinsi_domisili_ibu,
        no_hp_ibu: ibuData.no_hp_ibu,
        email_ibu: ibuData.email_ibu,
        pekerjaan_ibu: ibuData.pekerjaan_ibu,
        pendidikan_ibu: ibuData.pendidikan_ibu,
        nik_ayah: formattedAyahData.nik_ayah,
        nama_ayah: ayahData.nama_ayah,
        tempat_lahir_ayah: ayahData.tempat_lahir_ayah,
        tanggal_lahir_ayah: formattedAyahData.tanggal_lahir_ayah,
        alamat_ktp_ayah: ayahData.alamat_ktp_ayah,
        kelurahan_ktp_ayah: ayahData.kelurahan_ktp_ayah,
        kecamatan_ktp_ayah: ayahData.kecamatan_ktp_ayah,
        kota_ktp_ayah: ayahData.kota_ktp_ayah,
        provinsi_ktp_ayah: ayahData.provinsi_ktp_ayah,
        alamat_domisili_ayah: ayahData.alamat_domisili_ayah,
        kelurahan_domisili_ayah: ayahData.kelurahan_domisili_ayah,
        kecamatan_domisili_ayah: ayahData.kecamatan_domisili_ayah,
        kota_domisili_ayah: ayahData.kota_domisili_ayah,
        provinsi_domisili_ayah: ayahData.provinsi_domisili_ayah,
        no_hp_ayah: ayahData.no_hp_ayah,
        email_ayah: ayahData.email_ayah,
        pekerjaan_ayah: ayahData.pekerjaan_ayah,
        pendidikan_ayah: ayahData.pendidikan_ayah,
      });
  
      console.log(orangTuaResponse);
      navigation.navigate('DataOrtu', { message: 'Data saved locally and sent to backend!' });
  
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to save data or send it to the backend';
      console.error('Error saving data or sending to backend:', errorMessage);
      Alert.alert('Error', errorMessage);
    }
  };
  

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
          keyboardType="numeric"
          maxLength={16}
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
          keyboardType="numeric"
          maxLength={12}
          placeholderTextColor="#000"
          value={ayahData.no_hp_ayah}
          onChangeText={(text) => setAyahData({ ...ayahData, no_hp_ayah: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Email Ayah"
          placeholderTextColor="#000"
          keyboardType="email-address"
          value={ayahData.email_ayah}
          onChangeText={(text) => setAyahData({ ...ayahData, email_ayah: text })}
        />
 <DropDownPicker
          open={openPekerjaanAyah}
          value={ayahData.pekerjaan_ayah}
          items={pekerjaanOptions.map(pekerjaan => ({ label: pekerjaan.nama, value: pekerjaan.id }))}
          setOpen={setOpenPekerjaanAyah}
          setValue={(value) => setAyahData({ ...ayahData, pekerjaan_ayah: value() })}
          placeholder="Pilih Pekerjaan Ayah"
          containerStyle={styles.dropdownContainer}
          style={styles.dropdown}
        />
        
        <DropDownPicker
          open={openPendidikanAyah}
          value={ayahData.pendidikan_ayah}
          items={pendidikanOptions.map(pendidikan => ({ label: pendidikan.nama, value: pendidikan.id }))}
          setOpen={setOpenPendidikanAyah}
          setValue={(value) => setAyahData({ ...ayahData, pendidikan_ayah: value() })}
          placeholder="Pilih Pendidikan Ayah"
          containerStyle={styles.dropdownContainer}
          style={styles.dropdown}
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
      <ErrorModal
        visible={isErrorModalVisible}
        message={errorMessages.join('\n')}
        onClose={() => setIsErrorModalVisible(false)}
      />

<ConfirmationModal
  visible={isConfirmationModalVisible}
  message="Are you sure you want to submit the form?"
  onConfirm={confirmSubmit}
  onCancel={() => setIsConfirmationModalVisible(false)}
/>

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

export default AyahForm;
