import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput, Alert } from 'react-native';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';
import Header from '../../../Kader/componentKader/Header';
import LoadingModal from '../../../../components/modals/LoadingModal';
import SuccessModal from '../../../../components/modals/SuccessModal ';
import ErrorModal from '../../../../components/modals/ErrorModal';
import ConfirmationModal from '../../../../components/modals/ConfirmationModal';
import DatePicker from 'react-native-date-picker';
import Config from 'react-native-config';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
const DataWali = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [dataWali, setDataWali] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [openWali, setOpenWali] = useState(false);
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [pekerjaanOptions, setPekerjaanOptions] = useState([]);
  const [pendidikanOptions, setPendidikanOptions] = useState([]);
  const [openPekerjaanWali, setOpenPekerjaanWali] = useState(false);
  const [openPendidikanWali, setOpenPendidikanWali] = useState(false);
  const [openJenisKelaminWali, setOpenJenisKelaminWali] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [modalVisible, setModalVisible] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);  // Current page number
  const [pageSize] = useState(10);  // Limit per page
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);  // Total pages available
  const [items, setItems] = useState([
    { label: 'Laki-Laki', value: 'l' },
    { label: 'Perempuan', value: 'p' }
  ]);

  const [formData, setFormData] = useState({
    no_kk: '',
    nik_wali: '',
    nama_wali: '',
    jenis_kelamin_wali: '',
    tempat_lahir_wali: '',
    tanggal_lahir_wali: null,
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
    pendidikan_wali: ''
  });

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

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const pekerjaanResponse = await axios.get(`${Config.API_URL}/pekerjaan`);
        const pendidikanResponse = await axios.get(`${Config.API_URL}/pendidikan`);
        setPekerjaanOptions(pekerjaanResponse.data.map((item) => ({ label: item.nama, value: item.id })));
        setPendidikanOptions(pendidikanResponse.data.map((item) => ({ label: item.nama, value: item.id })));
      } catch (error) {
        console.error("Error fetching options: ", error);
      }
    };
    fetchOptions();
  }, []);

  const fetchDataWali = async () => {
    setLoadingVisible(true);
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get(`${Config.API_URL}/wali`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const totalItems = response.data.length;  // Total items
      const sortedData = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setDataWali(sortedData);
      setTotalPages(Math.ceil(totalItems / pageSize));  // Calculate total pages
      setFilteredData(response.data.slice(0, pageSize));  // Set initial data for the first page
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingVisible(false);
    }
  };

  useEffect(() => {
    fetchDataWali();
  }, []);

  const handleNextPage = () => {
    if (pageNumber < totalPages) {
      const nextPage = pageNumber + 1;
      setPageNumber(nextPage);
      setFilteredData(dataWali.slice((nextPage - 1) * pageSize, nextPage * pageSize));  // Set data for next page
    }
  };

  // Function to handle previous page
  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      const prevPage = pageNumber - 1;
      setPageNumber(prevPage);
      setFilteredData(dataWali.slice((prevPage - 1) * pageSize, prevPage * pageSize));  // Set data for previous page
    }
  };


  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredData(dataWali);
    } else {
      const filtered = dataWali.filter((item) =>
        (item.nama_wali && item.nama_wali.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredData(filtered);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleAddWali = async () => {
    const errors = validateForm();

    if (errors.length > 0) {
      setErrorMessage(errors.join('\n'));
      setErrorVisible(true);
      return;
    }

    const token = await AsyncStorage.getItem('token');
    setLoadingVisible(true);
    try {
      const response = await axios.post(`${Config.API_URL}/wali`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 201) {
        setSuccessVisible(true);
        fetchDataWali();
        setModalVisible(false);
      }
    } catch (error) {
        // Tangkap semua informasi error
        console.error('Error details:', error);
      
        // Cek apakah ada response dari server
        if (error.response) {
          console.error('Response Data:', error.response.data);
          console.error('Response Status:', error.response.status);
          console.error('Response Headers:', error.response.headers);
        } else if (error.request) {
          // Request dibuat tapi tidak ada respons dari server
          console.error('Request Data:', error.request);
        } else {
          // Error lain, misalnya kesalahan konfigurasi dalam permintaan
          console.error('Error Message:', error.message);
        }
      
        // Cetak seluruh error object
        console.error('Full Error:', error);
        
        // Alert atau tampilkan pesan error
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
        Alert.alert('Error', errorMessage);
  
        setLoadingVisible(false);
      }
    }
    

  const handleDelete = async (id) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.delete(`${Config.API_URL}/wali/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 204) {
        fetchDataWali();
        setConfirmVisible(false);
      }
    } catch (error) {
        // Tangkap semua informasi error
        console.error('Error details:', error);
      
        // Cek apakah ada response dari server
        if (error.response) {
          console.error('Response Data:', error.response.data);
          console.error('Response Status:', error.response.status);
          console.error('Response Headers:', error.response.headers);
        } else if (error.request) {
          // Request dibuat tapi tidak ada respons dari server
          console.error('Request Data:', error.request);
        } else {
          // Error lain, misalnya kesalahan konfigurasi dalam permintaan
          console.error('Error Message:', error.message);
        }
      
        // Cetak seluruh error object
        console.error('Full Error:', error);
        
        // Alert atau tampilkan pesan error
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
        Alert.alert('Error', errorMessage);
  
        setLoadingVisible(false);
      }
    }
  const renderItem = ({ item }) => (
    <View style={styles.verificationCard}>
      <View style={styles.verificationCardContent}>
        <View style={{ flexDirection: 'column', width: '70%' }}>
          <Text style={styles.verificationTextTitle}>{item.nama_wali}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Icon name="id-card" size={20} color="#424F5E" />
            <Text style={styles.verificationText3}>{item.nik_wali}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'column', top: 10 }}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('DetailWali', { id: item.id })}
            >
              <Icon name="eye" size={20} color="#16DBCC" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => setSelectedId(item.id) & setConfirmVisible(true)}
            >
              <Icon name="trash" size={24} color="#FF6000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F7FA' }}>
      <Header title="Data Wali" onLeftPress={() => navigation.goBack()} />
      <View style={{ backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', paddingBottom: 10 }}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#718EBF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari wali"
            placeholderTextColor={'#718EBF'}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>
      {filteredData.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Data Wali Belum Ada</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          style={{ backgroundColor: '#fff', marginTop: 20, borderRadius: 2 }}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(1)}>
        <Icon name="plus" size={30} color="white" />
      </TouchableOpacity>
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[styles.pageButton, pageNumber === 1 && styles.disabledButton]}
          onPress={handlePreviousPage}
          disabled={pageNumber === 1}
        >
          <Text style={styles.pageButtonText}><Icon name="angle-left" size={30} color="white"/> </Text>
        </TouchableOpacity>
        <Text style={styles.pageInfo}>
          Page {pageNumber} of {totalPages}
        </Text>
        <TouchableOpacity
          style={[styles.pageButton, pageNumber === totalPages && styles.disabledButton]}
          onPress={handleNextPage}
          disabled={pageNumber === totalPages}
        >
          <Text style={styles.pageButtonText}><Icon name="angle-right" size={30} color="white"/></Text>
        </TouchableOpacity>
      </View>
      {/* Add Wali Modal */}
      <Modal
        transparent={true}
        visible={modalVisible === 1}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Tambah Data Wali</Text>
            <TextInput
              style={styles.input}
              placeholder="Nomor KK"
              keyboardType="numeric"
              maxLength={16}
              placeholderTextColor="gray"
              value={formData.no_kk}
              onChangeText={(value) => handleInputChange('no_kk', value)}
            />
              <TextInput
              style={styles.input}
              placeholder="NIK Wali"
              keyboardType="numeric"
              maxLength={16}
              placeholderTextColor="gray"
              value={formData.nik_wali}
              onChangeText={(value) => handleInputChange('nik_wali', value)}
            />
               <TextInput
              style={styles.input}
              placeholder="Nama Wali"
              placeholderTextColor="gray"
              value={formData.nama_wali}
              onChangeText={(value) => handleInputChange('nama_wali', value)}
            />
            <DropDownPicker
              open={openWali}
              value={formData.jenis_kelamin_wali}
              items={items}
              setOpen={setOpenWali}
              onSelectItem={(item) => setFormData({ ...formData, jenis_kelamin_wali: item.value })}
              setItems={setItems}
              placeholder="Pilih Jenis Kelamin"
              containerStyle={styles.dropdownContainer}
              style={styles.dropdown}
            />

            <View style={{ flexDirection: 'row',justifyContent: 'space-between' }}>
      
      <TextInput
                style={styles.input1}
                placeholder="Tempat Lahir Wali"
                placeholderTextColor="gray"
                value={formData.tempat_lahir_wali}
                onChangeText={(value) => handleInputChange('tempat_lahir_wali', value)}
              />

              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setDatePickerOpen(true)}
              >
                <Text style={styles.datePickerButtonText}>
                  {formData.tanggal_lahir_wali
                    ? moment(formData.tanggal_lahir_wali).format('DD/MM/YYYY')
                    : 'Tanggal Lahir Wali'}
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
              <TextInput
                style={styles.input}
                placeholder="Alamat KTP Wali"
                placeholderTextColor="gray"
                value={formData.alamat_ktp_wali}
                onChangeText={(value) => handleInputChange('alamat_ktp_wali', value)}
              />

              <TextInput
                style={styles.input}
                placeholder="Kelurahan KTP Wali"
                placeholderTextColor="gray"
                value={formData.kelurahan_ktp_wali}
                onChangeText={(value) => handleInputChange('kelurahan_ktp_wali', value)}
              />

              <TextInput
                style={styles.input}
                placeholder="Kecamatan KTP Wali"
                placeholderTextColor="gray"
                value={formData.kecamatan_ktp_wali}
                onChangeText={(value) => handleInputChange('kecamatan_ktp_wali', value)}
              />

              <TextInput
                style={styles.input}
                placeholder="Kota KTP Wali"
                placeholderTextColor="gray"
                value={formData.kota_ktp_wali}
                onChangeText={(value) => handleInputChange('kota_ktp_wali', value)}
              />

              <TextInput
                style={styles.input}
                placeholder="Provinsi KTP Wali"
                placeholderTextColor="gray"
                value={formData.provinsi_ktp_wali}
                onChangeText={(value) => handleInputChange('provinsi_ktp_wali', value)}
              />

            
             {/* Tombol Lanjut ke Bagian 2 */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => setModalVisible(2)}  // Ganti ke modal kedua
      >
        <Text style={styles.saveButtonText}>Lanjut</Text>
      </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
  transparent={true}
  visible={modalVisible === 2}
  animationType="slide"
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Tambah Data wali (Bagian 2)</Text>
      <TextInput
                style={styles.input}
                placeholder="Alamat Domisili Wali"
                placeholderTextColor="gray"
                value={formData.alamat_domisili_wali}
                onChangeText={(value) => handleInputChange('alamat_domisili_wali', value)}
              />

              <DropDownPicker
                open={openPekerjaanWali}
                value={formData.pekerjaan_wali}
                items={pekerjaanOptions}
                setOpen={setOpenPekerjaanWali}
                onSelectItem={(item) => handleInputChange('pekerjaan_wali', item.value)}
                placeholder="Pilih Pekerjaan Wali"
                containerStyle={styles.dropdownContainer}
                style={styles.dropdown}
              />

              <DropDownPicker
                open={openPendidikanWali}
                value={formData.pendidikan_wali}
                items={pendidikanOptions}
                setOpen={setOpenPendidikanWali}
                onSelectItem={(item) => handleInputChange('pendidikan_wali', item.value)}
                placeholder="Pilih Pendidikan Wali"
                containerStyle={styles.dropdownContainer}
                style={styles.dropdown}
              />

                <TextInput
                style={styles.input}
                placeholder="kelurahan Domisili Wali"
                placeholderTextColor="gray"
                value={formData.kelurahan_domisili_wali}
                onChangeText={(value) => handleInputChange('kelurahan_domisili_wali', value)}
              />

                <TextInput
                style={styles.input}
                placeholder="Kecamatan Domisili Wali"
                placeholderTextColor="gray"
                value={formData.kecamatan_domisili_wali}
                onChangeText={(value) => handleInputChange('kecamatan_domisili_wali', value)}
              />

                <TextInput
                style={styles.input}
                placeholder="Kota Domisili Wali"
                placeholderTextColor="gray"
                value={formData.kota_domisili_wali}
                onChangeText={(value) => handleInputChange('kota_domisili_wali', value)}
              />

                <TextInput
                style={styles.input}
                placeholder="Provinsi Domisili Wali"
                placeholderTextColor="gray"
                value={formData.provinsi_domisili_wali}
                onChangeText={(value) => handleInputChange('provinsi_domisili_wali', value)}
              />

                <TextInput
                style={styles.input}
                placeholder="no telepon wali"
                placeholderTextColor="gray"
                value={formData.no_hp_wali}
                keyboardType="numeric"
                maxLength={12}
                onChangeText={(value) => handleInputChange('no_hp_wali', value)}
              />

              <TextInput
                style={styles.input}
                placeholder="Email Wali"
                placeholderTextColor="gray"
                value={formData.email_wali}
                onChangeText={(value) => handleInputChange('email_wali', value)}
              />

      {/* Tombol Simpan dan Kembali */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => setModalVisible(1)}  // Kembali ke modal pertama
        >
          <Text style={styles.saveButtonText}>Kembali</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleAddWali}  // Simpan data
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
    verificationCard: {
      backgroundColor: 'white',
      borderBottomWidth: 1,
      borderColor: 'grey',
      width: '95%',
      borderRadius: 5,
      padding: 10,
      marginHorizontal: 10,
      flex: 1,
      marginVertical: 10
    },
    verificationCardContent: {
      margin: 10,
      flexDirection: 'row',
  
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      marginBottom: 20,
    },
    pageButton: {
      backgroundColor: '#008EB3',
      padding: 10,
      borderRadius: 5,
      marginHorizontal: 25,
    },
    pageButtonText: {
      color: 'white',
      fontSize: 16,
    },
    pageInfo: {
      fontSize: 12,
      color: 'black',
    },
    disabledButton: {
      backgroundColor: '#ccc',
    },
    saveButton: {
      backgroundColor: '#008EB3',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
      marginBottom: 10,
    },
  
    saveButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  
    verificationText: {
      color: 'black',
      fontFamily: 'Urbanist-Reguler',
      marginBottom: 5,
      fontSize: 12,
      flexWrap: 'wrap',
    },
    verificationText3: {
      color: 'black',
      fontFamily: 'Urbanist-Bold',
      marginBottom: 10,
      marginLeft: 5,
      fontSize: 12,
      flexWrap: 'wrap',
      fontWeight: 'lighter',
      width: 150
    },
    verificationText1: {
      color: 'black',
      fontFamily: 'Urbanist-Reguler',
      marginBottom: 5,
      fontSize: 8,
      flexWrap: 'wrap',
    },
    verificationTextTitle: {
      color: '#424F5E',
      fontFamily: 'Urbanist-ExtraBold',
      marginBottom: 8,
      flexWrap: 'wrap',
      fontSize: 15,
      fontWeight: 'bold'
    },
    cardProfile: {
      backgroundColor: 'white',
      marginHorizontal: 10,
      marginVertical: 10,
      borderRadius: 20,
      padding: 20,
    },
    cardProfileContent: {
      flex: 1,
    },
    cardProfileTitle: {
      fontSize: 20,
      color: 'black',
      textAlign: 'center',
      marginBottom: 10,
    },
    cardProfileText: {
      color: 'black',
      fontSize: 16,
      marginBottom: 10,
    },
    cardProfileButtons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    cardBox: {
      backgroundColor: 'white',
      borderRadius: 20,
      width: '48%',
      padding: 10,
      flexDirection: 'row',
    },
    cardHeader: {
      marginTop: 10,
      backgroundColor: '#FFDBC6',
      height: 50,
      padding: 10,
      alignContent: 'center',
      borderRadius: 30,
    },
    cardHeaderText: {
      textAlign: 'center',
      color: 'black',
      fontSize: 10,
      width: '67%',
      fontFamily: 'Urbanist-ExtraBold',
    },
    cardContent: {
      justifyContent: 'center',
      alignContent: 'center',
      height: 100,
      marginTop: 10,
      marginLeft: 5,
    },
    cardContentText: {
      textAlign: 'left',
      fontSize: 20,
      color: 'black',
      fontFamily: 'Urbanist-ExtraBold',
      marginLeft: 10,
      flex: 1,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '50%',
    },
    button: {
      width: '45%',
    },
    adminPanelTitleContainer: {
      marginHorizontal: 20,
      marginTop: 20,
      marginBottom: 10,
      alignItems: 'center',
    },
  
    searchContainer: {
      flexDirection: 'row',
      backgroundColor: '#F5F7FA',
      alignItems: 'center', // Pusatkan konten di tengah secara vertikal
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 25,
      margin: 10,
      width: '90%',
      paddingHorizontal: 10,
    },
    searchIcon: {
      marginRight: 10, // Beri jarak antara icon dan input
    },
    searchInput: {
      flex: 1, // Agar TextInput memenuhi sisa ruang
      height: 40,
      color: '#718EBF',
    },
    adminPanelTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FF6000',
    },
    summaryContainer: {
      marginHorizontal: 20,
      marginTop: 20,
      marginBottom: 10,
    },
    summaryText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FF6000',
    },
    createButton: {
      position: 'absolute',
      bottom: 90,
      right: 20,
      backgroundColor: '#FF6000',
      borderRadius: 50,
      width: 70,
      height: 70,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 2,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    profileButton: {
      backgroundColor: '#FF6000',
      borderRadius: 50,
      width: 70,
      height: 70,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 2,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      position: 'absolute',
      bottom: 20,
      right: 20,
    },
    adminCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      height: 130,
      width: 170,
      padding: 20,
      marginHorizontal: 10,
      marginBottom: 10,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      elevation: 2,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    adminTextContainer: {
      flex: 1,
      marginRight: 20,
      color: 'black',
      textAlign: 'center',
    },
    adminTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
      color: 'black',
      textAlign: 'center',
    },
    adminSubtitle: {
      fontSize: 25,
      color: '#666666',
      textAlign: 'center',
    },
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      padding: 10,
      flex: 1,
      alignItems: 'center',
      elevation: 2,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      marginTop: 30,
    },
    cardContent: {
      flex: 1,
    },
    cardText: {
      marginBottom: 5,
      fontSize: 12,
      color: '#000000',
    },
    cardButtons: {
      bottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    editButton: {
      paddingVertical: 8,
      borderRadius: 25,
      marginHorizontal: 4,
      paddingHorizontal: 14,
      height: 40,
      backgroundColor: '#DCFAF8',
    },
    deleteButton: {
      paddingVertical: 8,
      height: 40,
      borderRadius: 50,
      backgroundColor: '#FFDBC6',
      paddingHorizontal: 12,
    },
    modalTitle: {
      fontSize: 20,
  
      fontWeight: 'bold',
      marginBottom: 10,
      color: 'black',
      textAlign: 'center',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 22,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    input: {
      marginBottom: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      color: 'black',
      width: '100%',
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
    userInfo: {
      flex: 1,
    },
    dropdown: {
      width: '100%',
      marginBottom: 10,
      color: 'black',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      zIndex: 100,
    },
    tabBar: {
      backgroundColor: 'white',
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 10,
      marginHorizontal: 30,
      borderRadius: 25,
    },
    tabBarButton: {
      margin: 5,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 25,
      backgroundColor: 'transparent',
    },
    activeTab: {
      backgroundColor: '#FF6000',
    },
    tabBarText: {
      fontSize: 16,
      color: '#FFDBC6',
    },
    activeTabText: {
      color: 'white',
      fontWeight: 'bold',
    },
    noDataContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 200,
    },
    noDataText: {
      fontSize: 18,
      color: 'black',
    },
    printButton: {
      position: 'absolute',
      bottom: 100,
      right: 20,
      backgroundColor: '#008EB3',
      borderRadius: 50,
      width: 60,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
    },
    addButton: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      backgroundColor: '#008EB3',
      borderRadius: 50,
      width: 60,
      height: 60,
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
      marginBottom: 10,
      height: 50,
      width: 150,
      borderRadius: 10,
      justifyContent: 'center',
    },
    datePickerButtonText: {
      color: '#000',
      marginLeft: 20,
    },
  
  });
export default DataWali;
