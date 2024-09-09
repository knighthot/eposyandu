import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Modal, TextInput } from 'react-native'
import moment from 'moment';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import Header from '../../componentKader/Header';
const dummyData = [
  {
    id: 1,
    nama_balita: 'Balita 1',
    Nama_Ibu: 'Ibu 1',
    Nik_Balita: '1234567890123456',
  },
  {
    id: 2,
    nama_balita: 'Balita 2',
    Nama_Ibu: 'Ibu 2',
    Nik_Balita: '1234567890123456',
  },
  {
    id: 3,
    nama_balita: 'Balita 3',
    Nama_Ibu: 'Ibu 3',
    Nik_Balita: '1234567890123456',
  },


];




const DataAnak = () => {
  const navigation = useNavigation();
  const [printModalVisible, setPrintModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [openBalita, setOpenBalita] = useState(false);
  const [isDatePickerOpenBalita, setDatePickerOpenBalita] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');  // State untuk menyimpan query pencarian
  const [filteredData, setFilteredData] = useState(dummyData);  // Data yang akan ditampilkan setelah di-filter

  const [items, setItems] = useState([
    { label: 'Laki-Laki', value: 'l' },
    { label: 'Perempuan', value: 'P' }
  ]);

  
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredData(dummyData);  // Jika query kosong, tampilkan semua data
    } else {
      // Filter data sesuai dengan nama balita atau nama ibu
      const filtered = dummyData.filter((item) =>
        item.nama_balita.toLowerCase().includes(query.toLowerCase()) ||
        item.Nama_Ibu.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const renderItem = ({ item }) => (
  
    <View style={styles.verificationCard} >
      <View style={styles.verificationCardContent}>
        <View style={{ flexDirection: 'column', width: '70%' }}>
  
          <Text style={styles.verificationTextTitle}>{item.nama_balita}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Icon name="user" size={20} color="#16DBCC" />
            <Text style={styles.verificationText3}>{item.Nama_Ibu}</Text>
          </View>
  
          <View style={{ flexDirection: 'row' }}>
            <Icon name="user" size={20} color="#16DBCC" />
            <Text style={styles.verificationText3}>{item.Nik_Balita}</Text>
          </View>
  
  
  
        </View>
        <View style={{ flexDirection: 'column', top: 10, }}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('DetailAnak', { item })}
            >
              <Icon name="eye" size={20} color="#16DBCC" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() =>
                Alert.alert('Confirmation', `Are you sure you want to delete user ${item.username}?`, [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'OK', onPress: () => handleDeleteUser(item.id) },
                ])
              }
            >
              <Icon name="trash" size={24} color="#FF6000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const [formData, setFormData] = useState({
    nikAnak: '',
    noKK: '',
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


  return (
    <View style={{ flex: 1, backgroundColor: '#F5F7FA' }}>
     <Header title="Data Anak" onLeftPress={() => navigation.goBack()} />
      {/* Search Input */}
      <View style={{backgroundColor: 'white', justifyContent: 'center', alignItems: 'center',paddingBottom: 10}}>
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
            <IconMaterial name="account-alert" size={30} color='#396AFF' />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardHeaderText}>Jumlah Laki-Laki</Text>
            <Text style={styles.cardContentText}>3</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cardBox}>
          <View style={[styles.cardHeader, { backgroundColor: '#FFE0EB' }]}>
            <IconMaterial name="account-alert" size={30} color='#FF82AC' />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardHeaderText}>Jumlah Perempuan</Text>
            <Text style={styles.cardContentText}>4</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <FlatList
          data={filteredData}
          style={{ backgroundColor: '#fff', marginTop: 20, borderRadius: 2 }}
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

            <TextInput
              style={styles.input}
              placeholder="NIK Anak"
              keyboardType="numeric"
              maxLength={16}
              placeholderTextColor="gray"
              value={formData.nikAnak}
              onChangeText={(value) => handleInputChange('nikAnak', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="No KK"
              keyboardType="numeric"
              maxLength={16}
              placeholderTextColor="gray"
              value={formData.noKK}
              onChangeText={(value) => handleInputChange('noKK', value)}
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

            <TouchableOpacity style={styles.saveButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.saveButtonText}>Tambah</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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