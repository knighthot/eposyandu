import {View, Text, Image, StyleSheet, Dimensions, TouchableWithoutFeedback} from 'react-native';
import React, {useState} from 'react';
import Animated, {interpolate, useAnimatedStyle, useSharedValue} from 'react-native-reanimated';
import Config from 'react-native-config';
const {width} = Dimensions.get('window');

const LARGE_IMAGE_WIDTH = width * 0.5;
const MEDIUM_IMAGE_WIDTH = LARGE_IMAGE_WIDTH * 0.8;
const SMALL_IMAGE_WIDTH = MEDIUM_IMAGE_WIDTH * 0.7;

const ListItem = ({ path, description, scrollX, index, dataLength }) => {
  const [isPressed, setIsPressed] = useState(false);
  const pathImg = `${Config.IMAGE_URL}${path}`;

  const inputRange = [
    (index - 2) * SMALL_IMAGE_WIDTH,
    (index - 1) * SMALL_IMAGE_WIDTH,
    index * SMALL_IMAGE_WIDTH,
    (index + 1) * SMALL_IMAGE_WIDTH,
  ];

  const isLastItem = dataLength === index + 1;
  const isSecondLastItem = dataLength === index + 2;

  const outputRange = isLastItem
    ? [SMALL_IMAGE_WIDTH, LARGE_IMAGE_WIDTH, LARGE_IMAGE_WIDTH, LARGE_IMAGE_WIDTH]
    : isSecondLastItem
    ? [SMALL_IMAGE_WIDTH, LARGE_IMAGE_WIDTH, MEDIUM_IMAGE_WIDTH, MEDIUM_IMAGE_WIDTH]
    : [SMALL_IMAGE_WIDTH, MEDIUM_IMAGE_WIDTH, LARGE_IMAGE_WIDTH, SMALL_IMAGE_WIDTH];

  const animatedStyle = useAnimatedStyle(() => ({
    width: interpolate(scrollX.value, inputRange, outputRange, 'clamp'),
    useNativeDriver: true, // Menggunakan native driver untuk animasi
  }));

  return (
    <TouchableWithoutFeedback
      onPressIn={() => setIsPressed(true)}  // Menampilkan deskripsi saat ditekan
      onPressOut={() => setIsPressed(false)}  // Menyembunyikan deskripsi saat dilepas
    >
      <View>
        <Animated.Image
          source={{ uri: `${pathImg}` }}
          style={[styles.Image, animatedStyle]}
        />
        {isPressed && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>{description}</Text>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  Image: {
    width: 250, // Ukuran gambar disesuaikan
    marginRight: 8,
    borderRadius: 20,
    height: 200,
  },
  descriptionContainer: {
    position: 'absolute',
    width: '96%', // Lebar kontainer sama dengan lebar gambar
    height: '100%', // Tinggi kontainer sama dengan gambar
    top: 0,
    left: 0,
    justifyContent: 'center', // Menyusun teks di tengah secara vertikal
    alignItems: 'center', // Menyusun teks di tengah secara horizontal
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Warna latar belakang transparan
    borderRadius: 20, // Menyamakan radius dengan gambar
  },
  descriptionText: {
    color: '#fff',
    fontSize: 8,
    textAlign: 'center',
    paddingHorizontal: 10, // Memberikan sedikit padding untuk teks
  },
});
