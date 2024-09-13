import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity,Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator,DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import HeaderKader from '../components/HeaderKader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
// Screens
import DashboardLansia from '../screens/Kader/lansia/Dashboard';
import App from '../../App';
import DataLansia from '../screens/Kader/lansia/dataLansia/DataLansia';
import DashboardBalita from '../screens/Kader/balita/Dashboard';
import DataAnak from '../screens/Kader/balita/dataAnak/DataAnak';
import DetailAnak from '../screens/Kader/balita/dataAnak/DetailAnak';
import DetailOrtu from '../screens/Kader/balita/dataOrangTua/DetailOrtu';
import DataOrtu from '../screens/Kader/balita/dataOrangTua/DataOrtu';
import Kegiatan from '../screens/Kader/kegiatan/Kegiatan';
import DataPa from '../screens/Kader/balita/dataPa/DataPa';
import DataImunisasiAnak from '../screens/Kader/balita/dataImunisasi/DataImunisasiAnak';
import EditIbuForm from '../screens/Kader/balita/dataOrangTua/EditIbuForm';
import EditAyahForm from '../screens/Kader/balita/dataOrangTua/EditAyahForm.js';
import Login from '../screens/auth/login/Index'
import DetailWali from '../screens/Kader/lansia/DataWali/DetailWali.js';
import InfoAplikasi from '../screens/InfoAplikasi';
import DataDokumentasi from '../screens/Kader/Dokumentasi/DataDokumentasi.js';
import DataWali from '../screens/Kader/lansia/DataWali/DataWali.js';
import AyahForm from '../screens/Kader/balita/dataOrangTua/AyahForm';
import IbuForm from '../screens/Kader/balita/dataOrangTua/IbuForm';
import DetailLansia from '../screens/Kader/lansia/dataLansia/DetailLansia.js';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const TabButton = ({ name, label, bgColor, activeColor, inactiveColor, onPress, accessibilityState }) => {
  const focused = accessibilityState.selected;
  const viewRef = React.useRef(null);
  const textViewRef = React.useRef(null);

  React.useEffect(() => {
    if (focused) {
      viewRef.current.animate({ 0: { scale: 0 }, 1: { scale: 1 } });
      textViewRef.current.animate({ 0: { scale: 0 }, 1: { scale: 1 } });
    } else {
      viewRef.current.animate({ 0: { scale: 1 }, 1: { scale: 0 } });
      textViewRef.current.animate({ 0: { scale: 1 }, 1: { scale: 0 } });
    }
  }, [focused]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={1} style={[styles.container, { flex: focused ? 1 : 0.65 }]}>
      <View>
        <Animatable.View
          ref={viewRef}
          style={[StyleSheet.absoluteFillObject, { backgroundColor: bgColor, borderRadius: 16 }]}
        />
        <View style={[styles.btn, { backgroundColor: focused ? null : 'transparent' }]}>
          <MaterialCommunityIcons name={name} color={focused ? activeColor : inactiveColor} size={30} />
          <Animatable.View ref={textViewRef}>
            {focused && (
              <Text style={{ color: activeColor, paddingHorizontal: 8 }}>
                {label}
              </Text>
            )}
          </Animatable.View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="DashboardBalita"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60,
          position: 'absolute',
        },
      }}
    >
      <Tab.Screen
        name="Balita"
        component={DashboardBalita}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarButton: (props) => (
            <TabButton
              {...props}
              name="home"
              label="Balita"
              bgColor="rgba(0, 0, 255, 0.1)"
              activeColor="#0000FF"
              inactiveColor="grey"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Lansia"
        component={DashboardLansia}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarButton: (props) => (
            <TabButton
              {...props}
              name="bell"
              label="Lansia"
              bgColor="rgba(0, 255, 0, 0.1)"
              activeColor="#00FF00"
              inactiveColor="grey"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};


// Custom drawer content for adding logout button
const CustomDrawerContent = (props) => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Apakah Anda yakin ingin keluar?",
      [
        {
          text: "Batal",
          onPress: () => null,
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: async () => {
            // Hapus semua data dari AsyncStorage
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userRole');
            await AsyncStorage.removeItem('userName');
            await AsyncStorage.removeItem('userEmail');

            // Arahkan kembali ke layar login
            
          }
        }
      ]
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      
      {/* Tombol Logout */}
      <TouchableOpacity
        style={{
          marginTop: 20,
          padding: 10,
          backgroundColor: '#f00',
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={handleLogout}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

// Stack Navigator
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="Home"
        component={StackNavigator}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="Kegiatan"
        component={Kegiatan}
        options={{
          header: ({ navigation }) => <HeaderKader openDrawer={() => navigation.openDrawer()} />,
        }}
      />
      <Drawer.Screen
        name="Dokumentasi"
        component={DataDokumentasi}
        options={{
          header: ({ navigation }) => <HeaderKader openDrawer={() => navigation.openDrawer()} />,
        }}
        />
      <Drawer.Screen
      name='Info Aplikasi'
      component={InfoAplikasi}
      options={{
        header: ({navigation}) => <HeaderKader openDrawer={() => navigation.openDrawer()}/>,
      }}
      />
    </Drawer.Navigator>
  );
};

const StackNavigator = () => {
  return (
    <Stack.Navigator>
     
      {/* Home Screen with HeaderKader */}
      <Stack.Screen
        name="Dashboard"
        component={TabNavigator} 
        options={{
          header: ({ navigation }) => <HeaderKader openDrawer={() => navigation.openDrawer()} />, // Show HeaderKader only on the dashboard
        }}
      />
      {/* All other screens with hidden header */}
      <Stack.Screen
        name="DataOrtu"
        component={DataOrtu}
        options={{ headerShown: false }} // Hide header for DataOrtu
      />
      <Stack.Screen
        name="DataLansia"
        component={DataLansia}
        options={{ headerShown: false }} // Hide header for DataLansia
      />
      <Stack.Screen
        name="DataAnak"
        component={DataAnak}
        options={{ headerShown: false }} // Hide header for DataAnak
      />
      <Stack.Screen
        name="DetailAnak"
        component={DetailAnak}
        options={{ headerShown: false }} // Hide header for DetailAnak
      />
      <Stack.Screen
        name="DataPa"
        component={DataPa}
        options={{ headerShown: false }} // Hide header for DataPa
      />
      <Stack.Screen
        name="DataImunisasiAnak"
        component={DataImunisasiAnak}
        options={{ headerShown: false }} // Hide header for DataImunisasiAnak
      />

        
        <Stack.Screen name="DetailOrtu" component={DetailOrtu} options={{headerShown: false}} />
       <Stack.Screen name="AyahForm" component={AyahForm} options={{headerShown: false}} />
       <Stack.Screen name="IbuForm" component={IbuForm} options={{headerShown: false}} />
      <Stack.Screen name="EditIbuForm" component={EditIbuForm} options={{headerShown: false}} />
      <Stack.Screen name="EditAyahForm" component={EditAyahForm} options={{headerShown: false}} />
      <Stack.Screen name="DataWali" component={DataWali} options={{headerShown: false}} />
        <Stack.Screen name="DetailLansia" component={DetailLansia} options={{headerShown: false}} />
        <Stack.Screen name="DetailWali" component={DetailWali} options={{headerShown: false}} />
    </Stack.Navigator>
  );
};




const Kader = () => {
  return (
    <NavigationContainer independent = {true}>
      <DrawerNavigator  />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
  },
});

export default Kader;
