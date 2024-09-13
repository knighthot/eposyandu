import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput,Alert } from 'react-native';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';
import Header from '../../../Kader/componentKader/Header';  // Modify based on your directory structure
import LoadingModal from '../../../../components/modals/LoadingModal';
import SuccessModal from '../../../../components/modals/SuccessModal ';
import ErrorModal from '../../../../components/modals/ErrorModal';
import ConfirmationModal from '../../../../components/modals/ConfirmationModal';
import DatePicker from 'react-native-date-picker';
import Config from 'react-native-config';
import { useNavigation } from '@react-navigation/native';
const DataLansia = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');  // For search queries
  const [dataLansia, setDataLansia] = useState([]);  // State for elderly data
  const [filteredData, setFilteredData] = useState([]);  // Filtered data
  const [openLansia, setOpenLansia] = useState(false);
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [pekerjaanOptions, setPekerjaanOptions] = useState([]);
  const [pendidikanOptions, setPendidikanOptions] = useState([]);
  const [openPekerjaanLansia, setOpenPekerjaanLansia] = useState(false);
  const [openPendidikanLansia, setOpenPendidikanLansia] = useState(false);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [openStatusPernikahan, setOpenStatusPernikahan] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [walis, setWalis] = useState([]);  // State for storing fetched Wali data
  const [openWaliDropdown, setOpenWaliDropdown] = useState(false);  // Control dropdown visibility
  const [selectedId, setSelectedId] = useState(null);
  const [modalVisible, setModalVisible] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);  // Current page number
  const [pageSize] = useState(10);  // Limit per page
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);  // Total pages available
  const [items, setItems] = useState([
    { label: 'Laki-Laki', value: 'l' },
    { label: 'Perempuan', value: 'P' }
  ]);

  const [formData, setFormData] = useState({
    no_kk_lansia: '',
    wali: '',
    nik_lansia: '',
    nama_lansia: '',
    jenis_kelamin_lansia: '',
    tempat_lahir_lansia: '',
    tanggal_lahir_lansia: null,
    alamat_ktp_lansia: '',
    kelurahan_ktp_lansia: '',
    kecamatan_ktp_lansia: '',
    kota_ktp_lansia: '',
    provinsi_ktp_lansia: '',
    alamat_domisili_lansia: '',
    kelurahan_domisili_lansia: '',
    kecamatan_domisili_lansia: '',
    kota_domisili_lansia: '',
    provinsi_domisili_lansia: '',
    no_hp_lansia: '',
    email_lansia: '',
    pekerjaan_lansia: '',
    pendidikan_lansia: '',
    status_pernikahan_lansia: ''
  });

  useEffect(() => {
    const fetchWalis = async () => {
      const token = await AsyncStorage.getItem('token');
      setLoadingVisible(true);
      try {
        const response = await axios.get(`${Config.API_URL}/wali`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWalis(response.data);  // Populate walis with the response data
      } catch (error) {
        setErrorMessage('Failed to fetch Wali data.');
        setErrorVisible(true);
      } finally {
        setLoadingVisible(false);
      }
    };
    fetchWalis();
  }, []);

    // Handle Wali selection from the dropdown
    const handleWaliChange = (value) => {
      setFormData({ ...formData, wali: value });
    };
  const validateForm = () => {
    let errors = [];
  
    if (!formData.no_kk_lansia) {
      errors.push('- Nomor KK tidak boleh kosong');
    }
  
    if (!formData.nama_lansia) {
      errors.push('- Nama Lansia tidak boleh kosong');
    }
  
    if (!formData.nik_lansia) {
      errors.push('- NIK Lansia tidak boleh kosong');
    } else if (!/^\d{16}$/.test(formData.nik_lansia)) {
      errors.push('- NIK Lansia harus 16 angka');
    }
  
    if (!formData.tempat_lahir_lansia) {
      errors.push('- Tempat Lahir Lansia tidak boleh kosong');
    }
  
    if (!formData.tanggal_lahir_lansia) {
      errors.push('- Tanggal Lahir Lansia tidak boleh kosong');
    }
  
    if (!formData.pekerjaan_lansia) {
      errors.push('- Pekerjaan Lansia tidak boleh kosong');
    }
  
    if (!formData.pendidikan_lansia) {
      errors.push('- Pendidikan Lansia tidak boleh kosong');
    }
  
    if (!formData.alamat_ktp_lansia) {
      errors.push('- Alamat KTP Lansia tidak boleh kosong');
    }
  
    if (!formData.kelurahan_ktp_lansia) {
      errors.push('- Kelurahan KTP Lansia tidak boleh kosong');
    }
  
    if (!formData.kecamatan_ktp_lansia) {
      errors.push('- Kecamatan KTP Lansia tidak boleh kosong');
    }
  
    if (!formData.kota_ktp_lansia) {
      errors.push('- Kota KTP Lansia tidak boleh kosong');
    }
  
    if (!formData.provinsi_ktp_lansia) {
      errors.push('- Provinsi KTP Lansia tidak boleh kosong');
    }
  
    if (!formData.alamat_domisili_lansia) {
      errors.push('- Alamat Domisili Lansia tidak boleh kosong');
    }
  
    if (!formData.kelurahan_domisili_lansia) {
      errors.push('- Kelurahan Domisili Lansia tidak boleh kosong');
    }
  
    if (!formData.kecamatan_domisili_lansia) {
      errors.push('- Kecamatan Domisili Lansia tidak boleh kosong');
    }
  
    if (!formData.kota_domisili_lansia) {
      errors.push('- Kota Domisili Lansia tidak boleh kosong');
    }
  
    if (!formData.provinsi_domisili_lansia) {
      errors.push('- Provinsi Domisili Lansia tidak boleh kosong');
    }
  
    if (!formData.no_hp_lansia) {
      errors.push('- Nomor HP Lansia tidak boleh kosong');
    } else if (!/^\d{10,12}$/.test(formData.no_hp_lansia)) {
      errors.push('- Nomor HP Lansia harus antara 10 hingga 12 angka');
    }
  
    if (!formData.email_lansia) {
      errors.push('- Email Lansia tidak boleh kosong');
    } else if (!/\S+@\S+\.\S+/.test(formData.email_lansia)) {
      errors.push('- Email Lansia tidak valid');
    }
  
    if (!formData.wali) {
      errors.push('- Nama Wali tidak boleh kosong');
    }
  
    if (!formData.status_pernikahan_lansia) {
      errors.push('- Status pernikahan Lansia tidak boleh kosong');
    }
  
    return errors;
  };
  
  

  // Fetch data of elderly

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
  const fetchDataLansia = async () => {
    setLoadingVisible(true);
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get(`${Config.API_URL}/lansia`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const totalItems = response.data.length;  // Total items
      const sortedData = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTotalPages(Math.ceil(totalItems / pageSize));  // Calculate total pages
      setFilteredData(response.data.slice(0, pageSize));  // Set initial data for the first page
      setDataLansia(sortedData);
     
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingVisible(false);
    }
  };

  // Fetch data on page load
  useEffect(() => {
    fetchDataLansia();  // Fetch data on component mount
  }, []);

  
  const handleNextPage = () => {
    if (pageNumber < totalPages) {
      const nextPage = pageNumber + 1;
      setPageNumber(nextPage);
      setFilteredData(dataLansia.slice((nextPage - 1) * pageSize, nextPage * pageSize));  // Set data for next page
    }
  };

  // Function to handle previous page
  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      const prevPage = pageNumber - 1;
      setPageNumber(prevPage);
      setFilteredData(dataLansia.slice((prevPage - 1) * pageSize, prevPage * pageSize));  // Set data for previous page
    }
  };

  // Function to search through the elderly data
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredData(dataLansia);
    } else {
      const filtered = dataLansia.filter((item) =>
        (item.nama_lansia && item.nama_lansia.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredData(filtered);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleAddLansia = async () => {
    const errors = validateForm();
  
    if (errors.length > 0) {
      setErrorMessage(errors.join('\n')); // Gabungkan semua error dalam satu pesan
      setErrorVisible(true);  // Tampilkan modal error
      return;
    }
  
    // Lanjutkan dengan logika pengiriman data jika tidak ada error
    const token = await AsyncStorage.getItem('token');
    setLoadingVisible(true);
    try {
      const response = await axios.post(`${Config.API_URL}/lansia`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 201) {
        setSuccessVisible(true);  // Tampilkan modal sukses
        fetchDataLansia();  // Refresh data setelah penambahan berhasil
        setModalVisible(false);  // Tutup modal input
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
      const response = await axios.delete(`${Config.API_URL}/lansia/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 204) {
        fetchDataLansia();  // Refresh data after deletion
        setConfirmVisible(false);
      }
    } catch (error) {
      setErrorMessage('Gagal menghapus data lansia.');
      setErrorVisible(true);  // Show error modal
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.verificationCard}>
      <View style={styles.verificationCardContent}>
        <View style={{ flexDirection: 'column', width: '70%' }}>
          <Text style={styles.verificationTextTitle}>{item.nama_lansia}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Icon name="id-card" size={20} color="#424F5E" />
            <Text style={styles.verificationText3}>{item.nik_lansia}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'column', top: 10 }}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('DetailLansia', { id: item.id })}
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
      <Header title="Data Lansia" onLeftPress={() => navigation.goBack()} />
      {/* Search Input */}
      <View style={{ backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', paddingBottom: 10 }}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#718EBF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari lansia"
            placeholderTextColor={'#718EBF'}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>
      {filteredData.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Data Lansia Belum Ada</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          style={{ backgroundColor: '#fff', marginTop: 20, borderRadius: 2 }}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}

      {/* Add Lansia Button */}
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


{/* Add Lansia Modal - Part 1 */}
<Modal
  transparent={true}
  visible={modalVisible === 1}
  animationType="slide"
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Tambah Data Lansia (Bagian 1)</Text>

        {/* No KK Lansia */}
        <TextInput
        style={styles.input}
        placeholder="Nomor KK Lansia"
          placeholderTextColor="gray"
        keyboardType="numeric"
        maxLength={16}
        value={formData.no_kk_lansia}
        onChangeText={(value) => handleInputChange('no_kk_lansia', value)}
      />
            <DropDownPicker
              open={openLansia}
              value={formData.jenis_kelamin_lansia}
              items={items}
              setOpen={setOpenLansia}
              onSelectItem={(item) => setFormData({ ...formData, jenis_kelamin_lansia: item.value })}
              setItems={setItems}
              placeholder="Pilih Jenis Kelamin"
              containerStyle={styles.dropdownContainer}
              style={styles.dropdown}
              dropDownStyle={styles.dropdown}
            />

      {/* Nama Lansia */}
      <TextInput
        style={styles.input}
        placeholder="Nama Lansia"
          placeholderTextColor="gray"
        value={formData.nama_lansia}
        onChangeText={(value) => handleInputChange('nama_lansia', value)}
      />

      {/* NIK Lansia */}
      <TextInput
        style={styles.input}
        placeholder="NIK Lansia"
        keyboardType="numeric"
        maxLength={16}
          placeholderTextColor="gray"
        value={formData.nik_lansia}
        onChangeText={(value) => handleInputChange('nik_lansia', value)}
      />

      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>

      {/* Tempat Lahir Lansia */}
      <TextInput
        style={styles.input1}
          placeholderTextColor="gray"
        placeholder="Tempat Lahir Lansia"
        value={formData.tempat_lahir_lansia}
        onChangeText={(value) => handleInputChange('tempat_lahir_lansia', value)}
      />

      {/* Tanggal Lahir Lansia */}
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setDatePickerOpen(true)}
      >
        <Text style={styles.datePickerButtonText}>
          {formData.tanggal_lahir_lansia
            ? moment(formData.tanggal_lahir_lansia).format('DD/MM/YYYY')
            : 'Tanggal Lahir Lansia'}
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
        onCancel={() => {
          setDatePickerOpen(false);
        }}
      />
</View>
      {/* Alamat KTP Lansia */}
      <TextInput
        style={styles.input}
          placeholderTextColor="gray"
        placeholder="Alamat KTP Lansia"
        value={formData.alamat_ktp_lansia}
        onChangeText={(value) => handleInputChange('alamat_ktp_lansia', value)}
      />

      {/* Kelurahan KTP Lansia */}
      <TextInput
        style={styles.input}
          placeholderTextColor="gray"
        placeholder="Kelurahan KTP Lansia"
        value={formData.kelurahan_ktp_lansia}
        onChangeText={(value) => handleInputChange('kelurahan_ktp_lansia', value)}
      />

      {/* Kecamatan KTP Lansia */}
      <TextInput
        style={styles.input}
          placeholderTextColor="gray"
        placeholder="Kecamatan KTP Lansia"
        value={formData.kecamatan_ktp_lansia}
        onChangeText={(value) => handleInputChange('kecamatan_ktp_lansia', value)}
      />

      {/* Kota KTP Lansia */}
      <TextInput
        style={styles.input}
          placeholderTextColor="gray"
        placeholder="Kota KTP Lansia"
        value={formData.kota_ktp_lansia}
        onChangeText={(value) => handleInputChange('kota_ktp_lansia', value)}
      />

      {/* Provinsi KTP Lansia */}
      <TextInput
        style={styles.input}
          placeholderTextColor="gray"
        placeholder="Provinsi KTP Lansia"
        value={formData.provinsi_ktp_lansia}
        onChangeText={(value) => handleInputChange('provinsi_ktp_lansia', value)}
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

{/* Add Lansia Modal - Part 2 */}
<Modal
  transparent={true}
  visible={modalVisible === 2}
  animationType="slide"
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Tambah Data Lansia (Bagian 2)</Text>

      {/* Alamat Domisili Lansia */}
      <TextInput
        style={styles.input}
          placeholderTextColor="gray"
        placeholder="Alamat Domisili Lansia"
        value={formData.alamat_domisili_lansia}
        onChangeText={(value) => handleInputChange('alamat_domisili_lansia', value)}
      />

      {/* Kelurahan Domisili Lansia */}
      <TextInput
        style={styles.input}
        placeholder="Kelurahan Domisili Lansia"
          placeholderTextColor="gray"
        value={formData.kelurahan_domisili_lansia}
        onChangeText={(value) => handleInputChange('kelurahan_domisili_lansia', value)}
      />

      {/* Kecamatan Domisili Lansia */}
      <TextInput
        style={styles.input}
        placeholder="Kecamatan Domisili Lansia"
        value={formData.kecamatan_domisili_lansia}
          placeholderTextColor="gray"
        onChangeText={(value) => handleInputChange('kecamatan_domisili_lansia', value)}
      />

      {/* Kota Domisili Lansia */}
      <TextInput
        style={styles.input}
        placeholder="Kota Domisili Lansia"
        value={formData.kota_domisili_lansia}
          placeholderTextColor="gray"
        onChangeText={(value) => handleInputChange('kota_domisili_lansia', value)}
      />

      {/* Provinsi Domisili Lansia */}
      <TextInput
        style={styles.input}
        placeholder="Provinsi Domisili Lansia"
        value={formData.provinsi_domisili_lansia}
          placeholderTextColor="gray"
        onChangeText={(value) => handleInputChange('provinsi_domisili_lansia', value)}
      />

      {/* Pekerjaan Lansia */}
      <DropDownPicker
          open={openPekerjaanLansia}
          value={formData.pekerjaan_lansia} 
          items={pekerjaanOptions.map(pekerjaan => ({ label: pekerjaan.nama, value: pekerjaan.id }))}
          setOpen={setOpenPekerjaanLansia}
          setValue={(value) => setFormData({ ...formData, pekerjaan_lansia: value() })}
          placeholder="Pilih Pekerjaan Lansia"
          containerStyle={styles.dropdownContainer}
          style={styles.dropdown}
        />
        
        <DropDownPicker
          open={openPendidikanLansia}
          value={formData.pendidikan_lansia}
          items={pendidikanOptions.map(pendidikan => ({ label: pendidikan.nama, value: pendidikan.id }))}
          setOpen={setOpenPendidikanLansia}
          setValue={(value) => setFormData({ ...formData, pendidikan_lansia: value() })}
          placeholder="Pilih Pendidikan Lansia"
          containerStyle={styles.dropdownContainer}
          style={styles.dropdown}
        />

      {/* Status Pernikahan */}
      <DropDownPicker
        open={openStatusPernikahan}
        value={formData.status_pernikahan_lansia}
        items={[
          { label: 'Tidak Menikah', value: 'Tidak Menikah' },
          { label: 'Menikah', value: 'Menikah' },
          { label: 'Duda', value: 'Duda' },
          { label: 'Janda', value: 'janda' },
        ]}
        setOpen={setOpenStatusPernikahan}
        setValue={(value) => handleInputChange('status_pernikahan_lansia', value())}
        placeholder="Pilih Status Pernikahan"
        containerStyle={{ marginBottom: 10 }}
        style={styles.dropdown}
      />

<DropDownPicker
              open={openWaliDropdown}
              value={formData.wali}
              items={walis.map(wali => ({
                label: wali.nama_wali,  // Display Wali name
                value: wali.id,  // Use Wali id as the value
              }))}
              setOpen={setOpenWaliDropdown}
              onSelectItem={(item) => handleWaliChange(item.value)}  // Update the selected wali in formData
              placeholder="Pilih Wali"
              containerStyle={styles.dropdownContainer}
              style={styles.dropdown}
            />


      {/* No HP Lansia */}
      <TextInput
        style={styles.input}
        placeholder="No HP Lansia"
        keyboardType="numeric"
          maxLength={12}
          placeholderTextColor="gray"
        value={formData.no_hp_lansia}
        onChangeText={(value) => handleInputChange('no_hp_lansia', value)}
      />

      {/* Email Lansia */}
      <TextInput
        style={styles.input}
        placeholder="Email Lansia"
          placeholderTextColor="gray"
        keyboardType="email-address"
        value={formData.email_lansia}
        onChangeText={(value) => handleInputChange('email_lansia', value)}
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
          onPress={handleAddLansia}  // Simpan data
        >
          <Text style={styles.saveButtonText}>Simpan</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

      {/* Modal Loading */}
      <LoadingModal visible={loadingVisible} />

      {/* Modal Sukses */}
      <SuccessModal
        visible={successVisible}
        message="Data lansia berhasil ditambahkan."
        onClose={() => setSuccessVisible(false)}
      />

      {/* Modal Error */}
      <ErrorModal
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />

      {/* Modal Konfirmasi Hapus */}
      <ConfirmationModal
        visible={confirmVisible}
        message="Apakah Anda yakin ingin menghapus data lansia ini?"
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
export default DataLansia;
