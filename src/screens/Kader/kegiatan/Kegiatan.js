import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput, Alert } from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';  // Import Axios
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Kegiatan = () => {
  const navigation = useNavigation();
  const [printModalVisible, setPrintModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    nama_kegiatan: '',
    hari_tanggal: '',
    jenisKegiatan: '',
    deskripsi: '',
  });

  // Fetch kegiatan from backend
  useEffect(() => {
    fetchKegiatan();
  }, []);

  const fetchKegiatan = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Token is missing');
      }
  
      const response = await axios.get(`${Config.API_URL}/kegiatan`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFilteredData(response.data);
    } catch (error) {
      console.error('Error fetching kegiatan:', error);
      Alert.alert('Error', 'Failed to fetch kegiatan data.');
    }
  };
  

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      fetchKegiatan();
    } else {
      const filtered = filteredData.filter((item) =>
        item.nama.toLowerCase().includes(query.toLowerCase()) ||
        item.jenis.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.verificationCard}>
      <View style={styles.verificationCardContent}>
        <View style={{ flexDirection: 'column', width: '55%' }}>
          <Text style={styles.verificationTextTitle}>{item.nama}</Text>
          <Text style={styles.verificationText}>Jenis kegiatan</Text>
          <Text style={styles.verificationText3}>{item.jenis}</Text>
          <Text style={styles.verificationText}>Tanggal kegiatan</Text>
          <Text style={styles.verificationText3}>{moment(item.tanggal).format('dddd, DD MMMM YYYY')}</Text>
        </View>
        <View style={{ flexDirection: 'column', top: 10 }}>
          <Text style={styles.verificationText3} numberOfLines={6} ellipsizeMode="tail">
            {item.deskripsi}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditKegiatan(item)}
            >
              <Icon name="pencil" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() =>
                Alert.alert('Confirmation', `Are you sure you want to delete this item?`, [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'OK', onPress: () => handleDeleteKegiatan(item.id) },
                ])
              }
            >
              <Icon name="trash" size={24} color="#FF0000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const handleAddKegiatanPress = () => {
    setFormData({
      nama_kegiatan: '',
      hari_tanggal: '',
      jenisKegiatan: '',
      deskripsi: '',
    });
    setModalVisible(true);
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleAddSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Token is missing');
      }
  
      await axios.post(
        `${Config.API_URL}/kegiatan`,
        {
          nama: formData.nama_kegiatan,
          tanggal: moment(formData.hari_tanggal, 'dddd, DD MMMM YYYY').toISOString(),
          jenis: formData.jenisKegiatan,
          deskripsi: formData.deskripsi,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchKegiatan();
      setModalVisible(false);
    } catch (error) {
      console.error('Error details:', error);
      
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      Alert.alert('Error', errorMessage);
    }
  };
  


  const handleEditKegiatan = (item) => {
    setSelectedItem(item);
    setFormData({
      nama_kegiatan: item.nama_kegiatan,
      hari_tanggal: moment(item.tanggal_kegiatan).format('dddd, DD MMMM YYYY'),
      jenisKegiatan: item.jenis_kegiatan,
      deskripsi: item.deskripsi,
    });
    setEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Token is missing');
      }
  
      await axios.put(
        `${Config.API_URL}/kegiatan/${selectedItem.id}`,
        {
          nama: formData.nama_kegiatan,
          tanggal: moment(formData.hari_tanggal, 'dddd, DD MMMM YYYY').toISOString(),
          jenis: formData.jenisKegiatan,
          deskripsi: formData.deskripsi,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchKegiatan();
      setEditModalVisible(false);
    } catch (error) {
      console.error('Error details:', error);
      
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      Alert.alert('Error', errorMessage);
    }
  };
  

  const handleDeleteKegiatan = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Token is missing');
      }
  
      await axios.delete(`${Config.API_URL}/kegiatan/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchKegiatan();
    } catch (error) {
      console.error('Error details:', error);
  
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      Alert.alert('Error', errorMessage);
    }
  };
  


  return (
    <View style={{ flex: 1, backgroundColor: '#F5F7FA' }}>
      {/* Search Input */}
      <View style={{ backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', paddingBottom: 10 }}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#718EBF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari kegiatan "
            placeholderTextColor={'#718EBF'}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <FlatList
        data={filteredData}
        style={styles.flatList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />

      <TouchableOpacity style={styles.printButton} onPress={() => {}}>
        <Icon name="print" size={30} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.addButton} onPress={handleAddKegiatanPress}>
        <Icon name="plus" size={30} color="white" />
      </TouchableOpacity>

      {/* Add/Edit Kegiatan Modal */}
      <Modal
        transparent={true}
        visible={modalVisible || editModalVisible}
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(false);
          setEditModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {editModalVisible ? 'Edit Kegiatan' : 'Tambah Kegiatan'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nama Kegiatan"
              placeholderTextColor="gray"
              value={formData.nama_kegiatan}
              onChangeText={(text) => handleInputChange('nama_kegiatan', text)}
            />

            <TouchableOpacity onPress={() => setDatePickerOpen(true)}>
              <TextInput
                style={styles.input}
                placeholder="Tanggal Kegiatan"
                placeholderTextColor="gray"
                value={formData.hari_tanggal}
                editable={false}
              />
            </TouchableOpacity>

            <DropDownPicker
              open={openDropdown}
              value={formData.jenisKegiatan}
              items={[
                { label: 'Balita', value: 'balita' },
                { label: 'Lansia', value: 'lansia' },
              ]}
              setOpen={setOpenDropdown}
              setValue={(value) => handleInputChange('jenisKegiatan', value())}
              placeholder="Pilih Jenis Kegiatan"
              style={styles.dropdown}
            />

            <TextInput
              style={styles.input}
              placeholder="Deskripsi Kegiatan"
              placeholderTextColor="gray"
              value={formData.deskripsi}
              onChangeText={(text) => handleInputChange('deskripsi', text)}
              multiline
              numberOfLines={4}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  if (editModalVisible) {
                    handleEditSubmit();
                  } else {
                    handleAddSubmit();
                  }
                }}
              >
                <Text style={styles.modalButtonText}>{editModalVisible ? 'Simpan' : 'Tambah'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setModalVisible(false);
                  setEditModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Batal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <DatePicker
        modal
        open={isDatePickerOpen}
        date={new Date()}
        onConfirm={(date) => {
          setDatePickerOpen(false);
          handleInputChange('hari_tanggal', moment(date).format('dddd, DD MMMM YYYY'));
        }}
        onCancel={() => setDatePickerOpen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  verificationCard: {
    backgroundColor: 'white',
    marginBottom:31,
    borderColor: 'grey',
    width: '95%',
    elevation: 5,
    borderRadius: 25,
    padding: 10,
    marginHorizontal: 10,
    flex: 1,
    marginVertical: 10,
    position: 'relative'
  },
  verificationCardContent: {
    margin: 10,
    height:120,
    flexDirection: 'row',
    position: 'relative',
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
    color: 'gray',
    fontFamily: 'Urbanist-Reguler',
    fontSize: 12,
    flexWrap: 'wrap',
  },
  verificationText3: {
    color: 'black',
    fontFamily: 'Urbanist-Bold',
    marginBottom: 5,
    
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
    marginBottom: 2,
    flexWrap: 'wrap',
    fontSize: 15,
  },

 
  buttonContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    flex:1,
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
    left: 10,
    position: 'absolute',
    backgroundColor: '#008EB3',
  },
  deleteButton: {
    paddingVertical: 8,
    height: 40,
    left: 80,
  
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: '#FFE0E0',
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
    height: 450,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    flex:1,
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
   width: '100%',
    borderRadius: 10,
    justifyContent: 'center',
  },
  datePickerButtonText: {
    color: '#000',
    marginLeft: 20,
  },

});


export default Kegiatan