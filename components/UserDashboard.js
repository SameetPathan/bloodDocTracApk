import React, { useState,useEffect  } from 'react';
import { StyleSheet, View, Text,ImageBackground } from 'react-native';
import {  Card, IconButton } from 'react-native-paper';
import { getDatabase, ref, onValue } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';


const UserDashboard = ({ navigation }) => {
  const [name, setName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [location, setLocation] = useState('');
  const [healthIssue, setHealthIssue] = useState('');
  const [age, setAge] = useState('');
  const [dob, setDob] = useState('');





  useEffect(()  => {
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

    <View style={styles.container}>
 
      <View style={styles.header}>
        <Text style={styles.title}>User Dashboard</Text>
        <IconButton
          icon="pencil"
          size={20}
          onPress={() => navigation.navigate('User Info')}
        />
      </View>
      <Card style={styles.card}>
        <Card.Title title={name} subtitle={`Age: ${age}`} />
        <Card.Content>
          <View style={styles.field}>
            <Text style={styles.label}>Blood Group:</Text>
            <Text>{bloodGroup}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Location:</Text>
            <Text>{location}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Health Issue:</Text>
            <Text>{healthIssue}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Date of Birth:</Text>
            <Text>{dob}</Text>
          </View>
        </Card.Content>
      </Card>
    
    </View>
    </ImageBackground>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color:'white'
  },
  card: {
    marginBottom: 20,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  button: {
    marginTop: 20,
  },
});

export default UserDashboard;
