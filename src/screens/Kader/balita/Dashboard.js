import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import React from 'react'
import { useNavigation } from '@react-navigation/native';


const Dashboard = () => {
    const navigation = useNavigation();
    return (
        <View style={{ flex: 1, backgroundColor: '#F5F7FA' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginTop: 20 }}>
                <TouchableOpacity style={styles.cardBox}>
                    <View style={[styles.cardHeader, { backgroundColor: '#FFF5D9' }]}>
                        <IconMaterial name="account-alert" size={30} color='#FFBB38' />
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardHeaderText}>Jumlah Data Ortu</Text>
                        <Text style={styles.cardContentText}>1</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cardBox}>
                    <View style={[styles.cardHeader, { backgroundColor: '#DCFAF8' }]}>
                        <IconMaterial name="account-alert" size={30} color='#16DBCC' />
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardHeaderText}>Jumlah Data Anak</Text>
                        <Text style={styles.cardContentText}>2</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginTop: 20 }}>
                <TouchableOpacity style={styles.cardBox}>
                    <View style={[styles.cardHeader, { backgroundColor: '#E7EDFF' }]}>
                        <IconMaterial name="account-alert" size={30} color='#396AFF' />
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardHeaderText}>Jumlah Laki-Laki</Text>
                        <Text style={styles.cardContentText}>3</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cardBox}>
                    <View style={[styles.cardHeader, { backgroundColor: '#FFE0EB' }]}>
                        <IconMaterial name="account-alert" size={30} color='#FF82AC' />
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardHeaderText}>Jumlah Perempuan</Text>
                        <Text style={styles.cardContentText}>4</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginTop: 20 }}>
                <TouchableOpacity style={styles.cardBox}>
                    <View style={[styles.cardHeader, { backgroundColor: '#FFE1DF' }]}>
                        <IconMaterial name="account-alert" size={30} color='#F37676' />
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardHeaderText}>Jumlah Imunisasi</Text>
                        <Text style={styles.cardContentText}>3</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cardBox}>
                    <View style={[styles.cardHeader, { backgroundColor: '#FFE1DF' }]}>
                        <IconMaterial name="account-alert" size={30} color='#F37676' />
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardHeaderText}>Jumlah Kunjungan</Text>
                        <Text style={styles.cardContentText}>4</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {/* Bottom Buttons */}
            <View style={{ backgroundColor: '#fff', marginHorizontal: 20, marginTop: 20, paddingVertical: 20, borderRadius: 10 }}>
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={{ width: '20%' }} onPress={() => navigation.navigate('DataAnak')}>
                        <View style={styles.bottomButton}>
                            <IconMaterial name="calendar" size={30} color='#F37676' />
                        </View>
                        <Text style={styles.buttonText}>Data Anak</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: '20%' }} onPress={() => navigation.navigate('DataOrtu')}>
                        <View style={styles.bottomButton}>
                            <IconMaterial name="calendar" size={30} color='#F37676' />
                        </View>
                        <Text style={styles.buttonText} >Data Ortu</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: '20%' }}>
                        <View style={styles.bottomButton}>
                            <IconMaterial name="calendar" size={30} color='#F37676' />
                        </View>
                        <Text style={styles.buttonText}>Data PA</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: '20%' }}>
                        <View style={styles.bottomButton}>
                            <IconMaterial name="calendar" size={30} color='#F37676' />
                        </View>
                        <Text style={styles.buttonText}>Data Imunisasi</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={{ width: '20%' }}>
                        <View style={styles.bottomButton}>
                            <IconMaterial name="calendar" size={30} color='#F37676' />
                        </View>
                        <Text style={styles.buttonText}>Data Kunjungan</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: '20%' }}>
                        <View style={styles.bottomButton}>
                            <IconMaterial name="calendar" size={30} color='#F37676' />
                        </View>
                        <Text style={styles.buttonText}>Laporan Rekapitulasi</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}



const styles = StyleSheet.create({

    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',

        marginTop: 20,
    },
    bottomButton: {
        backgroundColor: '#FFE1DF',
        borderRadius: 30,
        padding: 10,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        alignItems: 'center',
    },
    buttonText: {
        color: 'black',
        marginTop: 5,
        fontSize: 12,
        fontFamily: 'Urbanist-ExtraBold',
        textAlign: 'center',
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
        width: 100
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
    cardProfile: {
        backgroundColor: 'white',
        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: 20,
        padding: 20,
    },
    cardProfileContent: {
        flex: 1,
    },
    cardProfileTitle: {
        fontSize: 20,
        color: 'black',
        textAlign: 'center',
        marginBottom: 10,
    },
    cardProfileText: {
        color: 'black',
        fontSize: 16,
        marginBottom: 10,
    },
    cardProfileButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    cardBox: {
        backgroundColor: 'white',
        borderRadius: 20,
        width: '48%',
        padding: 10,
        flexDirection: 'row',
    },
    cardHeader: {
        height: 50,
        padding: 10,
        alignContent: 'center',
        borderRadius: 30,
    },

    cardHeaderText: {
        textAlign: 'center',
        color: 'black',
        fontSize: 9,
        width: '80%',
        fontFamily: 'Urbanist-ExtraBold',
    },
    cardContent: {
        justifyContent: 'center',
        alignContent: 'center',
        height: 100,
        marginTop: 10,
        marginLeft: 5,
    },
    cardContentText: {
        textAlign: 'left',
        fontSize: 20,
        color: 'black',
        fontFamily: 'Urbanist-ExtraBold',
        marginLeft: 10,
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '50%',
    },
    button: {
        width: '45%',
    },
    adminPanelTitleContainer: {
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
        alignItems: 'center',
    },
    adminPanelTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF6000',
    },
    summaryContainer: {
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
    },
    summaryText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF6000',
    },
    createButton: {
        position: 'absolute',
        bottom: 90,
        right: 20,
        backgroundColor: '#FF6000',
        borderRadius: 50,
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    profileButton: {
        backgroundColor: '#FF6000',
        borderRadius: 50,
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    adminCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        height: 130,
        width: 170,
        padding: 20,
        marginHorizontal: 10,
        marginBottom: 10,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    adminTextContainer: {
        flex: 1,
        marginRight: 20,
        color: 'black',
        textAlign: 'center',
    },
    adminTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'black',
        textAlign: 'center',
    },
    adminSubtitle: {
        fontSize: 25,
        color: '#666666',
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 10,
        flex: 1,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        marginTop: 30,
    },
    cardContent: {
        flex: 1,
    },
    cardText: {
        marginBottom: 5,
        fontSize: 12,
        color: '#000000',
    },
    cardButtons: {
        bottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    editButton: {
        paddingVertical: 8,
        borderRadius: 25,
        marginHorizontal: 4,
        paddingHorizontal: 14,
        height: 40,
        backgroundColor: '#FFDBC6',
    },
    deleteButton: {
        paddingVertical: 8,
        height: 40,
        borderRadius: 50,
        backgroundColor: '#FFDBC6',
        paddingHorizontal: 12,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'black',
        textAlign: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    input: {
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        color: 'black',
        width: '100%',
    },
    userInfo: {
        flex: 1,
    },
    dropdown: {
        width: '100%',
        marginBottom: 10,
        color: 'black',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
    },
    tabBar: {
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
        marginHorizontal: 30,
        borderRadius: 25,
    },
    tabBarButton: {
        margin: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        backgroundColor: 'transparent',
    },
    activeTab: {
        backgroundColor: '#FF6000',
    },
    tabBarText: {
        fontSize: 16,
        color: '#FFDBC6',
    },
    activeTabText: {
        color: 'white',
        fontWeight: 'bold',
    },
    noDataContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
    },
    noDataText: {
        fontSize: 18,
        color: 'black',
    },
});


export default Dashboard