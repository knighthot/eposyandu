import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Modal, ActivityIndicator, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../../../Kader/componentKader/Header';
import {  BiodataLansiaSection, BiodataWaliSection, PemeriksaanLansiaSection  } from '../../componentKader/DataLansia';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import cowok from '../../../../assets/images/anakcow.png';
import cewek from '../../../../assets/images/anakcew.png';

import Config from 'react-native-config';

const DetailLansia = ({ route }) => {
  const { id } = route.params;
  const [activeTab, setActiveTab] = useState('Biodata');
  const [modalVisible, setIsModalVisible] = useState(0);
  const [openLansia, setOpenLansia] = useState(false);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [dataWali, setDataWali] = useState(null);  // For wali data
  const [dataLansia, setDataLansia] = useState(null);  // For lansia data
  const [isLoading, setIsLoading] = useState(true);
  const [openWali, setOpenWali] = useState(false);
  const [openPekerjaanLansia, setOpenPekerjaanLansia] = useState('');
  const [openPendidikanLansia, setOpenPendidikanLansia] = useState('');
  const [pekerjaanOptions, setPekerjaanOptions] = useState([]);
  const [pendidikanOptions, setPendidikanOptions] = useState([]);
  const [openStatusPernikahan, setOpenStatusPernikahan] = useState('');
  const [openWaliDropdown, setOpenWaliDropdown] = useState(false);
  const [walis, setWaliOptions] = useState([]);  // Options for wali dropdown
  const [formData, setFormData] = useState({
    wali: '',  // Wali field
    nama: '',
    nikLansia: '',
    jenisKelamin: '',
    tempatLahir: '',
    tanggalLahir: '',
    beratBadanAwal: '',
    tinggiBadanAwal: '',
    riwayatPenyakit: '',
    keterangan: ''
  });

  const [items, setItems] = useState([
    { label: 'Laki-Laki', value: 'l' },
    { label: 'Perempuan', value: 'p' }
  ]);


  const renderDataSection = () => {
    switch (activeTab) {
      case 'Biodata':
        return <BiodataLansiaSection dataLansia={dataLansia} />;
      case 'Pemeriksaan':
        return <PemeriksaanLansiaSection />;
        default:
          return null;
    }
  }

  const renderProfileImage = () => {
    switch (dataLansia?.jenis_kelamin_lansia) {
      case 'l':
        return cowok;
      case 'p':
        return cewek;
      default:
        return cowok;
    }
  };

  const renderBackgroundColor = () => {
    switch (dataLansia?.jenis_kelamin_lansia) {
      case 'l':
        return '#E3F2FD'; // Light blue for boys
      case 'p':
        return '#FCE4EC'; // Light pink for girls
      default:
        return '#FFFFFF';
    }
  };

  const fetchWaliDropdown = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get(`${Config.API_URL}/wali`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data.map((wali) => ({
        label: wali.nama_wali,
        value: wali.id,
        key: wali.id
      }));
      setWaliOptions(data);
    } catch (error) {
      console.error('Error fetching wali:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchWaliDropdown();
      fetchWali();
      return () => { };
    }, [])
  );

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const response = await axios.get(`${Config.API_URL}/lansia/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDataLansia(response.data);
        if (response.data.wali) {
          fetchWali(response.data.wali);  // Fetch wali if data exists
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Fetch data wali based on id
  const fetchWali = async (idWali) => {
    console.log(`${Config.API_URL}/wali/${idWali}`)
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get(`${Config.API_URL}/wali/${idWali}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDataWali(response.data);  // Set data wali from API
    } catch (error) {
    
    }
  };

  useEffect(() => {
    if (dataLansia && dataLansia?.wali) {
      setFormData({
        wali: dataLansia.wali || '',
        nama: dataLansia.nama_lansia || '',
        nikLansia: dataLansia.nik_lansia?.toString() || '',
        jenisKelamin: dataLansia.jenis_kelamin_lansia || '',
        tempatLahir: dataLansia.tempat_lahir_lansia || '',
        tanggalLahir: dataLansia.tanggal_lahir_lansia ? new Date(dataLansia.tanggal_lahir_lansia) : '',
        beratBadanAwal: dataLansia.berat_badan_awal?.toString() || '',
        tinggiBadanAwal: dataLansia.tinggi_badan_awal?.toString() || '',
        riwayatPenyakit: dataLansia.riwayat_penyakit || '',
        keterangan: dataLansia.keterangan || '',
      });
    }
  }, [dataLansia]);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!formData.wali) {
      console.error("Wali data is missing");
      return;
    }
    try {
      await axios.put(`${Config.API_URL}/lansia/${id}`, {
        nama_lansia: formData.nama,
        wali: formData.wali,
        nik_lansia: formData.nikLansia,
        jenis_kelamin_lansia: formData.jenisKelamin,
        tempat_lahir_lansia: formData.tempatLahir,
        tanggal_lahir_lansia: formData.tanggalLahir,
        berat_badan_awal: formData.beratBadanAwal,
        tinggi_badan_awal: formData.tinggiBadanAwal,
        riwayat_penyakit: formData.riwayatPenyakit,
        keterangan: formData.keterangan,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header title='Lihat Data Lansia' />
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
                <Text style={styles.name}>{dataLansia?.nama_lansia}</Text>
                <Text style={styles.label}>Nama Wali</Text>
                <Text style={styles.value}>{dataWali ? dataWali.nama_wali : 'Memuat...'}</Text>
                <Text style={styles.label}>Tempat Tanggal Lahir</Text>
                <Text style={styles.value}>{dataLansia?.tempat_lahir_lansia}, {moment(dataLansia?.tanggal_lahir_lansia).format('dddd, DD MMMM YYYY')}</Text>
                <Text style={styles.label}>Jenis Kelamin</Text>
                <Text style={styles.value}>{dataLansia?.jenis_kelamin_lansia === 'l' ? 'Laki-Laki' : 'Perempuan'}</Text>
              </View>
              <View style={styles.rightSection}>
              <View style={[styles.profileImageContainer, { backgroundColor: renderBackgroundColor(dataLansia?.jenis_kelamin_lansia) }]}>
                  <Image
                    style={styles.profileImage}
                    source={renderProfileImage(dataLansia?.jenis_kelamin_lansia)}
                  />
                  </View>
                <TouchableOpacity style={styles.editButton} onPress={() => setIsModalVisible(1)}>
                  <Icon name="pencil" size={20} color="white" />
                </TouchableOpacity>
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
              style={[styles.tabButton, activeTab === 'Pemeriksaan' && styles.activeTabButton]}
              onPress={() => setActiveTab('Pemeriksaan')}
            >
              <Text style={[styles.tabText, activeTab === 'Pemeriksaan' && styles.activeTabText]}>
                DATA PEMERIKSAAN
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
  visible={modalVisible === 1}
  animationType="slide"
  onRequestClose={() => setIsModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Edit Data Lansia (Bagian 1)</Text>

      {/* No KK Lansia */}
      <TextInput
        style={styles.input}
        placeholder="Nomor KK Lansia"
        keyboardType="numeric"
        maxLength={16}
        value={formData.no_kk_lansia}
        onChangeText={(value) => handleInputChange('no_kk_lansia', value)}
      />

      {/* Jenis Kelamin */}
      <DropDownPicker
        open={openLansia}
        value={formData.jenis_kelamin_lansia}
        items={items}
        setOpen={setOpenLansia}
        onSelectItem={(item) => setFormData({ ...formData, jenis_kelamin_lansia: item.value })}
        placeholder="Pilih Jenis Kelamin"
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
      />

      {/* Nama Lansia */}
      <TextInput
        style={styles.input}
        placeholder="Nama Lansia"
        value={formData.nama_lansia}
        onChangeText={(value) => handleInputChange('nama_lansia', value)}
      />

      {/* NIK Lansia */}
      <TextInput
        style={styles.input}
        placeholder="NIK Lansia"
        keyboardType="numeric"
        maxLength={16}
        value={formData.nik_lansia}
        onChangeText={(value) => handleInputChange('nik_lansia', value)}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {/* Tempat Lahir */}
        <TextInput
          style={styles.input1}
          placeholder="Tempat Lahir"
          value={formData.tempat_lahir_lansia}
          onChangeText={(value) => handleInputChange('tempat_lahir_lansia', value)}
        />

        {/* Tanggal Lahir */}
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setDatePickerOpen(true)}
        >
          <Text style={styles.datePickerButtonText}>
            {formData.tanggal_lahir_lansia
              ? moment(formData.tanggal_lahir_lansia).format('DD/MM/YYYY')
              : 'Tanggal Lahir'}
          </Text>
        </TouchableOpacity>

        <DatePicker
          modal
          open={isDatePickerOpen}
          date={formData.tanggal_lahir_lansia || new Date()}
          mode="date"
          onConfirm={(date) => {
            setDatePickerOpen(false);
            handleInputChange('tanggal_lahir_lansia', date);
          }}
          onCancel={() => setDatePickerOpen(false)}
        />
      </View>

      {/* Alamat KTP */}
      <TextInput
        style={styles.input}
        placeholder="Alamat KTP"
        value={formData.alamat_ktp_lansia}
        onChangeText={(value) => handleInputChange('alamat_ktp_lansia', value)}
      />

      {/* Kelurahan KTP */}
      <TextInput
        style={styles.input}
        placeholder="Kelurahan KTP"
        value={formData.kelurahan_ktp_lansia}
        onChangeText={(value) => handleInputChange('kelurahan_ktp_lansia', value)}
      />

      {/* Kecamatan KTP */}
      <TextInput
        style={styles.input}
        placeholder="Kecamatan KTP"
        value={formData.kecamatan_ktp_lansia}
        onChangeText={(value) => handleInputChange('kecamatan_ktp_lansia', value)}
      />

      {/* Kota KTP */}
      <TextInput
        style={styles.input}
        placeholder="Kota KTP"
        value={formData.kota_ktp_lansia}
        onChangeText={(value) => handleInputChange('kota_ktp_lansia', value)}
      />

      {/* Provinsi KTP */}
      <TextInput
        style={styles.input}
        placeholder="Provinsi KTP"
        value={formData.provinsi_ktp_lansia}
        onChangeText={(value) => handleInputChange('provinsi_ktp_lansia', value)}
      />

      {/* Tombol Lanjut ke Bagian 2 */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => setIsModalVisible(2)}
      >
        <Text style={styles.saveButtonText}>Lanjut</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

{/* Edit Lansia Modal - Part 2 */}
<Modal
  transparent={true}
  visible={modalVisible === 2}
  animationType="slide"
  onRequestClose={() => setIsModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Edit Data Lansia (Bagian 2)</Text>

      {/* Alamat Domisili */}
      <TextInput
        style={styles.input}
        placeholder="Alamat Domisili"
        value={formData.alamat_domisili_lansia}
        onChangeText={(value) => handleInputChange('alamat_domisili_lansia', value)}
      />

      {/* Kelurahan Domisili */}
      <TextInput
        style={styles.input}
        placeholder="Kelurahan Domisili"
        value={formData.kelurahan_domisili_lansia}
        onChangeText={(value) => handleInputChange('kelurahan_domisili_lansia', value)}
      />

      {/* Kecamatan Domisili */}
      <TextInput
        style={styles.input}
        placeholder="Kecamatan Domisili"
        value={formData.kecamatan_domisili_lansia}
        onChangeText={(value) => handleInputChange('kecamatan_domisili_lansia', value)}
      />

      {/* Kota Domisili */}
      <TextInput
        style={styles.input}
        placeholder="Kota Domisili"
        value={formData.kota_domisili_lansia}
        onChangeText={(value) => handleInputChange('kota_domisili_lansia', value)}
      />

      {/* Provinsi Domisili */}
      <TextInput
        style={styles.input}
        placeholder="Provinsi Domisili"
        value={formData.provinsi_domisili_lansia}
        onChangeText={(value) => handleInputChange('provinsi_domisili_lansia', value)}
      />

      {/* Pekerjaan */}
      <DropDownPicker
        open={openPekerjaanLansia}
        value={formData.pekerjaan_lansia}
        items={pekerjaanOptions.map(pekerjaan => ({ label: pekerjaan.nama, value: pekerjaan.id }))}
        setOpen={setOpenPekerjaanLansia}
        onSelectItem={(item) => handleInputChange('pekerjaan_lansia', item.value)}
        placeholder="Pilih Pekerjaan"
      />

      {/* Pendidikan */}
      <DropDownPicker
        open={openPendidikanLansia}
        value={formData.pendidikan_lansia}
        items={pendidikanOptions.map(pendidikan => ({ label: pendidikan.nama, value: pendidikan.id }))}
        setOpen={setOpenPendidikanLansia}
        onSelectItem={(item) => handleInputChange('pendidikan_lansia', item.value)}
        placeholder="Pilih Pendidikan"
      />

      {/* Status Pernikahan */}
      <DropDownPicker
        open={openStatusPernikahan}
        value={formData.status_pernikahan_lansia}
        items={[
          { label: 'Tidak Menikah', value: 'Tidak Menikah' },
          { label: 'Menikah', value: 'Menikah' },
          { label: 'Duda', value: 'Duda' },
          { label: 'Janda', value: 'Janda' }
        ]}
        setOpen={setOpenStatusPernikahan}
        onSelectItem={(item) => handleInputChange('status_pernikahan_lansia', item.value)}
        placeholder="Pilih Status Pernikahan"
      />

      {/* Wali */}
      <DropDownPicker
        open={openWaliDropdown}
        value={formData.wali}
        items={walis.map(wali => ({ label: wali.nama_wali, value: wali.id }))}
        setOpen={setOpenWaliDropdown}
        onSelectItem={(item) => handleInputChange('wali', item.value)}
        placeholder="Pilih Wali"
      />

      {/* No HP */}
      <TextInput
        style={styles.input}
        placeholder="No HP Lansia"
        keyboardType="numeric"
        value={formData.no_hp_lansia}
        onChangeText={(value) => handleInputChange('no_hp_lansia', value)}
      />

      {/* Email */}
      <TextInput
        style={styles.input}
        placeholder="Email Lansia"
        keyboardType="email-address"
        value={formData.email_lansia}
        onChangeText={(value) => handleInputChange('email_lansia', value)}
      />

      {/* Tombol Simpan dan Kembali */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => setIsModalVisible(1)}
        >
          <Text style={styles.saveButtonText}>Kembali</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}  // Save the updated data
        >
          <Text style={styles.saveButtonText}>Simpan</Text>
        </TouchableOpacity>
      </View>
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

export default DetailLansia;
