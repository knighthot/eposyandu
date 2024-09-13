import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, ActivityIndicator, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../../../Kader/componentKader/Header';
import { BiodataWaliSection, PemeriksaanLansiaSection,DataLansiaSection } from '../../componentKader/DataLansia'; // Include the sections
import Icon from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import LoadingModal from '../../../../components/modals/LoadingModal';
import SuccessModal from '../../../../components/modals/SuccessModal ';
import ErrorModal from '../../../../components/modals/ErrorModal';
import ConfirmationModal from '../../../../components/modals/ConfirmationModal';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from 'react-native-config';

const DetailWali = ({ route }) => {
  const { id } = route.params;
  const [activeTab, setActiveTab] = useState('Biodata');  // Set default tab to Biodata
  const [modalVisible, setIsModalVisible] = useState(0);
  const [openWali, setOpenWali] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [dataWali, setDataWali] = useState(null);  // For wali data
  const [isLoading, setIsLoading] = useState(true);
  const [pekerjaanOptions, setPekerjaanOptions] = useState([]);
  const [pendidikanOptions, setPendidikanOptions] = useState([]);
  const [openPekerjaanWali, setOpenPekerjaanWali] = useState('');
  const [openPendidikanWali, setOpenPendidikanWali] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [formData, setFormData] = useState({
    no_kk: '',
    nik_wali: '',
    nama_wali: '',
    tempat_lahir_wali: '',
    tanggal_lahir_wali: '',
    jenis_kelamin_wali: '',
    alamat_ktp_wali: '',
    kelurahan_ktp_wali: '',
    kecamatan_ktp_wali: '',
    kota_ktp_wali: '',
    provinsi_ktp_wali: '',
    alamat_domisili_wali: '',
    kelurahan_domisili_wali: '',
    kecamatan_domisili_wali: '',
    kota_domisili_wali: '',
    provinsi_domisili_wali: '',
    no_hp_wali: '',
    email_wali: '',
    pekerjaan_wali: '',
    pendidikan_wali: '',
  });

  const [items, setItems] = useState([
    { label: 'Laki-Laki', value: 'l' },
    { label: 'Perempuan', value: 'p' }
  ]);

  const renderDataSection = () => {
    switch (activeTab) {
      case 'Biodata':
        return <BiodataWaliSection dataWali={dataWali} />;  // Render Biodata Section
      case 'Pemeriksaan':
        return <DataLansiaSection dataList={dataWali.id} />;  // Render Pemeriksaan Section
      default:
        return null;
    }
  };

  const validateForm = () => {
    let errors = [];

    if (!formData.no_kk) {
      errors.push('- Nomor KK tidak boleh kosong');
    }

    if (!formData.nama_wali) {
      errors.push('- Nama Wali tidak boleh kosong');
    }

    if (!formData.nik_wali) {
      errors.push('- NIK Wali tidak boleh kosong');
    } else if (!/^\d{16}$/.test(formData.nik_wali)) {
      errors.push('- NIK Wali harus 16 angka');
    }

    if (!formData.tempat_lahir_wali) {
      errors.push('- Tempat Lahir Wali tidak boleh kosong');
    }

    if (!formData.tanggal_lahir_wali) {
      errors.push('- Tanggal Lahir Wali tidak boleh kosong');
    }

    if (!formData.pekerjaan_wali) {
      errors.push('- Pekerjaan Wali tidak boleh kosong');
    }

    if (!formData.pendidikan_wali) {
      errors.push('- Pendidikan Wali tidak boleh kosong');
    }

    if (!formData.alamat_ktp_wali) {
      errors.push('- Alamat KTP Wali tidak boleh kosong');
    }

    if (!formData.kelurahan_ktp_wali) {
      errors.push('- Kelurahan KTP Wali tidak boleh kosong');
    }

    if (!formData.kecamatan_ktp_wali) {
      errors.push('- Kecamatan KTP Wali tidak boleh kosong');
    }

    if (!formData.kota_ktp_wali) {
      errors.push('- Kota KTP Wali tidak boleh kosong');
    }

    if (!formData.provinsi_ktp_wali) {
      errors.push('- Provinsi KTP Wali tidak boleh kosong');
    }

    if (!formData.alamat_domisili_wali) {
      errors.push('- Alamat Domisili Wali tidak boleh kosong');
    }

    if (!formData.kelurahan_domisili_wali) {
      errors.push('- Kelurahan Domisili Wali tidak boleh kosong');
    }

    if (!formData.kecamatan_domisili_wali) {
      errors.push('- Kecamatan Domisili Wali tidak boleh kosong');
    }

    if (!formData.kota_domisili_wali) {
      errors.push('- Kota Domisili Wali tidak boleh kosong');
    }

    if (!formData.provinsi_domisili_wali) {
      errors.push('- Provinsi Domisili Wali tidak boleh kosong');
    }

    if (!formData.no_hp_wali) {
      errors.push('- Nomor HP Wali tidak boleh kosong');
    } else if (!/^\d{10,12}$/.test(formData.no_hp_wali)) {
      errors.push('- Nomor HP Wali harus antara 10 hingga 12 angka');
    }

    if (!formData.email_wali) {
      errors.push('- Email Wali tidak boleh kosong');
    } else if (!/\S+@\S+\.\S+/.test(formData.email_wali)) {
      errors.push('- Email Wali tidak valid');
    }

    return errors;
  };

  // Mengambil data wali
  const fetchData = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const [pekerjaanResponse, pendidikanResponse] = await Promise.all([
        axios.get(`${Config.API_URL}/pekerjaan`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${Config.API_URL}/pendidikan`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // Map data for the dropdowns
      const pekerjaanData = pekerjaanResponse.data.map(pekerjaan => ({ label: pekerjaan.nama, value: pekerjaan.id, key: pekerjaan.id }));
      const pendidikanData = pendidikanResponse.data.map(pendidikan => ({ label: pendidikan.nama, value: pendidikan.id, key: pendidikan.id }));

      setPekerjaanOptions(pekerjaanData);
      setPendidikanOptions(pendidikanData);

      // Fetch wali data
      const response = await axios.get(`${Config.API_URL}/wali/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDataWali(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();  // Memuat ulang data setiap kali layar difokuskan
      return () => { };
    }, [])
  );

  useEffect(() => {
    if (dataWali) {
      setFormData({
        no_kk: dataWali.no_kk?.toString() || '',
        nik_wali: dataWali.nik_wali?.toString() || '',
        nama_wali: dataWali.nama_wali || '',
        tempat_lahir_wali: dataWali.tempat_lahir_wali || '',
        tanggal_lahir_wali: dataWali.tanggal_lahir_wali ? new Date(dataWali.tanggal_lahir_wali) : '',
        jenis_kelamin_wali: dataWali.jenis_kelamin_wali || '',
        alamat_ktp_wali: dataWali.alamat_ktp_wali || '',
        kelurahan_ktp_wali: dataWali.kelurahan_ktp_wali || '',
        kecamatan_ktp_wali: dataWali.kecamatan_ktp_wali || '',
        kota_ktp_wali: dataWali.kota_ktp_wali || '',
        provinsi_ktp_wali: dataWali.provinsi_ktp_wali || '',
        alamat_domisili_wali: dataWali.alamat_domisili_wali || '',
        kelurahan_domisili_wali: dataWali.kelurahan_domisili_wali || '',
        kecamatan_domisili_wali: dataWali.kecamatan_domisili_wali || '',
        kota_domisili_wali: dataWali.kota_domisili_wali || '',
        provinsi_domisili_wali: dataWali.provinsi_domisili_wali || '',
        no_hp_wali: dataWali.no_hp_wali?.toString() || '',
        email_wali: dataWali.email_wali || '',
        pekerjaan_wali: dataWali.pekerjaan_wali || '',
        pendidikan_wali: dataWali.pendidikan_wali || '',
      });
    }
  }, [dataWali]);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    const token = await AsyncStorage.getItem('token');
    const errors = validateForm();
  
    if (errors.length > 0) {
      setErrorMessage(errors.join('\n')); // Gabungkan semua error dalam satu pesan
      setErrorVisible(true);  // Tampilkan modal error
      return;
    }
    try {
      // Update data wali
      await axios.put(`${Config.API_URL}/wali/${id}`, {
        no_kk: formData.no_kk,
        nik_wali: formData.nik_wali,
        nama_wali: formData.nama_wali,
        tempat_lahir_wali: formData.tempat_lahir_wali,
        tanggal_lahir_wali: formData.tanggal_lahir_wali,
        jenis_kelamin_wali: formData.jenis_kelamin_wali,
        alamat_ktp_wali: formData.alamat_ktp_wali,
        kelurahan_ktp_wali: formData.kelurahan_ktp_wali,
        kecamatan_ktp_wali: formData.kecamatan_ktp_wali,
        kota_ktp_wali: formData.kota_ktp_wali,
        provinsi_ktp_wali: formData.provinsi_ktp_wali,
        alamat_domisili_wali: formData.alamat_domisili_wali,
        kelurahan_domisili_wali: formData.kelurahan_domisili_wali,
        kecamatan_domisili_wali: formData.kecamatan_domisili_wali,
        kota_domisili_wali: formData.kota_domisili_wali,
        provinsi_domisili_wali: formData.provinsi_domisili_wali,
        no_hp_wali: formData.no_hp_wali,
        email_wali: formData.email_wali,
        pekerjaan_wali: formData.pekerjaan_wali,
        pendidikan_wali: formData.pendidikan_wali,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Setelah update berhasil, panggil fetchData untuk memperbarui data
      fetchData();  // Memuat ulang data setelah update berhasil
      
      // Tutup modal setelah update berhasil
      setIsModalVisible(false);
      
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header title='Lihat Data Wali' />
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4BC9FE" />
          <Text>Loading...</Text>
        </View>
      ) : (
        <>
         
          <ScrollView style={styles.scrollContainer}>
          <View style={styles.cardProfile}>
            <View style={styles.profileContainer}>
              <View style={styles.leftSection}>
                <Text style={styles.name}>{dataWali?.nama_wali}</Text>
                <Text style={styles.label}>Tempat Tanggal Lahir</Text>
                <Text style={styles.value}>{dataWali?.tempat_lahir_wali}, {moment(dataWali?.tanggal_lahir_wali).format('dddd, DD MMMM YYYY')}</Text>
                <Text style={styles.label}>Jenis Kelamin</Text>
                <Text style={styles.value}>{dataWali?.jenis_kelamin_wali === 'l' ? 'Laki-Laki' : 'Perempuan'}</Text>
                <Text style={styles.label}>Pekerjaan</Text>
                <Text style={styles.value}>{dataWali?.pekerjaan_wali}</Text>
                <Text style={styles.label}>Pendidikan</Text>
                <Text style={styles.value}>{dataWali?.pendidikan_wali}</Text>
              </View>
              <TouchableOpacity style={styles.editButton} onPress={() => setIsModalVisible(1)}>
                <Icon name="pencil" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'Biodata' && styles.activeTabButton]}
              onPress={() => setActiveTab('Biodata')}
            >
              <Text style={[styles.tabText, activeTab === 'Biodata' && styles.activeTabText]}>
                BIODATA WALI
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
      <Text style={styles.modalTitle}>Edit Data Wali (Bagian 1)</Text>

      {/* No KK Wali */}
      <TextInput
        style={styles.input}
        placeholder="Nomor KK Wali"
        keyboardType="numeric"
        placeholderTextColor={'gray'}
        maxLength={16}
        value={formData.no_kk}
        onChangeText={(value) => handleInputChange('no_kk', value)}
      />

      {/* Jenis Kelamin Wali */}
      <DropDownPicker
        open={openWali}
        value={formData.jenis_kelamin_wali}
        items={items}
        placeholderTextColor={'gray'}
        setOpen={setOpenWali}
        onSelectItem={(item) => setFormData({ ...formData, jenis_kelamin_wali: item.value })}
        placeholder="Pilih Jenis Kelamin"
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
      />

      {/* Nama Wali */}
      <TextInput
        style={styles.input}
        placeholder="Nama Wali"
        placeholderTextColor={'gray'}
        value={formData.nama_wali}
        onChangeText={(value) => handleInputChange('nama_wali', value)}
      />

      {/* NIK Wali */}
      <TextInput
        style={styles.input}
        placeholder="NIK Wali"
        keyboardType="numeric"
        placeholderTextColor={'gray'}
        maxLength={16}
        value={formData.nik_wali}
        onChangeText={(value) => handleInputChange('nik_wali', value)}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {/* Tempat Lahir Wali */}
        <TextInput
          style={styles.input1}
          placeholderTextColor={'gray'}
          placeholder="Tempat Lahir Wali"
          value={formData.tempat_lahir_wali}
          onChangeText={(value) => handleInputChange('tempat_lahir_wali', value)}
        />

        {/* Tanggal Lahir Wali */}
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setDatePickerOpen(true)}
        >
          <Text style={styles.datePickerButtonText}>
            {formData.tanggal_lahir_wali
              ? moment(formData.tanggal_lahir_wali).format('DD/MM/YYYY')
              : 'Tanggal Lahir'}
          </Text>
        </TouchableOpacity>

        <DatePicker
          modal
          open={isDatePickerOpen}
          date={formData.tanggal_lahir_wali || new Date()}
          mode="date"
          onConfirm={(date) => {
            setDatePickerOpen(false);
            handleInputChange('tanggal_lahir_wali', date);
          }}
          onCancel={() => setDatePickerOpen(false)}
        />
      </View>

      {/* Alamat KTP Wali */}
      <TextInput
        style={styles.input}
        placeholder="Alamat KTP Wali"
        placeholderTextColor={'gray'}
        value={formData.alamat_ktp_wali}
        onChangeText={(value) => handleInputChange('alamat_ktp_wali', value)}
      />

      {/* Kelurahan KTP Wali */}
      <TextInput
        style={styles.input}
        placeholder="Kelurahan KTP Wali"
        placeholderTextColor={'gray'}
        value={formData.kelurahan_ktp_wali}
        onChangeText={(value) => handleInputChange('kelurahan_ktp_wali', value)}
      />

      {/* Kecamatan KTP Wali */}
      <TextInput
        style={styles.input}
        placeholder="Kecamatan KTP Wali"
        placeholderTextColor={'gray'}
        value={formData.kecamatan_ktp_wali}
        onChangeText={(value) => handleInputChange('kecamatan_ktp_wali', value)}
      />

      {/* Kota KTP Wali */}
      <TextInput
        style={styles.input}
        placeholder="Kota KTP Wali"
        placeholderTextColor={'gray'}
        value={formData.kota_ktp_wali}
        onChangeText={(value) => handleInputChange('kota_ktp_wali', value)}
      />

      {/* Provinsi KTP Wali */}
      <TextInput
        style={styles.input}
        placeholder="Provinsi KTP Wali"
        placeholderTextColor={'gray'}
        value={formData.provinsi_ktp_wali}
        onChangeText={(value) => handleInputChange('provinsi_ktp_wali', value)}
      />

      {/* Alamat Domisili Wali */}
      <TextInput
        style={styles.input}
        placeholder="Alamat Domisili Wali"
        placeholderTextColor={'gray'}
        value={formData.alamat_domisili_wali}
        onChangeText={(value) => handleInputChange('alamat_domisili_wali', value)}
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

{/* Edit Wali Modal - Part 2 */}
<Modal
  transparent={true}
  visible={modalVisible === 2}
  animationType="slide"
  onRequestClose={() => setIsModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Edit Data Wali (Bagian 2)</Text>

      {/* Kelurahan Domisili Wali */}
      <TextInput
        style={styles.input}
        placeholder="Kelurahan Domisili Wali"
        value={formData.kelurahan_domisili_wali}
        onChangeText={(value) => handleInputChange('kelurahan_domisili_wali', value)}
      />

      {/* Kecamatan Domisili Wali */}
      <TextInput
        style={styles.input}
        placeholder="Kecamatan Domisili Wali"
        value={formData.kecamatan_domisili_wali}
        onChangeText={(value) => handleInputChange('kecamatan_domisili_wali', value)}
      />

      {/* Kota Domisili Wali */}
      <TextInput
        style={styles.input}
        placeholder="Kota Domisili Wali"
        value={formData.kota_domisili_wali}
        onChangeText={(value) => handleInputChange('kota_domisili_wali', value)}
      />

      {/* Provinsi Domisili Wali */}
      <TextInput
        style={styles.input}
        placeholder="Provinsi Domisili Wali"
        value={formData.provinsi_domisili_wali}
        onChangeText={(value) => handleInputChange('provinsi_domisili_wali', value)}
      />

      {/* Pekerjaan */}
      <DropDownPicker
        open={openPekerjaanWali}
        value={formData.pekerjaan_wali}
        items={pekerjaanOptions}
        setOpen={setOpenPekerjaanWali}
        onSelectItem={(item) => handleInputChange('pekerjaan_wali', item.value)}
        placeholder="Pilih Pekerjaan"
        containerStyle={{ zIndex: 1000 }}
        style={styles.dropdown}
        dropDownStyle={styles.dropdown}
      />

      {/* Pendidikan */}
      <DropDownPicker
        open={openPendidikanWali}
        value={formData.pendidikan_wali}
        items={pendidikanOptions}
        setOpen={setOpenPendidikanWali}
        onSelectItem={(item) => handleInputChange('pendidikan_wali', item.value)}
        placeholder="Pilih Pendidikan"
        containerStyle={{ zIndex: 999 }}
        style={styles.dropdown}
        dropDownStyle={styles.dropdown}
      />

      {/* No HP Wali */}
      <TextInput
        style={styles.input}
        placeholder="No HP Wali"
        keyboardType="numeric"
        value={formData.no_hp_wali}
        onChangeText={(value) => handleInputChange('no_hp_wali', value)}
      />

      {/* Email Wali */}
      <TextInput
        style={styles.input}
        placeholder="Email Wali"
        keyboardType="email-address"
        value={formData.email_wali}
        onChangeText={(value) => handleInputChange('email_wali', value)}
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

<LoadingModal visible={loadingVisible} />
      <SuccessModal visible={successVisible} message="Data wali berhasil ditambahkan." onClose={() => setSuccessVisible(false)} />
      <ErrorModal visible={errorVisible} message={errorMessage} onClose={() => setErrorVisible(false)} />
      <ConfirmationModal
        visible={confirmVisible}
        message="Apakah Anda yakin ingin menghapus data wali ini?"
        onConfirm={() => handleDelete(selectedId)}
        onCancel={() => setConfirmVisible(false)}
      />
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

export default DetailWali;
