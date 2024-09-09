import React, { useState , useEffect} from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet, Touchable, FlatList } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';
import Header from '../../../components/Header';
import moment from 'moment';
import 'moment/locale/id'; // Import Indonesian locale
import Config from 'react-native-config';

moment.locale('id'); // Set the locale to Indonesian

console.log('API_URL:', Config.API_URL);

const IbuScreen = ({ route }) => {
  const navigation = useNavigation();
  const userData = route.params || {};
  const [openIbu, setOpenIbu] = useState(false);
  const [isDatePickerOpenIbu, setDatePickerOpenIbu] = useState(false);
  const [pekerjaanOptions,setPekerjaanOptions] = useState(false);
  const [pendidikanOptions,setPendidikanOptions] = useState(false);
  
  const [ibuData, setIbuData] = useState({
    nik_ibu: '', nama_ibu: '', jenis_kelamin_ibu: '', tempat_lahir_ibu: '', tanggal_lahir_ibu: null,
    alamat_ktp_ibu: '', kelurahan_ktp_ibu: '', kecamatan_ktp_ibu: '', kota_ktp_ibu: '', provinsi_ktp_ibu: '',
    alamat_domisili_ibu: '', kelurahan_domisili_ibu: '', kecamatan_domisili_ibu: '', kota_domisili_ibu: '', provinsi_domisili_ibu: '',
    no_hp_ibu: '', email_ibu: '', pekerjaan_ibu: null, pendidikan_ibu: null
  });

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


  const [items, setItems] = useState([
    { label: 'Laki-Laki', value: 'l' },
    { label: 'Perempuan', value: 'P' }
  ]);

  const handleNext = () => {
    const formattedIbuData = {
      ...ibuData,
      tanggal_lahir_ibu: ibuData.tanggal_lahir_ibu ? ibuData.tanggal_lahir_ibu.toISOString() : null,
    };

    navigation.navigate('AyahScreen', { ibuData: formattedIbuData, userData });
  
  };

  const formatDate = (date) => {
    return moment(date).format('LL'); // 'LL' format gives a localized long date
  };

  const validateForm = () => {
    let errors = {};

    if (!ibuData.nik_ibu) {
      errors.nik_ibu = 'NIK Ibu tidak boleh kosong';
    } else if (!/^\d{16}$/.test(formData.nik_ibu)) {
      errors.nik_ibu = 'NIK Ibu harus 16 angka';
    }
    if (!ibuData.nama_ibu) {
      errors.nama_ibu = 'Nama Ibu tidak boleh kosong';
    }
    if (!ibuData.tempat_lahir_ibu) {
      errors.tempat_lahir_ibu = 'Tempat Lahir Ibu tidak boleh kosong';
    }
    if (!ibuData.tanggal_lahir_ibu) {
      errors.tanggal_lahir_ibu = 'Tanggal Lahir tidak boleh kosong';
    }
    if (!ibuData.pekerjaan_ibu) {
      errors.pekerjaan_ibu = 'Pekerjaan Ibu tidak boleh kosong';
    }
    if (!ibuData.pendidikan_ibu) {
      errors.pendidikan_ibu = 'Pendidikan Ibu tidak boleh kosong';
    }
    if (!ibuData.alamat_ktp_ibu) {
      errors.alamat_ktp_ibu = 'Alamat KTP Ibu tidak boleh kosong';
    }
    if (!ibuData.kelurahan_ktp_ibu) {
      errors.kelurahan_ktp_ibu = 'Kelurahan KTP Ibu tidak boleh kosong';
    }
    if (!ibuData.kecamatan_ktp_ibu) {
      errors.kecamatan_ktp_ibu = 'Kecamatan KTP Ibu tidak boleh kosong';
    }
    if (!ibuData.kota_ktp_ibu) {
      errors.kota_ktp_ibu = 'Kota KTP Ibu tidak boleh kosong';
    }
    if (!ibuData.provinsi_ktp_ibu) {
      errors.provinsi_ktp_ibu = 'Provinsi KTP Ibu tidak boleh kosong';
    }
    if (!ibuData.alamat_domisili_ibu) {
      errors.alamat_domisili_ibu = 'Alamat Domisili Ibu tidak boleh kosong';
    }
    if (!ibuData.kelurahan_domisili_ibu) {
      errors.kelurahan_domisili_ibu = 'Kelurahan Domisili Ibu tidak boleh kosong';
    }
    if (!ibuData.kecamatan_domisili_ibu) {
      errors.kecamatan_domisili_ibu = 'Kecamatan Domisili Ibu tidak boleh kosong';
    }
    if (!ibuData.kota_domisili_ibu) {
      errors.kota_domisili_ibu = 'Kota Domisili Ibu tidak boleh kosong';
    }
    if (!ibuData.provinsi_domisili_ibu) {
      errors.provinsi_domisili_ibu = 'Provinsi Domisili Ibu tidak boleh kosong';
    }
    if (!ibuData.no_hp_ibu) {
      errors.no_hp_ibu = 'Nomor HP Ibu tidak boleh kosong';
    }else if (!/^\d{12}$/.test(ibuData.no_hp_ibu)) {
      errors.no_hp_ibu = 'Nomor HP Ibu harus 12 angka';
    }

    if (!ibuData.email_ibu) {
      errors.email_ibu = 'Email Ibu tidak boleh kosong';
    }else if (!/\S+@\S+\.\S+/.test(formData.email_ibu)) {
      errors.email_ibu = 'Email Ibu tidak valid';
    }
    
    if (!pekerjaan_ibu) {
      errors.pekerjaan_ibu = 'Pekerjaan Ibu tidak boleh kosong';
    }

    if (!pendidikan_ibu) {
      errors.pendidikan_ibu = 'Pendidikan Ibu tidak boleh kosong';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };



  const renderForm = () => (
    <View>
      <View style={styles.scene}>
        <Text style={styles.title}>Data Diri Ibu {Config.API_BASE_URL}</Text>
        <TextInput
          style={styles.input}
          placeholder="NIK Ibu"
          placeholderTextColor="#000"
          value={ibuData.nik_ibu}
          onChangeText={(text) => setIbuData({ ...ibuData, nik_ibu: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Nama Ibu"
          placeholderTextColor="#000"
          value={ibuData.nama_ibu}
          onChangeText={(text) => setIbuData({ ...ibuData, nama_ibu: text })}
        />
        <DropDownPicker
          open={openIbu}
          value={ibuData.jenis_kelamin_ibu}
          items={items}
          setOpen={setOpenIbu}
          onSelectItem={(item) => setIbuData({ ...ibuData, jenis_kelamin_ibu: item.value })}
          setItems={setItems}
          placeholder="Pilih Jenis Kelamin"
          containerStyle={styles.dropdownContainer}
          style={styles.dropdown}
        />

        <TextInput
          style={styles.input}
          placeholder="Tempat Lahir Ibu"
          placeholderTextColor="#000"
          value={ibuData.tempat_lahir_ibu}
          onChangeText={(text) => setIbuData({ ...ibuData, tempat_lahir_ibu: text })}
        />

        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setDatePickerOpenIbu(true)}
        >
          <Text style={styles.datePickerButtonText}>
            {ibuData.tanggal_lahir_ibu ? formatDate(ibuData.tanggal_lahir_ibu) : 'Pilih Tanggal Lahir Ibu'}
          </Text>
        </TouchableOpacity>
        <DatePicker
          modal
          style={styles.datePicker}
          open={isDatePickerOpenIbu}
          date={ibuData.tanggal_lahir_ibu || new Date()}
          mode="date"
          onConfirm={(date) => {
            setDatePickerOpenIbu(false);
            setIbuData({ ...ibuData, tanggal_lahir_ibu: date });
            console.log('Selected date:', date);  // Log the selected date
          }}
          onCancel={() => {
            setDatePickerOpenIbu(false);
            console.log('Date picker cancelled');
          }}
        />

        <TextInput
          style={styles.input}
          placeholder="Alamat KTP Ibu"
          placeholderTextColor="#000"
          value={ibuData.alamat_ktp_ibu}
          onChangeText={(text) => setIbuData({ ...ibuData, alamat_ktp_ibu: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Kelurahan KTP Ibu"
          placeholderTextColor="#000"
          value={ibuData.kelurahan_ktp_ibu}
          onChangeText={(text) => setIbuData({ ...ibuData, kelurahan_ktp_ibu: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Kecamatan KTP Ibu"
          placeholderTextColor="#000"
          value={ibuData.kecamatan_ktp_ibu}
          onChangeText={(text) => setIbuData({ ...ibuData, kecamatan_ktp_ibu: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Kota KTP Ibu"
          placeholderTextColor="#000"
          value={ibuData.kota_ktp_ibu}
          onChangeText={(text) => setIbuData({ ...ibuData, kota_ktp_ibu: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Provinsi KTP Ibu"
          placeholderTextColor="#000"
          value={ibuData.provinsi_ktp_ibu}
          onChangeText={(text) => setIbuData({ ...ibuData, provinsi_ktp_ibu: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Alamat Domisili Ibu"
          placeholderTextColor="#000"
          value={ibuData.alamat_domisili_ibu}
          onChangeText={(text) => setIbuData({ ...ibuData, alamat_domisili_ibu: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Kelurahan Domisili Ibu"
          placeholderTextColor="#000"
          value={ibuData.kelurahan_domisili_ibu}
          onChangeText={(text) => setIbuData({ ...ibuData, kelurahan_domisili_ibu: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Kecamatan Domisili Ibu"
          placeholderTextColor="#000"
          value={ibuData.kecamatan_domisili_ibu}
          onChangeText={(text) => setIbuData({ ...ibuData, kecamatan_domisili_ibu: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Kota Domisili Ibu"
          placeholderTextColor="#000"
          value={ibuData.kota_domisili_ibu}
          onChangeText={(text) => setIbuData({ ...ibuData, kota_domisili_ibu: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Provinsi Domisili Ibu"
          placeholderTextColor="#000"
          value={ibuData.provinsi_domisili_ibu}
          onChangeText={(text) => setIbuData({ ...ibuData, provinsi_domisili_ibu: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="No. HP Ibu"
          placeholderTextColor="#000"
          value={ibuData.no_hp_ibu}
          onChangeText={(text) => setIbuData({ ...ibuData, no_hp_ibu: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Email Ibu"
          placeholderTextColor="#000"
          value={ibuData.email_ibu}
          onChangeText={(text) => setIbuData({ ...ibuData, email_ibu: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Pekerjaan Ibu"
          placeholderTextColor="#000"
          value={ibuData.pekerjaan_ibu}
          onChangeText={(text) => setIbuData({ ...ibuData, pekerjaan_ibu: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Pendidikan Ibu"
          placeholderTextColor="#000"
          value={ibuData.pendidikan_ibu}
          onChangeText={(text) => setIbuData({ ...ibuData, pendidikan_ibu: text })}
        />

        <TouchableOpacity style={styles.btnNext} onPress={handleNext}>
          <Text style={styles.btnText}>Lanjut</Text>
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

export default IbuScreen;
