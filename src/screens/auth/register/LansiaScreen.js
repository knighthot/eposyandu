import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet, Touchable, FlatList } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Header from '../../../components/Header';
import moment from 'moment';
import 'moment/locale/id'; // Import Indonesian locale

moment.locale('id'); // Set the locale to Indonesian

const LansiaScreen = ({ route }) => {
    const navigation = useNavigation();
    const [openLansia, setOpenLansia] = useState(false);
    const [isDatePickerOpenLansia, setDatePickerOpenLansia] = useState(false);
    const [lansiaData, setLansiaData] = useState({
        nik_lansia: '', nama_lansia: '', jenis_kelamin_lansia: '', tempat_lahir_lansia: '', tanggal_lahir_lansia: null, alamat_ktp_lansia: '', kelurahan_ktp_lansia: '',
        kecamatan_ktp_lansia: '', kota_ktp_lansia: '', provinsi_ktp_lansia: '', alamat_domisili_lansia: '', kelurahan_domisili_lansia: '',
        kecamatan_domisili_lansia: '', kota_domisili_lansia: '', provinsi_domisili_lansia: '', no_hp_lansia: '', email_lansia: '',
        pekerjaan_lansia: '', pendidikan_lansia: ''
    });
    const userData = route.params || {};
  


    console.log(userData, "data");

    const [items, setItems] = useState([
        { label: 'Laki-Laki', value: 'l' },
        { label: 'Perempuan', value: 'P' }
    ]);


    const handleNext = () => {
        const formattedLansiaData = {
            ...lansiaData,
            tanggal_lahir_lansia: lansiaData.tanggal_lahir_lansia ? lansiaData.tanggal_lahir_lansia.toISOString() : null,
        };

        navigation.navigate('WaliScreen', { lansiaData: formattedLansiaData, userData });

    };

    const handleSubmit = async () => {

        try {

            const formattedLansiaData = {
                ...lansiaData,
                tanggal_lahir_lansia: lansiaData.tanggal_lahir_lansia ? lansiaData.tanggal_lahir_lansia.toISOString() : null,
            };
            console.log('Saving lansiaData locally...');

            await AsyncStorage.setItem('lansiaData', JSON.stringify(userData));
            console.log('users saved:', userData);



            console.log('Saving lansiaData locally...');




            await AsyncStorage.setItem('lansiaData', JSON.stringify(formattedLansiaData));
            console.log('lansiaData saved:', lansiaData);

            console.log('All data saved locally successfully');

            // Optionally, navigate to another screen or display a success message
            navigation.navigate('SplashScreen', { message: 'Data saved locally!' });
        } catch (error) {
            console.error('Error saving data locally:', error);
            // Handle errors, such as showing an alert
            Alert.alert('Error', 'Failed to save data locally');
        }
    };



    const formatDate = (date) => {
        return moment(date).format('LL'); // 'LL' format gives a localized long date
    };

    const renderForm = () => (
        <View>
            <View style={styles.scene}>
                <Text style={styles.title}>Data Diri Lansia</Text>
                <TextInput
                    style={styles.input}
                    placeholder="NIK Lansia"
                    placeholderTextColor="#000"
                    value={lansiaData.nik_lansia}
                    onChangeText={(text) => setLansiaData({ ...lansiaData, nik_lansia: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Nama Lansia"
                    placeholderTextColor="#000"
                    value={lansiaData.nama_lansia}
                    onChangeText={(text) => setLansiaData({ ...lansiaData, nama_lansia: text })}
                />
                <DropDownPicker
                    open={openLansia}
                    value={lansiaData.jenis_kelamin_lansia}
                    items={items}
                    setOpen={setOpenLansia}
                    onSelectItem={(item) => setLansiaData({ ...lansiaData, jenis_kelamin_lansia: item.value })}
                    setItems={setItems}
                    placeholder="Pilih Jenis Kelamin"
                    containerStyle={styles.dropdownContainer}
                    style={styles.dropdown}
                    dropDownStyle={styles.dropdown}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Tempat Lahir Lansia"
                    placeholderTextColor="#000"
                    value={lansiaData.tempat_lahir_lansia}
                    onChangeText={(text) => setLansiaData({ ...lansiaData, tempat_lahir_lansia: text })}
                />

                <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setDatePickerOpenLansia(true)}
                >
                    <Text style={styles.datePickerButtonText}>
                        {lansiaData.tanggal_lahir_lansia ? formatDate(lansiaData.tanggal_lahir_lansia) : 'Pilih Tanggal Lahir Lansia'}
                    </Text>
                </TouchableOpacity>
                <DatePicker
                    modal
                    style={styles.datePicker}
                    open={isDatePickerOpenLansia}
                    date={lansiaData.tanggal_lahir_lansia || new Date()}
                    mode="date"
                    onConfirm={(date) => {
                        setDatePickerOpenLansia(false);
                        setLansiaData({ ...lansiaData, tanggal_lahir_lansia: date });
                        console.log('Selected date:', date);  // Log the selected date
                    }}
                    onCancel={() => {
                        setDatePickerOpenLansia(false);
                        console.log('Date picker cancelled');
                    }}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Alamat KTP Lansia"
                    placeholderTextColor="#000"
                    value={lansiaData.alamat_ktp_lansia}
                    onChangeText={(text) => setLansiaData({ ...lansiaData, alamat_ktp_lansia: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Kelurahan KTP Lansia"
                    placeholderTextColor="#000"
                    value={lansiaData.kelurahan_ktp_lansia}
                    onChangeText={(text) => setLansiaData({ ...lansiaData, kelurahan_ktp_lansia: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Kecamatan KTP Lansia"
                    placeholderTextColor="#000"
                    value={lansiaData.kecamatan_ktp_lansia}
                    onChangeText={(text) => setLansiaData({ ...lansiaData, kecamatan_ktp_lansia: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Kota KTP Lansia"
                    placeholderTextColor="#000"
                    value={lansiaData.kota_ktp_lansia}
                    onChangeText={(text) => setLansiaData({ ...lansiaData, kota_ktp_lansia: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Provinsi KTP Lansia"
                    placeholderTextColor="#000"
                    value={lansiaData.provinsi_ktp_lansia}
                    onChangeText={(text) => setLansiaData({ ...lansiaData, provinsi_ktp_lansia: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Alamat Domisili Lansia"
                    placeholderTextColor="#000"
                    value={lansiaData.alamat_domisili_lansia}
                    onChangeText={(text) => setLansiaData({ ...lansiaData, alamat_domisili_lansia: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Kelurahan Domisili Lansia"
                    placeholderTextColor="#000"
                    value={lansiaData.kelurahan_domisili_lansia}
                    onChangeText={(text) => setLansiaData({ ...lansiaData, kelurahan_domisili_lansia: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Kecamatan Domisili Lansia"
                    placeholderTextColor="#000"
                    value={lansiaData.kecamatan_domisili_lansia}
                    onChangeText={(text) => setLansiaData({ ...lansiaData, kecamatan_domisili_lansia: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Kota Domisili Lansia"
                    placeholderTextColor="#000"
                    value={lansiaData.kota_domisili_lansia}
                    onChangeText={(text) => setLansiaData({ ...lansiaData, kota_domisili_lansia: text })}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Provinsi Domisili Lansia"
                    placeholderTextColor="#000"
                    value={lansiaData.provinsi_domisili_lansia}
                    onChangeText={(text) => setLansiaData({ ...lansiaData, provinsi_domisili_lansia: text })}
                />

                <TextInput
                    style={styles.input}
                    placeholder="No. HP Lansia"
                    placeholderTextColor="#000"
                    value={lansiaData.no_hp_lansia}
                    onChangeText={(text) => setLansiaData({ ...lansiaData, no_hp_lansia: text })}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Email Lansia"
                    placeholderTextColor="#000"
                    value={lansiaData.email_lansia}
                    onChangeText={(text) => setLansiaData({ ...lansiaData, email_lansia: text })}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Pekerjaan Lansia"
                    placeholderTextColor="#000"
                    value={lansiaData.pekerjaan_lansia}
                    onChangeText={(text) => setLansiaData({ ...lansiaData, pekerjaan_lansia: text })}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Pendidikan Lansia"
                    placeholderTextColor="#000"
                    value={lansiaData.pendidikan_lansia}
                    onChangeText={(text) => setLansiaData({ ...lansiaData, pendidikan_lansia: text })}
                />

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.btnNext}
                        onPress={handleNext}
                    >
                        <Text style={styles.btnText}>Daftar Wali</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnNext} onPress={handleSubmit}>
                        <Text style={styles.btnText}>Selesai</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Header title="Formulir Pendaftaran Lansia" onLeftPress={() => navigation.goBack()} />
            <View style={styles.container}>
                <FlatList
                    data={[{ key: 'form' }]}
                    renderItem={renderForm}
                    keyExtractor={(item) => item.key}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    scene: {
        padding: 20,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        paddingVertical: 20,
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
        fontWeight: 'bold',
        color: '#008EB3',
    },
    input: {
        backgroundColor: '#DFE4EB',
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
        color: '#000',
    },
    dropdownContainer: {
        height: 50,
        marginBottom: 20,
    },
    dropdown: {
        backgroundColor: '#DFE4EB',
        borderColor: '#ccc',
    },
    datePicker: {
        backgroundColor: '#DFE4EB',
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
        borderRadius: 10,
        justifyContent: 'center',
    },
    datePickerButtonText: {
        color: '#000',
        marginLeft: 20,
    },
    btnNext: {
        backgroundColor: '#008EB3',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    btnText: {
        color: '#FFF',
        fontSize: 16,
    },
    buttonContainer: {
        paddingBottom: 30,
    },
});

export default LansiaScreen;

