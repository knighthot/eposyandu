import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

// Sample data for the children
const DataAnak = [
  {
    id: '1',
    nama_balita: 'Setia Budi',
    Nik_balita: '12273872918',
    umur: '1 tahun, 7 bulan',
    TempatTanggalLahir: 'Jakarta, 01 Januari 2000',
    Anak_ke: '1',
  },
  {
    id: '2',
    nama_balita: 'Setia Budi',
    Nik_balita: '12273872918',
    umur: '1 tahun, 7 bulan',
    TempatTanggalLahir: 'Jakarta, 01 Januari 2000',
    Anak_ke: '2',
  },
  {
    id: '3',
    nama_balita: 'Setia Budi',
    Nik_balita: '12273872918',
    umur: '1 tahun, 7 bulan',
    TempatTanggalLahir: 'Jakarta, 01 Januari 2000',
    Anak_ke: '3',
  },
];

// Component to render each item in the FlatList
const RenderItem = ({ item }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('DetailAnak', { dataAnak: item });
  };
  return (
    <View style={styles.verificationCard}>
      <View style={styles.verificationCardContent}>
        <View style={{ flexDirection: 'column', width: '70%' }}>
          <Text style={styles.verificationTextTitle}>{item.nama_balita}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="user" size={20} color="#16DBCC" />
            <Text style={styles.verificationText3}>{item.Nik_balita}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="user" size={20} color="#16DBCC" />
            <Text style={styles.verificationText3}>{item.TempatTanggalLahir}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.verificationText3}>{item.umur}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.verificationText3}>Anak ke - {item.Anak_ke}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
          <TouchableOpacity
            style={styles.statusButton}
            onPress={handlePress} 
           
          >
            <Icon name="eye" size={20} color="#16DBCC" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};


const RenderItemIbu = ({ item }) => (
  
  <View style={styles.dataSection}>
   
    <Text style={styles.label}>Nama Ibu</Text>
    <TextInput style={styles.input} value={item.nama_ibu} editable={false} />

    <Text style={styles.label}>NIK</Text>
    <TextInput style={styles.input} value={item.nik_ibu} editable={false} />

    <Text style={styles.label}>Jenis Kelamin</Text>
    <TextInput style={styles.input} value={item.jenis_kelamin_ibu} editable={false} />

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
    <TextInput style={styles.input} value={item.no_hp_ibu} editable={false} />

    <Text style={styles.label}>Email</Text>
    <TextInput style={styles.input} value={item.email_ibu} editable={false} />

    <Text style={styles.label}>Pekerjaan</Text>
    <TextInput style={styles.input} value={item.pekerjaan_ibu} editable={false} />

    <Text style={styles.label}>Pendidikan</Text>
    <TextInput style={styles.input} value={item.pendidikan_ibu} editable={false} />

  </View>
);

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

const RenderItemAyah = ({ item }) => (
  <View style={styles.dataSection}>
   
  <Text style={styles.label}>Nama Ayah</Text>
  <TextInput style={styles.input} value={item.DataAyah.nama_ayah} editable={false} />

  <Text style={styles.label}>NIK</Text>
  <TextInput style={styles.input} value={item.DataAyah.nik_ayah} editable={false} />

  <Text style={styles.label}>Tempat Lahir</Text>
  <TextInput style={styles.input} value={item.DataAyah.tempat_lahir_ayah} editable={false} />

  <Text style={styles.label}>Tanggal Lahir</Text>
  <TextInput style={styles.input} value={item.DataAyah.tanggal_lahir_ayah} editable={false} />

  <Text style={styles.label}>Alamat KTP</Text>
  <TextInput style={styles.input} value={item.DataAyah.alamat_ktp_ayah} editable={false} />

  <Text style={styles.label}>Kelurahan KTP</Text>
  <TextInput style={styles.input} value={item.DataAyah.kelurahan_ktp_ayah} editable={false} />

  <Text style={styles.label}>Kecamatan KTP</Text>
  <TextInput style={styles.input} value={item.DataAyah.kecamatan_ktp_ayah} editable={false} />

  <Text style={styles.label}>Kota KTP</Text>
  <TextInput style={styles.input} value={item.DataAyah.kota_ktp_ayah} editable={false} />

  <Text style={styles.label}>Provinsi KTP</Text>
  <TextInput style={styles.input} value={item.DataAyah.provinsi_ktp_ayah} editable={false} />

  <Text style={styles.label}>Alamat Domisili</Text>
  <TextInput style={styles.input} value={item.DataAyah.alamat_domisili_ayah} editable={false} />

  <Text style={styles.label}>Kelurahan Domisili</Text>
  <TextInput style={styles.input} value={item.DataAyah.kelurahan_domisili_ayah} editable={false} />

  <Text style={styles.label}>Kecamatan Domisili</Text>
  <TextInput style={styles.input} value={item.DataAyah.kecamatan_domisili_ayah} editable={false} />

  <Text style={styles.label}>Kota Domisili</Text>
  <TextInput style={styles.input} value={item.DataAyah.kota_domisili_ayah} editable={false} />

  <Text style={styles.label}>Provinsi Domisili</Text>
  <TextInput style={styles.input} value={item.DataAyah.provinsi_domisili_ayah} editable={false} />

  <Text style={styles.label}>Nomor HP</Text>
  <TextInput style={styles.input} value={item.DataAyah.no_hp_ayah} editable={false} />

  <Text style={styles.label}>Email</Text>
  <TextInput style={styles.input} value={item.DataAyah.email_ayah} editable={false} />

  <Text style={styles.label}>Pekerjaan</Text>
  <TextInput style={styles.input} value={item.DataAyah.pekerjaan_ayah} editable={false} />

  <Text style={styles.label}>Pendidikan</Text>
  <TextInput style={styles.input} value={item.DataAyah.pendidikan_ayah} editable={false} />

</View>
);

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
const DataAnakSection = () => (
   <ScrollView style={styles.dataSection}>
    {DataAnak.map((item) => (
      <RenderItem key={item.id} item={item} />
    ))}
  </ScrollView>
);

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

    marginVertical: 10,
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
    width: 150,
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
