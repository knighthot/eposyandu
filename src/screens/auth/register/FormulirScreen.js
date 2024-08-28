import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet, Touchable, } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import moment from 'moment';

import 'moment/locale/id'; // Import Indonesian locale

moment.locale('id'); // Set the locale to Indonesian

// Form components for Balita and Lansia

const FormBalita = ({ onComplete }) => {
  
  const [balitaData, setBalitaData] = useState({
    nik_ibu: '', nama_ibu: '', jenis_kelamin_ibu: '', tempat_lahir_ibu: '', tanggal_lahir_ibu: null,
    alamat_ktp_ibu: '', kelurahan_ktp_ibu: '', kecamatan_ktp_ibu: '', kota_ktp_ibu: '', provinsi_ktp_ibu: '',
    alamat_domisili_ibu: '', kelurahan_domisili_ibu: '', kecamatan_domisili_ibu: '', kota_domisili_ibu: '', provinsi_domisili_ibu: '',
    no_hp_ibu: '', email_ibu: '', pekerjaan_ibu: '', pendidikan_ibu: '', nik_ayah: '',
    nama_ayah: '', jenis_kelamin_ayah: '', tempat_lahir_ayah: '', tanggal_lahir_ayah: null, alamat_ktp_ayah: '', kelurahan_ktp_ayah: '',
    kecamatan_ktp_ayah: '', kota_ktp_ayah: '', provinsi_ktp_ayah: '', alamat_domisili_ayah: '', kelurahan_domisili_ayah: '',
    kecamatan_domisili_ayah: '', kota_domisili_ayah: '', provinsi_domisili_ayah: '', no_hp_ayah: '', email_ayah: '',
    pekerjaan_ayah: '', pendidikan_ayah: ''
  });

  const formatDate = (date) => {
    return moment(date).format('LL'); // 'LL' format gives a localized long date
  };

  const [openIbu, setOpenIbu] = useState(false);
  const [openAyah, setOpenAyah] = useState(false);
  const [isDatePickerOpenIbu, setDatePickerOpenIbu] = useState(false);
  const [isDatePickerOpenAyah, setDatePickerOpenAyah] = useState(false);

  const [items, setItems] = useState([
    { label: 'Laki-Laki', value: 'l' },
    { label: 'Perempuan', value: 'P' }
  ]);
  const handleNext = () => {
    onComplete({ balitaData });
  };

  return (
    <ScrollView style={styles.scene}>
      <Text style={styles.title}>Data Diri Ibu</Text>
      <TextInput
        style={styles.input}
        placeholder="NIK Ibu"
        placeholderTextColor="#000"
        value={balitaData.nik_ibu}
        onChangeText={(text) => setBalitaData({ ...balitaData, nik_ibu: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Nama Ibu"
        placeholderTextColor="#000"
        value={balitaData.nama_ibu}
        onChangeText={(text) => setBalitaData({ ...balitaData, nama_ibu: text })}
      />
      <DropDownPicker
        open={openIbu}
        value={balitaData.jenis_kelamin_ibu}
        items={items}
        setOpen={setOpenIbu}
        setValue={(value) => setBalitaData({ ...balitaData, jenis_kelamin_ibu: value })}
        setItems={setItems}
        placeholder="Pilih Jenis Kelamin"
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
        dropDownStyle={styles.dropdown}
      />
      <TextInput
        style={styles.input}
        placeholder="Tempat Lahir Ibu"
        placeholderTextColor="#000"
        value={balitaData.tempat_lahir_ibu}
        onChangeText={(text) => setBalitaData({ ...balitaData, tempat_lahir_ibu: text })}
      />
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setDatePickerOpenIbu(true)}
      >
        <Text style={styles.datePickerButtonText}>
          {balitaData.tanggal_lahir_ibu ? formatDate(balitaData.tanggal_lahir_ibu) : 'Pilih Tanggal Lahir Ibu'}
        </Text>
      </TouchableOpacity>
      <DatePicker
        modal
        style={styles.datePicker}
        open={isDatePickerOpenIbu}
        date={balitaData.tanggal_lahir_ibu || new Date()}
        mode="date"
        onConfirm={(date) => {
          setDatePickerOpenIbu(false);
          setBalitaData({ ...balitaData, tanggal_lahir_ibu: date });
        }}
        onCancel={() => {
          setDatePickerOpenIbu(false);
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Alamat KTP Ibu"
        placeholderTextColor="#000"
        value={balitaData.alamat_ktp_ibu}
        onChangeText={(text) => setBalitaData({ ...balitaData, alamat_ktp_ibu: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Kelurahan KTP Ibu"
        placeholderTextColor="#000"
        value={balitaData.kelurahan_ktp_ibu}
        onChangeText={(text) => setBalitaData({ ...balitaData, kelurahan_ktp_ibu: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Kecamatan KTP Ibu"
        placeholderTextColor="#000"
        value={balitaData.kecamatan_ktp_ibu}
        onChangeText={(text) => setBalitaData({ ...balitaData, kecamatan_ktp_ibu: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Kota KTP Ibu"
        placeholderTextColor="#000"
        value={balitaData.kota_ktp_ibu}
        onChangeText={(text) => setBalitaData({ ...balitaData, kota_ktp_ibu: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Provinsi KTP Ibu"
        placeholderTextColor="#000"
        value={balitaData.provinsi_ktp_ibu}
        onChangeText={(text) => setBalitaData({ ...balitaData, provinsi_ktp_ibu: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Alamat Domisili Ibu"
        placeholderTextColor="#000"
        value={balitaData.alamat_domisili_ibu}
        onChangeText={(text) => setBalitaData({ ...balitaData, alamat_domisili_ibu: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Kelurahan Domisili Ibu"
        placeholderTextColor="#000"
        value={balitaData.kelurahan_domisili_ibu}
        onChangeText={(text) => setBalitaData({ ...balitaData, kelurahan_domisili_ibu: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Kecamatan Domisili Ibu"
        placeholderTextColor="#000"
        value={balitaData.kecamatan_domisili_ibu}
        onChangeText={(text) => setBalitaData({ ...balitaData, kecamatan_domisili_ibu: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Kota Domisili Ibu"
        placeholderTextColor="#000"
        value={balitaData.kota_domisili_ibu}
        onChangeText={(text) => setBalitaData({ ...balitaData, kota_domisili_ibu: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Provinsi Domisili Ibu"
        placeholderTextColor="#000"
        value={balitaData.provinsi_domisili_ibu}
        onChangeText={(text) => setBalitaData({ ...balitaData, provinsi_domisili_ibu: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="No. HP Ibu"
        placeholderTextColor="#000"
        value={balitaData.no_hp_ibu}
      />

      <TextInput
        style={styles.input}
        placeholder="Email Ibu"
        placeholderTextColor="#000"
        value={balitaData.email_ibu}
        onChangeText={(text) => setBalitaData({ ...balitaData, email_ibu: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Pekerjaan Ibu"
        placeholderTextColor="#000"
        value={balitaData.pekerjaan_ibu}
        onChangeText={(text) => setBalitaData({ ...balitaData, pekerjaan_ibu: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Pendidikan Ibu"
        placeholderTextColor="#000"
        value={balitaData.pendidikan_ibu}
        onChangeText={(text) => setBalitaData({ ...balitaData, pendidikan_ibu: text })}
      />


      <Text style={styles.title}>Data Diri Ayah</Text>
      <TextInput
        style={styles.input}
        placeholder="NIK Ayah"
        placeholderTextColor="#000"
        value={balitaData.nik_ayah}
        onChangeText={(text) => setBalitaData({ ...balitaData, nik_ayah: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Nama Ayah"
        placeholderTextColor="#000"
        value={balitaData.nama_ayah}
        onChangeText={(text) => setBalitaData({ ...balitaData, nama_ayah: text })}
      />
      <DropDownPicker
        open={openAyah}
        value={balitaData.jenis_kelamin_ayah}
        items={items}
        setOpen={setOpenAyah}
        setValue={(value) => setBalitaData({ ...balitaData, jenis_kelamin_ayah: value })}
        setItems={setItems}
        placeholder="Pilih Jenis Kelamin"
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
        dropDownStyle={styles.dropdown}
      />
      <TextInput
        style={styles.input}
        placeholder="Tempat Lahir Ayah"
        placeholderTextColor="#000"
        value={balitaData.tempat_lahir_ayah}
        onChangeText={(text) => setBalitaData({ ...balitaData, tempat_lahir_ayah: text })}
      />
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setDatePickerOpenAyah(true)}
      >
        <Text style={styles.datePickerButtonText}>
          {balitaData.tanggal_lahir_ayah ? formatDate(balitaData.tanggal_lahir_ayah) : 'Pilih Tanggal Lahir Ayah'}
        </Text>
      </TouchableOpacity>
      <DatePicker
        modal
        style={styles.datePicker}
        open={isDatePickerOpenAyah}
        date={balitaData.tanggal_lahir_ayah || new Date()}
        mode="date"
        onConfirm={(date) => {
          setDatePickerOpenAyah(false);
          setBalitaData({ ...balitaData, tanggal_lahir_ayah: date });
        }}
        onCancel={() => {
          setDatePickerOpenAyah(false);
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Tanggal Lahir Ayah"
        placeholderTextColor="#000"
        value={balitaData.tanggal_lahir_ayah}
        onChangeText={(text) => setBalitaData({ ...balitaData, tanggal_lahir_ayah: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Alamat KTP Ayah"
        placeholderTextColor="#000"
        value={balitaData.alamat_ktp_ayah}
        onChangeText={(text) => setBalitaData({ ...balitaData, alamat_ktp_ayah: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Kelurahan KTP Ayah"
        placeholderTextColor="#000"
        value={balitaData.kelurahan_ktp_ayah}
        onChangeText={(text) => setBalitaData({ ...balitaData, kelurahan_ktp_ayah: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Kecamatan KTP Ayah"
        placeholderTextColor="#000"
        value={balitaData.kecamatan_ktp_ayah}
        onChangeText={(text) => setBalitaData({ ...balitaData, kecamatan_ktp_ayah: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Kota KTP Ayah"
        placeholderTextColor="#000"
        value={balitaData.kota_ktp_ayah}
        onChangeText={(text) => setBalitaData({ ...balitaData, kota_ktp_ayah: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Provinsi KTP Ayah"
        placeholderTextColor="#000"
        value={balitaData.provinsi_ktp_ayah}
        onChangeText={(text) => setBalitaData({ ...balitaData, provinsi_ktp_ayah: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Alamat Domisili Ayah"
        placeholderTextColor="#000"
        value={balitaData.alamat_domisili_ayah}
        onChangeText={(text) => setBalitaData({ ...balitaData, alamat_domisili_ayah: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Kelurahan Domisili Ayah"
        placeholderTextColor="#000"
        value={balitaData.kelurahan_domisili_ayah}
        onChangeText={(text) => setBalitaData({ ...balitaData, kelurahan_domisili_ayah: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Kecamatan Domisili Ayah"
        placeholderTextColor="#000"
        value={balitaData.kecamatan_domisili_ayah}
        onChangeText={(text) => setBalitaData({ ...balitaData, kecamatan_domisili_ayah: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Kota Domisili Ayah"
        placeholderTextColor="#000"
        value={balitaData.kota_domisili_ayah}
        onChangeText={(text) => setBalitaData({ ...balitaData, kota_domisili_ayah: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Provinsi Domisili Ayah"
        placeholderTextColor="#000"
        value={balitaData.provinsi_domisili_ayah}
        onChangeText={(text) => setBalitaData({ ...balitaData, provinsi_domisili_ayah: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="No. HP Ayah"
        placeholderTextColor="#000"
        value={balitaData.no_hp_ayah}
        onChangeText={(text) => setBalitaData({ ...balitaData, no_hp_ayah: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email Ayah"
        placeholderTextColor="#000"
        value={balitaData.email_ayah}
        onChangeText={(text) => setBalitaData({ ...balitaData, email_ayah: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Pekerjaan Ayah"
        placeholderTextColor="#000"
        value={balitaData.pekerjaan_ayah}
        onChangeText={(text) => setBalitaData({ ...balitaData, pekerjaan_ayah: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Pendidikan Ayah"
        placeholderTextColor="#000"
        value={balitaData.pendidikan_ayah}
        onChangeText={(text) => setBalitaData({ ...balitaData, pendidikan_ayah: text })}
      />

      <View style={styles.buttonContainer}>
        <Button title="Submit Data Balita" onPress={handleNext} />
      </View>
    </ScrollView>
  );
};

const FormLansia = ({ onComplete }) => {
  const [lansiaData, setLansiaData] = useState({
    nik_lansia: '', nama_lansia: '', jenis_kelamin_lansia: '', tempat_lahir_lansia: '',
    tanggal_lahir_lansia: '', alamat_ktp_lansia: '', kelurahan_ktp_lansia: '',
    kecamatan_ktp_lansia: '', kota_ktp_lansia: '', provinsi_ktp_lansia: '',
    alamat_domisili_lansia: '', kelurahan_domisili_lansia: '', kecamatan_domisili_lansia: '',
    kota_domisili_lansia: '', provinsi_domisili_lansia: '', no_hp_lansia: '',
    email_lansia: '', pekerjaan_lansia: '', pendidikan_lansia: '', nik_wali: '', nama_wali: '', tempat_lahir_wali: '',
    tanggal_lahir_wali: '', jenis_kelamin_wali: '', alamat_ktp_wali: '', kelurahan_ktp_wali: '',
    kecamatan_ktp_wali: '', kota_ktp_wali: '', provinsi_ktp_wali: '', alamat_domisili_wali: '', kelurahan_domisili_wali: '',
    kecamatan_domisili_wali: '', kota_domisili_wali: '', provinsi_domisili_wali: '', no_hp_wali: '', email_wali: '', pekerjaan_wali: '', pendidikan_wali: ''
  });

  const formatDate = (date) => {
    return moment(date).format('LL'); // 'LL' format gives a localized long date
  };

  const [openStatus, setOpenStatus] = useState(false);
  const [openLansia, setOpenLansia] = useState(false);
  const [openWali, setOpenWali] = useState(false);
  const [isDatePickerOpenLansia, setDatePickerOpenLansia] = useState(false);
  const [isDatePickerOpenWali, setDatePickerOpenWali] = useState(false);

  const [items, setItems] = useState([
    { label: 'Laki-Laki', value: 'l' },
    { label: 'Perempuan', value: 'p' }
  ]);

  const [itemsStatus, setItemsStatus] = useState([
    { label: 'Menikah', value: 'Menikah' },
    { label: 'Duda', value: 'Duda' },
    { label: 'Janda', value: 'Janda' },
    { label: 'Tidak Menikah', value: 'Tidak Menikah' }
  ]);

  const handleNext = () => {
    onComplete({ lansiaData });
  };

  return (
    <ScrollView style={styles.scene}>
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
        setValue={(value) => setLansiaData({ ...lansiaData, jenis_kelamin_lansia: value })}
        setItems={setItems}
        placeholder="Pilih Jenis Kelamin"
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
        dropDownStyle={styles.dropdown}
      />
      <DropDownPicker
        open={openStatus}
        value={lansiaData.status_pernikahan}
        items={itemsStatus}
        setOpen={setOpenStatus}
        setValue={(value) => setLansiaData({ ...lansiaData, status_pernikahan: value })}
        setItems={setItemsStatus}
        placeholder="Pilih Status Pernikahan"
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
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
          {lansiaData.tanggal_lahir_lansia ? formatDate(lansiaData.tanggal_lahir_lansia) : 'Pilih Tanggal Lahir lansia'}
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
        }}
        onCancel={() => {
          setDatePickerOpenLansia(false);
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
        placeholder="No Hp Lansia"
        placeholderTextColor="#000"
        keyboardType='numeric'
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

      <Text style={styles.title}>Data Diri Wali</Text>

      <TextInput
        style={styles.input}
        placeholder="NIK Wali"
        placeholderTextColor="#000"
        value={lansiaData.nik_wali}
        onChangeText={(text) => setLansiaData({ ...lansiaData, nik_wali: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Nama Wali"
        placeholderTextColor="#000"
        value={lansiaData.nama_wali}
        onChangeText={(text) => setLansiaData({ ...lansiaData, nama_wali: text })}
      />

      <DropDownPicker
        open={openWali}
        value={lansiaData.jenis_kelamin_wali}
        items={items}
        setOpen={setOpenWali}
        setValue={(value) => setLansiaData({ ...lansiaData, jenis_kelamin_wali: value })}
        setItems={setItems}
        placeholder="Pilih Jenis Kelamin"
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
        dropDownStyle={styles.dropdown}
      />

      <TextInput
        style={styles.input}
        placeholder="Tempat Lahir Wali"
        placeholderTextColor="#000"
        value={lansiaData.tempat_lahir_wali}
        onChangeText={(text) => setLansiaData({ ...lansiaData, tempat_lahir_wali: text })}
      />

<TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setDatePickerOpenWali(true)}
      >
        <Text style={styles.datePickerButtonText}>
          {lansiaData.tanggal_lahir_wali ? formatDate(lansiaData.tanggal_lahir_wali) : 'Pilih Tanggal Lahir wali'}
        </Text>
      </TouchableOpacity>
      <DatePicker
        modal
        style={styles.datePicker}
        open={isDatePickerOpenWali}
        date={lansiaData.tanggal_lahir_wali || new Date()}
        mode="date"
        onConfirm={(date) => {
          setDatePickerOpenWali(false);
          setLansiaData({ ...lansiaData, tanggal_lahir_wali: date });
        }}
        onCancel={() => {
          setDatePickerOpenWali(false);
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Tanggal Lahir Wali"
        placeholderTextColor="#000"
        value={lansiaData.tanggal_lahir_wali}
        onChangeText={(text) => setLansiaData({ ...lansiaData, tanggal_lahir_wali: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Alamat Ktp Wali"
        placeholderTextColor="#000"
        value={lansiaData.alamat_ktp_wali}
        onChangeText={(text) => setLansiaData({ ...lansiaData, alamat_ktp_wali: text })}
      />


      <TextInput
        style={styles.input}
        placeholder="Kelurahan Ktp Wali"
        placeholderTextColor="#000"
        value={lansiaData.kelurahan_ktp_wali}
        onChangeText={(text) => setLansiaData({ ...lansiaData, kelurahan_ktp_wali: text })}
      />


      <TextInput
        style={styles.input}
        placeholder="Kecamatan Ktp Wali"
        placeholderTextColor="#000"
        value={lansiaData.kecamatan_ktp_wali}
        onChangeText={(text) => setLansiaData({ ...lansiaData, kecamatan_ktp_wali: text })}
      />



      <TextInput
        style={styles.input}
        placeholder="Kota Ktp Wali"
        placeholderTextColor="#000"
        value={lansiaData.kota_ktp_wali}
        onChangeText={(text) => setLansiaData({ ...lansiaData, kota_ktp_wali: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Provinsi Ktp Wali"
        placeholderTextColor="#000"
        value={lansiaData.provinsi_ktp_wali}
        onChangeText={(text) => setLansiaData({ ...lansiaData, provinsi_ktp_wali: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Alamat Domisili Wali"
        placeholderTextColor="#000"
        value={lansiaData.alamat_domisili_wali}
        onChangeText={(text) => setLansiaData({ ...lansiaData, alamat_domisili_wali: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Kelurahan Domisili Wali"
        placeholderTextColor="#000"
        value={lansiaData.kelurahan_domisili_wali}
        onChangeText={(text) => setLansiaData({ ...lansiaData, kelurahan_domisili_wali: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Kecamatan Domisili Wali"
        placeholderTextColor="#000"
        value={lansiaData.kecamatan_domisili_wali}
        onChangeText={(text) => setLansiaData({ ...lansiaData, kecamatan_domisili_wali: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Kota Domisili Wali"
        placeholderTextColor="#000"
        value={lansiaData.kota_domisili_wali}
        onChangeText={(text) => setLansiaData({ ...lansiaData, kota_domisili_wali: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Provinsi Domisili Wali"
        placeholderTextColor="#000"
        value={lansiaData.provinsi_domisili_wali}
        onChangeText={(text) => setLansiaData({ ...lansiaData, provinsi_domisili_wali: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="No Hp Wali"
        placeholderTextColor="#000"
        value={lansiaData.no_hp_wali}
        onChangeText={(text) => setLansiaData({ ...lansiaData, no_hp_wali: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Email Wali"
        placeholderTextColor="#000"
        value={lansiaData.email_wali}
        onChangeText={(text) => setLansiaData({ ...lansiaData, email_wali: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Pekerjaan Wali"
        placeholderTextColor="#000"
        value={lansiaData.pekerjaan_wali}
        onChangeText={(text) => setLansiaData({ ...lansiaData, pekerjaan_wali: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Pendidikan Wali"
        placeholderTextColor="#000"
        value={lansiaData.pendidikan_wali}
        onChangeText={(text) => setLansiaData({ ...lansiaData, pendidikan_wali: text })}
      />


      <View style={styles.buttonContainer}>
        <Button title="Submit Data Lansia" onPress={handleNext} />
      </View>
    </ScrollView>
  );
};

// Tab Navigator
const Tab = createMaterialTopTabNavigator();

const FormulirScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { no_hp, nama, kata_sandi, no_ktp, no_kk, foto_kk } = route.params;

  const handleComplete = async (formData) => {
    try {
      const allData = {
        no_hp, nama, kata_sandi, no_ktp, no_kk, foto_kk, ...formData,
      };
  
      // Extract data to be sent to respective tables
      const penggunaData = {
        no_hp,
        nama,
        kata_sandi,
        no_ktp,
        no_kk,
        foto_kk,
        orangtua: formData.balitaData ? formData.balitaData.nik_ibu : null, // Example: linking with OrangTua
        wali: formData.lansiaData ? formData.lansiaData.nik_wali : null, // Example: linking with Wali
      };
  
      const orangTuaData = formData.balitaData ? {
        ...formData.balitaData,
        no_kk,
      } : null;
  
      const lansiaData = formData.lansiaData ? {
        ...formData.lansiaData,
        no_kk,
      } : null;
  
      // Print the data as if it was sent to each table
      console.log('Pengguna Data:', penggunaData);
      if (orangTuaData) console.log('OrangTua Data:', orangTuaData);
      if (lansiaData) console.log('Lansia Data:', lansiaData);
  
      // Simulate saving data locally
      await AsyncStorage.setItem('formData', JSON.stringify(allData));
      Alert.alert('Success', 'All data saved locally');
      // Navigate to home or another screen
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Failed to save data');
    }
  };
  

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
        tabBarStyle: { backgroundColor: '#008EB3' },
        tabBarIndicatorStyle: { backgroundColor: '#fff' },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#ddd',
       
      }}
    >
      
      <Tab.Screen name="Wali Balita">
        {() => <FormBalita onComplete={handleComplete} />}
      </Tab.Screen>
      <Tab.Screen name="Wali / Lansia">
        {() => <FormLansia onComplete={handleComplete} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

// Styles
const styles = StyleSheet.create({
  scene: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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

  buttonContainer: {
    paddingBottom: 30,

  },
});



export default FormulirScreen;
