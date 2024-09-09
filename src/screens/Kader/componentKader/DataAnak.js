import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { BarChart } from 'react-native-gifted-charts';

const imunisasiData = [
    {
      id: '1',
      nama_balita: 'Setia Budi',
      jenis_imunisasi: 'BCG',
      tanggal_imunisasi: '2022-01-01',
      status: 'Sudah',
    },
    {
      id: '2',
      nama_balita: 'Ahmad Junaedi',
      jenis_imunisasi: 'BCG',
      tanggal_imunisasi: '2022-01-01',
      status: 'Belum',
    },

    {
      id: '3',
      nama_balita: 'Dewi Astuti',
      jenis_imunisasi: 'BCG',
      tanggal_imunisasi: '2022-01-01',
      status: 'Belum',
    },

    {
      id: '4',
      nama_balita: 'Dewi Astuti',
      jenis_imunisasi: 'BCG',
      tanggal_imunisasi: '2022-01-01',
      status: 'Belum',
    },
    // Tambahkan lebih banyak data sesuai kebutuhan
  ];

const renderItem = ({ item }) => (
    <View style={styles.verificationCard}>
      <View style={styles.verificationCardContent}>
        <View style={{ flexDirection: 'column', width: '70%' }}>
          <Text style={styles.verificationTextTitle}>{item.nama_balita}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="user" size={20} color="#16DBCC" />
            <Text style={styles.verificationText3}>{item.jenis_imunisasi}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="user" size={20} color="#16DBCC" />
            <Text style={styles.verificationText3}>{item.tanggal_imunisasi}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
          <TouchableOpacity
            style={[
              styles.statusButton,
              item.status === 'Sudah' ? styles.sudah : styles.belum,
            ]}
          >
            <Text style={styles.statusText}>{item.status}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  
const BiodataSection = () => (
  <View style={styles.dataSection}>
    <Text style={styles.label}>Nama</Text>
    <TextInput style={styles.input} value="Setia Budi" editable={false} />

    <Text style={styles.label}>NIK</Text>
    <TextInput style={styles.input} value="12273872918" editable={false} />

    <Text style={styles.label}>Umur</Text>
    <TextInput style={styles.input} value="1 tahun, 7 bulan" editable={false} />

    <Text style={styles.label}>Riwayat Penyakit</Text>
    <TextInput style={styles.input} value="Tidak ada" editable={false} />
  </View>
);

const PASection = () => {
    const datadummy = [
      { value: 0.2, label: '0,1 ' ,frontColor: '#4ABFF4',spacing: 0 }, //umur
      { value: 3,  }, //berat
      { value: 0.5, label: '0.5 ' ,frontColor: '#4ABFF4',spacing: 0 },
      { value: 5,  },
      { value: 1, label: '1 ' ,frontColor: '#4ABFF4',spacing: 0 },
      { value: 5,  },
      { value: 1, label: '2' ,frontColor: '#4ABFF4',spacing: 0 },
      { value: 1.5,  },
      { value: 3, label: '3', frontColor: '#4ABFF4',spacing: 0 },
      { value: 4,  },
      { value: 5, label: '4 kg' ,frontColor: '#4ABFF4',spacing: 0},
      { value: 5, }  
    ]
    return (
  <View style={styles.dataSection}>
 
    <View style={{ marginTop: 20 ,width: '100%'}}>
      <BarChart
      labelColor={'#888888'}
        data={datadummy}
        barWidth={30}
        spacing={15}
        capThickness={4}
        isAnimated
       
        xAxisLabelTextStyle={{  color: '#4ABFF4', }}
        sideWidth={15}
       
        yAxisTextStyle={{color: '#90EE90'}}
        frontColor={'#90EE90'}

      />
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: '#ADD8E6' }]} />
          <Text style={styles.legendText}>Umur Balita</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: '#90EE90' }]} />
          <Text style={styles.legendText}>Berat Balita</Text>
        </View>
      </View>
    </View>
  </View>
  
);
}
const ImunisasiSection = () => (
    
  <View style={styles.dataSection}>
    <FlatList
      data={imunisasiData}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      style={{ maxHeight: 300 }}
    />
  </View>
);

export { BiodataSection, PASection, ImunisasiSection };

const styles = StyleSheet.create({
  dataSection: {
    padding: 15,
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
    flex: 1,
    marginVertical: 10
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
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  sudah: {
    backgroundColor: '#16DBCC',
  },
  belum: {
    backgroundColor: '#FF4C4C',
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
