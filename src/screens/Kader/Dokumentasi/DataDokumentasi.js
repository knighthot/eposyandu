import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput, Alert, Image } from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';

const DataDokumentasi = () => {
    console.log(Config.IMAGE_URL);
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [viewDetailVisible, setViewDetailVisible] = useState(false); // New state for viewing details
    const [selectedItem, setSelectedItem] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [isDatePickerOpen, setDatePickerOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [filePath, setFilePath] = useState(null);
    const [localImageUri, setLocalImageUri] = useState(null);
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
            console.log(token);
            const response = await axios.get(`${Config.API_URL}/dokumentasi`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFilteredData(response.data);
            console.log(response.data);
        } catch (error) {
            handleAxiosError(error);
        }
    };

    const handleInputChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
      };

    const handleImagePick = async () => {
        const options = {
            mediaType: 'photo',
            quality: 1,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                setLocalImageUri(response.assets[0].uri);
                const formData = new FormData();
                formData.append('file', {
                    uri: response.assets[0].uri,
                    name: response.assets[0].fileName,
                    type: response.assets[0].type,
                });
                setFilePath(formData); // Save form data for later upload
            }
        });
    };

  
    
 

  
    // Function for viewing details (when card is pressed)
    const handleViewDetail = (item) => {
        setSelectedItem(item);
        setViewDetailVisible(true);
    };

    // Function for editing (when pencil icon is pressed)

    const handleAxiosError = (error) => {
        console.error('Error details:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
        Alert.alert('Error', errorMessage);
    };
// Function for handling submit for both add and edit
const handleSubmit = async () => {
    if (editModalVisible) {
        // If edit modal is visible, we are editing
        handleEditSubmit();
    } else {
        // Otherwise, it's a new entry
        handleAddSubmit();
    }
};

// Edit submission logic
const handleEditSubmit = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            throw new Error('Token is missing');
        }

        let uploadedFilePath = selectedItem.foto; // Default to current foto path
        if (filePath) {
            // If a new file was selected, upload it
            const uploadResponse = await axios.post(`${Config.API_URL}/upload`, filePath, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            uploadedFilePath = `/uploads/${uploadResponse.data.fileName}`;
        }

        // Update the existing item using its ID
        await axios.put(
            `${Config.API_URL}/dokumentasi/${selectedItem.id}`,
            {
                judul: formData.nama_kegiatan,
                tanggal: moment(formData.hari_tanggal, 'dddd, DD MMMM YYYY').toISOString(),
                deskripsi: formData.deskripsi,
                foto: uploadedFilePath, // Use the new or existing photo path
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        fetchKegiatan();  // Reload data
        setEditModalVisible(false); // Close modal
    } catch (error) {
        handleAxiosError(error);  // Handle any errors
    }
};

// Add submission logic
const handleAddSubmit = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            throw new Error('Token is missing');
        }

        let uploadedFilePath = null;
        if (filePath) {
            const uploadResponse = await axios.post(`${Config.API_URL}/upload`, filePath, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            uploadedFilePath = `/uploads/${uploadResponse.data.fileName}`;
        }

        // Create new item
        await axios.post(
            `${Config.API_URL}/dokumentasi`,
            {
                judul: formData.nama_kegiatan,
                tanggal: moment(formData.hari_tanggal, 'dddd, DD MMMM YYYY').toISOString(),
                deskripsi: formData.deskripsi,
                foto: uploadedFilePath,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        fetchKegiatan();  // Reload data
        setModalVisible(false);  // Close modal
    } catch (error) {
        handleAxiosError(error);  // Handle any errors
    }
};

    const renderItem = ({ item }) => (
        console.log( `${Config.IMAGE_URL}${item.foto}`),
        <TouchableOpacity style={styles.verificationCard} onPress={() => handleViewDetail(item)}>
            <View style={styles.verificationCardContent}>
                <View style={{ flexDirection: 'column', width: '55%' }}>
                    <Text style={styles.verificationTextTitle}>{item.judul}</Text>
                    <Text style={styles.verificationText}>Tanggal kegiatan</Text>
                    <Text style={styles.verificationText3}>{moment(item.tanggal).format('dddd, DD MMMM YYYY')}</Text>
                    <Text style={styles.verificationText}>Deskripsi</Text>
                    <Text style={styles.verificationText3} numberOfLines={2} ellipsizeMode="tail">{item.deskripsi}</Text>
                </View>
                <View style={{ flexDirection: 'column', top: 10 }}>
                   
                    {item.foto && <Image source={{ uri: `${Config.IMAGE_URL}${item.foto}` }} style={styles.uploadedImage} />}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.editButton} onPress={() => handleEditKegiatan(item)}>
                            <Icon name="pencil" size={20} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteDokumentasi(item.id)}>
                            <Icon name="trash" size={24} color="#FF0000" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    const handleEditKegiatan = (item) => {
        setSelectedItem(item);
        setFormData({
            nama_kegiatan: item.judul,
            hari_tanggal: moment(item.tanggal).format('dddd, DD MMMM YYYY'),
            deskripsi: item.deskripsi,
        });
        setEditModalVisible(true);
    };

    const handleDeleteDokumentasi= async (id) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                throw new Error('Token is missing');
            }

            await axios.delete(`${Config.API_URL}/dokumentasi/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchKegiatan();
        } catch (error) {
            handleAxiosError(error);
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
                        onChangeText={(query) => setSearchQuery(query)}
                    />
                </View>
            </View>

            <FlatList data={filteredData} style={styles.flatList} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} />

            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Icon name="plus" size={30} color="white" />
            </TouchableOpacity>

            {/* Add/Edit Modal */}
            <Modal transparent={true} visible={modalVisible || editModalVisible} animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>{editModalVisible ? 'Edit Kegiatan' : 'Tambah Kegiatan'}</Text>

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


                        <TextInput
                            style={styles.input}
                            placeholder="Deskripsi Kegiatan"
                            placeholderTextColor="gray"
                            value={formData.deskripsi}
                            onChangeText={(text) => handleInputChange('deskripsi', text)}
                            multiline
                            numberOfLines={4}
                        />

                        <TouchableOpacity style={styles.uploadButton} onPress={handleImagePick}>
                            <Text style={styles.uploadButtonText}>Pilih Gambar</Text>
                        </TouchableOpacity>

                        {localImageUri && <Image source={{ uri: localImageUri }} style={styles.uploadedImage} />}

                        <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.modalButton} onPress={handleSubmit}>
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
     <Modal transparent={true} visible={viewDetailVisible} animationType="slide">
    <View style={styles.modalOverlay}>
        <View style={styles.detailModalContainer}>
            <Text style={styles.detailModalTitle}>Detail Kegiatan</Text>
            {selectedItem && (
                <>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Nama:</Text>
                        <Text style={styles.detailValue}>{selectedItem.judul}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Tanggal:</Text>
                        <Text style={styles.detailValue}>
                            {moment(selectedItem.tanggal).format('dddd, DD MMMM YYYY')}
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Deskripsi:</Text>
                        <Text style={styles.detailValue}>{selectedItem.deskripsi}</Text>
                    </View>

                    {selectedItem.foto && (
                        <Image
                            source={{ uri: `${Config.IMAGE_URL}${selectedItem.foto}` }}
                            style={styles.detailImage}
                        />
                    )}
                </>
            )}
            <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setViewDetailVisible(false)}
            >
                <Text style={styles.closeButtonText}>Tutup</Text>
            </TouchableOpacity>
        </View>
    </View>
</Modal>

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
      modalContainer: {
        width: '95%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 20,
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
    },
    modalButton: {
        backgroundColor: '#008EB3',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    detailModalContainer: {
        width: '90%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 10,
    },
    detailModalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    detailLabel: {
        fontWeight: 'bold',
        fontSize: 16,
        width: '30%',
        color: '#555',
    },
    detailValue: {
        fontSize: 16,
        width: '70%',
        color: '#333',
    },
    detailImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: '#008EB3',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
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
        fontWeight: 'bold',
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
  uploadedImage: {
    width: 120,
    height: 100,
  marginLeft:10,
  },
  uploadButton: {
    backgroundColor: '#008EB3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DataDokumentasi;
