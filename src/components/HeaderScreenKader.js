import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const HeaderScreenKader = (title , onLeftPress,) => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onLeftPress}>
        <MaterialCommunityIcons name="arrow-left" size={28} color="#0C1A42" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <Image
        source={{ uri: 'https://example.com/profile-pic.png' }} // Replace with your image URL
        style={styles.profileImage}
      />
    </View>
  );
};

const styles = {
  headerContainer: {
    flexDirection: 'row',
    paddingTop: 25,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 125,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0C1A42',
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
};

export default HeaderScreenKader;
