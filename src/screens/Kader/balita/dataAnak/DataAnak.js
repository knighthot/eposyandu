import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Modal, TextInput, Alert } from 'react-native'
import moment from 'moment';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import React, { useState, useEffect } from 'react'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../componentKader/Header';
import axios from 'axios';
import Config from 'react-native-config';
import IbuHamil from '../../../../assets/icons/IbuGendong';
import ErrorModal from '../../../../components/modals/ErrorModal';
import LoadingModal from '../../../../components/modals/LoadingModal';
import SuccessModal from '../../../../components/modals/SuccessModal ';
import ConfirmationModal from '../../../../components/modals/ConfirmationModal';
import AnakLaki from '../../../../assets/icons/AnakLaki';
import AnakPerempuan from '../../../../assets/icons/AnakPerempuan';


const DataAnak = () => {
  const navigation = useNavigation();
  const [printModalVisible, setPrintModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [openBalita, setOpenBalita] = useState(false);
  const [isDatePickerOpenBalita, setDatePickerOpenBalita] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');  // State untuk menyimpan query pencarian
  const [dataAnak, setDataAnak] = useState([]);  // State untuk menyimpan data dari API
  const [filteredData, setFilteredData] = useState([]);  // State untuk data yang difilter
  const [orangTuaOptions, setOrangTuaOptions] = useState([]);
  const [openOrangTua, setOpenOrangTua] = useState(false);
  const [jumlahLaki, setJumlahLaki] = useState(0);
  const [jumlahPerempuan, setJumlahPerempuan] = useState(0);
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);  // Current page number
  const [pageSize] = useState(10);  // Limit per page
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);  // Total pages available

  const fetchDataAnak = async () => {
    setIsLoading(true);
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get(`${Config.API_URL}/balita`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const totalItems = response.data.length;  // Total items
      const sortedData = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setDataAnak(sortedData);
      setTotalPages(Math.ceil(totalItems / pageSize));  // Calculate total pages
      setFilteredData(response.data.slice(0, pageSize));  // Set initial data for the first page
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on page load
  useEffect(() => {
    fetchDataAnak();  // Fetch the data for the first page on load
  }, []);

  // Function to handle next page
  const handleNextPage = () => {
    if (pageNumber < totalPages) {
      const nextPage = pageNumber + 1;
      setPageNumber(nextPage);
      setFilteredData(dataAnak.slice((nextPage - 1) * pageSize, nextPage * pageSize));  // Set data for next page
    }
  };

  // Function to handle previous page
  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      const prevPage = pageNumber - 1;
      setPageNumber(prevPage);
      setFilteredData(dataAnak.slice((prevPage - 1) * pageSize, prevPage * pageSize));  // Set data for previous page
    }
  };
  // Fungsi untuk fetch data orang tua
  const fetchOrangTua = async () => {
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
      console.error('Error fetching orang tua:', error);
    }
  };

  // Error handling function


  // UseFocusEffect untuk refresh data setiap kali halaman difokuskan
  useFocusEffect(
    React.useCallback(() => {
      fetchDataAnak();
      fetchOrangTua();
      return () => { };
    }, [])
  );

  // Menghitung jumlah anak laki-laki dan perempuan
  useEffect(() => {
    const countGender = () => {
      const laki = dataAnak.filter(item => item.jenis_kelamin_balita === 'l').length;
      const perempuan = dataAnak.filter(item => item.jenis_kelamin_balita === 'p').length;
      setJumlahLaki(laki);
      setJumlahPerempuan(perempuan);
    };
    countGender();
  }, [dataAnak]);

  // Fungsi untuk pencarian data
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredData(dataAnak);
    } else {
      const filtered = dataAnak.filter((item) =>
        (item.nama_balita && item.nama_balita.toLowerCase().includes(query.toLowerCase())) ||
        (item.Nama_Ibu && item.Nama_Ibu.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredData(filtered);
    }
  };

  // Mendapatkan nama ibu berdasarkan ID
  const getNamaIbuById = (id) => {
    const ibu = orangTuaOptions.find((orangTua) => orangTua.value === id);
    return ibu ? ibu.label : 'Nama Ibu Tidak Ditemukan';
  };

  const [items, setItems] = useState([
    { label: 'Laki-Laki', value: 'l' },
    { label: 'Perempuan', value: 'P' }
  ]);

  const handleDelete = (id) => {
    setSelectedId(id); // Simpan ID yang akan dihapus
    setConfirmVisible(true); // Tampilkan modal konfirmasi
  };

  const confirmDelete = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.delete(`${Config.API_URL}/balita/${selectedId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 204) {
        setConfirmVisible(false); // Sembunyikan modal
        fetchDataAnak(); // Refresh data setelah penghapusan
      }
    } catch (error) {
      setErrorMessage('Gagal menghapus data balita.');
      setErrorVisible(true); // Tampilkan modal error
    }
  };




  const renderItem = ({ item }) => (

    <View style={styles.verificationCard} >
      <View style={styles.verificationCardContent}>
        <View style={{ flexDirection: 'column', width: '70%' }}>

          <Text style={styles.verificationTextTitle}>{item.nama_balita}</Text>
          <View style={{ flexDirection: 'row' }}>
            <IbuHamil />
            <Text style={styles.verificationText3}>{getNamaIbuById(item.orangtua)}</Text>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Icon name="id-card" size={20} color="#424F5E" />
            <Text style={styles.verificationText3}>{item.nik_balita}</Text>
          </View>



        </View>
        <View style={{ flexDirection: 'column', top: 10, }}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('DetailAnak', { id : item.id })}
            >
              <Icon name="eye" size={20} color="#16DBCC" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id)}
            >
              <Icon name="trash" size={24} color="#FF6000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
    </View>
  );

  const [formData, setFormData] = useState({
    nama: '',
    nikAnak: '',
    orangTua: '',
    jenisKelamin: '',
    tempatLahir: '',
    tanggalLahir: null,
    beratBadanAwal: '',
    tinggiBadanAwal: '',
    riwayatPenyakit: '',
    riwayatKelahiran: '',
    keterangan: ''
  });

  const handleAddChildPress = () => {
    setModalVisible(true);
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };


  const handlePrintPress = () => {
    setPrintModalVisible(true);
  };
  // Fungsi untuk menambahkan anak
  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem('token');
    setLoadingVisible(true);
    try {
      const response = await axios.post(`${Config.API_URL}/balita`, {
        nama_balita: formData.nama,
        orangtua: formData.orangTua,
        nik_balita: formData.nikAnak,
        jenis_kelamin_balita: formData.jenisKelamin,
        tempat_lahir_balita: formData.tempatLahir,
        tanggal_lahir_balita: formData.tanggalLahir,
        berat_badan_awal_balita: formData.beratBadanAwal,
        tinggi_badan_awal_balita: formData.tinggiBadanAwal,
        riwayat_penyakit_balita: formData.riwayatPenyakit,
        riwayat_kelahiran_balita: formData.riwayatKelahiran,
        keterangan_balita: formData.keterangan
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 201) {
       
        setLoadingVisible(false); // Sembunyikan modal loading
        setSuccessVisible(true); // Tampilkan modal sukses
        fetchDataAnak();  // Refresh data setelah penambahan

        // Reset form setelah sukses
        setFormData({
          nama: '',
          nikAnak: '',
          orangTua: '',
          jenisKelamin: '',
          tempatLahir: '',
          tanggalLahir: null,
          beratBadanAwal: '',
          tinggiBadanAwal: '',
          riwayatPenyakit: '',
          riwayatKelahiran: '',
          keterangan: ''
        });
      }
    } catch (error) {
      setLoadingVisible(false); // Sembunyikan modal loading
      setErrorMessage('Gagal menyimpan data balita.');
      setErrorVisible(true); // Tampilkan modal error
    }
  };




  return (
    <View style={{ flex: 1, backgroundColor: '#F5F7FA' }}>
      <Header title="Data Anak" onLeftPress={() => navigation.goBack()} />
      {/* Search Input */}
      <View style={{ backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', paddingBottom: 10 }}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#718EBF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari balita atau nama ibu"
            placeholderTextColor={'#718EBF'}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginTop: 20 }}>
        <TouchableOpacity style={styles.cardBox}>
          <View style={[styles.cardHeader, { backgroundColor: '#E7EDFF' }]}>
            <AnakLaki/>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardHeaderText}>Jumlah Laki-Laki</Text>
            <Text style={styles.cardContentText}>{jumlahLaki}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cardBox}>
          <View style={[styles.cardHeader, { backgroundColor: '#FFE0EB' }]}>
            <AnakPerempuan/>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardHeaderText}>Jumlah Perempuan</Text>
            <Text style={styles.cardContentText}>{jumlahPerempuan}</Text>
          </View>
        </TouchableOpacity>
      </View>
      {filteredData.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Data Anak Belum Ada</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          style={{ backgroundColor: '#fff', marginTop: 20, borderRadius: 2 }}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}

      <TouchableOpacity style={styles.printButton} onPress={handlePrintPress}>
        <Icon name="print" size={30} color="white" />
      </TouchableOpacity>

      {/* Add Child Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddChildPress}>
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
      {/* Print Modal */}
      <Modal
        transparent={true}
        visible={printModalVisible}
        animationType="slide"
        onRequestClose={() => setPrintModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Cetak Data</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                // Implement Print Option 1
                setPrintModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>Cetak Semua Data Anak</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                // Implement Print Option 1
                setPrintModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>Cetak Data Anak Laki-Laki</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                // Implement Print Option 2
                setPrintModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>Cetak  Data Anak Perempuan</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Tambah Data Anak</Text>
            <DropDownPicker
              open={openOrangTua}
              value={formData.orangTua}
              items={orangTuaOptions}
              setOpen={setOpenOrangTua}
              setValue={(value) => handleInputChange('orangTua', value())}
              placeholder="Pilih nama orang tua"
              containerStyle={{ zIndex: 1000, }}
              style={styles.dropdown}
              dropDownStyle={styles.dropdown}
            />
            <TextInput
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="nama anak"
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
              value={formData.jenisKelamin}
              items={items}
              setOpen={setOpenBalita}
              onSelectItem={(item) => setFormData({ ...formData, jenisKelamin: item.value })}
              setItems={setItems}
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
                style={styles.datePicker}
                open={isDatePickerOpenBalita} //lita}
                date={formData.tanggalLahir || new Date()}
                mode="date"
                onConfirm={(date) => {
                  setDatePickerOpenBalita(false);
                  setFormData({ ...formData, tanggalLahir: date });
                  console.log('Selected date:', date);  // Log the selected date
                }}
                onCancel={() => {
                  setDatePickerOpenBalita(false);
                  console.log('Date picker cancelled');
                }}
              />
            </View>
            <TextInput
              placeholderTextColor="gray"
              style={styles.input}
              keyboardType='numeric'
              placeholder="Berat Badan Awal"
              value={formData.beratBadanAwal}
              onChangeText={(value) => handleInputChange('beratBadanAwal', value)}
            />
            <TextInput
              style={styles.input}
              placeholderTextColor="gray"
              keyboardType='numeric'
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

            <TouchableOpacity style={styles.saveButton} onPress={() => handleSubmit()}>
              <Text style={styles.saveButtonText}>Tambah</Text>
            </TouchableOpacity>
          </View>
      
        </View>
     
      </Modal>

      {/* Modal Loading */}
      <LoadingModal visible={loadingVisible} />

      {/* Modal Sukses */}
      <SuccessModal
        visible={successVisible}
        message="Data balita berhasil ditambahkan."
        onClose={() => setSuccessVisible(false)}
      />

      {/* Modal Error */}
      <ErrorModal
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />
      <ConfirmationModal
        visible={confirmVisible}
        message="Apakah Anda yakin ingin menghapus data anak ini?"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmVisible(false)}
      />
    </View>


  )
}


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


export default DataAnak