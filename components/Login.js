import { MaterialIcons } from '@expo/vector-icons';
import React, { useState ,useEffect } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { Picker } from "@react-native-picker/picker";
import { getDatabase, ref, get} from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';


const  Login = ({ navigation })  => {

    
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('Please Select User Type');

  
    const getLocationAsync = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
    };
    useEffect(() => {
      getLocationAsync();
    }, []);


    const handleRegisterFirst=()=>{
      navigation.navigate('Register');
    }

    
    

    const handleLogin = async () => {
        const db = getDatabase();
        const userRef = ref(db, 'users/' + phone);
        const userSnapshot = await get(userRef);
        const userData = userSnapshot.val();
        
      if(phone && password && userType ){
        if (!userData) {
          alert("Login Failed")
        }
        else{
          if(userData.password===password && userData.usertype===userType ){
            await AsyncStorage.setItem('phone', phone);
            if(userData.usertype==="donor"){
              navigation.navigate("DonarProfile"); 
            }
            if(userData.usertype==="seeker"){
              navigation.navigate("SeekerHome"); 
            }
            if(userData.usertype==="bloodbank"){
              navigation.navigate("BloodBankProfile"); 
            }
           
          }
          else{
            alert("Login Failed")
          }
        }   } else{
            alert("Please Enter All Feilds")
        }
    
      };

    return (
      <ImageBackground
        source={require('../assets/bg2.jpg')}
        style={styleslogin.background}
      >
        <View style={styleslogin.overlay} />
        <View style={styleslogin.container}>
          <AntDesign name="login" size={100} color="white" style={styleslogin.logo} />
          <TextInput label="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={styleslogin.input} />
          <TextInput label="Password"  value={password}
            onChangeText={setPassword} secureTextEntry style={styleslogin.input}  />
          <Picker
          selectedValue={userType}
          onValueChange={(itemValue, itemIndex) => setUserType(itemValue)}
          style={styleslogin.picker}
        >
          <Picker.Item label="Select User Type" value="Select User Type" />
          <Picker.Item label="Donor" value="donor" />
          <Picker.Item label="Seeker" value="seeker" />
          <Picker.Item label="Blood Bank" value="bloodbank" />
        </Picker>
          <Button mode="contained" style={styleslogin.button} onPress={handleLogin}>
            Login
          </Button>

          
          <View style={styleslogin.signup}>
            <MaterialIcons name="person-add" size={20} color="white" />
            <Button mode="text" style={styleslogin.signupText} onPress={handleRegisterFirst}>
              Sign up
            </Button>
          </View>
        </View>
      </ImageBackground>
    );
  };
  
  const styleslogin = StyleSheet.create({
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
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      marginBottom: 50,
    },
    input: {
      width: '80%',
      marginVertical: 10,
    },
    button: {
      width: '80%',
      marginVertical: 10,
    },
    signup: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 20,
    },
    signupText: {
      color: 'white',
      marginLeft: 5,
    },
    picker: {
        width: '80%',
        marginVertical: 10,
        color: 'black',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 10,
        height: 50,
        paddingLeft: 10,
      },
  });

  export default Login


