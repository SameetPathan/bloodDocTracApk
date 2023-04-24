import React, { useState,useEffect ,useMemo  } from 'react';
import { StyleSheet, View, Text,ImageBackground,FlatList ,Modal,Linking} from 'react-native';
import { Button, Card, IconButton,Portal, TextInput,Title } from 'react-native-paper';
import { getDatabase, ref, onValue ,remove,update} from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';


function BloodDonarList({ navigation }) {
    const [locationFilter, setLocationFilter] = useState("");
    const [bloodTypeFilter, setBloodTypeFilter] = useState("");

    const [bloodDonarsList, setDonarsStockList] = useState([]);

    const filteredBloodDonarsList = useMemo(() => {
        return bloodDonarsList.filter((item) => {
          const locationMatch = !locationFilter || item.StorageLocation.toLowerCase().includes(locationFilter.toLowerCase());
          const bloodTypeMatch = !bloodTypeFilter || item.BloodType.toLowerCase().includes(bloodTypeFilter.toLowerCase());
          return locationMatch && bloodTypeMatch;
        });
      }, [bloodDonarsList, locationFilter, bloodTypeFilter]);

    useEffect(() => {
        const dbb = getDatabase();
        const bloodDonarsRef = ref(dbb, 'Donars');
          onValue(bloodDonarsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              const bloodDonarsArray = Object.keys(data)
                .map((key) => ({ id: key, ...data[key] }));
                setDonarsStockList(bloodDonarsArray);
            }
          });
      }, []);

      const makeCall = (phoneNumber) => {
        Linking.openURL(`tel:${phoneNumber}`);
      }

      const handleTrackPress = (location) => {
        const address = encodeURIComponent(location);
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;
      
        Linking.canOpenURL(mapsUrl).then((supported) => {
          if (supported) {
            Linking.openURL(mapsUrl);
          } else {
            alert(`Cannot open Google Maps URL: ${mapsUrl}`);
          }
        });
      };

      const renderItem = ({ item }) => (
        <Card style={styles.card}>
          <Card.Title title={item.name} subtitle={`Donor Phone: ${item.id}`} />
          <Card.Content>
            <View style={styles.field}>
              <Text style={styles.label}>Blood Group:</Text>
              <Text>{item.bloodgroup}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Age:</Text>
              <Text>{item.age}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Date of Birth:</Text>
              <Text>{item.dob}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Health Issue:</Text>
              <Text>{item.healthIssue}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Location:</Text>
            </View>
            <View style={styles.field}>
              <Text>{item.location}</Text>
            </View>
        
      
            <View style={{ flexDirection: 'row' }}>
            <Button style={[styles.button, { marginRight: 10,backgroundColor:'red' }]} mode="contained" onPress={() => makeCall(item.id)}>
                    Call
                </Button>
                <Button style={styles.button} mode="outlined" onPress={() => handleTrackPress(item.location)}>
                    Track
                </Button>
            </View>
          </Card.Content>
        </Card>
      );



  return (
   <ImageBackground
    source={require('../assets/bg2.jpg')}
    style={styles.background}
  >
   <ScrollView showsVerticalScrollIndicator={false}>
    <View style={styles.overlay} />
    <View style={styles.container}>
        <View style={styles.header}>
        <Text style={styles.title}>Donar</Text>
        
      </View>
      <View style={styles.searchContainer}>
        <TextInput
            style={styles.searchInput}
            placeholder="Location"
            value={locationFilter}
            onChangeText={(text) => setLocationFilter(text)}
        />
        <TextInput
            style={styles.searchInput}
            placeholder="Blood Type"
            value={bloodTypeFilter}
            onChangeText={(text) => setBloodTypeFilter(text)}
        />
        </View>
      <FlatList
        data={filteredBloodDonarsList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
    </ScrollView>
   
    </ImageBackground>
  )
}

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
    padding: 40,
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
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    width: '45%',
    height: 30,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    borderRadius: 5,
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


export default BloodDonarList