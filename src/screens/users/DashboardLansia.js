import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import * as Animatable from 'react-native-animatable';
import cowok from '../../assets/images/anakcow.png';
import cewek from '../../assets/images/anakcew.png';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ListItem from '../../components/ListItem';
import Config from 'react-native-config';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSharedValue } from 'react-native-reanimated';
import { BiodataLansiaSection, PemeriksaanLansiaSection } from '../../screens/Kader/componentKader/DataLansia'; // Import the correct sections for Lansia

const DashboardLansia = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [dataLansia, setDataLansia] = useState([]); // All Lansia data
  const [selectedLansia, setSelectedLansia] = useState(null); // Selected Lansia from dropdown
  const [filteredLansia, setFilteredLansia] = useState([]); // Lansia filtered based on caregiver
  const [dokumentasi, setDokumentasi] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false); // Dropdown open/close state
  const [items, setItems] = useState([]); // Items for dropdown
  const [modalVisible, setModalVisible] = useState(false); // Modal for Dropdown
  const [scrollEnabled, setScrollEnabled] = useState(true); // Control ScrollView scroll behavior
  const navigation = useNavigation(); // Navigation for navigating to form data lansia
  const [activeTab, setActiveTab] = useState('Biodata');
  const [modalVisibleDropdown, setModalVisibleDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activities, setActivities] = useState({});
  const [todayActivity, setTodayActivity] = useState('');
  const [isTodayModalVisible, setTodayModalVisible] = useState(false);

  const scrollX = useSharedValue(0);

  const onScroll = e => {
    scrollX.value = e.nativeEvent.contentOffset.x;
  };

  // Function to open the modal
  const openTodayModal = () => {
    setTodayModalVisible(true);
  };

  // Function to close the modal
  const closeTodayModal = () => {
    setTodayModalVisible(false);
  };

  const onDayPress = (day) => {
    const dateActivities = activities[selectedCategory]?.dates?.[day.dateString]?.activity;

    // If there is no activity on the selected date, show default message
    if (!dateActivities) {
      setSelectedDate(day.dateString);
      setSelectedActivity('Tidak ada kegiatan');
      return;
    }

    // Join all activities into a single string
    const activityText = dateActivities.join('\n');
    setSelectedDate(day.dateString);
    setSelectedActivity(activityText);
  };

  LocaleConfig.locales['id'] = {
    monthNames: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
    dayNames: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
    dayNamesShort: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
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
        // Fetch user data
        const userResponse = await axios.get(`${Config.API_URL}/pengguna/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = userResponse.data;

        // Fetch all lansia data
        const lansiaResponse = await axios.get(`${Config.API_URL}/lansia`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const allLansia = lansiaResponse.data;
        console.log(allLansia, 'all lansia');
        // Filter lansia based on caregiver ID
        const filtered = allLansia.filter(lansia => lansia.wali === userData.wali);
        setFilteredLansia(filtered);
        console.log(filtered, 'filtered lansia');
        // Set dropdown items
        const dropdownItems = filtered.map((lansia) => ({
          label: lansia.nama_lansia,
          value: lansia.id,
        }));
        setItems(dropdownItems);

        // Fetch activities from the backend
        const kegiatanResponse = await axios.get(`${Config.API_URL}/kegiatan`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const kegiatanData = kegiatanResponse.data;

        // Filter only activities for Lansia
        const filteredLansiaKegiatan = kegiatanData.filter(kegiatan => kegiatan.jenis === 'lansia');

        // Process activities into calendar format with custom styles
        const formattedActivities = {};
        filteredLansiaKegiatan.forEach((kegiatan) => {
          const date = kegiatan.tanggal;

          // If the date already exists, add the activity description
          if (formattedActivities[date]) {
            formattedActivities[date].activity.push(kegiatan.deskripsi);
          } else {
            // If it doesn't exist, create an array to store activity descriptions
            formattedActivities[date] = {
              marked: true,
              dotColor: 'blue',
              activity: [kegiatan.deskripsi],
              customStyles: {
                container: {
                  backgroundColor: 'rgba(0, 150, 136, 0.2)',
                  borderRadius: 50,
                },
                text: {
                  color: '#0000FF',
                  fontWeight: 'bold',
                },
              }
            };
          }
        });

        console.log(formattedActivities, "kegiatan lansia");

        // Set the activities in state
        setActivities({
          Lansia: { dates: formattedActivities }
        });

        // Check if there are any activities for today
        const today = moment().format('YYYY-MM-DD');
        const todayActivity = formattedActivities[today]?.activity || [];
        setTodayActivity(todayActivity);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch Dokumentasi data for Lansia
  useEffect(() => {
    const fetchDokumentasi = async () => {
      try {
        const response = await axios.get(`${Config.API_URL}/dokumentasi`);
        setDokumentasi(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dokumentasi:', error);
        setIsLoading(false);
      }
    };
    fetchDokumentasi();
  }, []);

  const renderDataSection = () => {
    switch (activeTab) {
      case 'Biodata':
        return <BiodataLansiaSection dataLansia={selectedLansiaData} />;
      case 'Pemeriksaan':
        return <PemeriksaanLansiaSection dataLansia={selectedLansiaData} />;
      default:
        return null;
    }
  };

  const selectedLansiaData = filteredLansia.find(lansia => lansia.id === selectedLansia);

  const renderCustomButton = () => {
    return (
      <View style={styles.profileWrapper}>
        <Image
          style={styles.profileImage}
          source={selectedLansiaData ? cowok : cewek}
        />
        <TouchableOpacity style={styles.dropdownIconWrapper} onPress={() => setModalVisibleDropdown(true)}>
          <Icon name="arrow-drop-down" size={30} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      scrollEnabled={scrollEnabled}
    >
      <View style={styles.cardHeader}>
        <Animatable.Text animation="fadeIn" style={styles.title}>Selamat Datang</Animatable.Text>
        <Animatable.Text animation="fadeIn" style={styles.subTitle}>Di E-Posyandu Lansia</Animatable.Text>
      </View>

      <Text style={{ marginVertical: 10, color: "black", fontFamily: "PlusJakartaSans-SemiBold", marginHorizontal: 15 }}>
        Kegiatan Posyandu Lansia
      </Text>

      <View style={styles.cardJadwal}>
        <TouchableOpacity onPress={() => openModal('Lansia')}>
          <View style={styles.cardJadwalContainer}>
            <Animatable.Text animation="fadeIn" style={styles.TitleCardJadwal}>Lansia</Animatable.Text>
            <Animatable.Text animation="fadeIn" style={styles.HeaderTitleCardJadwal}>Kamis, 12 Agustus 2022</Animatable.Text>
            <Animatable.Text animation="fadeIn" style={styles.SubTitleCardJadwal} numberOfLines={2} ellipsizeMode="tail">
              Kegiatan Pemeriksaan Lansia
            </Animatable.Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={openTodayModal}>
          <View style={styles.cardJadwalContainer}>
            <Animatable.Text animation="fadeIn" style={styles.TitleCardJadwal}>Kegiatan Hari ini</Animatable.Text>
            {todayActivity.length > 0 ? (
              <>
                <Animatable.Text animation="fadeIn" style={styles.HeaderTitleCardJadwal}>
                  {moment().format('dddd, D MMMM YYYY')}
                </Animatable.Text>
                <Animatable.Text animation="fadeIn" style={styles.SubTitleCardJadwal}>
                  <Text style={styles.SubTitleCardJadwal}>tekan untuk melihat</Text>
                </Animatable.Text>
              </>
            ) : (
              <>
                <Animatable.Text animation="fadeIn" style={styles.HeaderTitleCardJadwal}>
                  {moment().format('dddd, D MMMM YYYY')}
                </Animatable.Text>
                <Animatable.Text animation="fadeIn" style={styles.SubTitleCardJadwal}>
                  Tidak ada kegiatan hari ini
                </Animatable.Text>
              </>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Rest of the JSX and modals */}
      {/* Rest of the JS and modals */}
{isLoading ? (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#4BC9FE" />
    <Text>Loading...</Text>
  </View>
) : (
  <>
    {filteredLansia.length === 0 ? (
      <View style={styles.emptyContainer}>
        <Text style={styles.noDataText}>Tidak ada data lansia.</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddLansiaForm')} // Ensure this navigates to the correct form for adding Lansia
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
            visible={modalVisibleDropdown}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisibleDropdown(false)}
          >
            <View style={styles.modalWrapper}>
              <DropDownPicker
                open={open}
                value={selectedLansia}
                items={items}
                setOpen={setOpen}
                setValue={setSelectedLansia}
                setItems={setItems}
                placeholder="Pilih Lansia"
                containerStyle={styles.dropdown}
                style={styles.dropdownStyle}
                dropDownContainerStyle={styles.dropDown}
                onClose={() => setModalVisibleDropdown(false)}
              />
            </View>
          </Modal>
        </View>

        {selectedLansiaData ? (
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
                style={[styles.tabButton, activeTab === 'Pemeriksaan' && styles.activeTabButton]}
                onPress={() => setActiveTab('Pemeriksaan')}
              >
                <Text style={[styles.tabText, activeTab === 'Pemeriksaan' && styles.activeTabText]}>
                  PEMERIKSAAN
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
          <Text style={styles.noSelectionText}>Silakan pilih lansia untuk melihat detail.</Text>
        )}
      </>
    )}
  </>
)}

<View style={styles.PenggunaTitleCard}>
  <Text style={styles.PenggunaTitle}>Dokumentasi</Text>
</View>

<View style={styles.GambarContainer}>
  {isLoading ? (
    <Text>Loading...</Text>
  ) : (
    <FlatList
      data={dokumentasi}
      horizontal
      style={{ margin: 16 }}
      bounces={false}
      onScroll={onScroll}
      scrollEventThrottle={18}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ padding: 0 }}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item, index }) => (
        <ListItem
          path={item.foto}  // Use the correct path from your API data
          scrollX={scrollX}
          description={item.deskripsi}
          index={index}
          dataLength={dokumentasi.length}
        />
      )}
    />
  )}
</View>

{/* Calendar Modal for selecting date */}
<Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={closeModal}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>{selectedCategory} - Jadwal Lansia</Text>
      <Calendar
        markedDates={activities[selectedCategory]?.dates}
        onDayPress={onDayPress}
        markingType={'custom'}
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

{/* Modal for today's activities */}
<Modal
  visible={isTodayModalVisible}
  transparent={true}
  animationType="fade"
  onRequestClose={closeTodayModal}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer1}>
      <Text style={styles.modalTitle}>
        {moment().format('dddd, D MMMM YYYY')}
      </Text>
      {todayActivity.length > 0 ? (
        todayActivity.map((activity, index) => (
          <Text key={index} style={styles.modalText}>
            - {activity}
          </Text>
        ))
      ) : (
        <Text style={styles.modalText}>Tidak ada kegiatan hari ini</Text>
      )}
      <TouchableOpacity onPress={closeTodayModal} style={styles.closeButton}>
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
  PenggunaTitleCard: {
    textAlign: 'center',
    alignItems: 'center',
    fontFamily: "PlusJakartaSans-SemiBold"
  },
  GambarContainer: {
    flex: 1,
    marginBottom: 50,
  },
  PenggunaTitle: {
    marginVertical: 10,
    color: "black",
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold"
  },

  cardHeader: {
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    marginHorizontal: 15,
    backgroundColor: '#008EB3'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContainer1: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',

  },

  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 18,
    color: 'black',
    fontFamily: 'PlusJakartaSans-Bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },

  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#008EB3',
    borderRadius: 10,
    alignItems: 'center',
  },

  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold'
  },

  activityContainer: {
    marginTop: 20,
    alignItems: 'center',
  },

  activityDate: {
    fontSize: 14,
    color: 'black',
    fontFamily: 'PlusJakartaSans-SemiBold'
  },

  activityText: {
    fontSize: 14,
    color: 'gray',
    fontFamily: 'PlusJakartaSans-Regular',
    textAlign: 'center'
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
    marginBottom: 20,
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

  dropdown: {
    width: '70%',
    marginBottom: 10,
    color: 'black',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    zIndex: 100,
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
    marginTop: 5,
  },
  cardProfile: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginHorizontal: 20,
    marginVertical: 10,
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

export default DashboardLansia;
