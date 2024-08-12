import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal,Text,FlatList,ScrollView} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Grandparents from '../assets/icons/Grandparents';
import ListItem from '../components/ListItem';
import Baby from '../assets/icons/Baby';
import IbuHamil from '../assets/icons/IbuHamil';
import {fotoposyandu } from '../data/DataFoto';

import {useSharedValue} from 'react-native-reanimated';

// Mengatur lokal Indonesia
LocaleConfig.locales['id'] = {
  monthNames: ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'],
  monthNamesShort: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'],
  dayNames: ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'],
  dayNamesShort: ['Min','Sen','Sel','Rab','Kam','Jum','Sab'],
  today: 'Hari Ini'
};
LocaleConfig.defaultLocale = 'id';

const Homescreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');

  // State warna teks untuk setiap kartu
  const [textColorBalita, setTextColorBalita] = useState('#D9D9D9');
  const [textColorIbuHamil, setTextColorIbuHamil] = useState('#D9D9D9');
  const [textColorLansia, setTextColorLansia] = useState('#D9D9D9');

  const scrollX = useSharedValue(0);

  const onScroll = e => {
    scrollX.value = e.nativeEvent.contentOffset.x;
  };

  const activities = {
    Balita: {
      dates: {
        '2024-08-12': { marked: true, dotColor: 'blue', activity: 'Pemeriksaan rutin balita' },
        '2024-08-19': { marked: true, dotColor: 'blue', activity: 'Imunisasi balita' }
      }
    },
    Lansia: {
      dates: {
        '2024-08-15': { marked: true, dotColor: 'blue', activity: 'Pemeriksaan kesehatan lansia' },
        '2024-08-22': { marked: true, dotColor: 'blue', activity: 'Senam sehat lansia' }
      }
    }
  };

  const openModal = (category) => {
    setSelectedCategory(category);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedCategory('');
    setSelectedDate('');
    setSelectedActivity('');
  };

  const onDayPress = (day) => {
    const activity = activities[selectedCategory]?.dates[day.dateString]?.activity || 'Tidak ada kegiatan';
    setSelectedDate(day.dateString);
    setSelectedActivity(activity);
  };

  const handlePressIn = (setTextColor, textRef, viewRef) => {
    setTextColor('#008EB3');
    textRef.transitionTo({ color: '#008EB3' });
    viewRef.animate({
      0: { scale: 1 },
      1: { scale: 1.1 },
    }, 200);
  };

  const handlePressOut = (setTextColor, textRef, viewRef) => {
    setTextColor('#D9D9D9');
    textRef.transitionTo({ color: '#D9D9D9' });
    viewRef.animate({
      0: { scale: 1.1 },
      1: { scale: 1 },
    }, 200);
  };

  return (
    <ScrollView>
    <View style={Styles.Container}>
      <View style={Styles.CardHeader}>
        <Animatable.Text animation="fadeIn" style={Styles.Title}>Selamat Datang</Animatable.Text>
        <Animatable.Text animation="fadeIn" style={Styles.SubTitle}>Di E-Posyandu</Animatable.Text>
      </View>

      <View style={Styles.CardHeader}>
        <Animatable.Text animation="fadeIn" style={Styles.Title}>Jadwal Posyandu</Animatable.Text>
        <Animatable.Text animation="fadeIn" style={Styles.SubTitle}>Kamis, 12 Agustus 2022</Animatable.Text>
        <Animatable.Text animation="fadeIn" style={Styles.SubTitle}>Jam Buka : 08.00 - 15.00 WIB</Animatable.Text>
      </View>

      <View>
        <Text style={{ marginTop: 20, color: "black", fontFamily: "PlusJakartaSans-SemiBold",marginHorizontal: 15, }}>
          Kegiatan Posyandu
        </Text>
      </View>

      <View style={Styles.CardJadwal}>
        <TouchableOpacity onPress={() => openModal('Balita')}>
          <View style={Styles.CardJadwalContainer}>
            <Animatable.Text animation="fadeIn" style={Styles.TitleCardJadwal}>Balita</Animatable.Text>
            <Animatable.Text animation="fadeIn" style={Styles.HeaderTitleCardJadwal}>Kamis, 12 Agustus 2022</Animatable.Text>
            <Animatable.Text animation="fadeIn" style={Styles.SubTitleCardJadwal} numberOfLines={2} ellipsizeMode="tail">
              Lorem ipsum odor amet, consectetuer adipiscing elit. Urna ad convallis posuere enim dolor est
            </Animatable.Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => openModal('Lansia')}>
          <View style={Styles.CardJadwalContainer}>
            <Animatable.Text animation="fadeIn" style={Styles.TitleCardJadwal}>Lansia</Animatable.Text>
            <Animatable.Text animation="fadeIn" style={Styles.HeaderTitleCardJadwal}>Kamis, 12 Agustus 2022</Animatable.Text>
            <Animatable.Text animation="fadeIn" style={Styles.SubTitleCardJadwal} numberOfLines={2} ellipsizeMode="tail">
              Lorem ipsum odor amet, consectetuer adipiscing elit. Urna ad convallis posuere enim dolor est
            </Animatable.Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={Styles.PenggunaTitleCard}>
        <Text style={Styles.PenggunaTitle}>Pengguna <Text style={{ color: "#008EB3" }}>E-Posyandu</Text> TanjungPinang</Text>
      </View>

      <View style={Styles.PenggunaCardContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPressIn={() => handlePressIn(setTextColorBalita, this.babyTextRef, this.babyViewRef)}
          onPressOut={() => handlePressOut(setTextColorBalita, this.babyTextRef, this.babyViewRef)}
        >
          <Animatable.View
            ref={ref => this.babyViewRef = ref}
            style={Styles.PenggunaCard}
          >
            <Baby />
            <Animatable.Text
              ref={ref => this.babyTextRef = ref}
              style={[Styles.TextPenggunaCard, { color: textColorBalita }]}
            >
              O
            </Animatable.Text>
            <Animatable.Text
              ref={ref => this.babyTextRef = ref}
              style={[Styles.TextPenggunaCard, { color: textColorBalita }]}
            >
              Total Balita
            </Animatable.Text>
          </Animatable.View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPressIn={() => handlePressIn(setTextColorIbuHamil, this.pregnantTextRef, this.pregnantViewRef)}
          onPressOut={() => handlePressOut(setTextColorIbuHamil, this.pregnantTextRef, this.pregnantViewRef)}
        >
          <Animatable.View
            ref={ref => this.pregnantViewRef = ref}
            style={Styles.PenggunaCard}
          >
            <IbuHamil />
            <Animatable.Text
              ref={ref => this.pregnantTextRef = ref}
              style={[Styles.TextPenggunaCard, { color: textColorIbuHamil }]}
            >
              O
            </Animatable.Text>
            <Animatable.Text
              ref={ref => this.pregnantTextRef = ref}
              style={[Styles.TextPenggunaCard, { color: textColorIbuHamil }]}
            >
              Total Ibu Hamil
            </Animatable.Text>
          </Animatable.View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPressIn={() => handlePressIn(setTextColorLansia, this.grandparentsTextRef, this.grandparentsViewRef)}
          onPressOut={() => handlePressOut(setTextColorLansia, this.grandparentsTextRef, this.grandparentsViewRef)}
        >
          <Animatable.View
            ref={ref => this.grandparentsViewRef = ref}
            style={Styles.PenggunaCard}
          >
            <Grandparents />
            <Animatable.Text
              ref={ref => this.grandparentsTextRef = ref}
              style={[Styles.TextPenggunaCard, { color: textColorLansia }]}
            >
              O
            </Animatable.Text>
            <Animatable.Text
              ref={ref => this.grandparentsTextRef = ref}
              style={[Styles.TextPenggunaCard, { color: textColorLansia }]}
            >
              Total Lansia
            </Animatable.Text>
          </Animatable.View>
        </TouchableOpacity>
      </View>

      
      <View style={Styles.PenggunaTitleCard}>
        <Text style={Styles.PenggunaTitle}>Dokumentasi</Text>
      </View>

<View style={Styles.GambarContainer}>
     <FlatList
     data={fotoposyandu}
     horizontal
        style={{margin: 16}}
        bounces={false}
        onScroll={onScroll}
        scrollEventThrottle={18}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ padding: 0 }} 
     keyExtractor={item => item.id.toString()}
     renderItem={({ item, index}) => 
     <ListItem 
     path={item.path} 
     scrollX={scrollX} 
     index={index}
     dataLength={fotoposyandu.length}
     />
    }
     />
  </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View style={Styles.modalContainer}>
          <View style={Styles.modalContent}>
            <Text style={Styles.modalTitle}>{selectedCategory} - Jadwal</Text>
            <Calendar
              markedDates={activities[selectedCategory]?.dates}
              onDayPress={onDayPress}
              theme={{
                selectedDayBackgroundColor: '#008EB3',
                todayTextColor: '#008EB3',
                arrowColor: '#008EB3',
              }}
            />
            {selectedDate ? (
              <View style={Styles.activityContainer}>
                <Text style={Styles.activityDate}>{selectedDate}</Text>
                <Text style={Styles.activityText}>{selectedActivity}</Text>
              </View>
            ) : null}
            <TouchableOpacity onPress={closeModal} style={Styles.closeButton}>
              <Text style={Styles.closeButtonText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
    </ScrollView>
  );
};

const Styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#fff',
    
  },

  CardHeader: {
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    marginHorizontal: 15,
    backgroundColor: '#008EB3'
  },

  SubTitle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold'
  },

  Title: {
    color: '#fff',
    fontSize: 30,
    fontFamily: 'PlusJakartaSans-Bold'
  },

  CardJadwal: {
    flexDirection: 'row',
    borderRadius: 10,
    marginTop: 20,
    marginHorizontal: 15,
  },

  CardJadwalContainer: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#008EB3',
    marginRight: 10
  },

  TitleCardJadwal: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold'
  },

  HeaderTitleCardJadwal: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'PlusJakartaSans-SemiBold'
  },

  SubTitleCardJadwal: {
    color: '#fff',
    fontSize: 10,
    width: 156,
    fontFamily: 'PlusJakartaSans-SemiBold'
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 18,
    color:'black',
    fontFamily: 'PlusJakartaSans-Bold',
    marginBottom: 10,
  },

  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#008EB3',
    borderRadius: 10,
    alignItems: 'center',
  },

  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold'
  },

  activityContainer: {
    marginTop: 20,
    alignItems: 'center',
  },

  activityDate: {
    fontSize: 14,
    color: 'black',
    fontFamily: 'PlusJakartaSans-SemiBold'
  },

  activityText: {
    fontSize: 14,
    color: 'gray',
    fontFamily: 'PlusJakartaSans-Regular',
    textAlign: 'center'
  },

  PenggunaTitleCard: {
    textAlign: 'center',
    alignItems: 'center',
    fontFamily: "PlusJakartaSans-SemiBold"
  },

  PenggunaTitle:{
    marginTop: 20,
     color: "black",
     fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold" 
  },

  PenggunaCardContainer:{
    marginTop: 20,
    flexDirection: 'row',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
   
  },
  

  PenggunaCard:{
    flexDirection: 'column',
    textAlign: 'center',
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  TextPenggunaCard:{
    color: "#D9D9D9",
    fontSize: 14,
    fontFamily: "PlusJakartaSans-SemiBold"
  },

  GambarContainer: {
    flex:1,
    marginBottom: 50,
  }

});

export default Homescreen;
