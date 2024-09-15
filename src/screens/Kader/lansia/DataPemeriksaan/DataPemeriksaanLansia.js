import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Modal, TextInput, Alert, ActivityIndicator } from 'react-native'
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

const DataPemeriksaanLansia = () => {
    const [pemeriksaanData, setPemeriksaanData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [printModalVisible, setPrintModalVisible] = useState(false);
    const [modalEditMode, setModalEditMode] = useState(false);
    const [formData, setFormData] = useState({
        id: '', // Add this for edit mode
        lansia: '',
        tanggal_kunjungan: null,
        berat_badan: '',
        tinggi_badan: '',
        lingkar_perut: '',
        tekanan_darah: '',
        gula_darah: '',
        kolestrol: '',
        asam_urat: '',
        kesehatan_mata: '',
        keterangan: '',
        riwayat_obat: '',
        riwayat_penyakit: '',
        dokter: '',
        kader: ''
    });
    const [lansiaItems, setLansiaItems] = useState([]);
    const [dokterItems, setDokterItems] = useState([]);
    const [selectedLansia, setSelectedLansia] = useState(null);
    const [modalVisible, setModalVisible] = useState(0);
    const [selectedDokter, setSelectedDokter] = useState(null);
    const [openLansia, setOpenLansia] = useState(false);
    const [openDokter, setOpenDokter] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');  // State untuk menyimpan query pencarian
    const [filteredData, setFilteredData] = useState([]);  // Data yang akan ditampilkan setelah di-filter
    const [kader, setKader] = useState(null);
    const [selectedLansiaDetail, setSelectedLansiaDetail] = useState(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    // Fetch JWT Token and Decode for Kader ID
    useEffect(() => {
        const fetchKader = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const decodedToken = jwtDecode(token);
                setKader(decodedToken.id); // Assuming `id` is kader identifier in token
                setFormData({ ...formData, kader: decodedToken.id });
            }
        };
        fetchKader();
    }, []);

    const handleAddChildPress = () => {
        setModalVisible(1);
    };


    useEffect(() => {
        fetchData(); // Memanggil fetchData saat komponen pertama kali dimuat
    }, []);
    

    // Fetch Data for Dropdowns (Lansia, Dokter) and Pemeriksaan Data
    const fetchData = async () => {
        const token = await AsyncStorage.getItem('token');
        try {
            // Fetch Pemeriksaan Data
            const pemeriksaanResponse = await axios.get(`${Config.API_URL}/pemeriksaan-lansia`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const pemeriksaanData = pemeriksaanResponse.data;
    
            // Fetch Lansia Data
            const lansiaResponse = await axios.get(`${Config.API_URL}/lansia`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const lansiaData = lansiaResponse.data;
    
            // Fetch Dokter Data
            const dokterResponse = await axios.get(`${Config.API_URL}/dokter`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const dokterData = dokterResponse.data;
    
            // Fetch Kader Data
            const kaderResponse = await axios.get(`${Config.API_URL}/pengguna`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const kaderData = kaderResponse.data;
    
            // Map pemeriksaan data to include nama_lansia, nama_dokter, and nama_kader
            const pemeriksaanWithDetails = pemeriksaanData.map((pemeriksaan) => {
                const relatedLansia = lansiaData.find(lansia => lansia.id === pemeriksaan.lansia); // find lansia by id
                const relatedDokter = dokterData.find(dokter => dokter.id === pemeriksaan.dokter); // find dokter by id
                const relatedKader = kaderData.find(kader => kader.id === pemeriksaan.kader); // find kader by id
    
                return {
                    ...pemeriksaan,
                    nama_lansia: relatedLansia ? relatedLansia.nama_lansia : 'Unknown',
                    tanggal_lahir_lansia: relatedLansia ? relatedLansia.tanggal_lahir_lansia : 'Unknown',
                    nik_lansia: relatedLansia ? relatedLansia.nik_lansia.toString() : 'Unknown',
                    jenis_kelamin: relatedLansia
                        ? (relatedLansia.jenis_kelamin === 'l' ? 'Laki-laki' : 'Perempuan')
                        : 'Unknown',
                    nama_dokter: relatedDokter ? relatedDokter.nama : 'Unknown',
                    nama_kader: relatedKader ? relatedKader.nama : 'Unknown',
                };
            });
    
            setPemeriksaanData(pemeriksaanWithDetails); // Set pemeriksaan data with all details
    
            // Set Lansia items for dropdown
            setLansiaItems(lansiaData.map((lansia) => ({
                label: lansia.nama_lansia,
                value: lansia.id
            })));
    
            // Set Dokter items for dropdown
            setDokterItems(dokterData.map((dokter) => ({
                label: dokter.nama,
                value: dokter.id
            })));
    
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoading(false);
        }
    };
    
    

    // Handle form saving (both create and update)
    const handleSave = async () => {
        const token = await AsyncStorage.getItem('token');
     
        const newFormData = {
            ...formData,
            kader: kader, // Include kader from JWT
            lansia: selectedLansia,
            dokter: selectedDokter,
            tanggal_kunjungan: new Date(formData.tanggal_kunjungan).toISOString(),
            berat_badan: formData.berat_badan,
            tinggi_badan: formData.tinggi_badan,
            lingkar_perut: formData.lingkar_perut,
            tekanan_darah: formData.tekanan_darah,
            gula_darah: formData.gula_darah,
            kolestrol: formData.kolestrol,
            asam_urat: formData.asam_urat,
            kesehatan_mata: formData.kesehatan_mata,
            keterangan: formData.keterangan,
            riwayat_obat:  formData.riwayat_obat,
            riwayat_penyakit: formData.riwayat_penyakit,
        };
        console.log(newFormData);
        try {
            if (modalEditMode) {
                // If editing, update the existing record
                await axios.put(`${Config.API_URL}/pemeriksaan-lansia/${formData.id}`, newFormData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                Alert.alert('Success', 'Data successfully updated.');
            } else {
                // If adding new, create a new record
                await axios.post(`${Config.API_URL}/pemeriksaan-lansia`, newFormData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                Alert.alert('Success', 'Data successfully saved.');
            }
            setModalVisible(false);
            resetForm();
            fetchData(); // Reload data after saving
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

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query === '') {
            setFilteredData(pemeriksaanData);  // Jika query kosong, tampilkan semua data
        } else {
            // Filter data sesuai dengan nama balita atau nama ibu
            const filtered = pemeriksaanData.filter((item) =>
                item.riwayat_obat.toLowerCase().includes(query.toLowerCase()) ||
                item.riwayat_penyakit.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredData(filtered);
        }
    };
    // Handle editing form data
    const handleEditPress = (item) => {
        setModalEditMode(true);
        setFormData({
            id: item.id,
            tanggal_kunjungan: new Date(item.tanggal_kunjungan),
            berat_badan: item.berat_badan.toString(),
            tinggi_badan: item.tinggi_badan.toString(),
            lingkar_perut: item.lingkar_perut.toString(),
            tekanan_darah: item.tekanan_darah.toString(),
            gula_darah: item.gula_darah.toString(),
            kolestrol: item.kolestrol.toString(),
            asam_urat: item.asam_urat.toString(),
            kesehatan_mata: item.kesehatan_mata.toString(),
            keterangan: item.keterangan,
            riwayat_obat: item.riwayat_obat,
            riwayat_penyakit: item.riwayat_penyakit,
            dokter: item.dokter,
            lansia: item.lansia
        });
        setSelectedLansia(item.lansia);
        setSelectedDokter(item.dokter);
        setModalVisible(1);
    };

    const handlePrintPress = () => {
        setPrintModalVisible(true);
    };



    const renderItem = ({ item }) => (


        <TouchableOpacity style={styles.verificationCard} onPress={() => handleCardPress(item)}>
          <View style={styles.verificationCardContent}>
            <View style={{ flexDirection: 'column', width: '70%' }}>
    
              <Text style={styles.verificationTextTitle}>{item.nama_lansia}</Text>
              <View style={{ flexDirection: 'row' }}>
                <Icon name="user" size={20} color="#16DBCC" />
                <Text style={styles.verificationText3}>{item.nik_lansia}</Text>
              </View>
    
              <View style={{ flexDirection: 'row' }}>
                <Icon name="user" size={20} color="#16DBCC" />
                <Text style={styles.verificationText3}>{item.jenis_kelamin}</Text>
              </View>
              <Text style={{fontSize: 12, color: 'black', fontWeight: 'bold'}}>Ket:</Text>
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
                    style={{ ...styles.editButton,}}
                    onPress={() => handleEditPress(item)}
                  >
                    <Text style={{  width: 80, fontSize: 14, textAlign: 'center' }}>{item.status_gizi}</Text>
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

    if (isLoading) {
        return <ActivityIndicator size="large" />;
    }

    

    const resetForm = () => {
        setFormData({
            lansia: '',
            tanggal_kunjungan: null,
            berat_badan: '',
            tinggi_badan: '',
            lingkar_perut: '',
            tekanan_darah: '',
            gula_darah: '',
            kolestrol: '',
            asam_urat: '',
            kesehatan_mata: '',
            keterangan: '',
            riwayat_obat: '',
            riwayat_penyakit: '',
            dokter: '',
            kader: ''
        });
        setSelectedLansia(null);
        setSelectedDokter(null);
        setModalVisible(false);  // Close the modal
        setModalEditMode(false);  // Reset edit mode
    };

    const handleCardPress = (item) => {
        setSelectedLansiaDetail(item);  // Set data balita yang dipilih
        setDetailModalVisible(true);    // Tampilkan modal detail
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


            </View>
            <View>
                <FlatList
                    data={pemeriksaanData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                />

            </View>

            <TouchableOpacity style={styles.printButton} onPress={handlePrintPress}>
                <Icon name="print" size={30} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.addButton} onPress={handleAddChildPress}>
                <Icon name="plus" size={30} color="white" />
            </TouchableOpacity>


            <Modal
             visible={modalVisible === 1}
             onRequestClose={() => {
                resetForm();  // Reset form when modal is closed
              }}
             animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>{modalEditMode ? 'Edit Data Pemeriksaan' : 'Tambah Data Pemeriksaan'}</Text>

                        <DropDownPicker
                            open={openLansia}
                            value={selectedLansia}
                            items={lansiaItems}
                            setOpen={setOpenLansia}
                            setValue={setSelectedLansia}
                            placeholder="Pilih Lansia"
                            style={styles.dropdown}
                        />

                        <DropDownPicker
                            open={openDokter}
                            value={selectedDokter}
                            items={dokterItems}
                            setOpen={setOpenDokter}
                            setValue={setSelectedDokter}
                            placeholder="Pilih Dokter"
                            style={styles.dropdown}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Berat Badan (kg)"
                            keyboardType="numeric"
                            placeholderTextColor={'gray'}
                            value={formData.berat_badan}
                            onChangeText={(value) => setFormData({ ...formData, berat_badan: value })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Tinggi Badan (cm)"
                            keyboardType="numeric"
                            placeholderTextColor={'gray'}
                            value={formData.tinggi_badan}
                            onChangeText={(value) => setFormData({ ...formData, tinggi_badan: value })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Lingkar Perut (cm)"
                            keyboardType="numeric"
                            placeholderTextColor={'gray'}
                            value={formData.lingkar_perut}
                            onChangeText={(value) => setFormData({ ...formData, lingkar_perut: value })}
                        />
                        <View style={styles.buttonContainer}>
                        <TouchableOpacity
        style={styles.saveButton}
        onPress={() => setModalVisible(2)}  // Ganti ke modal kedua
      >
        <Text style={styles.saveButtonText}>Lanjut</Text>
      </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
             visible={modalVisible === 2}
             onRequestClose={() => {
                resetForm();  // Reset form when modal is closed
              }}
             animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>{modalEditMode ? 'Edit Data Pemeriksaan' : 'Tambah Data Pemeriksaan'}</Text>

               
                        <TextInput
                            style={styles.input}
                            placeholder="Tekanan Darah"
                            placeholderTextColor={'gray'}
                            value={formData.tekanan_darah}
                            onChangeText={(value) => setFormData({ ...formData, tekanan_darah: value })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Gula Darah"
                            placeholderTextColor={'gray'}
                            value={formData.gula_darah}
                            onChangeText={(value) => setFormData({ ...formData, gula_darah: value })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Kolestrol"
                            placeholderTextColor={'gray'}
                            value={formData.kolestrol}
                            onChangeText={(value) => setFormData({ ...formData, kolestrol: value })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Asam Urat"
                            placeholderTextColor={'gray'}
                            value={formData.asam_urat}
                            onChangeText={(value) => setFormData({ ...formData, asam_urat: value })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholderTextColor={'gray'}
                            placeholder="Kesehatan Mata"
                            value={formData.kesehatan_mata}
                            onChangeText={(value) => setFormData({ ...formData, kesehatan_mata: value })}
                        />

                        <TextInput
                            style={styles.input}
                            placeholderTextColor={'gray'}
                            placeholder="Riwayat Obat"
                            value={formData.riwayat_obat}
                            onChangeText={(value) => setFormData({ ...formData, riwayat_obat: value })}
                        />

                        <TextInput
                            style={styles.input}
                            placeholderTextColor={'gray'}
                            placeholder="Riwayat Penyakit"
                            value={formData.riwayat_penyakit}
                            onChangeText={(value) => setFormData({ ...formData, riwayat_penyakit: value })}
                        />

                        <TextInput
                            style={styles.input}
                            placeholderTextColor={'gray'}
                            placeholder="Keterangan"
                            value={formData.keterangan}
                            multiline={true}
                            numberOfLines={4}
                            onChangeText={(value) => setFormData({ ...formData, keterangan: value })}
                        />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                <Text>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton}  onPress={() => {
    resetForm();  // Pastikan form di-reset
  }} >
                                <Text>Cancel</Text>
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
      <Text style={styles.modalTitle}>Detail Pemeriksaan Lansia</Text>

      {selectedLansiaDetail && (
        <ScrollView style={styles.modalScrollView}>
          <View style={styles.detailRow}>
            <Icon name="user" size={24} color="#008EB3" style={styles.detailIcon} />
            <Text style={styles.detailText}>Nama Lansia: {selectedLansiaDetail.nama_lansia}</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="id-card" size={24} color="#008EB3" style={styles.detailIcon} />
            <Text style={styles.detailText}>NIK Lansia: {selectedLansiaDetail.nik_lansia}</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="calendar" size={24} color="#008EB3" style={styles.detailIcon} />
            <Text style={styles.detailText}>Tanggal Kunjungan: {moment(selectedLansiaDetail.tanggal_kunjungan).format('DD/MM/YYYY')}</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="balance-scale" size={24} color="#008EB3" style={styles.detailIcon} />
            <Text style={styles.detailText}>Berat Badan: {selectedLansiaDetail.berat_badan} kg</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="arrows-alt" size={24} color="#008EB3" style={styles.detailIcon} />
            <Text style={styles.detailText}>Tinggi Badan: {selectedLansiaDetail.tinggi_badan} cm</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="tape" size={24} color="#008EB3" style={styles.detailIcon} />
            <Text style={styles.detailText}>Lingkar Perut: {selectedLansiaDetail.lingkar_perut} cm</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="heartbeat" size={24} color="#008EB3" style={styles.detailIcon} />
            <Text style={styles.detailText}>Tekanan Darah: {selectedLansiaDetail.tekanan_darah}</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="vial" size={24} color="#008EB3" style={styles.detailIcon} />
            <Text style={styles.detailText}>Gula Darah: {selectedLansiaDetail.gula_darah}</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="thermometer" size={24} color="#008EB3" style={styles.detailIcon} />
            <Text style={styles.detailText}>Kolestrol: {selectedLansiaDetail.kolestrol}</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="vial" size={24} color="#008EB3" style={styles.detailIcon} />
            <Text style={styles.detailText}>Asam Urat: {selectedLansiaDetail.asam_urat}</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="eye" size={24} color="#008EB3" style={styles.detailIcon} />
            <Text style={styles.detailText}>Kesehatan Mata: {selectedLansiaDetail.kesehatan_mata}</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="notes-medical" size={24} color="#008EB3" style={styles.detailIcon} />
            <Text style={styles.detailText}>Riwayat Obat: {selectedLansiaDetail.riwayat_obat}</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="heartbeat" size={24} color="#008EB3" style={styles.detailIcon} />
            <Text style={styles.detailText}>Riwayat Penyakit: {selectedLansiaDetail.riwayat_penyakit}</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="stethoscope" size={24} color="#008EB3" style={styles.detailIcon} />
            <Text style={styles.detailText}>Nama Dokter: {selectedLansiaDetail.nama_dokter}</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="user-nurse" size={24} color="#008EB3" style={styles.detailIcon} />
            <Text style={styles.detailText}>Nama Kader: {selectedLansiaDetail.nama_kader}</Text>
          </View>
        </ScrollView>
      )}

      <View style={styles.modalButtonContainer}>
        <TouchableOpacity
          style={[styles.modalButton, { backgroundColor: '#008EB3' }]}
          onPress={() => handleEditPress(selectedLansiaDetail)}
        >
          <Icon name="edit" size={20} color="white" />
          <Text style={styles.modalButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modalButton, { backgroundColor: '#DC143C' }]}
          onPress={() => setDetailModalVisible(false)}
        >
          <Icon name="times" size={20} color="white" />
          <Text style={styles.modalButtonText}>Tutup</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>



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

    modalScrollView: {
        maxHeight: 400, // Maksimal tinggi modal agar bisa di-scroll
      },
      modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#008EB3',
        marginBottom: 15,
        textAlign: 'center',
      },
      detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
        paddingBottom: 10,
      },
      detailIcon: {
        marginRight: 15,
      },
      detailText: {
        fontSize: 16,
        color: 'black',
      },
      modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
      },
      modalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
         paddingVertical: 10,  // Hanya padding vertikal, bisa diubah sesuai keinginan
  paddingHorizontal: 20, // Horizontal padding untuk menyesuaikan ukuran tombol
  borderRadius: 8,  // Lebih kecil dari 10 agar proporsional
  width: '40%',  // Lebar dikurangi jadi 40%
  marginHorizontal: 5,  // Memberikan jarak antar tombol
      },
      modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
      },


      modalCloseButton: {
        backgroundColor: '#DC143C',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        width: '45%',
        justifyContent: 'center',
      },
      modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 5,
      },
      buttonIcon: {
        marginRight: 5,
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
        width: '90%',
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

export default DataPemeriksaanLansia;
