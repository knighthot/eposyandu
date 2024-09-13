import { View, Text, StyleSheet, TouchableOpacity,  FlatList, Modal, TextInput } from 'react-native'
import moment from 'moment';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import React, { useState,useEffect } from 'react'
import { useNavigation,useFocusEffect } from '@react-navigation/native';
import Header from '../../componentKader/Header';
import Config from 'react-native-config';
import axios from 'axios';
import ErrorModal from '../../../../components/modals/ErrorModal';
import LoadingModal from '../../../../components/modals/LoadingModal';
import SuccessModal from '../../../../components/modals/SuccessModal ';
import ConfirmationModal from '../../../../components/modals/ConfirmationModal';
import AsyncStorage from '@react-native-async-storage/async-storage';




const DataOrtu = () => {
  const [printModalVisible, setPrintModalVisible] = useState(false);
  
  const [orangtua, setOrangTua] = useState([]);  

  const [jumlahAnak, setJumlahAnak] = useState(0);
  const [jumlahortu, setJumlahOrtu] = useState(0);
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);  // Current page number
  const [pageSize] = useState(10);  // Limit per page
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);  // Total pages available
  const [selectedId, setSelectedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');  // State untuk menyimpan query pencarian
  const [filteredData, setFilteredData] = useState([]);  // Data yang akan ditampilkan setelah di-filter
  const navigation = useNavigation();
  

  const fetchDataOrangTua = async () => {
    setIsLoading(true);
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get(`${Config.API_URL}/orangtua`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const totalItems = response.data.length;  // Total items
      setJumlahOrtu(response.data.length);
      setOrangTua(response.data);
      setTotalPages(Math.ceil(totalItems / pageSize));  // Calculate total pages
      setFilteredData(response.data.slice(0, pageSize));  // Set initial data for the first page
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDataAnak = async () => {
    setIsLoading(true);
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get(`${Config.API_URL}/balita`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setJumlahAnak(response.data.length);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }


  useFocusEffect(
    React.useCallback(() => {
      fetchDataAnak();
      fetchDataOrangTua();
      return () => { };
    }, [])
  );
  // Function to handle next page
  const handleNextPage = () => {
    if (pageNumber < totalPages) {
      const nextPage = pageNumber + 1;
      setPageNumber(nextPage);
      setFilteredData(orangtua.slice((nextPage - 1) * pageSize, nextPage * pageSize));  // Set data for next page
    }
  };

  // Function to handle previous page
  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      const prevPage = pageNumber - 1;
      setPageNumber(prevPage);
      setFilteredData(orangtua.slice((prevPage - 1) * pageSize, prevPage * pageSize));  // Set data for previous page
    }
  };

  const confirmDelete = async () => {
    console.log(selectedId)
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.delete(`${Config.API_URL}/orangtua/${selectedId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 204) {
        setConfirmVisible(false); // Sembunyikan modal
        fetchDataOrangTua(); // Refresh data setelah penghapusan
      }
    } catch (error) {
      setErrorMessage(`Gagal menghapus data balita. ${error.message}`,);
      setErrorVisible(true); // Tampilkan modal error
    }
  };

  const handleDelete = (id) => {
    setSelectedId(id); // Simpan ID yang akan dihapus
    setConfirmVisible(true); // Tampilkan modal konfirmasi
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredData(orangtua);
    } else {
      const filtered = orangtua.filter((item) =>
        (item.nama_ayah && item.nama_ayah.toLowerCase().includes(query.toLowerCase())) ||
        (item.nama_ibu && item.nama_ibu.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredData(filtered);
    }
  };



  const handleAddChildPress = () => {
    navigation.navigate('IbuForm')
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };


  const handlePrintPress = () => {
    setPrintModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <View style={styles.verificationCard}>
      <View style={styles.verificationCardContent}>
        <View style={{ flexDirection: 'column', width: '70%' }}>
  
          <Text style={styles.verificationTextTitle}>{item.nama_ibu}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Icon name="user" size={20} color="#424F5E" />
            <Text style={styles.verificationText3}>{item.nama_ayah}</Text>
          </View>
  
          <View style={{ flexDirection: 'row' }}>
          <Icon name="id-card" size={20} color="#424F5E" />
            <Text style={styles.verificationText3}>{item.no_kk}</Text>
          </View>
  
  
  
        </View>
        <View style={{ flexDirection: 'column', top: 10, }}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('DetailOrtu', { id :item.id })}
            >
              <Icon name="eye" size={20} color="#16DBCC" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() =>
                handleDelete(item.id)
              }
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
      <Header title="Data Orang tua" onLeftPress={() => navigation.goBack()} />
      {/* Search Input */}
      <View style={{backgroundColor: 'white', justifyContent: 'center', alignItems: 'center',paddingBottom: 10}}>
        
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#718EBF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari nama ibu dan ayah.."
          placeholderTextColor={'#718EBF'}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      </View>
     <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginTop: 20 }}>
                <TouchableOpacity style={styles.cardBox}>
                    <View style={[styles.cardHeader, { backgroundColor: '#FFF5D9' }]}>
                        <IconMaterial name="account-alert" size={30} color='#FFBB38' />
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardHeaderText}>Jumlah Data Ortu</Text>
                        <Text style={styles.cardContentText}>{jumlahortu}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cardBox}>
                    <View style={[styles.cardHeader, { backgroundColor: '#DCFAF8' }]}>
                        <IconMaterial name="account-alert" size={30} color='#16DBCC' />
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardHeaderText}>Jumlah Data Anak</Text>
                        <Text style={styles.cardContentText}>{jumlahAnak}</Text>
                    </View>
                </TouchableOpacity>
            </View>
      <View>
        <FlatList
          data={filteredData}
          style={{ backgroundColor: '#fff', marginVertical: 20, borderRadius: 2,maxHeight: 400}}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>

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
            <Text style={styles.modalTitle}>Print Options</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                // Implement Print Option 1
                setPrintModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>Print Option 1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                // Implement Print Option 2
                setPrintModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>Print Option 2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setPrintModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
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
    color: 'black',
    fontFamily: 'Urbanist-ExtraBold',
    marginBottom: 5,
    flexWrap: 'wrap',
    fontSize: 15,
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
    fontWeight: 'bold',
  },
  modalButton: {
    width: '100%',
    padding: 10,
    backgroundColor: '#008EB3',
    borderRadius: 5,
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
    borderRadius: 10,
    justifyContent: 'center',
  },
  datePickerButtonText: {
    color: '#000',
    marginLeft: 20,
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

});


export default DataOrtu