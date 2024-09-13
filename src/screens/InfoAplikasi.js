import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'

const InfoAplikasi = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Info Aplikasi E-Posyandu</Text>
      
      <Text style={styles.subHeader}>Tentang Aplikasi</Text>
      <Text style={styles.paragraph}>
        E-Posyandu adalah aplikasi layanan posyandu yang dirancang untuk memudahkan pemantauan kesehatan dan perkembangan balita serta lansia. 
        Aplikasi ini memberikan akses cepat dan mudah bagi keluarga dan tenaga medis untuk melihat data perkembangan, imunisasi, dan kesehatan secara real-time.
      </Text>

      <Text style={styles.subHeader}>Fitur untuk Balita</Text>
      <Text style={styles.paragraph}>
        1. Pemantauan Perkembangan Balita:
        {'\n'}Aplikasi memungkinkan pemantauan grafik perkembangan fisik balita, seperti berat badan, tinggi badan, dan status gizi, sehingga orang tua dapat mengikuti perkembangan anaknya secara berkala.
      </Text>
      <Text style={styles.paragraph}>
        2. Data Imunisasi Balita:
        {'\n'}Fitur ini mencatat riwayat imunisasi balita yang telah diberikan. Orang tua dapat melihat jadwal imunisasi berikutnya serta status vaksinasi anak mereka.
      </Text>
      <Text style={styles.paragraph}>
        3. Data Pemberian Vitamin:
        {'\n'}Pemberian vitamin juga dicatat di dalam aplikasi ini. Orang tua dapat memantau pemberian vitamin dan memastikan anak mendapatkan suplemen sesuai jadwal.
      </Text>

      <Text style={styles.subHeader}>Fitur untuk Lansia</Text>
      <Text style={styles.paragraph}>
        1. Data Kesehatan Lansia:
        {'\n'}Fitur ini mencakup catatan kesehatan rutin lansia seperti tekanan darah, gula darah, dan riwayat pemeriksaan medis lainnya. Ini membantu lansia dan keluarganya untuk memantau kondisi kesehatan secara berkala.
      </Text>
      <Text style={styles.paragraph}>
        2. Data Lansia:
        {'\n'}Aplikasi juga menyimpan data lengkap tentang lansia yang terdaftar di posyandu, termasuk status kesehatan mereka dan riwayat pengobatan atau pemeriksaan yang telah dilakukan.
      </Text>

      <Text style={styles.subHeader}>Manfaat</Text>
      <Text style={styles.paragraph}>
        Aplikasi E-Posyandu memberikan kemudahan bagi tenaga kesehatan dan masyarakat untuk mengakses data kesehatan dengan lebih mudah dan cepat, serta meningkatkan kualitas pelayanan posyandu di masyarakat.
      </Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#008EB3',
  },
  paragraph: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
    lineHeight: 22,
  },
})

export default InfoAplikasi
