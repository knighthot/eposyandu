import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // or any other icon library

const Header = ({ title, onLeftPress, onRightPress }) => {
  return (
    <View style={styles.headerContainer}>
      {/* Left Icon */}
      <TouchableOpacity onPress={onLeftPress} style={styles.iconContainer}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Right Icon */}
   
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#008EB3', // Customize the background color
    height: 60, // Customize the height
  },
  iconContainer: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
});

export default Header;
