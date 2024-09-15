import React,{useState,useEffect} from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList ,ActivityIndicator, ScrollView ,Modal, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import { BarChart } from 'react-native-gifted-charts';
import Config from 'react-native-config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
const imunisasiData = [
    {
      id: '1',
      nama_balita: 'Setia Budi',
      jenis_imunisasi: 'BCG',
      tanggal_imunisasi: '2022-01-01',
      status: 'Sudah',
    },
    {
      id: '2',
      nama_balita: 'Ahmad Junaedi',
      jenis_imunisasi: 'BCG',
      tanggal_imunisasi: '2022-01-01',
      status: 'Belum',
    },

    {
      id: '3',
      nama_balita: 'Dewi Astuti',
      jenis_imunisasi: 'BCG',
      tanggal_imunisasi: '2022-01-01',
      status: 'Belum',
    },

    {
      id: '4',
      nama_balita: 'Dewi Astuti',
      jenis_imunisasi: 'BCG',
      tanggal_imunisasi: '2022-01-01',
      status: 'Belum',
    },
    // Tambahkan lebih banyak data sesuai kebutuhan
  ];


  
  const BiodataSection = ({ dataAnak }) => {
    // Menghitung umur
    const calculateAge = (birthDate) => {
      if (!birthDate) return ''; // Jika tidak ada tanggal lahir
  
      const now = moment(); // Waktu sekarang
      const birthMoment = moment(birthDate); // Tanggal lahir
      const years = now.diff(birthMoment, 'years'); // Selisih dalam tahun
      const months = now.diff(birthMoment, 'months') % 12; // Sisa bulan setelah dikurangi tahun
  
      return `${years} tahun, ${months} bulan`;
    };
  
    return (
      <View style={styles.dataSection}>
        <Text style={styles.label}>Nama</Text>
        <TextInput style={styles.input} value={dataAnak?.nama_balita || ''} editable={false} />
  
        <Text style={styles.label}>NIK</Text>
        <TextInput style={styles.input} value={dataAnak?.nik_balita?.toString() || ''} editable={false} />
  
        <Text style={styles.label}>Tempat Lahir</Text>
        <TextInput style={styles.input} value={dataAnak?.tempat_lahir_balita || ''} editable={false} />
  
        <Text style={styles.label}>Tanggal Lahir</Text>
        <TextInput style={styles.input} value={moment(dataAnak?.tanggal_lahir_balita).format('dddd, DD MMMM YYYY')} editable={false} />
  
        <Text style={styles.label}>Umur</Text>
        <TextInput style={styles.input} value={calculateAge(dataAnak?.tanggal_lahir_balita)} editable={false} />
  
        <Text style={styles.label}>Jenis Kelamin</Text>
        <TextInput style={styles.input} value={dataAnak?.jenis_kelamin_balita === 'l' ? 'Laki-Laki' : 'Perempuan'} editable={false} />
  
        <Text style={styles.label}>Berat Badan Awal</Text>
        <TextInput style={styles.input} value={dataAnak?.berat_badan_awal_balita?.toString() + ' kg' || ''} editable={false} />
  
        <Text style={styles.label}>Tinggi Badan Awal</Text>
        <TextInput style={styles.input} value={dataAnak?.tinggi_badan_awal_balita?.toString() + ' cm' || ''} editable={false} />
  
        <Text style={styles.label}>Riwayat Kelahiran</Text>
        <TextInput style={styles.input} value={dataAnak?.riwayat_kelahiran_balita || ''} editable={false} />
  
        <Text style={styles.label}>Riwayat Penyakit</Text>
        <TextInput style={styles.input} value={dataAnak?.riwayat_penyakit_balita || 'Tidak ada'} editable={false} />
  
        <Text style={styles.label}>Keterangan</Text>
        <TextInput style={styles.input} value={dataAnak?.keterangan_balita || ''} editable={false} />
      </View>
    );
  };
  
  const PASection = ({ dataAnak }) => {
    const [paData, setPaData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          if (!token) throw new Error('Token is missing');
  
          const response = await axios.get(`${Config.API_URL}/perkembangan-balita`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          // Memfilter data berdasarkan id balita dan menambahkan tanggal lahir ke setiap item
          const filteredData = response.data
            .filter(item => item.balita === dataAnak.id)
            .map(item => ({
              ...item,
              tanggal_lahir_balita: dataAnak.tanggal_lahir_balita, // Tambahkan tanggal lahir dari dataAnak ke setiap entri
            }));
          
          setPaData(filteredData);
          setLoading(false);
        } catch (err) {
          setError(err);
          setLoading(false);
        }
      };
  
      if (dataAnak && dataAnak.id) {
        fetchData();
      }
    }, [dataAnak]);
  
    if (loading) {
      return <ActivityIndicator size="large" color="#00ff00" />;
    }
  
    if (error) {
      return <Text style={{ color: 'red' }}>Error: {error.message}</Text>;
    }
  
    if (paData.length === 0) {
      return <Text>No data available.</Text>;
    }
  
    // Fungsi untuk menghitung umur dalam format desimal
    const calculateAgeInDecimal = (birthDate, checkupDate) => {
      const birthMoment = moment(birthDate, 'YYYY-MM-DD'); // Pastikan format tanggal sesuai
      const checkupMoment = moment(checkupDate, 'YYYY-MM-DD');
      const years = checkupMoment.diff(birthMoment, 'years'); // Hitung jumlah tahun
      birthMoment.add(years, 'years'); // Update tanggal lahir setelah menambahkan tahun
      const months = checkupMoment.diff(birthMoment, 'months'); // Hitung sisa bulan setelah tahun
  
      return parseFloat(`${years}.${months}`); // Gabungkan tahun dan bulan dalam format desimal
    };
  
    // Menyiapkan data untuk BarChart
    const chartData = paData
      .map(item => ({
        value: item.berat_badan,
        label: calculateAgeInDecimal(item.tanggal_lahir_balita, item.tanggal_kunjungan), // Menggunakan format desimal untuk umur
        frontColor: '#90EE90',
      }))
      .sort((a, b) => a.label - b.label); // Urutkan berdasarkan umur desimal
  
    return (
      <View style={styles.dataSection}>
        <Text style={styles.label}>Perkembangan Balita</Text>
        <BarChart
          data={chartData}
          barWidth={30}
          spacing={15}
          capThickness={4}
          isAnimated
          xAxisLabelTextStyle={{ color: '#4ABFF4' }}
          yAxisTextStyle={{ color: '#90EE90' }}
          frontColor={'#90EE90'}
        />
      </View>
    );
  };
  
  
  
  
  const KegiatanSection = ({ dataAnak }) => {
    const [kegiatanData, setKegiatanData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false); // Untuk mengatur visibilitas modal
    const [selectedItem, setSelectedItem] = useState(null); // Untuk menyimpan data yang dipilih
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          if (!token) throw new Error('Token is missing');
  
          const response = await axios.get(`${Config.API_URL}/perkembangan-balita`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          const filteredData = response.data.filter(item => item.balita === dataAnak.id);
          setKegiatanData(filteredData);
          setLoading(false);
        } catch (err) {
          setError(err);
          setLoading(false);
        }
      };
  
      if (dataAnak && dataAnak.id) {
        fetchData();
      }
    }, [dataAnak]);
  
    if (loading) {
      return <ActivityIndicator size="large" color="#00ff00" />;
    }
  
    if (error) {
      return <Text style={{ color: 'red' }}>Error: {error.message}</Text>;
    }
  
    if (kegiatanData.length === 0) {
      return <Text>No data available.</Text>;
    }
  
    const openModal = (item) => {
      setSelectedItem(item);
      setModalVisible(true);
    };
  
    const closeModal = () => {
      setModalVisible(false);
      setSelectedItem(null);
    };
  
    return (
      <ScrollView style={styles.dataSection}>
        {kegiatanData.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => openModal(item)}>
            <View style={styles.verificationCardContent}>
              <View style={{ flexDirection: 'column', width: '70%' }}>
                <Text style={styles.verificationTextTitle}>Status Gizi: {item.status_gizi}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="balance-scale" size={20} color="#16DBCC" />
                  <Text style={styles.verificationText3}>{item.berat_badan} kg</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="smile-o" size={20} color="#16DBCC" />
                  <Text style={styles.verificationText3}>Lingkar Kepala: {item.lingkar_kepala} cm</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="calendar" size={20} color="#16DBCC" />
                  <Text style={styles.verificationText3}>{moment(item.tanggal_kegiatan).format('DD MMMM YYYY')}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <IconMaterial name="ruler" size={20} color="#16DBCC" />
                  <Text style={styles.verificationText3}>Tinggi Badan: {item.tinggi_badan} cm</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'column', marginTop: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <IconMaterial name="needle" size={20} color="#16DBCC" />
                  <Text style={styles.verificationText3}>{item.tipe_imunisasi}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="medkit" size={20} color="#16DBCC" />
                  <Text style={styles.verificationText3}>Vitamin {item.tipe_vitamin}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
  
        {/* Modal untuk menampilkan keterangan */}
        {selectedItem && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Keterangan Kunjungan</Text>
                <Text style={styles.modalText}>{selectedItem.keterangan}</Text>
                <Button title="Tutup" onPress={closeModal} />
              </View>
            </View>
          </Modal>
        )}
      </ScrollView>
    );
  };
  

export { BiodataSection, PASection, KegiatanSection  };

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background transparan dengan overlay gelap
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#444444',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    color: 'black',
  },
  dataSection: {
    padding: 15,
    overflow: 'hidden',  
    borderRadius: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#888888',
    marginTop: 5,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 5,
    fontSize: 16,
    color: '#444444',
  },
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
    marginBottom: 5,
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
    marginBottom: 2,
    flexWrap: 'wrap',
    fontSize: 15,
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  sudah: {
    backgroundColor: '#16DBCC',
  },
  belum: {
    backgroundColor: '#FF4C4C',
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendBox: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#888888',
  },
});
