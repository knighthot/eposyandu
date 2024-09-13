import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity,Image } from 'react-native';
import error from '../../assets/images/Eror.png'

const ErrorModal = ({ visible, message = '', onClose }) => {
    return (
      <Modal
        transparent={true}
        animationType="slide"
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
             <Image source={error} style={{width:150,height:150 ,marginBottom:-20}}/>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Error</Text>
            <Text style={styles.errorText}>{message}</Text>
  
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#176B87',
    marginBottom: 15,
  },
  errorText: {
    fontSize: 14,
    color: '#176B87',
    
    marginVertical: 5,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#176B87',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ErrorModal;
