import React, { useState ,useEffect } from 'react';
import { StyleSheet, View, Text,ImageBackground,FlatList } from 'react-native';
import { Button, TextInput, Card, IconButton,Title } from 'react-native-paper';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { addBloodStock, addMarker} from '../firebaseconfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase, ref, onValue,update } from 'firebase/database';
import BloodDashboard from './BloodDashboard';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { ScrollView } from 'react-native-gesture-handler';
import * as Location from 'expo-location';

const Tab = createMaterialBottomTabNavigator();

const BloodProfile = () => {

  
  const [BloodType, setBloodType] = useState('');
  const [RhFactor, setRhFactor] = useState('');
  const [DonorID, setDonoID] = useState('');
  const [CollectionDate, setCollectionDate] = useState('');
  const [ExpirationDate, setExpirationDate] = useState('');
  const [Volume, setVolume] = useState('');
  const [StorageLocation, setStorageLocation] = useState('');
  const [AvailabilityStatus, setAvailabilityStatus] = useState('');
  const [TransfusionHistory, setTransfusionHistory] = useState('');

  const [locationlag, setLocationlag] = useState(null);
  const [locationlat, setLocationlat] = useState(null);
 
    const getLocationAsync = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      let { coords } = await Location.getCurrentPositionAsync({});
      setLocationlag(coords.longitude);
      setLocationlat(coords.latitude);

    };

    useEffect(() => {
      getLocationAsync();
    }, []);

  
  const handleadd = async ()  => {
    const phone = await AsyncStorage.getItem('phone');
    if(locationlag){
    addBloodStock(phone,BloodType,RhFactor,DonorID,CollectionDate,ExpirationDate,Volume,StorageLocation,AvailabilityStatus,TransfusionHistory,locationlag,locationlat)
    addMarker(phone,BloodType,locationlag,locationlat)
   
    }
    else{
      alert("Unable to get Location ! try Again ")
    }
    
  };

  return (
    <ImageBackground
    source={require('../assets/bg2.jpg')}
    style={styles.background}
  >
   <ScrollView showsVerticalScrollIndicator={false}>
    <View style={styles.overlay} />
    <View style={styles.container}>
   
      <Card style={styles.card}>
        <Card.Title title="Blood Information" />
        <Card.Content>
          <TextInput
            label="Blood Type"
            value={BloodType}
            onChangeText={setBloodType}
            style={styles.input}
          />
          <TextInput
            label="Rh Factor"
            value={RhFactor}
            onChangeText={setRhFactor}
            style={styles.input}
          />
          <TextInput
            label="Donor Phone"
            value={DonorID}
            onChangeText={setDonoID}
            style={styles.input}
          />
          <TextInput
            label="Collection Date"
            value={CollectionDate}
            onChangeText={setCollectionDate}
            style={styles.input}
          />
          <TextInput
            label="Expiration Date"
            value={ExpirationDate}
            onChangeText={setExpirationDate}
            style={styles.input}
          />
          <TextInput
            label="Volume"
            value={Volume}
            onChangeText={setVolume}
            style={styles.input}
          />
          <TextInput
            label="Storage Location"
            value={StorageLocation}
            onChangeText={setStorageLocation}
            style={styles.input}
          />
          <TextInput
            label="Availability Status"
            value={AvailabilityStatus}
            onChangeText={setAvailabilityStatus}
            style={styles.input}
          />
            <TextInput
            label="Transfusion History"
            value={TransfusionHistory}
            onChangeText={setTransfusionHistory}
            style={styles.input}
          />
        </Card.Content>
      </Card>
      <Button style={styles.button} mode="contained" onPress={handleadd}>
        Add Blood Stock
      </Button>
    </View>
    </ScrollView>
    </ImageBackground>
  );
};


const BloodbankProfileNavigator = () => {

 

  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard"  component={BloodDashboard}  />
      <Tab.Screen name="Add Stock Info"  component={BloodProfile}  />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    flex: 1,
    padding: 20,
    marginTop:20,
  },
  card: {
    marginVertical: 20,
  },
  input: {
    marginVertical: 10,
  },
 
  iconButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  button: {
    marginTop: 20,
  },
});

export default BloodbankProfileNavigator;
