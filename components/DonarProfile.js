import React, { useState ,useEffect } from 'react';
import { StyleSheet, View, Text,ImageBackground } from 'react-native';
import { Button, TextInput, Card, IconButton } from 'react-native-paper';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import UserDashboard from './UserDashboard';
import { addDonarBLoodDetails, addMarker } from '../firebaseconfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase, ref, onValue } from 'firebase/database';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { ScrollView } from 'react-native-gesture-handler';
import * as Location from 'expo-location';

const Tab = createMaterialBottomTabNavigator();

const UserProfile = ({navigation}) => {

  
  const [name, setName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [location, setLocation] = useState('');
  const [healthIssue, setHealthIssue] = useState('');
  const [age, setAge] = useState('');
  const [dob, setDob] = useState('');
  const [locationlag, setLocationlag] = useState(null);
  const [locationlat, setLocationlat] = useState(null);
 

  const handleUpdate = async ()  => {
    const phone = await AsyncStorage.getItem('phone');
    if(locationlag){
      addDonarBLoodDetails(phone,name,bloodGroup,location,healthIssue,age,dob,locationlag,locationlat)
      addMarker(phone,bloodGroup,locationlag,locationlat)
       navigation.navigate('User Dashboard');
    }
    else{
      alert("Unable to get Location ! try Again ")
    }

  };

  
    const getLocationAsync = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      let { coords } = await Location.getCurrentPositionAsync({});
      setLocationlag(coords.longitude);
      setLocationlat(coords.latitude);
  
    };
  
  useEffect(()  => {
    getLocationAsync();
    const dbb = getDatabase();
    AsyncStorage.getItem('phone').then((phoneNumber) => {
        const userRef = ref(dbb, 'Donars/' + phoneNumber);
        const unsubscribe = onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if(data){
            setName(data.name);
            setAge(data.age);
            setBloodGroup(data.bloodgroup);
            setLocation(data.location);
            setHealthIssue(data.healthIssue);
            setDob(data.dob);
            }
          });
      })
      .catch((error) => {
        console.log(error);
    });
    
    return () => {
        unsubscribe();
      };
  }, []);

  return (
    <ImageBackground
    source={require('../assets/bg2.jpg')}
    style={styles.background}
  >
    <View style={styles.overlay} />
    <ScrollView showsVerticalScrollIndicator={false}>
    <View style={styles.container}>
   
      <Card style={styles.card}>
        <Card.Title title="User Information" />
        <Card.Content>
          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            label="Blood Group"
            value={bloodGroup}
            onChangeText={setBloodGroup}
            style={styles.input}
          />
          <TextInput
            label="Location"
            value={location}
            onChangeText={setLocation}
            style={styles.input}
          />
          <TextInput
            label="Health Issue"
            value={healthIssue}
            onChangeText={setHealthIssue}
            style={styles.input}
          />
          <TextInput
            label="Age"
            value={age}
            onChangeText={setAge}
            style={styles.input}
          />
          <TextInput
            label="Date of Birth"
            value={dob}
            onChangeText={setDob}
            style={styles.input}
          />
        </Card.Content>
      </Card>
      <Button style={styles.button} mode="contained" onPress={handleUpdate}>
        Update Profile
      </Button>
    </View>
    </ScrollView>
   
    </ImageBackground>
  );
};


const UserProfileNavigator = () => {

 
  

  return (
    <Tab.Navigator >
      <Tab.Screen name="User Dashboard"  component={UserDashboard}  />
      <Tab.Screen name="User Info"  component={UserProfile}  />
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

export default UserProfileNavigator;
