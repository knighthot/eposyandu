import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Modal, ActivityIndicator, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../../../Kader/componentKader/Header'
import { BiodataSection, PASection, KegiatanSection } from '../../componentKader/DataAnak'
import cowok from '../../../../assets/images/anakcow.png';
import cewek from '../../../../assets/images/anakcew.png';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import Config from 'react-native-config';
const DetailAnak = ({ route }) => {
  const { id } = route.params
  const [activeTab, setActiveTab] = useState('Biodata');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [openBalita, setOpenBalita] = useState(false);
  const [isDatePickerOpenBalita, setDatePickerOpenBalita] = useState(false);
  const [dataOrangTua, setDataOrangTua] = useState(null);
  const [dataAnak, setDataAnak] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openOrangTua, setOpenOrangTua] = useState(false);
  const [orangTuaOptions, setOrangTuaOptions] = useState([]);
  const [formData, setFormData] = useState({
    orangtua: '',
    nama: '',
    nikAnak: '',
    jenisKelamin: '',
    tanggalLahir: null,
    tanggalLahir: '',
    beratBadanAwal: '',
    tinggiBadanAwal: '',
    riwayatPenyakit: '',
    riwayatKelahiran: '',
    keterangan: ''
  });



  const [items, setItems] = useState([
    { label: 'Laki-Laki', value: 'l' },
    { label: 'Perempuan', value: 'p' }
  ]);
  const renderDataSection = () => {
    switch (activeTab) {
      case 'Biodata':
        return <BiodataSection dataAnak={dataAnak} />;
      case 'PA':
        return <PASection dataAnak={dataAnak} />;
      case 'Kegiatan':
        return <KegiatanSection dataAnak={dataAnak}/>;
      default:
        return null;
    }
  };


  const fetchOrangTuaDropdown = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get(`${Config.API_URL}/orangtua`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data.map((orangTua) => ({
        label: orangTua.nama_ibu,
        value: orangTua.id,
        key: orangTua.id
      }));
      setOrangTuaOptions(data);
    } catch (error) {
      console.error('Error fetching orang tua1:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchOrangTuaDropdown();
      fetchOrangTua();
      return () => { };
    }, [])
  );


  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const response = await axios.get(`${Config.API_URL}/balita/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data)
        setDataAnak(response.data);  // Set data balita dari API
        if (response.data.orangtua) {
          fetchOrangTua(response.data.orangtua); // Fetch orang tua jika data balita ada
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Fetch data orang tua berdasarkan id
  const fetchOrangTua = async (idOrangTua) => {
   console.log(`${Config.API_URL}/orangtua/${idOrangTua}`)
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get(`${Config.API_URL}/orangtua/${idOrangTua}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDataOrangTua(response.data);  // Set data orang tua dari API
    } catch (error) {
    }
  };

  // Gambar dan warna berdasarkan jenis kelamin
  const renderProfileImage = () => {
    switch (dataAnak?.jenis_kelamin_balita) {
      case 'l':
        return cowok;
      case 'p':
        return cewek;
      default:
        return cowok;
    }
  };

  const renderBackgroundColor = () => {
    switch (dataAnak?.jenis_kelamin_balita) {
      case 'l':
        return '#E3F2FD'; // Light blue for boys
      case 'p':
        return '#FCE4EC'; // Light pink for girls
      default:
        return '#FFFFFF';
    }
  };


  useEffect(() => {
    console.log(dataAnak, "data anak");
    console.log(dataAnak?.orangtua, "data orang tua");
    if (dataAnak && dataAnak?.orangtua) {  // Ensure dataAnak and orangtua exist
      setFormData({
        orangtua: dataAnak.orangtua || '',  // Add fallback to empty string if null
        nama: dataAnak.nama_balita || '',
        nikAnak: dataAnak.nik_balita?.toString() || '',
        jenisKelamin: dataAnak.jenis_kelamin_balita || '',
        tempatLahir: dataAnak.tempat_lahir_balita || '',
        tanggalLahir: dataAnak.tanggal_lahir_balita ? new Date(dataAnak.tanggal_lahir_balita) : '',
        beratBadanAwal: dataAnak.berat_badan_awal_balita?.toString() || '',
        tinggiBadanAwal: dataAnak.tinggi_badan_awal_balita?.toString() || '',
        riwayatPenyakit: dataAnak.riwayat_penyakit_balita || '',
        riwayatKelahiran: dataAnak.riwayat_kelahiran_balita || '',
        keterangan: dataAnak.keterangan_balita || '',
      });
    }
  }, [dataAnak]);
  

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    const token = await AsyncStorage.getItem('token'); // Get token for authorization
    if (!formData.orangtua) {
      console.error("Orang tua data is missing");
      return;
    }
    try {
      await axios.put(`${Config.API_URL}/balita/${id}`, {
        nama_balita: formData.nama, 
        orangtua: formData.orangtua,
        nik_balita: formData.nikAnak,
        jenis_kelamin_balita: formData.jenisKelamin,
        tempat_lahir_balita: formData.tempatLahir,
        tanggal_lahir_balita: formData.tanggalLahir, // Make sure this is in the correct format
        berat_badan_awal_balita: formData.beratBadanAwal,
        tinggi_badan_awal_balita: formData.tinggiBadanAwal,
        riwayat_penyakit_balita: formData.riwayatPenyakit,
        riwayat_kelahiran_balita: formData.riwayatKelahiran,
        keterangan_balita: formData.keterangan,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token in headers
        },
      });
      setIsModalVisible(false); // Close modal after saving
    } catch (error) {
      console.error('Error updating data:', error); // Handle any errors
    }
  };

  return (
    <View style={styles.container}>
      <Header title='Lihat Data Anak' />
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4BC9FE" />
          <Text>Loading...</Text>
        </View>
      ) : (
        <>
          <View style={styles.cardProfile}>
            <View style={styles.profileContainer}>
              <View style={styles.leftSection}>
                <Text style={styles.name}>{dataAnak?.nama_balita}</Text>
                <Text style={styles.label}>Nama Wali</Text>
                <Text style={styles.value}>{dataOrangTua ? dataOrangTua.nama_ibu : 'Memuat...'}</Text>
                <Text style={styles.label}>Tempat Tanggal Lahir</Text>
                <Text style={styles.value}>{dataAnak?.tempat_lahir_balita}, {moment(dataAnak?.tanggal_lahir_balita).format('dddd, DD MMMM YYYY')}</Text>
                <Text style={styles.label}>Jenis Kelamin</Text>
                <Text style={styles.value}> {dataAnak?.jenis_kelamin_balita === 'l' ? 'Laki-Laki' : 'Perempuan'}</Text>
              </View>
              <View style={styles.rightSection}>
                {/* Profile Image */}
                <View style={[styles.profileImageContainer, { backgroundColor: renderBackgroundColor(dataAnak?.jenis_kelamin_balita) }]}>
                  <Image
                    style={styles.profileImage}
                    source={renderProfileImage(dataAnak?.jenis_kelamin_balita)}
                  />

                  <TouchableOpacity style={styles.editButton} onPress={() => setIsModalVisible(true)}>
                    <Icon name="pencil" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'Biodata' && styles.activeTabButton]}
              onPress={() => setActiveTab('Biodata')}
            >
              <Text style={[styles.tabText, activeTab === 'Biodata' && styles.activeTabText]}>
                BIODATA
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'PA' && styles.activeTabButton]}
              onPress={() => setActiveTab('PA')}
            >
              <Text style={[styles.tabText, activeTab === 'PA' && styles.activeTabText]}>
                DATA PA
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'Kegiatan' && styles.activeTabButton]}
              onPress={() => setActiveTab('Kegiatan')}
            >
              <Text style={[styles.tabText, activeTab === 'Kegiatan' && styles.activeTabText]}>
                DATA KEGIATAN
              </Text>
            </TouchableOpacity>
          </View>

          {/* Data Section */}
          <ScrollView style={styles.scrollContainer}>
            <View style={styles.cardProfile}>
              {renderDataSection()}
            </View>
          </ScrollView>
        </>
      )}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Data Anak</Text>
            <DropDownPicker
              open={openOrangTua}
              value={formData.orangtua}
              items={orangTuaOptions}
              setOpen={setOpenOrangTua}
              setValue={(value) => handleInputChange('orangTua', value())}
              placeholder="Pilih nama orang tua"
              containerStyle={{ zIndex: 1000 }}
              style={styles.dropdown}
              dropDownStyle={styles.dropdown}
            />
            <TextInput
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Nama Anak"
              value={formData.nama}
              onChangeText={(value) => handleInputChange('nama', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="NIK Anak"
              keyboardType="numeric"
              maxLength={16}
              placeholderTextColor="gray"
              value={formData.nikAnak}
              onChangeText={(value) => handleInputChange('nikAnak', value)}
            />
            <DropDownPicker
              open={openBalita}
              value={formData.jenisKelamin}  // Ambil nilai jenisKelamin dari formData
              items={items}
              setOpen={setOpenBalita}
              setValue={(callback) => setFormData((prevFormData) => ({
                ...prevFormData,
                jenisKelamin: callback(prevFormData.jenisKelamin)
              }))}
              placeholder="Pilih Jenis Kelamin"
              containerStyle={styles.dropdownContainer}
              style={styles.dropdown}
              dropDownStyle={styles.dropdown}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TextInput
                style={styles.input1}
                placeholderTextColor="gray"
                placeholder="Tempat Lahir"
                value={formData.tempatLahir}
                onChangeText={(value) => handleInputChange('tempatLahir', value)}
              />
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setDatePickerOpenBalita(true)}>
                <Text style={styles.datePickerButtonText}>
                  {formData.tanggalLahir ? moment(formData.tanggalLahir).format('DD/MM/YYYY') : 'Tanggal Lahir'}
                </Text>
              </TouchableOpacity>
              <DatePicker
                modal
                open={isDatePickerOpenBalita}
                date={formData.tanggalLahir ? new Date(formData.tanggalLahir) : new Date()} // Pastikan tanggalLahir berupa Date object
                mode="date"
                onConfirm={(date) => {
                  setDatePickerOpenBalita(false);
                  setFormData({ ...formData, tanggalLahir: date });
                }}
                onCancel={() => setDatePickerOpenBalita(false)}
              />
            </View>
            <TextInput
              placeholderTextColor="gray"
              style={styles.input}
              placeholder="Berat Badan Awal"
              value={formData.beratBadanAwal}
              onChangeText={(value) => handleInputChange('beratBadanAwal', value)}
            />
            <TextInput
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Tinggi Badan Awal"
              value={formData.tinggiBadanAwal}
              onChangeText={(value) => handleInputChange('tinggiBadanAwal', value)}
            />
            <TextInput
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Riwayat Penyakit"
              value={formData.riwayatPenyakit}
              onChangeText={(value) => handleInputChange('riwayatPenyakit', value)}
            />
            <TextInput
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Riwayat Kelahiran"
              value={formData.riwayatKelahiran}
              onChangeText={(value) => handleInputChange('riwayatKelahiran', value)}
            />
            <TextInput
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Keterangan"
              value={formData.keterangan}
              onChangeText={(value) => handleInputChange('keterangan', value)}
            />
            <TouchableOpacity style={styles.saveButton}  onPress={() => handleSave()}>
              <Text style={styles.saveButtonText}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>


  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  cardProfile: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    margin: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  profileImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 200,
    right: 0,
    borderRadius: 10,
  },
  profileContainer: {
    flexDirection: 'row',

  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '95%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    color: 'black',


  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
    color: 'black',
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: 'bold',
  },
  modalButton: {
    width: '100%',
    padding: 10,
    backgroundColor: '#008EB3',
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalCloseButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#DC143C',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  datePicker: {
    backgroundColor: 'yellow',
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

    height: 50,
    width: 150,
    borderRadius: 10,
    justifyContent: 'center',
  },
  datePickerButtonText: {
    color: '#000',
    marginLeft: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  leftSection: {
    flex: 1,

    justifyContent: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  label: {
    fontSize: 12,
    color: '#888888',
    marginTop: 5,
  },
  value: {
    fontSize: 14,
    color: '#444444',
    marginTop: 2,
  },
  input1: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: 'black',
    width: '50%',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 50,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: -7,
    backgroundColor: '#16DBCC',
    padding: 10,
    borderRadius: 20,
  },

  tabs: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 10,
    marginHorizontal: 20,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    padding: 7,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',

  },
  tabText: {
    color: '#4BC9FE',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  activeTabButton: {
    backgroundColor: '#4BC9FE',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  dataSection: {
    padding: 15,
    borderRadius: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 10,
    fontSize: 16,
    color: '#444444',
  },
  dropdown: {
    width: '100%',
    marginVertical: 10,
    color: 'black',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  saveButton: {
    backgroundColor: '#4BC9FE',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DetailAnak;
