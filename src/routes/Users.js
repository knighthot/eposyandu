import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DashboardBalita from '../screens/users/DashboardBalita'; // Stack for Dashboard Balita
import DashboardLansia from '../screens/users/DashboardLansia'; // Stack for Dashboard Lansia
import axios from 'axios';
import Config from 'react-native-config';
import profile from '../assets/images/anakcew.png'; // Profile picture placeholder
import { useNavigation } from '@react-navigation/native';
import AppStack from './AppStack'; // Import AppStack for token validation
import HeaderKader from '../components/HeaderKader';
import App from '../../App';
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

// Komponen untuk tampilan jika tidak ada tab yang tersedia
const NoTabsAvailable = () => (
  <View style={styles.fallbackContainer}>
    <Text style={styles.fallbackText}>No tabs available. Please ensure user data is complete.</Text>
  </View>
);

// Tab Navigator dengan stack Balita dan Lansia
const TabNavigator = ({ hasOrangTua, hasWali }) => {
  if (!hasOrangTua && !hasWali) {
    return <NoTabsAvailable />;
  }

  return (
    <Tab.Navigator
      initialRouteName="DashboardBalitaStack"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60,
          position: 'absolute',
        },
      }}
    >
      {hasOrangTua && (
        <Tab.Screen
          name="DashboardBalitaStack"
          component={DashboardBalita} // Stack untuk Dashboard Balita
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
      )}
      {hasWali && (
        <Tab.Screen
          name="DashboardLansiaStack"
          component={DashboardLansia} // Stack untuk Dashboard Lansia
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
      )}
    </Tab.Navigator>
  );
};

// Tambahkan Stack untuk Dashboard Balita
const StackNavigator = ({ hasOrangTua, hasWali }) => {

  return (
    <Stack.Navigator>
         <Stack.Screen name='Dashboard'  
          options={{
          header: ({ navigation }) => <HeaderKader openDrawer={() => navigation.openDrawer()} />, // Show HeaderKader only on the dashboard
        }}>
          {() => <TabNavigator hasOrangTua={hasOrangTua} hasWali={hasWali} />}
        
        </Stack.Screen>
        
        <Stack.Screen name="App" component={App} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};


const DrawerNavigator = ({ hasOrangTua, hasWali }) => {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
        name="Home"
        children={() => <StackNavigator hasOrangTua={hasOrangTua} hasWali={hasWali} />}  
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
};

const CustomDrawerContent = (props) => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState(''); 

  useEffect(() => {
    const getUserName = async () => {
      try {
        const storedUserName = await AsyncStorage.getItem('userName');
        if (storedUserName) {
          setUserName(storedUserName); 
        }
      } catch (error) {
        console.error('Error fetching userName:', error);
        
      }
    };

    getUserName();
  }, []);

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
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userRole');
            await AsyncStorage.removeItem('userName');
            await AsyncStorage.removeItem('userEmail');

            navigation.navigate('App'); // Navigasi ke login
          }
        }
      ]
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.profileContainer}>
        <View style={styles.profilePictureWrapper}>
          <Image source={profile} style={styles.profilePicture} />
          <TouchableOpacity style={styles.editIcon}>
            <MaterialCommunityIcons name="pencil" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.profileName}>{userName}</Text>
      </View>
      <DrawerItemList {...props} />

      <View style={styles.logoutContainer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <MaterialCommunityIcons name="logout" size={20} color="white" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

// Main Users Component with Drawer
const Users = () => {
  const [hasOrangTua, setHasOrangTua] = useState(false);
  const [hasWali, setHasWali] = useState(false);

  const navigation = useNavigation();
  
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
      try {
        if (!userId || !token) {
          console.error('User ID or authentication token is missing');
          navigation.navigate('App'); // Pastikan rute 'Home' sudah dikonfigurasi di navigasi
        }

        const response = await axios.get(`${Config.API_URL}/pengguna/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = response.data;

        setHasOrangTua(userData.orangtua !== null);
        setHasWali(userData.wali !== null);
      }catch (error) {
        // Jika error 403, hapus token dan kembali ke home/login
        if (error.response && error.response.status === 403) {
          console.error('Invalid token, logging out...');
  
          // Hapus token dan data lain dari AsyncStorage
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('userRole');
          await AsyncStorage.removeItem('userName');
          await AsyncStorage.removeItem('userEmail');
  
          // Arahkan kembali ke halaman login atau home
          navigation.navigate('App'); // Pastikan rute 'Home' sudah dikonfigurasi di navigasi
        } else {
          console.error('Error fetching user data:', error.message);
        }
      }
    };
  
    fetchUserData();
  }, []);
  
  return (
    <NavigationContainer independent={true}>
      <DrawerNavigator hasOrangTua={hasOrangTua} hasWali={hasWali} />
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
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    fontSize: 18,
    color: 'grey',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  profilePictureWrapper: {
    position: 'relative',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#008EB3',
    borderRadius: 15,
    padding: 5,
  },
  profileName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  logoutContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50, 
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f00',
    borderRadius: 10,
    justifyContent: 'center',
    width: '80%',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default Users;
