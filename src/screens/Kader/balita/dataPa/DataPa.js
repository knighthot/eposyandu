import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Modal, TextInput } from 'react-native'
import moment from 'moment';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import Header from '../../componentKader/Header';
import React, { useState, useEffect } from 'react'
import { PieChart } from "react-native-gifted-charts";
import { useNavigation } from '@react-navigation/native';
import Config from 'react-native-config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
const dummyData = [
  {
    id: 1,
    nama_balita: 'Balita 1',
    Nama_Ibu: 'Ibu 1',
    Nik_Balita: '1234',
    gizi: 'Berat Badan Kurang',
    umur: "06 bulan 1 tahun",
    BeratBadan: '0.6 kg',
    tanggalPemeriksaan: 'Rabu, 11 November 2024',
  },
  {
    id: 2,
    nama_balita: 'Balita 2',
    Nama_Ibu: 'Ibu 2',
    Nik_Balita: '56789',
    gizi: 'Berat Badan Normal',
    umur: "06 bulan 1 tahun",
    BeratBadan: '0.6 kg',
    tanggalPemeriksaan: 'Rabu, 11 November 2024'
  },
  {
    id: 3,
    nama_balita: 'Balita 3',
    Nama_Ibu: 'Ibu 3',
    Nik_Balita: '12456',
    gizi: 'Berat Badan Lebih',
    umur: "06 bulan 1 tahun",
    BeratBadan: '0.6 kg',
    tanggalPemeriksaan: 'Rabu, 11 November 2024'
  },

  {
    id: 4,
    nama_balita: 'Balita 4',
    Nama_Ibu: 'Ibu 4',
    Nik_Balita: '123456',
    gizi: 'Berat Badan Lebih',
    umur: "06 bulan 1 tahun",
    BeratBadan: '0.6 kg',
    tanggalPemeriksaan: 'Rabu, 11 November 2024'
  },

  {
    id: 5,
    nama_balita: 'Balita 5',
    Nama_Ibu: 'Ibu 5',
    Nik_Balita: '12345676',
    gizi: 'Berat Badan Lebih',
    umur: "06 bulan 1 tahun",
    BeratBadan: '0.6 kg',
    tanggalPemeriksaan: 'Rabu, 11 November 2024'
  },

  {
    id: 6,
    nama_balita: 'Balita 6',
    Nama_Ibu: 'Ibu 6',
    Nik_Balita: '123456789',
    gizi: 'Berat Badan Lebih',
    umur: "06 bulan 1 tahun",
    BeratBadan: '0.6 kg',
    tanggalPemeriksaan: 'Rabu, 11 November 2024'
  },




];



const BeratBadan = [
  {
    gizi: 'Berat Badan Normal',
    banyak: 10,
    color: '#60E7DC', // Set your color
  },

  {
    gizi: 'Berat Badan Kurang',
    banyak: 10,
    color: '#FFBB38', // Set your color
  },

  {
    gizi: 'Berat Badan Lebih',
    banyak: 10,
    color: '#FF0000', // Set your color
  },
];

const getGiziColor = (gizi) => {
  switch (gizi) {
    case 'Berat Badan Kurang':
      return '#FFF5D9';
    case 'Berat Badan Normal':
      return '#DCFAF8';
    case 'Berat Badan Lebih':
      return '#FFE0E0';
  }
}

const getGiziTextColor = (gizi) => {
  switch (gizi) {
    case 'Berat Badan Kurang':
      return 'orange';
    case 'Berat Badan Normal':
      return 'green';
    case 'Berat Badan Lebih':
      return '#FF0000';
  }
}

const renderItem = ({ item }) => (


  <View style={styles.verificationCard}>
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

        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.verificationText3}>{item.umur}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.verificationText3}>{item.BeratBadan}</Text>
        </View>



      </View>
      <View style={{ flexDirection: 'column', }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flexDirection: 'column', }}>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() =>
                Alert.alert('Confirmation', `Are you sure you want to delete user ${item.username}?`, [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'OK', onPress: () => handleDeleteUser(item.id) },
                ])
              }
            >
              <Icon name="trash" size={24} color="#FF0000" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.editButton, backgroundColor: getGiziColor(item.gizi) }}
              onPress={() => handleEditPress(item)}
            >
              <Text style={{ color: getGiziTextColor(item.gizi), width: 80, fontSize: 8, textAlign: 'center' }}>{item.gizi}</Text>
            </TouchableOpacity>

          </View>

        </View>
      </View>
    </View>
    <View style={{ justifyContent: 'flex-end', marginRight: 10 }}>
      <Text style={{ color: 'black', textAlign: 'right', fontSize: 10 }}> Tanggal Kunjungan : {item.tanggalPemeriksaan}</Text>
    </View>
  </View>
);

const DataPa = () => {
  const [printModalVisible, setPrintModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [openBalita, setOpenBalita] = useState(false);
  const [openDokter, setOpenDokter] = useState(false);  // Dropdown for Dokter
  const [openImunisasi, setOpenImunisasi] = useState(false);  // Dropdown for Imunisasi
  const [openVitamin, setOpenVitamin] = useState(false);  // Dropdown for Vitamin
  const [isDatePickerOpenBalita, setDatePickerOpenBalita] = useState(false);
  const [selectedImunisasi, setSelectedImunisasi] = useState(null);  // State for selected Imunisasi
  const [selectedVitamin, setSelectedVitamin] = useState(null);  // State for selected Vitamin
  const [dokterItems, setDokterItems] = useState([]);  // Data for Dokter dropdown
  const [selectedBalita, setSelectedBalita] = useState(null);  // Selected Balita ID
  const [selectedDokter, setSelectedDokter] = useState(null);  // Selected Dokter ID
  const [openStatusGizi, setOpenStatusGizi] = useState(false);  // Dropdown for Status Gizi
  const [balitaItems, setBalitaItems] = useState([]);
  const [perkembangan_balita, setPerkembangan_balita] = useState([]);
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState('');  // State untuk menyimpan query pencarian
  const [filteredData, setFilteredData] = useState([]);  // Data yang akan ditampilkan setelah di-filter

  const [formData, setFormData] = useState({
    idBalita: '',
    TanggalKunjungan: null,
    beratbadankg: '',
    beratbadangram: '',
    tinggibadan: '',
    keterangan: '',
    tipeVitamin: '',
    tipeImunisasi: '',
    lingkarKepala : '',
    idDokter: '',
  });

  useEffect(() => {
    const dropdownData = balitaItems.map((item) => ({
      label: `${item.Nik_Balita} - ${item.nama_balita}`, // Label to display in the dropdown
      value: item.Nik_Balita, // Value to store (Nik_Balita)
    }));
    setBalitaItems(dropdownData);  // Set dropdown items
  }, []);


  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredData(perkembangan_balita);  // Jika query kosong, tampilkan semua data
    } else {
      // Filter data sesuai dengan nama balita atau nama ibu
      const filtered = dummyData.filter((item) =>
        item.nama_balita.toLowerCase().includes(query.toLowerCase()) ||
        item.Nama_Ibu.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

   // Fetch Balita and Dokter data
   useEffect(() => {
    fetchPerkembanganBalita();
    fetchBalita();
    fetchDokter();
  }, []);

  const fetchPerkembanganBalita = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get(`${Config.API_URL}/perkembangan-balita`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPerkembangan_balita(response.data);
      console.log(response.data);
    } catch (error) {
    }
  }

  const fetchBalita = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get(`${Config.API_URL}/balita`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const formattedBalita = response.data.map((balita) => ({
        label: `${balita.nik_balita} - ${balita.nama_balita}`,
        value: balita.id,
      }));
      setBalitaItems(formattedBalita);
    } catch (error) {
      console.error('Error fetching balita data:', error);
    }
  };

  const fetchDokter = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get(`${Config.API_URL}/dokter`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const formattedDokter = response.data.map((dokter) => ({
        label: dokter.nama,
        value: dokter.id,
      }));
      setDokterItems(formattedDokter);
    } catch (error) {
      console.error('Error fetching dokter data:', error);
    }
  };


  const handleSave = async () => {
    const token = await AsyncStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const id = decodedToken.id;
    const newFormData = {
      balita: selectedBalita,
      tanggal_kunjungan: formData.TanggalKunjungan,
      berat_badan: `${formData.beratbadankg}.${formData.beratbadangram}`,
      tinggi_badan: formData.tinggibadan,
      lingkar_kepala: formData.lingkarKepala,
      status_gizi: "baik",
      tipe_imunisasi: selectedImunisasi,
      tipe_vitamin: selectedVitamin,
      keterangan: formData.keterangan,
      dokter: selectedDokter,
      kader: id,  // Add kader id dynamically or from token
    };

    try {
      console.log(newFormData);
      console.log(`${Config.API_URL}/perkembangan-balita/`)
      await axios.post(`${Config.API_URL}/perkembangan-balita/`, newFormData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModalVisible(false);
      alert('Data berhasil disimpan');
      // Optionally, refresh the list or perform other actions
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
    }
  };



  const tipeImunisasiItems = [
    { label: 'Tidak ada', value: 'Tidak ada' },
    { label: 'BCGE', value: 'BCGE' },
    { label: 'Hepatitis B', value: 'Hepatitis B' },
    { label: 'Polio', value: 'Polio' },
    { label: 'DPT-HB-Hib', value: 'DPT-HB-Hib' },
    { label: 'Campak', value: 'Campak' },
    { label: 'MR', value: 'MR' }

  ];

  const tipeVitaminItems = [
    { label: 'Tidak ada', value: 'Tidak ada' },
    { label: 'Vitamin A', value: 'A' },
    { label: 'Cacing', value: 'Cacing' }
  ];


  const handleAddChildPress = () => {
    setModalVisible(true);
  };

  const handleInputChange = (name, value) => {
    console.log(`Input ${name} changed to ${value}`);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  

  const handlePrintPress = () => {
    setPrintModalVisible(true);
  };



  return (
    <View style={{ flex: 1, backgroundColor: '#F5F7FA' }}>
      <Header title="Data Balita" onLeftPress={() => navigation.goBack()} />
      <View style={{ backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', paddingBottom: 10 }}>
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
          <View style={styles.cardHeader}>
            <PieChart
              data={BeratBadan.map((item) => ({
                value: item.banyak,
                color: item.color,

              }))}
              radius={50} // Adjust the radius to change the size of the pie chart
              innerRadius={30} // Adjust the inner radius for a donut chart
              donut={true} // Optional: make it a donut chart
              innerCircleColor={'#fff'}
              innerCircleBorderWidth={3}
              showText
              textColor="black"
              textSize={14}
              showValuesAsLabels={true}
            />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardHeaderText}>Berat Badan</Text>

            <View style={{ flexDirection: 'row', marginTop: 20, width: '80%' }}>
              <View style={{ flexDirection: 'column', flex: 1 }}>
                <View style={{ backgroundColor: '#FFBB38', width: 80, height: 10, borderRadius: 5 }}></View>
                <Text style={styles.verificationText4}>Kurang Ideal</Text>
              </View>
              <View style={{ flexDirection: 'column', flex: 1, marginHorizontal: 1 }}>
                <View style={{ backgroundColor: '#60E7DC', width: 80, height: 10, borderRadius: 5 }}></View>
                <Text style={styles.verificationText4}>Normal</Text>
              </View>
              <View style={{ flexDirection: 'column', flex: 1 }}>
                <View style={{ backgroundColor: '#FF0000', width: 80, height: 10, borderRadius: 5 }}></View>
                <Text style={styles.verificationText4}>Obesitas</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <FlatList
          data={filteredData}
          style={{ backgroundColor: '#fff', marginTop: 20, borderRadius: 2, marginHorizontal: 20, maxHeight: 400 }}
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

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Tambah Data PA</Text>
            <View style={{ marginBottom: 10 }}>
              <Text style={{ color: 'black', fontWeight: 'bold' }}>Cek Gizi</Text>
            </View>
            <DropDownPicker
              open={openBalita}
              value={selectedBalita}
              items={balitaItems}
              setOpen={setOpenBalita}
              setValue={setSelectedBalita}
              setItems={setBalitaItems}
              placeholder="Pilih Balita"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />

            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setDatePickerOpenBalita(true)}>
              <Text style={styles.datePickerButtonText}>
                {formData.TanggalKunjungan ? moment(formData.TanggalKunjungan).format('DD/MM/YYYY') : 'tanggal kunjungan'}
              </Text>
            </TouchableOpacity>
            <DatePicker
              modal
              style={styles.datePicker}
              open={isDatePickerOpenBalita} //lita}
              date={formData.TanggalKunjungan || new Date()}
              mode="datetime"
              onConfirm={(date) => {
                setDatePickerOpenBalita(false);
                setFormData({ ...formData, TanggalKunjungan: date });
                console.log('Selected date:', date);  // Log the selected date
              }}
              onCancel={() => {
                setDatePickerOpenBalita(false);
                console.log('Date picker cancelled');
              }}
            />

            <View style={{ flexDirection: 'row' }}>
            <TextInput
  style={styles.input1}
  placeholder="Berat badan (Kg)"
  keyboardType="numeric"
  maxLength={16}
  placeholderTextColor="gray"
  value={formData.beratbadankg}  // Mengikat nilai input ke state
  onChangeText={(value) => handleInputChange('beratbadankg', value)}  // Meng-update state untuk kg
/>

<TextInput
  style={styles.input1}
  placeholder="Berat Badan (Gram)"
  value={formData.beratbadangram}  // Mengikat nilai input ke state
  keyboardType="numeric"
  placeholderTextColor="gray"
  onChangeText={(value) => handleInputChange('beratbadangram', value)}  // Meng-update state untuk gram
/>

              

            </View>
            <TextInput
                style={styles.input}
                placeholder="Lingkar kepala (cm)"
                value={formData.lingkarKepala}
                keyboardType="numeric"
                placeholderTextColor="gray"
                onChangeText={(value) => handleInputChange('lingkarKepala', value)}
              />
           <TextInput
  style={styles.input}
  placeholder="Tinggi Badan (Cm)"
  keyboardType="numeric"
  placeholderTextColor="gray"
  value={formData.tinggibadan}
  onChangeText={(value) => handleInputChange('tinggibadan', value)} 
/>

            <View style={{ marginBottom: 10 }}>
              <Text style={{ color: 'black', fontWeight: 'bold' }}>Imunisasi</Text>
            </View>
            <DropDownPicker
              open={openImunisasi}
              value={selectedImunisasi}
              items={tipeImunisasiItems}
              setOpen={setOpenImunisasi}
              setValue={setSelectedImunisasi}
              setItems={() => {}}
              placeholder="Pilih Imunisasi"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />

            <View style={{ marginBottom: 10 }}>
              <Text style={{ color: 'black', fontWeight: 'bold' }}>Vitamin</Text>
            </View>
            {/* Dropdown for Vitamin */}
            <DropDownPicker
              open={openVitamin}
              value={selectedVitamin}
              items={tipeVitaminItems}
              setOpen={setOpenVitamin}
              setValue={setSelectedVitamin}
              setItems={() => {}}
              placeholder="Pilih Vitamin"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
 <View style={{ marginBottom: 10 }}>
              <Text style={{ color: 'black', fontWeight: 'bold' }}>Dokter</Text>
            </View>
            {/* Dropdown for Dokter */}
            <DropDownPicker
              open={openDokter}
              value={selectedDokter}
              items={dokterItems}
              setOpen={setOpenDokter}
              setValue={setSelectedDokter}
              setItems={setDokterItems}
              placeholder="Pilih Dokter"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
           <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Simpan</Text>
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

  verificationText4: {
    color: 'black',
    fontFamily: 'Urbanist-Bold',
    marginBottom: 5,
    fontSize: 9,
    flexWrap: 'wrap',
    width: 150,
    marginLeft: 10,
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
    width: '100%',
    height: '100%',
    padding: 10,
    flexDirection: 'row',
  },
  cardHeader: {
    marginTop: 10,
    padding: 10,
    alignContent: 'center',
    borderRadius: 30,
  },
  cardHeaderText: {
    marginTop: 25,
    textAlign: 'center',
    color: 'black',
    fontSize: 15,

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
    flex: 1,
    paddingVertical: 8,
    borderRadius: 25,
    marginHorizontal: 4,
    paddingHorizontal: 5,
    height: 40,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',

  },
  deleteButton: {
    flex: 1,
    marginHorizontal: 25,
    paddingVertical: 8,
    width: 45,
    height: 40,
    borderRadius: 50,
    backgroundColor: '#FFE0E0',
    paddingHorizontal: 12,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
  dropdownContainer: {
    backgroundColor: '#EFEFEF',   // Background color of dropdown container
    borderColor: '#ccc',          // Border color
    borderWidth: 1,               // Border width
    borderRadius: 8,              // Rounded corners for dropdown container
    marginTop: 5,                 // Space between dropdown and above element
    maxHeight: 150,               // Set a maximum height for dropdown list
    zIndex: 9999            // Ensure dropdown is above other UI elements
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
    width: "100%",
    borderRadius: 10,
    justifyContent: 'center',
  },
  datePickerButtonText: {
    color: '#000',
    marginLeft: 20,
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



});


export default DataPa