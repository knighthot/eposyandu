import React, { useState , useEffect} from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet, Touchable, FlatList } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';
import Header from '../../../../components/Header';
import moment from 'moment';
import 'moment/locale/id'; // Import Indonesian locale
import Config from 'react-native-config';
import ErrorModal from '../../../../components/modals/ErrorModal';
moment.locale('id'); // Set the locale to Indonesian

console.log('API_URL:', Config.API_URL);

const IbuForm = () => {
  const navigation = useNavigation();
  const [openIbu, setOpenIbu] = useState(false);
  const [isDatePickerOpenIbu, setDatePickerOpenIbu] = useState(false);
  const [pekerjaanOptions, setPekerjaanOptions] = useState([]);
  const [pendidikanOptions,setPendidikanOptions] = useState([]);
  const [openPekerjaanIbu, setOpenPekerjaanIbu] = useState(false);
const [openPendidikanIbu, setOpenPendidikanIbu] = useState(false);
const [modalVisible, setModalVisible] = useState(false);
const [errorMessages, setErrorMessages] = useState([]);

  const [ibuData, setIbuData] = useState({
    no_kk: '',nik_ibu: '', nama_ibu: '', jenis_kelamin_ibu: '', tempat_lahir_ibu: '', tanggal_lahir_ibu: null,
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
    const errors = validateForm();
    if (errors.length > 0) {
      setErrorMessages(errors);
      setModalVisible(true);
      return;
    }

    const formattedIbuData = {
      ...ibuData,
      tanggal_lahir_ibu: ibuData.tanggal_lahir_ibu ? ibuData.tanggal_lahir_ibu.toISOString() : null,
      nik_ibu: !isNaN(parseInt(ibuData.nik_ibu, 10)) ? parseInt(ibuData.nik_ibu, 10) : null,
    };

    navigation.navigate('AyahForm', { ibuData: formattedIbuData});
  
  };

  const formatDate = (date) => {
    return moment(date).format('LL'); // 'LL' format gives a localized long date
  };

  const validateForm = () => {
    let errors = [];
  
    if (!ibuData.no_kk) {
      errors.push('- No KK tidak boleh kosong');
    } else if (!/^\d{16}$/.test(ibuData.no_kk)) {
      errors.push('- No KK harus 16 angka');
    
    }
    if (!ibuData.nik_ibu) {
      errors.push('- NIK Ibu tidak boleh kosong');
    } else if (!/^\d{16}$/.test(ibuData.nik_ibu)) {
      errors.push('- NIK Ibu harus 16 angka');
    }
  
    if (!ibuData.nama_ibu) {
      errors.push('- Nama Ibu tidak boleh kosong');
    }
  
    if (!ibuData.tempat_lahir_ibu) {
      errors.push('- Tempat Lahir Ibu tidak boleh kosong');
    }
  
    if (!ibuData.tanggal_lahir_ibu) {
      errors.push('- Tanggal Lahir Ibu tidak boleh kosong');
    }
  
    if (!ibuData.pekerjaan_ibu) {
      errors.push('- Pekerjaan Ibu tidak boleh kosong');
    }
  
    if (!ibuData.pendidikan_ibu) {
      errors.push('- Pendidikan Ibu tidak boleh kosong');
    }
  
    if (!ibuData.alamat_ktp_ibu) {
      errors.push('- Alamat KTP Ibu tidak boleh kosong');
    }
  
    if (!ibuData.kelurahan_ktp_ibu) {
      errors.push('- Kelurahan KTP Ibu tidak boleh kosong');
    }
  
    if (!ibuData.kecamatan_ktp_ibu) {
      errors.push('- Kecamatan KTP Ibu tidak boleh kosong');
    }
  
    if (!ibuData.kota_ktp_ibu) {
      errors.push('- Kota KTP Ibu tidak boleh kosong');
    }
  
    if (!ibuData.provinsi_ktp_ibu) {
      errors.push('- Provinsi KTP Ibu tidak boleh kosong');
    }
  
    if (!ibuData.alamat_domisili_ibu) {
      errors.push('- Alamat Domisili Ibu tidak boleh kosong');
    }
  
    if (!ibuData.kelurahan_domisili_ibu) {
      errors.push('- Kelurahan Domisili Ibu tidak boleh kosong');
    }
  
    if (!ibuData.kecamatan_domisili_ibu) {
      errors.push('- Kecamatan Domisili Ibu tidak boleh kosong');
    }
  
    if (!ibuData.kota_domisili_ibu) {
      errors.push('- Kota Domisili Ibu tidak boleh kosong');
    }
  
    if (!ibuData.provinsi_domisili_ibu) {
      errors.push('- Provinsi Domisili Ibu tidak boleh kosong');
    }
  
    if (!ibuData.no_hp_ibu) {
      errors.push('- Nomor HP Ibu tidak boleh kosong');
    } else if (!/^\d{12}$/.test(ibuData.no_hp_ibu)) {
      errors.push('- Nomor HP Ibu harus 12 angka');
    }
  
    if (!ibuData.email_ibu) {
      errors.push('- Email Ibu tidak boleh kosong');
    } else if (!/\S+@\S+\.\S+/.test(ibuData.email_ibu)) {
      errors.push('- Email Ibu tidak valid');
    }
  
    return errors;
  };
  



  const renderForm = () => (
    <View>
      <View style={styles.scene}>
        <Text style={styles.title}>Data Diri Ibu</Text>
        <TextInput
          style={styles.input}
          placeholder="No KK"
          keyboardType="numeric"
          maxLength={16}
          placeholderTextColor="#000"
          value={ibuData.no_kk}
          onChangeText={(text) => setIbuData({ ...ibuData, no_kk: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="NIK Ibu"
          keyboardType="numeric"
          maxLength={16}
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
          keyboardType="phone-pad"
          maxLength={12}
          value={ibuData.no_hp_ibu}
          onChangeText={(text) => setIbuData({ ...ibuData, no_hp_ibu: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Email Ibu"
          keyboardType="email-address"
          placeholderTextColor="#000"
          value={ibuData.email_ibu}
          onChangeText={(text) => setIbuData({ ...ibuData, email_ibu: text })}
        />
  <DropDownPicker
          open={openPekerjaanIbu}
          value={ibuData.pekerjaan_ibu}
          items={pekerjaanOptions.map(pekerjaan => ({ label: pekerjaan.nama, value: pekerjaan.id }))}
          setOpen={setOpenPekerjaanIbu}
          setValue={(value) => setIbuData({ ...ibuData, pekerjaan_ibu: value() })}
          placeholder="Pilih Pekerjaan Ibu"
          containerStyle={styles.dropdownContainer}
          style={styles.dropdown}
        />
        
        <DropDownPicker
          open={openPendidikanIbu}
          value={ibuData.pendidikan_ibu}
          items={pendidikanOptions.map(pendidikan => ({ label: pendidikan.nama, value: pendidikan.id }))}
          setOpen={setOpenPendidikanIbu}
          setValue={(value) => setIbuData({ ...ibuData, pendidikan_ibu: value() })}
          placeholder="Pilih Pendidikan Ibu"
          containerStyle={styles.dropdownContainer}
          style={styles.dropdown}
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
      <ErrorModal
        visible={modalVisible}
        message={errorMessages.join('\n')}
        onClose={() => setModalVisible(false)}
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

export default IbuForm;
