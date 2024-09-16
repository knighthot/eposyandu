import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity, Modal } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import * as Animatable from 'react-native-animatable';
import cowok from '../../assets/images/anakcow.png';
import cewek from '../../assets/images/anakcew.png';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from 'react-native-config';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BiodataSection, PASection, KegiatanSection } from '../Kader/componentKader/DataAnak';

const DashboardBalita = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');

  // State warna teks untuk setiap
  const [dataBalita, setDataBalita] = useState([]); // Semua data balita
  const [selectedBalita, setSelectedBalita] = useState(null); // Balita yang dipilih dari dropdown
  const [filteredBalita, setFilteredBalita] = useState([]); // Balita yang difilter berdasarkan orang tua
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false); // State untuk dropdown terbuka/tutup
  const [items, setItems] = useState([]); // Items untuk dropdown
  const [modalVisible, setModalVisible] = useState(false); // Modal untuk Dropdown
  const [scrollEnabled, setScrollEnabled] = useState(true); // Control ScrollView scroll behavior
  const navigation = useNavigation(); // Navigation untuk pindah ke form data anak
  const [activeTab, setActiveTab] = useState('Biodata');
  const [selectedCategory, setSelectedCategory] = useState('');
  // Mengatur lokal Indonesia
  const activities = {
    Balita: {
      dates: {
        '2024-08-12': { marked: true, dotColor: 'blue', activity: 'Pemeriksaan rutin balita' },
        '2024-08-19': { marked: true, dotColor: 'blue', activity: 'Imunisasi balita' }
      }
    },
    Lansia: {
      dates: {
        '2024-08-15': { marked: true, dotColor: 'blue', activity: 'Pemeriksaan kesehatan lansia' },
        '2024-08-22': { marked: true, dotColor: 'blue', activity: 'Senam sehat lansia' }
      }
    }
  };

  
  const onDayPress = (day) => {
    const activity = activities[selectedCategory]?.dates[day.dateString]?.activity || 'Tidak ada kegiatan';
    setSelectedDate(day.dateString);
    setSelectedActivity(activity);
  };

LocaleConfig.locales['id'] = {
  monthNames: ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'],
  monthNamesShort: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'],
  dayNames: ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'],
  dayNamesShort: ['Min','Sen','Sel','Rab','Kam','Jum','Sab'],
  today: 'Hari Ini'
};
LocaleConfig.defaultLocale = 'id';

const openModal = (category) => {
  setSelectedCategory(category);
  setModalVisible(true);
};

const closeModal = () => {
  setModalVisible(false);
  setSelectedCategory('');
  setSelectedDate('');
  setSelectedActivity('');
};

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');

      try {
        // Ambil data pengguna
        const userResponse = await axios.get(`${Config.API_URL}/pengguna/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = userResponse.data;

        // Ambil semua data balita
        const balitaResponse = await axios.get(`${Config.API_URL}/balita`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const allBalita = balitaResponse.data;

        // Filter data balita berdasarkan id orang tua
        const filtered = allBalita.filter(balita => balita.orangtua === userData.orangtua);
        setFilteredBalita(filtered);

        // Set items untuk dropdown
        const dropdownItems = filtered.map((balita) => ({
          label: balita.nama_balita,
          value: balita.id,
        }));
        setItems(dropdownItems);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fungsi untuk merender gambar berdasarkan jenis kelamin balita
  const renderProfileImage = (jenisKelamin) => {
    switch (jenisKelamin) {
      case 'l':
        return cowok;
      case 'p':
        return cewek;
      default:
        return cowok;
    }
  };

  // Fungsi untuk merender section berdasarkan tab yang aktif
  const renderDataSection = () => {
    switch (activeTab) {
      case 'Biodata':
        return <BiodataSection dataAnak={selectedBalitaData} />;
      case 'PA':
        return <PASection dataAnak={selectedBalitaData} />;
      case 'Kegiatan':
        return <KegiatanSection dataAnak={selectedBalitaData} />;
      default:
        return null;
    }
  };

  // Cari data balita yang dipilih berdasarkan ID
  const selectedBalitaData = filteredBalita.find(balita => balita.id === selectedBalita);

  // Custom dropdown button with profile image and dropdown icon
  const renderCustomButton = () => {
    return (
      <View style={styles.profileWrapper}>
        {/* Profile Image */}
        <Image
          style={styles.profileImage}
          source={selectedBalitaData ? renderProfileImage(selectedBalitaData?.jenis_kelamin_balita) : cowok}
        />
        {/* Dropdown Icon */}
        <TouchableOpacity style={styles.dropdownIconWrapper} onPress={() => setModalVisible(true)}>
          <Icon name="arrow-drop-down" size={30} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView 
      style={styles.container} 
      scrollEnabled={scrollEnabled} // Control whether scrolling is enabled
    >
      <View style={styles.cardHeader}>
        <Animatable.Text animation="fadeIn" style={styles.title}>Selamat Datang</Animatable.Text>
        <Animatable.Text animation="fadeIn" style={styles.subTitle}>Di E-Posyandu</Animatable.Text>
      </View>

      <View style={styles.cardJadwal}>
        <TouchableOpacity onPress={() => openModal('Balita')}>
          <View style={styles.cardJadwalContainer}>
            <Animatable.Text animation="fadeIn" style={styles.TitleCardJadwal}>Balita</Animatable.Text>
            <Animatable.Text animation="fadeIn" style={styles.HeaderTitleCardJadwal}>Kamis, 12 Agustus 2022</Animatable.Text>
            <Animatable.Text animation="fadeIn" style={styles.SubTitleCardJadwal} numberOfLines={2} ellipsizeMode="tail">
              Kegiatan Pemeriksaan Balita
            </Animatable.Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => openModal('Lansia')}>
          <View style={styles.cardJadwalContainer}>
            <Animatable.Text animation="fadeIn" style={styles.TitleCardJadwal}>Kegiatan Hari ini</Animatable.Text>
            <Animatable.Text animation="fadeIn" style={styles.HeaderTitleCardJadwal}>Kamis, 12 Agustus 2022</Animatable.Text>
            <Animatable.Text animation="fadeIn" style={styles.SubTitleCardJadwal} numberOfLines={2} ellipsizeMode="tail">
              Kegiatan Pemeriksaan Lansia
            </Animatable.Text>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.activityTitle}>Kegiatan Posyandu</Text>
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4BC9FE" />
          <Text>Loading...</Text>
        </View>
      ) : (
        <>
          {filteredBalita.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.noDataText}>Tidak ada data balita.</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddBalitaForm')}
              >
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                {/* Custom Profile Image with Dropdown */}
                {renderCustomButton()}

                {/* Modal for Dropdown */}
                <Modal
                  visible={modalVisible}
                  transparent={true}
                  animationType="slide"
                  onRequestClose={() => setModalVisible(false)}
                >
                  <View style={styles.modalWrapper}>
                    <DropDownPicker
                      open={open}
                      value={selectedBalita}
                      items={items}
                      setOpen={setOpen}
                      setValue={setSelectedBalita}
                      setItems={setItems}
                      placeholder="Pilih Balita"
                      containerStyle={styles.dropdown}
                      style={styles.dropdownStyle}
                      dropDownContainerStyle={styles.dropDown}
                      onClose={() => setModalVisible(false)} // Close modal when selection is made
                    />
                  </View>
                </Modal>
              </View>

              {selectedBalitaData ? (
                <>
                  <View style={styles.tabs}>
                    <TouchableOpacity
                      style={[styles.tabButton, activeTab === 'Biodata' && styles.activeTabButton]}
                      onPress={() => setActiveTab('Biodata')}
                    >
                      <Text style={[styles.tabText, activeTab === 'Biodata' && styles.activeTabText]}>
                        BIODATA
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.tabButton, activeTab === 'PA' && styles.activeTabButton]}
                      onPress={() => setActiveTab('PA')}
                    >
                      <Text style={[styles.tabText, activeTab === 'PA' && styles.activeTabText]}>
                        DATA PA
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.tabButton, activeTab === 'Kegiatan' && styles.activeTabButton]}
                      onPress={() => setActiveTab('Kegiatan')}
                    >
                      <Text style={[styles.tabText, activeTab === 'Kegiatan' && styles.activeTabText]}>
                        DATA KEGIATAN
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <ScrollView style={styles.scrollContainer}>
                    <View style={styles.cardProfile}>
                      {renderDataSection()}
                    </View>
                  </ScrollView>
                </>
              ) : (
                <Text style={styles.noSelectionText}>Silakan pilih balita untuk melihat detail.</Text>
              )}
            </>
          )}
        </>
      )}

<Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedCategory} - Jadwal</Text>
            <Calendar
              markedDates={activities[selectedCategory]?.dates}
              onDayPress={onDayPress}
              theme={{
                selectedDayBackgroundColor: '#008EB3',
                todayTextColor: '#008EB3',
                arrowColor: '#008EB3',
              }}
            />
            {selectedDate ? (
              <View style={styles.activityContainer}>
                <Text style={styles.activityDate}>{selectedDate}</Text>
                <Text style={styles.activityText}>{selectedActivity}</Text>
              </View>
            ) : null}
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  cardHeader: {
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    marginHorizontal: 15,
    backgroundColor: '#008EB3'
  },

  subTitle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold'
  },

  title: {
    color: '#fff',
    fontSize: 25,
    fontFamily: 'PlusJakartaSans-Bold'
  },
  
  cardJadwal: {
    flexDirection: 'row',
    borderRadius: 10,
    marginTop: 20,
    marginHorizontal: 15,
  },

  cardJadwalContainer: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#008EB3',
    marginRight: 10
  },

  TitleCardJadwal: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold'
  },

  HeaderTitleCardJadwal: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'PlusJakartaSans-SemiBold'
  },

  SubTitleCardJadwal: {
    color: '#fff',
    fontSize: 10,
    width: 156,
    fontFamily: 'PlusJakartaSans-SemiBold'
  },

  profileWrapper: {
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  dropdownIconWrapper: {
    position: 'absolute',
    right: -5,
    bottom: -5,
    backgroundColor: '#4BC9FE',
    borderRadius: 15,
    padding: 2,
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  tabs: {
    flexDirection: 'row',
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 10,
    marginHorizontal: 20,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    padding: 7,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    color: '#4BC9FE',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  activeTabButton: {
    backgroundColor: '#4BC9FE',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    marginTop: 10,
  },
  cardProfile: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    margin: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  noSelectionText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    color: '#444',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#4BC9FE',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default DashboardBalita;
