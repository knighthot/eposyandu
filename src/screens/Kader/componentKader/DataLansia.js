import React,{ useState,useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import axios from 'axios';
// Dummy data for pemeriksaan lansia (you can replace this with real data)
const pemeriksaanLansiaData = [
  {
    id: '1',
    nama_lansia: 'Budi Santoso',
    tanggal_kunjungan: '2023-08-01',
    berat_badan: '60 kg',
    tinggi_badan: '160 cm',
    tekanan_darah: '120/80',
    status: 'Normal',
  },
  {
    id: '2',
    nama_lansia: 'Siti Aminah',
    tanggal_kunjungan: '2023-07-15',
    berat_badan: '55 kg',
    tinggi_badan: '155 cm',
    tekanan_darah: '110/70',
    status: 'Normal',
  },
  // Add more data as necessary
];

// Biodata Lansia Section
const BiodataLansiaSection = ({ dataLansia }) => {
    const [pekerjaanIbu, setPekerjaanIbu] = useState('');
    const [pendidikanIbu, setPendidikanIbu] = useState('');
    const [namaWali, setNamaWali] = useState('');
  
    const fetchPekerjaanDanPendidikan = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const pekerjaanResponse = await axios.get(`${Config.API_URL}/pekerjaan/${dataLansia.pekerjaan_lansia}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPekerjaanIbu(pekerjaanResponse.data.nama);
        console.log(pekerjaanResponse.data.nama)
        const pendidikanResponse = await axios.get(`${Config.API_URL}/pendidikan/${dataLansia.pendidikan_lansia}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPendidikanIbu(pendidikanResponse.data.nama);
        console.log(pendidikanResponse.data.nama)
        
        const namaWalidanResponse = await axios.get(`${Config.API_URL}/wali/${dataLansia.wali}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNamaWali(namaWalidanResponse.data.nama_wali);

      }  catch (error) {
       
  
      }

    };
    useEffect(() => {
        fetchPekerjaanDanPendidikan();
      }, []);
    const calculateAge = (birthDate) => {
      if (!birthDate) return '';
      const now = moment();
      const birthMoment = moment(birthDate);
      const years = now.diff(birthMoment, 'years');
      const months = now.diff(birthMoment, 'months') % 12;
      return `${years} tahun, ${months} bulan`;
    };
  
    return (
      <View style={styles.dataSection}>
        <Text style={styles.label}>Nomor KK</Text>
        <TextInput style={styles.input} value={dataLansia?.no_kk_lansia || ''} editable={false} />
  
        <Text style={styles.label}>Nama Wali</Text>
        <TextInput style={styles.input} value={namaWali || ''} editable={false} />
  
        <Text style={styles.label}>NIK Lansia</Text>
        <TextInput style={styles.input} value={dataLansia?.nik_lansia?.toString() || ''} editable={false} />
  
        <Text style={styles.label}>Nama Lansia</Text>
        <TextInput style={styles.input} value={dataLansia?.nama_lansia || ''} editable={false} />
  
        <Text style={styles.label}>Tempat Lahir</Text>
        <TextInput style={styles.input} value={dataLansia?.tempat_lahir_lansia || ''} editable={false} />
  
        <Text style={styles.label}>Tanggal Lahir</Text>
        <TextInput style={styles.input} value={moment(dataLansia?.tanggal_lahir_lansia).format('DD MMMM YYYY')} editable={false} />
  
        <Text style={styles.label}>Umur</Text>
        <TextInput style={styles.input} value={calculateAge(dataLansia?.tanggal_lahir_lansia)} editable={false} />
  
        <Text style={styles.label}>Jenis Kelamin</Text>
        <TextInput style={styles.input} value={dataLansia?.jenis_kelamin_lansia === 'l' ? 'Laki-Laki' : 'Perempuan'} editable={false} />
  
        <Text style={styles.label}>Alamat KTP</Text>
        <TextInput style={styles.input} value={dataLansia?.alamat_ktp_lansia || ''} editable={false} />
  
        <Text style={styles.label}>Kelurahan KTP</Text>
        <TextInput style={styles.input} value={dataLansia?.kelurahan_ktp_lansia || ''} editable={false} />
  
        <Text style={styles.label}>Kecamatan KTP</Text>
        <TextInput style={styles.input} value={dataLansia?.kecamatan_ktp_lansia || ''} editable={false} />
  
        <Text style={styles.label}>Kota KTP</Text>
        <TextInput style={styles.input} value={dataLansia?.kota_ktp_lansia || ''} editable={false} />
  
        <Text style={styles.label}>Provinsi KTP</Text>
        <TextInput style={styles.input} value={dataLansia?.provinsi_ktp_lansia || ''} editable={false} />
  
        <Text style={styles.label}>Alamat Domisili</Text>
        <TextInput style={styles.input} value={dataLansia?.alamat_domisili_lansia || ''} editable={false} />
  
        <Text style={styles.label}>Kelurahan Domisili</Text>
        <TextInput style={styles.input} value={dataLansia?.kelurahan_domisili_lansia || ''} editable={false} />
  
        <Text style={styles.label}>Kecamatan Domisili</Text>
        <TextInput style={styles.input} value={dataLansia?.kecamatan_domisili_lansia || ''} editable={false} />
  
        <Text style={styles.label}>Kota Domisili</Text>
        <TextInput style={styles.input} value={dataLansia?.kota_domisili_lansia || ''} editable={false} />
  
        <Text style={styles.label}>Provinsi Domisili</Text>
        <TextInput style={styles.input} value={dataLansia?.provinsi_domisili_lansia || ''} editable={false} />
  
        <Text style={styles.label}>No HP</Text>
        <TextInput style={styles.input} value={dataLansia?.no_hp_lansia?.toString() || ''} editable={false} />
  
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={dataLansia?.email_lansia || ''} editable={false} />
  
        <Text style={styles.label}>Pekerjaan</Text>
        <TextInput style={styles.input} value={pekerjaanIbu} editable={false} />
  
        <Text style={styles.label}>Pendidikan</Text>
        <TextInput style={styles.input} value={pendidikanIbu} editable={false} />
  
        <Text style={styles.label}>Status Pernikahan</Text>
        <TextInput style={styles.input} value={dataLansia?.status_pernikahan_lansia || ''} editable={false} />
      </View>
    );
  };
  

// Biodata Wali Section
const BiodataWaliSection = ({ dataWali }) => {
  return (
    <View style={styles.dataSection}>
      <Text style={styles.label}>Nama Wali</Text>
      <TextInput style={styles.input} value={dataWali?.nama_wali || ''} editable={false} />

      <Text style={styles.label}>NIK Wali</Text>
      <TextInput style={styles.input} value={dataWali?.nik_wali?.toString() || ''} editable={false} />

      <Text style={styles.label}>Tempat Lahir</Text>
      <TextInput style={styles.input} value={dataWali?.tempat_lahir_wali || ''} editable={false} />

      <Text style={styles.label}>Tanggal Lahir</Text>
      <TextInput style={styles.input} value={moment(dataWali?.tanggal_lahir_wali).format('DD MMMM YYYY')} editable={false} />

      <Text style={styles.label}>Jenis Kelamin</Text>
      <TextInput style={styles.input} value={dataWali?.jenis_kelamin_wali === 'l' ? 'Laki-Laki' : 'Perempuan'} editable={false} />

      <Text style={styles.label}>Alamat KTP</Text>
      <TextInput style={styles.input} value={dataWali?.alamat_ktp_wali || ''} editable={false} />

      <Text style={styles.label}>Alamat Domisili</Text>
      <TextInput style={styles.input} value={dataWali?.alamat_domisili_wali || ''} editable={false} />

      <Text style={styles.label}>No HP</Text>
      <TextInput style={styles.input} value={dataWali?.no_hp_wali || ''} editable={false} />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={dataWali?.email_wali || ''} editable={false} />
    </View>
  );
};

// Pemeriksaan Lansia Section
const PemeriksaanLansiaSection = () => {
  return (
    <View style={styles.dataSection}>
      {pemeriksaanLansiaData.map((item) => (
        <View key={item.id} style={styles.verificationCard}>
          <View style={styles.verificationCardContent}>
            <View style={{ flexDirection: 'column', width: '70%' }}>
              <Text style={styles.verificationTextTitle}>{item.nama_lansia}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="calendar" size={20} color="#16DBCC" />
                <Text style={styles.verificationText3}>Tanggal: {moment(item.tanggal_kunjungan).format('DD MMMM YYYY')}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="heartbeat" size={20} color="#16DBCC" />
                <Text style={styles.verificationText3}>Tekanan Darah: {item.tekanan_darah}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
              <TouchableOpacity
                style={[styles.statusButton, item.status === 'Normal' ? styles.normal : styles.abnormal]}
              >
                <Text style={styles.statusText}>{item.status}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

// Main Component
export { BiodataLansiaSection, BiodataWaliSection, PemeriksaanLansiaSection };
// Styles
const styles = StyleSheet.create({
  dataSection: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    marginVertical: 10,
    borderRadius: 10,
    elevation: 2,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#888888',
    marginTop: 5,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#DDDDDD',
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
    marginVertical: 10,
  },
  verificationCardContent: {
    margin: 10,
    flexDirection: 'row',
  },
  verificationTextTitle: {
    color: 'black',
    fontFamily: 'Urbanist-ExtraBold',
    marginBottom: 2,
    flexWrap: 'wrap',
    fontSize: 15,
  },
  verificationText3: {
    color: 'black',
    fontFamily: 'Urbanist-Bold',
    marginBottom: 5,
    fontSize: 12,
    flexWrap: 'wrap',
    width: 150,
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  normal: {
    backgroundColor: '#16DBCC',
  },
  abnormal: {
    backgroundColor: '#FF4C4C',
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

