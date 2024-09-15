import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Modal, TextInput, Alert } from 'react-native'
import moment from 'moment';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { antropometriBoys, antropometriGirl } from './DataAntropometri';
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
import ErrorModal from '../../../../components/modals/ErrorModal';

const getGiziColor = (status_gizi) => {
  switch (status_gizi) {
    case 'buruk':
      return '#FFEEEE'; // Latar belakang merah lembut
    case 'kurang':
      return '#FFF4D1'; // Latar belakang kuning lembut
    case 'baik':
      return '#E0F7FA'; // Latar belakang hijau lembut (soft turquoise)
    case 'lebih':
      return '#FFE5DC'; // Latar belakang oranye lembut
    case 'obesitas':
      return '#F4CCCC'; // Latar belakang merah tua lembut
    default:
      return '#FFFFFF'; // Default warna putih jika status tidak ditemukan
  }
}



const getGiziTextColor = (status_gizi) => {
  switch (status_gizi) {
    case 'buruk':
      return '#FF0000'; // Teks merah kuat
    case 'kurang':
      return '#FFBB38'; // Teks oranye kuat
    case 'baik':
      return '#00796B'; // Teks hijau kuat
    case 'lebih':
      return '#FF4500'; // Teks oranye gelap untuk lebih
    case 'obesitas':
      return '#8B0000'; // Teks merah tua kuat
    default:
      return 'black'; // Default warna hitam
  }
}








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
  const [balitaItems, setBalitaItems] = useState([]);
  const [perkembangan_balita, setPerkembangan_balita] = useState([]);
  const navigation = useNavigation();
  const [BalitaData, setBalitaData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');  // State untuk menyimpan query pencarian
  const [filteredData, setFilteredData] = useState([]);  // Data yang akan ditampilkan setelah di-filter
  const [selectedAntropometri, setSelectedAntropometri] = useState(null);
  const [zScore, setZScore] = useState(null); // State untuk menyimpan hasil Z-Score
  const [statusGizi, setStatusGizi] = useState(null); // State untuk status gizi
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedBalitaDetail, setSelectedBalitaDetail] = useState(null);
  const [giziData, setGiziData] = useState([
    { gizi: 'Buruk', banyak: 0, color: '#FF0000' }, // Merah untuk buruk
    { gizi: 'Kurang', banyak: 0, color: '#FFBB38' }, // Kuning untuk kurang
    { gizi: 'Baik', banyak: 0, color: '#60E7DC' }, // Hijau untuk baik
    { gizi: 'Lebih', banyak: 0, color: '#FF7F50' }, // Oranye untuk lebih
    { gizi: 'Obesitas', banyak: 0, color: '#8B0000' } // Warna gelap untuk obesitas
  ]);
  const [modalEditMode, setModalEditMode] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);  // Current page number
  const [pageSize] = useState(10);  // Limit per page
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [totalPages, setTotalPages] = useState(1);  // Total pages available
  const [formData, setFormData] = useState({
    id: '', // Add this for edit mode
    idBalita: '',
    TanggalKunjungan: null,
    beratbadankg: '',
    beratbadangram: '',
    tinggibadan: '',
    keterangan: '',
    tipeVitamin: '',
    tipeImunisasi: '',
    lingkarKepala: '',
    idDokter: '',
    keterangan: '',
  });

  useEffect(() => {
    const dropdownData = balitaItems.map((item) => ({
      label: `${item.Nik_Balita} - ${item.nama_balita}`, // Label to display in the dropdown
      value: item.Nik_Balita, // Value to store (Nik_Balita)
    }));
    setBalitaItems(dropdownData);  // Set dropdown items
  }, []);

  // Handle editing mode
  const handleEditPress = (item) => {
    setModalEditMode(true); // Set the modal to edit mode
    setFormData({
      id: item.id, // Load the ID of the selected item
      TanggalKunjungan: item.tanggal_kunjungan ? new Date(item.tanggal_kunjungan) : null,
      beratbadankg: item.berat_badan.toString().split('.')[0],
      beratbadangram: item.berat_badan.toString().split('.')[1],
      tinggibadan: item.tinggi_badan.toString(),
      keterangan: item.keterangan,
      tipeVitamin: item.tipe_vitamin,
      tipeImunisasi: item.tipe_imunisasi,
      lingkarKepala: item.lingkar_kepala.toString(),
      idDokter: item.dokter.toString(),
    });
    setSelectedImunisasi(item.tipe_imunisasi);
    setSelectedVitamin(item.tipe_vitamin);
    setSelectedDokter(item.dokter);
    setSelectedBalita(item.balita);
    setModalVisible(true);
  };


  const handleDeleteUser = async (id) => {
    const token = await AsyncStorage.getItem('token');
    try {
      await axios.delete(`${Config.API_URL}/perkembangan-balita/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Data berhasil dihapus');
      fetchPerkembanganBalita(); // Memperbarui data setelah penghapusan
    } catch (error) {
      setErrorMessages('Gagal menghapus data balita.');
      setIsErrorModalVisible(true);
    }
  };

  const renderItem = ({ item }) => (


    <TouchableOpacity style={styles.verificationCard} onPress={() => handleCardPress(item)}>
      <View style={styles.verificationCardContent}>
        <View style={{ flexDirection: 'column', width: '70%' }}>

          <Text style={styles.verificationTextTitle}>{item.nama_balita}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Icon name="user" size={20} color="#16DBCC" />
            <Text style={styles.verificationText3}>{item.status_gizi}</Text>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Icon name="user" size={20} color="#16DBCC" />
            <Text style={styles.verificationText3}>{item.nik_balita}</Text>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.verificationText3}>{item.umur_balita} bulan</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.verificationText3}>{item.keterangan}</Text>
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
                style={{ ...styles.editButton, backgroundColor: getGiziColor(item.status_gizi) }}
                onPress={() => handleEditPress(item)}
              >
                <Text style={{ color: getGiziTextColor(item.status_gizi), width: 80, fontSize: 14, textAlign: 'center' }}>{item.status_gizi}</Text>
              </TouchableOpacity>

            </View>

          </View>
        </View>
      </View>
      <View style={{ justifyContent: 'flex-end', marginRight: 10 }}>
        <Text style={{ color: 'black', textAlign: 'right', fontSize: 10 }}> Tanggal Kunjungan : {item.tanggal_kunjungan}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredData(perkembangan_balita);  // Jika query kosong, tampilkan semua data
    } else {
      // Filter data sesuai dengan nama balita atau nama ibu
      const filtered = perkembangan_balita.filter((item) =>
        item.nama_balita.toLowerCase().includes(query.toLowerCase()) ||
        item.status_gizi.toLowerCase().includes(query.toLowerCase())
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

      const pemeriksaanData = response.data;

      // Ambil semua ID balita dari data pemeriksaan
      const balitaIds = pemeriksaanData.map(pemeriksaan => pemeriksaan.balita);

      // Fetch data balita berdasarkan ID balita
      const balitaPromises = balitaIds.map(id => axios.get(`${Config.API_URL}/balita/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }));

      // Tunggu semua request selesai
      const balitaResponses = await Promise.all(balitaPromises);
      const balitaData = balitaResponses.map(response => response.data);

      // Gabungkan data pemeriksaan balita dengan data balita
      const mergedData = pemeriksaanData.map((pemeriksaan, index) => ({
        ...pemeriksaan,
        nama_balita: balitaData[index].nama_balita,
        nik_balita: balitaData[index].nik_balita,
        umur_balita: moment().diff(moment(balitaData[index].tanggal_lahir_balita), 'months'), // Menghitung umur dalam bulan
        createdAt: pemeriksaan.createdAt, // Pastikan createdAt tersedia di data pemeriksaan
      }));

      // Urutkan data berdasarkan createdAt dalam urutan menurun (data terbaru di atas)
      mergedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // --- Logic for PieChart (latest data for each balita) ---
      const uniqueBalitaMap = new Map();
      mergedData.forEach((item) => {
        if (!uniqueBalitaMap.has(item.balita)) {
          uniqueBalitaMap.set(item.balita, item); // Only keep the latest entry for each balita
        }
      });

      // Dapatkan data terbaru untuk setiap balita
      const filteredPemeriksaanDataForPie = Array.from(uniqueBalitaMap.values());

      // Menghitung status gizi untuk PieChart
      const giziCounts = {
        buruk: 0,
        kurang: 0,
        baik: 0,
        lebih: 0,
        obesitas: 0,
      };

      filteredPemeriksaanDataForPie.forEach(item => {
        if (item.status_gizi in giziCounts) {
          giziCounts[item.status_gizi]++;
        }
      });

      // Update giziData berdasarkan hitungan status gizi
      setGiziData([
        { gizi: 'Buruk', banyak: giziCounts.buruk, color: '#FF0000' }, // Merah untuk buruk
        { gizi: 'Kurang', banyak: giziCounts.kurang, color: '#FFBB38' }, // Kuning untuk kurang
        { gizi: 'Baik', banyak: giziCounts.baik, color: '#60E7DC' }, // Hijau untuk baik
        { gizi: 'Lebih', banyak: giziCounts.lebih, color: '#FF7F50' }, // Oranye untuk lebih
        { gizi: 'Obesitas', banyak: giziCounts.obesitas, color: '#8B0000' } // Warna gelap untuk obesitas
      ]);

      // --- Pagination Logic ---
      const totalItems = mergedData.length; // Total items after merging
      const pageSize = 10; // Set page size
      const totalPages = Math.ceil(totalItems / pageSize); // Calculate total pages

      // Set data for the first page (initial page load)
      const paginatedData = mergedData.slice(0, pageSize); // Slice data for the first page

      // Set state for FlatList and pagination
      setPerkembangan_balita(mergedData);
      setFilteredData(paginatedData); // Set initial data for FlatList
      setTotalPages(totalPages); // Set total pages for pagination
      setPageNumber(1); // Initialize page number

      console.log(mergedData);
    } catch (error) {

    }
  };


  const handleNextPage = () => {
    if (pageNumber < totalPages) {
      const nextPage = pageNumber + 1;
      setPageNumber(nextPage);
      // Ambil data berdasarkan halaman berikutnya
      setFilteredData(perkembangan_balita.slice((nextPage - 1) * pageSize, nextPage * pageSize));
    }
  };

  // Function to handle previous page
  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      const prevPage = pageNumber - 1;
      setPageNumber(prevPage);
      // Ambil data berdasarkan halaman sebelumnya
      setFilteredData(perkembangan_balita.slice((prevPage - 1) * pageSize, prevPage * pageSize));
    }
  };

  const handleCardPress = (item) => {
    setSelectedBalitaDetail(item);  // Set data balita yang dipilih
    setDetailModalVisible(true);    // Tampilkan modal detail
  };

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

    }
  };

  const handleBalitaSelect = async (value) => {
    console.log(value, 'value');
    setSelectedBalita(value); // Set selected balita
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get(`${Config.API_URL}/balita/${value}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const balitaData = response.data;

      // Ambil tanggal lahir dan jenis kelamin
      const { tanggal_lahir_balita, jenis_kelamin_balita } = balitaData;

      // Hitung umur dalam bulan
      const umurDalamBulan = moment().diff(moment(tanggal_lahir_balita), 'months');
      setBalitaData({
        ...balitaData,
        umurDalamBulan,
      });

      console.log(umurDalamBulan, 'umurDalamBulan');

      // Pilih data antropometri berdasarkan jenis kelamin
      let selectedAntropometri;
      if (jenis_kelamin_balita === 'l') {
        selectedAntropometri = antropometriBoys.find((item) => item.umur === umurDalamBulan);
      } else {
        selectedAntropometri = antropometriGirl.find((item) => item.umur === umurDalamBulan);
      }
      setSelectedAntropometri(selectedAntropometri);
    } catch (error) {

    }
  };

  // Perhitungan Z-Score secara dinamis saat berat badan (kg/gram) berubah
  useEffect(() => {
    if (formData.beratbadankg !== '' && selectedAntropometri) {
      const beratBadanTotal = parseFloat(formData.beratbadankg) + (parseFloat(formData.beratbadangram) / 1000);
      const medianBB = selectedAntropometri.median;
      const sd = (selectedAntropometri["+1SD"] - selectedAntropometri["median"]) / 1; // Hitung SD sebagai jarak antara +1SD dan median
      const zScore = (beratBadanTotal - medianBB) / sd;

      setZScore(zScore);

      // Tentukan status gizi berdasarkan Z-Score
      let statusGizi;
      if (zScore < -3) {
        statusGizi = "buruk";
      } else if (zScore >= -3 && zScore < -2) {
        statusGizi = "kurang";
      } else if (zScore >= -2 && zScore <= 1) {
        statusGizi = "baik";
      } else if (zScore > 1 && zScore <= 2) {
        statusGizi = "lebih";
      } else if (zScore > 2) {
        statusGizi = "obesitas";
      }

      setStatusGizi(statusGizi);
    }
  }, [formData.beratbadankg, formData.beratbadangram, selectedAntropometri]);


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
      setErrorMessages('Gagal Mendapatkan Data Dokter');

      // Tampilkan modal error
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
      status_gizi: statusGizi,
      tipe_imunisasi: selectedImunisasi,
      tipe_vitamin: selectedVitamin,
      keterangan: formData.keterangan,
      dokter: selectedDokter,
      kader: id,  // Add kader id dynamically or from token
    };
    try {
      if (modalEditMode) {
        // If editing, update the existing record
        await axios.put(`${Config.API_URL}/perkembangan-balita/${formData.id}`, newFormData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Data berhasil diperbarui');
      } else {
        // If adding new, create a new record
        await axios.post(`${Config.API_URL}/perkembangan-balita`, newFormData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Data berhasil disimpan');
      }
      resetForm();
      setModalVisible(false);
      setModalEditMode(false); // Reset edit mode after saving
      fetchPerkembanganBalita(); // Optionally, refresh the list or perform other actions
    } catch (error) {
      setErrorMessages('Gagal Mengupdate Data.');
      setIsErrorModalVisible(true)
    }
  };



  const tipeImunisasiItems = [
    { label: 'Tidak ada', value: null },
    { label: 'BCGE', value: 'BCGE' },
    { label: 'Hepatitis B', value: 'Hepatitis B' },
    { label: 'Polio', value: 'Polio' },
    { label: 'DPT-HB-Hib', value: 'DPT-HB-Hib' },
    { label: 'Campak', value: 'Campak' },
    { label: 'MR', value: 'MR' }

  ];

  const tipeVitaminItems = [
    { label: 'Tidak ada', value: null },
    { label: 'Vitamin A', value: 'A' },
    { label: 'Cacing', value: 'Cacing' }
  ];

  const resetForm = () => {
    setFormData({
      id: '', // Reset id for new entry
      idBalita: '',
      TanggalKunjungan: null,
      beratbadankg: '',
      beratbadangram: '',
      tinggibadan: '',
      keterangan: '',
      tipeVitamin: '',
      tipeImunisasi: '',
      lingkarKepala: '',
      idDokter: '',
    });
    setSelectedBalita(null);  // Reset selectedBalita
    setSelectedImunisasi(null);  // Reset selectedImunisasi
    setSelectedVitamin(null);  // Reset selectedVitamin
    setSelectedDokter(null);  // Reset selectedDokter
    setStatusGizi('');
    setModalVisible(false);  // Close the modal
    setModalEditMode(false);  // Reset edit mode
  };

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
              data={giziData.map((item) => ({
                value: item.banyak, // Jumlah balita per status gizi
                color: item.color,  // Warna untuk status gizi
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

            <View style={{ flexDirection: 'row', marginTop: 20, width: '100%' }}>
              <View style={{ flexDirection: 'column', flex: 1 }}>
                <View style={{ backgroundColor: '#FF0000', width: 80, height: 10, borderRadius: 5 }}></View>
                <Text style={styles.verificationText4}>Buruk</Text>
              </View>
              <View style={{ flexDirection: 'column', flex: 1 }}>
                <View style={{ backgroundColor: '#FFBB38', width: 80, height: 10, borderRadius: 5 }}></View>
                <Text style={styles.verificationText4}>Kurang</Text>
              </View>
              <View style={{ flexDirection: 'column', flex: 1 }}>
                <View style={{ backgroundColor: '#60E7DC', width: 80, height: 10, borderRadius: 5 }}></View>
                <Text style={styles.verificationText4}>Baik</Text>
              </View>
              <View style={{ flexDirection: 'column', flex: 1 }}>
                <View style={{ backgroundColor: '#FF7F50', width: 80, height: 10, borderRadius: 5 }}></View>
                <Text style={styles.verificationText4}>Lebih</Text>
              </View>
              <View style={{ flexDirection: 'column', flex: 1 }}>
                <View style={{ backgroundColor: '#8B0000', width: 50, height: 10, borderRadius: 5 }}></View>
                <Text style={styles.verificationText4}>Obesitas</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <FlatList
          data={filteredData}
          style={{ backgroundColor: '#fff', marginTop: 20, borderRadius: 2, marginHorizontal: 20, maxHeight: 350 }}
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
          <Text style={styles.pageButtonText}><Icon name="angle-left" size={30} color="white" /> </Text>
        </TouchableOpacity>
        <Text style={styles.pageInfo}>
          Page {pageNumber} of {totalPages}
        </Text>
        <TouchableOpacity
          style={[styles.pageButton, pageNumber === totalPages && styles.disabledButton]}
          onPress={handleNextPage}
          disabled={pageNumber === totalPages}
        >
          <Text style={styles.pageButtonText}><Icon name="angle-right" size={30} color="white" /></Text>
        </TouchableOpacity>
      </View>
      {/* Print Modal */}
      <Modal
        transparent={true}
        visible={printModalVisible}
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();  // Reset form when modal is closed
        }}
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
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();  // Reset form when modal is closed
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{modalEditMode ? 'Edit Data PA' : 'Tambah Data PA'}</Text>
            <View style={{ marginBottom: 10 }}>
              <Text style={{ color: 'black', fontWeight: 'bold' }}>Cek Gizi</Text>
            </View>
            <DropDownPicker
              open={openBalita}
              value={selectedBalita}
              items={balitaItems}
              setOpen={setOpenBalita}
              setValue={(value) => {
                setSelectedBalita(value); // Update state ketika balita dipilih
                handleBalitaSelect(value); // Panggil fungsi handleBalitaSelect untuk memproses data balita yang dipilih
              }}
              setItems={setBalitaItems}
              placeholder="Pilih Balita"
              style={styles.dropdown}
              onChangeValue={(value) => handleBalitaSelect(value)}
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
              setItems={() => { }}
              placeholder="Pilih Imunisasi"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
            <View style={{ marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: 'black', fontWeight: 'bold' }}>Z-Score: {zScore !== null ? zScore.toFixed(2) : "Belum dihitung"},</Text>
              <Text style={{ color: 'black', fontWeight: 'bold' }}>Status Gizi: {statusGizi !== null ? statusGizi : "Belum dihitung"}</Text>
            </View>


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
              setItems={() => { }}
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

            <TextInput
              style={styles.input}
              placeholder="Keterangan"
              value={formData.keterangan}
              multiline={true}
              numberOfLines={3}
              placeholderTextColor="gray"
              onChangeText={(value) => handleInputChange('keterangan', value)}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={detailModalVisible}
        animationType="slide"
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Detail Perkembangan Balita</Text>

            {selectedBalitaDetail && (
              <View>
                <Text style={{ fontWeight: 'bold', marginBottom: 10, color: 'black' }}>Nama Balita: {selectedBalitaDetail.nama_balita}</Text>
                <Text style={{ marginBottom: 10, color: 'black' }}>NIK Balita: {selectedBalitaDetail.nik_balita}</Text>
                <Text style={{ marginBottom: 10, color: 'black' }}>Umur: {selectedBalitaDetail.umur_balita} bulan</Text>
                <Text style={{ marginBottom: 10, color: 'black' }}>Status Gizi: {selectedBalitaDetail.status_gizi}</Text>
                <Text style={{ marginBottom: 10, color: 'black' }}>Keterangan: {selectedBalitaDetail.keterangan}</Text>
                <Text style={{ marginBottom: 10, color: 'black' }}>Tanggal Kunjungan: {selectedBalitaDetail.tanggal_kunjungan}</Text>
              </View>
            )}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => handleEditPress(selectedBalitaDetail)}
              >
                <Text style={styles.modalButtonText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setDetailModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <ErrorModal
        visible={isErrorModalVisible}
        message={errorMessages}
        onClose={() => setIsErrorModalVisible(false)}
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
    width: '40%',
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

  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },

  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },


});


export default DataPa