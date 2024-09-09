import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Modal, Button } from 'react-native';
import React, { useState } from 'react';
import { useRoute,useNavigation } from '@react-navigation/native';

import Header from '../../componentKader/Header'
import { BiodataSectionAyah, DataAnakSection } from '../../componentKader/DataOrtu'
import cowok from '../../../../assets/images/anakcow.png';
import cewek from '../../../../assets/images/anakcew.png';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import DetailOrtu from './DetailOrtu';
import { ScrollView } from 'react-native-gesture-handler';
const DetailOrtuAyah = () => {
    const [activeTab, setActiveTab] = useState('Biodata');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [openBalita, setOpenBalita] = useState(false);
    const [isDatePickerOpenBalita, setDatePickerOpenBalita] = useState(false);
    const navigation = useNavigation();
    const route = useRoute();
    const { combineData } = route.params; 
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
    const renderDataSection = () => {
        switch (activeTab) {
            case 'Biodata':
                return <BiodataSectionAyah DataAyah={combineData} />;
            case 'Data Anak':
                return <DataAnakSection />;
            default:
                return null;
        }
    };

    const renderProfileImage = () => {
        switch (dataAnak.Gender) {
            case 'Laki-Laki':
                return cowok;
            case 'Perempuan':
                return cewek;
            default:
                return null;
        }
    };

    const renderBackgroundColor = () => {
        switch (dataAnak.Gender) {
            case 'Laki-Laki':
                return '#E3F2FD'; // Light blue for boys
            case 'Perempuan':
                return '#FCE4EC'; // Light pink for girls
            default:
                return '#FFFFFF'; // Default color
        }
    };

    const dataAnak = {
        id: 1,
        Nama_balita: 'Haris',
        Nama_Ibu: 'Ibu Haris',
        TempattanggalLahir: 'Tanjungpinang Timur, Senin 30 Juni 2024',
        Gender: 'Laki-Laki',
    }

   

    const handleSave = () => {
        // Save the edited data
        console.log(editedData);
        setIsModalVisible(false);
    };

    const handleInputChange = (name, value) => {
        setEditedData({ ...editedData, [name]: value });
    };

    return (
        <View style={styles.container}>
            <Header title='Lihat Data Orang Tua' />
            <ScrollView>
            <View style={styles.cardProfile}>
                <View style={styles.profileContainer}>
                    <View style={styles.leftSection}>
                    <Text style={styles.name}> {combineData.DataAyah.nama_ayah}</Text>
                        <Text style={styles.label}>Nama Istri</Text>
                        <Text style={styles.value}> {combineData.Nama_Ibu}</Text>
                        <Text style={styles.label}>Tempat Tanggal Lahir</Text>
                        <Text style={styles.value}>{combineData.DataAyah.tempat_lahir_ayah}, {combineData.DataAyah.tanggal_lahir_ayah}</Text>
                        <Text style={styles.label}>Jenis Kelamin</Text>
                        <Text style={styles.value}>{combineData.DataAyah.jenis_kelamin_ayah}</Text>
                    </View>
                    <View style={styles.rightSection}>
                    <TouchableOpacity style={styles.ChangeButton} onPress={() => navigation.navigate(DetailOrtu)}>
                                <Icon name="exchange" size={20} color="white" />
                            </TouchableOpacity>
                        {/* Profile Image */}
                        <View style={[styles.profileImageContainer, { backgroundColor: renderBackgroundColor(dataAnak.Gender) }]}>
                            <Image
                                style={styles.profileImage}
                                source={renderProfileImage(dataAnak.Gender)}
                            />

                            <TouchableOpacity style={styles.editButton} onPress={() => setIsModalVisible(true)}>
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
            <Modal
                transparent={true}
                visible={isModalVisible}
                animationType="slide"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Edit Data Anak</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="NIK Anak"
                            keyboardType="numeric"
                            maxLength={16}
                            placeholderTextColor="gray"
                            value={editedData.nikAnak}
                            onChangeText={(value) => handleInputChange('nikAnak', value)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="No KK"
                            keyboardType="numeric"
                            maxLength={16}
                            placeholderTextColor="gray"
                            value={editedData.noKK}
                            onChangeText={(value) => handleInputChange('noKK', value)}
                        />
                        <DropDownPicker
                            open={openBalita}
                            value={editedData.jenisKelamin}
                            items={items}
                            setOpen={setOpenBalita}
                            onSelectItem={(item) => setEditedData({ ...editedData, jenisKelamin: item.value })}
                            setItems={setItems}
                            placeholder="Pilih Jenis Kelamin"
                            containerStyle={styles.dropdownContainer}
                            style={styles.dropdown}
                            dropDownStyle={styles.dropdown}
                        />
                        <View style={styles.dateContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Tempat Lahir"
                                placeholderTextColor="gray"
                                value={editedData.tempatLahir}
                                onChangeText={(value) => handleInputChange('tempatLahir', value)}
                            />
                            <TouchableOpacity
                                style={styles.datePickerButton}
                                onPress={() => setDatePickerOpenBalita(true)}
                            >
                                <Text style={styles.datePickerButtonText}>
                                    {editedData.tanggalLahir ? moment(editedData.tanggalLahir).format('DD/MM/YYYY') : 'Tanggal Lahir'}
                                </Text>
                            </TouchableOpacity>

                            <DatePicker
                                modal
                                open={isDatePickerOpenBalita}
                                date={editedData.tanggalLahir || new Date()}
                                mode="date"
                                onConfirm={(date) => {
                                    setDatePickerOpenBalita(false);
                                    setEditedData({ ...editedData, tanggalLahir: date });
                                }}
                                onCancel={() => setDatePickerOpenBalita(false)}
                            />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Berat Badan Awal"
                            placeholderTextColor="gray"
                            value={editedData.beratBadanAwal}
                            onChangeText={(value) => handleInputChange('beratBadanAwal', value)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Tinggi Badan Awal"
                            placeholderTextColor="gray"
                            value={editedData.tinggiBadanAwal}
                            onChangeText={(value) => handleInputChange('tinggiBadanAwal', value)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Riwayat Penyakit"
                            placeholderTextColor="gray"
                            value={editedData.riwayatPenyakit}
                            onChangeText={(value) => handleInputChange('riwayatPenyakit', value)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Riwayat Kelahiran"
                            placeholderTextColor="gray"
                            value={editedData.riwayatKelahiran}
                            onChangeText={(value) => handleInputChange('riwayatKelahiran', value)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Keterangan"
                            placeholderTextColor="gray"
                            value={editedData.keterangan}
                            onChangeText={(value) => handleInputChange('keterangan', value)}
                        />
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>Tambah</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        marginTop: 10,
        height: 50,
        width: 150,
        borderRadius: 10,
        justifyContent: 'center',
    },
    datePickerButtonText: {
        color: '#000',
        marginLeft: 20,
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
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
    dataSection: {
        padding: 15,
        borderRadius: 10,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginTop: 10,
        fontSize: 16,
        color: '#444444',
    },
    dropdown: {
        width: '100%',
        marginVertical: 10,
        color: 'black',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
    },
    saveButton: {
        backgroundColor: '#4BC9FE',
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default DetailOrtuAyah;
