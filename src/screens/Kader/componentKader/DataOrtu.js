import React,{useEffect,useState} from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import moment from 'moment';

// Component to render each item in the FlatList
const RenderItem = ({ item }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('DetailAnak', { id: item.id });
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return ''; // Jika tidak ada tanggal lahir

    const now = moment(); // Waktu sekarang
    const birthMoment = moment(birthDate); // Tanggal lahir
    const years = now.diff(birthMoment, 'years'); // Selisih dalam tahun
    const months = now.diff(birthMoment, 'months') % 12; // Sisa bulan setelah dikurangi tahun

    return `${years} tahun, ${months} bulan`;
  };

  return (
    <View style={styles.verificationCard}>
      <View style={styles.verificationCardContent}>
        <View style={{ flexDirection: 'column', width: '70%' }}>
          <Text style={styles.verificationTextTitle}>{item.nama_balita}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="id-card" size={20} color="#424F5E" />
            <Text style={styles.verificationText3}>{item.nik_balita}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center',marginTop:5 }}>
            <Icon name="transgender" size={20} color="#424F5E" />
            <Text style={styles.verificationText3}>{item.jenis_kelamin_balita === 'l' ? 'Laki-Laki' : 'Perempuan'}</Text>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.verificationText}>{calculateAge(item.tanggal_lahir_balita)}</Text>
          </View>
    
        </View>
        <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
          <TouchableOpacity style={styles.statusButton} onPress={handlePress}>
            <Icon name="eye" size={20} color="#16DBCC" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};


const RenderItemIbu = ({ item }) => {
  const [pekerjaanIbu, setPekerjaanIbu] = useState('');
  const [pendidikanIbu, setPendidikanIbu] = useState('');

  console.log(item.pekerjaan_ibu)
  const fetchPekerjaanDanPendidikan = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const pekerjaanResponse = await axios.get(`${Config.API_URL}/pekerjaan/${item.pekerjaan_ibu}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPekerjaanIbu(pekerjaanResponse.data.nama);

      const pendidikanResponse = await axios.get(`${Config.API_URL}/pendidikan/${item.pendidikan_ibu}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendidikanIbu(pendidikanResponse.data.nama);
    } catch (error) {
      console.error('Error fetching pekerjaan or pendidikan:', error);
    }
  };

  useEffect(() => {
    fetchPekerjaanDanPendidikan();
  }, []);
  return (
  <View style={styles.dataSection}>
   
    <Text style={styles.label}>Nama Ibu</Text>
    <TextInput style={styles.input} value={item.nama_ibu} editable={false} />

    <Text style={styles.label}>NIK</Text>
    <TextInput style={styles.input} value={item.nik_ibu.toString()} editable={false} />

    <Text style={styles.label}>Tempat Lahir</Text>
    <TextInput style={styles.input} value={item.tempat_lahir_ibu} editable={false} />

    <Text style={styles.label}>Tanggal Lahir</Text>
    <TextInput style={styles.input} value={item.tanggal_lahir_ibu} editable={false} />

    <Text style={styles.label}>Alamat KTP</Text>
    <TextInput style={styles.input} value={item.alamat_ktp_ibu} editable={false} />

    <Text style={styles.label}>Kelurahan KTP</Text>
    <TextInput style={styles.input} value={item.kelurahan_ktp_ibu} editable={false} />

    <Text style={styles.label}>Kecamatan KTP</Text>
    <TextInput style={styles.input} value={item.kecamatan_ktp_ibu} editable={false} />

    <Text style={styles.label}>Kota KTP</Text>
    <TextInput style={styles.input} value={item.kota_ktp_ibu} editable={false} />

    <Text style={styles.label}>Provinsi KTP</Text>
    <TextInput style={styles.input} value={item.provinsi_ktp_ibu} editable={false} />

    <Text style={styles.label}>Alamat Domisili</Text>
    <TextInput style={styles.input} value={item.alamat_domisili_ibu} editable={false} />

    <Text style={styles.label}>Kelurahan Domisili</Text>
    <TextInput style={styles.input} value={item.kelurahan_domisili_ibu} editable={false} />

    <Text style={styles.label}>Kecamatan Domisili</Text>
    <TextInput style={styles.input} value={item.kecamatan_domisili_ibu} editable={false} />

    <Text style={styles.label}>Kota Domisili</Text>
    <TextInput style={styles.input} value={item.kota_domisili_ibu} editable={false} />

    <Text style={styles.label}>Provinsi Domisili</Text>
    <TextInput style={styles.input} value={item.provinsi_domisili_ibu} editable={false} />

    <Text style={styles.label}>Nomor HP</Text>
    <TextInput style={styles.input} value={item.no_hp_ibu.toString()} editable={false} />

    <Text style={styles.label}>Email</Text>
    <TextInput style={styles.input} value={item.email_ibu} editable={false} />

    <Text style={styles.label}>Pekerjaan</Text>
    <TextInput style={styles.input} value={pekerjaanIbu} editable={false} />

    <Text style={styles.label}>Pendidikan</Text>
    <TextInput style={styles.input} value={pendidikanIbu} editable={false} />

  </View>
  
);
}

// Komponen Biodata untuk menampilkan data ibu dalam bentuk FlatList
const BiodataSectionIbu = ({ DataIbu }) => {
  const dataArray = Array.isArray(DataIbu) ? DataIbu : [DataIbu];

  return (
    <View contentContainerStyle={styles.scrollContainer}>
      {dataArray.map((item, index) => (
        <RenderItemIbu key={index} item={item} />
      ))}
    </View>
  );
};


// Component for displaying father's biodata

const RenderItemAyah = ({ item }) =>{
  const [pekerjaanAyah, setPekerjaanAyah] = useState('');
  const [pendidikanAyah, setPendidikanAyah] = useState('');

  // Fetch pekerjaan dan pendidikan dari ID
  const fetchPekerjaanDanPendidikan = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const pekerjaanResponse = await axios.get(`${Config.API_URL}/pekerjaan/${item.pekerjaan_ayah}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPekerjaanAyah(pekerjaanResponse.data.nama);

      const pendidikanResponse = await axios.get(`${Config.API_URL}/pendidikan/${item.pendidikan_ayah}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendidikanAyah(pendidikanResponse.data.nama);
    } catch (error) {
      console.error('Error fetching pekerjaan or pendidikan:', error);
    }
  };

  useEffect(() => {
    fetchPekerjaanDanPendidikan();
  }, []);

  return (
    
  <View style={styles.dataSection}>
   
  <Text style={styles.label}>Nama Ayah</Text>
  <TextInput style={styles.input} value={item.nama_ayah} editable={false} />

  <Text style={styles.label}>NIK</Text>
  <TextInput style={styles.input} value={item.nik_ayah.toString()} editable={false} />

  <Text style={styles.label}>Tempat Lahir</Text>
  <TextInput style={styles.input} value={item.tempat_lahir_ayah} editable={false} />

  <Text style={styles.label}>Tanggal Lahir</Text>
  <TextInput style={styles.input} value={item.tanggal_lahir_ayah} editable={false} />

  <Text style={styles.label}>Alamat KTP</Text>
  <TextInput style={styles.input} value={item.alamat_ktp_ayah} editable={false} />

  <Text style={styles.label}>Kelurahan KTP</Text>
  <TextInput style={styles.input} value={item.kelurahan_ktp_ayah} editable={false} />

  <Text style={styles.label}>Kecamatan KTP</Text>
  <TextInput style={styles.input} value={item.kecamatan_ktp_ayah} editable={false} />

  <Text style={styles.label}>Kota KTP</Text>
  <TextInput style={styles.input} value={item.kota_ktp_ayah} editable={false} />

  <Text style={styles.label}>Provinsi KTP</Text>
  <TextInput style={styles.input} value={item.provinsi_ktp_ayah} editable={false} />

  <Text style={styles.label}>Alamat Domisili</Text>
  <TextInput style={styles.input} value={item.alamat_domisili_ayah} editable={false} />

  <Text style={styles.label}>Kelurahan Domisili</Text>
  <TextInput style={styles.input} value={item.kelurahan_domisili_ayah} editable={false} />

  <Text style={styles.label}>Kecamatan Domisili</Text>
  <TextInput style={styles.input} value={item.kecamatan_domisili_ayah} editable={false} />

  <Text style={styles.label}>Kota Domisili</Text>
  <TextInput style={styles.input} value={item.kota_domisili_ayah} editable={false} />

  <Text style={styles.label}>Provinsi Domisili</Text>
  <TextInput style={styles.input} value={item.provinsi_domisili_ayah} editable={false} />

  <Text style={styles.label}>Nomor HP</Text>
  <TextInput style={styles.input} value={item.no_hp_ayah.toString()} editable={false} />

  <Text style={styles.label}>Email</Text>
  <TextInput style={styles.input} value={item.email_ayah} editable={false} />

  <Text style={styles.label}>Pekerjaan</Text>
  <TextInput style={styles.input} value={pekerjaanAyah} editable={false} />

  <Text style={styles.label}>Pendidikan</Text>
  <TextInput style={styles.input} value={pendidikanAyah} editable={false} />

</View>
);
};

// Component Biodata to display father's data in a FlatList
const BiodataSectionAyah = ({ DataAyah }) => {
const dataArray = Array.isArray(DataAyah) ? DataAyah : [DataAyah];

return (
  <View contentContainerStyle={styles.scrollContainer}>
    {dataArray.map((item, index) => (
      <RenderItemAyah key={index} item={item} />
    ))}
  </View>
);
};

// Component for displaying the list of children
const DataAnakSection = ({ orangtuaId }) => {
  console.log('Id OrangTua:', orangtuaId);
  const [dataAnak, setDataAnak] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDataAnak = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get(`${Config.API_URL}/balita`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter anak-anak berdasarkan orangtuaId
      const filteredAnak = response.data.filter((anak) => anak.orangtua === orangtuaId);
      setDataAnak(filteredAnak);
    } catch (error) {
      console.error('Error fetching data anak:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataAnak();
  }, [orangtuaId]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (dataAnak.length === 0) {
    return <Text>No data available</Text>;
  }

  return (
    <ScrollView style={styles.dataSection}>
      {dataAnak.map((item) => (
        <RenderItem key={item.id} item={item} />
      ))}
    </ScrollView>
  );
};
export { BiodataSectionIbu, DataAnakSection, BiodataSectionAyah };

const styles = StyleSheet.create({
  scrollContainer: {
   flex: 1,
  },
  dataSection: {
    paddingVertical: 15,
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
    marginBottom: 10,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  verificationCardContent: {
    margin: 10,
    flexDirection: 'row',
  },
  verificationText: {
    color: 'black',
    fontFamily: 'Urbanist-Reguler',
    marginTop: 5,
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
    width: 150,
  },
  verificationTextTitle: {
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'Urbanist-ExtraBold',
    marginBottom: 10,
    flexWrap: 'wrap',
    fontSize: 15,
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    backgroundColor: '#DCFAF8',
    alignItems: 'center',
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
