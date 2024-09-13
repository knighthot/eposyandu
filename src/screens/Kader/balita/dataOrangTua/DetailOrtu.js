import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Header from '../../../Kader/componentKader/Header';
import { BiodataSectionIbu, BiodataSectionAyah, DataAnakSection } from '../../componentKader/DataOrtu'; // Assuming you have both sections
import cowok from '../../../../assets/images/anakcow.png';
import cewek from '../../../../assets/images/anakcew.png';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const DetailOrtu = ({ route }) => {
    const [activeTab, setActiveTab] = useState('Biodata');
    const [isModalVisible, setIsModalVisible] = useState(false);
  
    const { id } = route.params; 
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [DataOrtu , setDataOrtu] = useState([]);
    const [isShowingIbu, setIsShowingIbu] = useState(true); // New state to toggle between Ibu and Ayah

    const [editedData, setEditedData] = useState({
        nikAnak: '',
        noKK: '',
        jenisKelamin: '',
        tempatLahir: '',
        tanggalLahir: null,
        beratBadanAwal: '',
        tinggiBadanAwal: '',
        riwayatPenyakit: '',
        riwayatKelahiran: '',
        keterangan: '',
    });

    const [items, setItems] = useState([
        { label: 'Laki-Laki', value: 'l' },
        { label: 'Perempuan', value: 'P' }
    ]);

    const fetchDataOrangTua = async () => {
        setIsLoading(true);
        const token = await AsyncStorage.getItem('token');
        try {
          const response = await axios.get(`${Config.API_URL}/orangtua/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setDataOrtu(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false);
        }
      };

    useFocusEffect(
        React.useCallback(() => {
          fetchDataOrangTua();
          return () => { };
        }, [])
    );

    const renderDataSection = () => {
        if (activeTab === 'Biodata') {
            return isShowingIbu ? <BiodataSectionIbu DataIbu={DataOrtu} /> : <BiodataSectionAyah DataAyah={DataOrtu} />;
        } else if (activeTab === 'Data Anak') {
            return <DataAnakSection orangtuaId={DataOrtu.id} />;
        }
        return null;
    };

    const renderProfileImage = () => {
        // Tampilkan cewek jika Ibu, cowok jika Ayah
        return isShowingIbu ? cewek : cowok;
    };
    
    const renderBackgroundColor = () => {
        // Pink untuk Ibu, Blue untuk Ayah
        return isShowingIbu ? '#FCE4EC' : '#E3F2FD'; 
    };
    

    const handleToggle = () => {
        setIsShowingIbu(!isShowingIbu); // Toggle between Ibu and Ayah
    };

    const handleEdit = () => {
        navigation.navigate('EditIbuForm', {  DataOrtu: DataOrtu });
    };

    return (
        <View style={styles.container}>
            <Header title='Lihat Data Orang Tua' />
            <ScrollView>
                <View style={styles.cardProfile}>
                    <View style={styles.profileContainer}>
                        <View style={styles.leftSection}>
                            <Text style={styles.name}>
                                {isShowingIbu ? DataOrtu?.nama_ibu : DataOrtu?.nama_ayah}
                            </Text>
                            <Text style={styles.label}>Tempat Tanggal Lahir</Text>
                            <Text style={styles.value}>
                                {isShowingIbu 
                                    ? `${DataOrtu?.tempat_lahir_ibu}, ${moment(DataOrtu?.tanggal_lahir_ibu).format('dddd, DD MMMM YYYY')}`
                                    : `${DataOrtu?.tempat_lahir_ayah}, ${moment(DataOrtu?.tanggal_lahir_ayah).format('dddd, DD MMMM YYYY')}`}
                            </Text>
                            <Text style={styles.label}>Nomor Kartu Keluarga</Text>
                            <Text style={styles.value}>{DataOrtu?.no_kk}</Text>
                        </View>
                        <View style={styles.rightSection}>
                            <TouchableOpacity style={styles.ChangeButton} onPress={handleToggle}>
                                <Icon name="exchange" size={20} color="white" />
                            </TouchableOpacity>
                            <View style={[styles.profileImageContainer, { backgroundColor: renderBackgroundColor() }]}>
                                <Image
                                    style={styles.profileImage}
                                    source={renderProfileImage()}
                                />
                                <TouchableOpacity style={styles.editButton} onPress={() => handleEdit()}>
                                    <Icon name="pencil" size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Tabs */}
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
                        style={[styles.tabButton, activeTab === 'Data Anak' && styles.activeTabButton]}
                        onPress={() => setActiveTab('Data Anak')}
                    >
                        <Text style={[styles.tabText, activeTab === 'Data Anak' && styles.activeTabText]}>
                            DATA ANAK
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Data Section */}
                <View style={styles.cardProfile}>
                    {renderDataSection()}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2',
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
    profileImageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 140,
        height: 200,
        right: 0,
        borderRadius: 10,
    },
    profileContainer: {
        flexDirection: 'row',
    },
    leftSection: {
        flex: 1,
        justifyContent: 'center',
    },
    rightSection: {
        flex: 1,
        alignItems: 'center',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
    },
    label: {
        fontSize: 12,
        color: '#888888',
        marginTop: 5,
    },
    value: {
        fontSize: 14,
        color: '#444444',
        marginTop: 2,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 50,
    },
    editButton: {
        position: 'absolute',
        bottom: 0,
        right: -7,
        backgroundColor: '#16DBCC',
        padding: 10,
        borderRadius: 20,
    },
    ChangeButton: {
        position: 'absolute',
        top: -2,
        right: -7,
        backgroundColor: '#16DBCC',
        padding: 10,
        zIndex: 100,
        borderRadius: 20,
    },
    tabs: {
        flexDirection: 'row',
        marginBottom: 10,
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
});

export default DetailOrtu;
