import React, { useState,useEffect ,useMemo  } from 'react';
import { StyleSheet, View, Text,ImageBackground,FlatList ,Modal,Linking} from 'react-native';
import { Button, Card, IconButton,Portal, TextInput,Title } from 'react-native-paper';
import { getDatabase, ref, onValue ,remove,update} from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';



const BloodStockList = ({ navigation }) => {

    const [locationFilter, setLocationFilter] = useState("");
    const [bloodTypeFilter, setBloodTypeFilter] = useState("");

    const [bloodStockList, setBloodStockList] = useState([]);


  

    const filteredBloodStockList = useMemo(() => {
        return bloodStockList.filter((item) => {
          const locationMatch = !locationFilter || item.StorageLocation.toLowerCase().includes(locationFilter.toLowerCase());
          const bloodTypeMatch = !bloodTypeFilter || item.BloodType.toLowerCase().includes(bloodTypeFilter.toLowerCase());
          return locationMatch && bloodTypeMatch;
        });
      }, [bloodStockList, locationFilter, bloodTypeFilter]);

    useEffect(() => {
        const dbb = getDatabase();
        AsyncStorage.getItem('phone').then((phone) => {
          const bloodStockRef = ref(dbb, 'BloodStock');
      
          onValue(bloodStockRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              const bloodStockArray = Object.keys(data)
                .map((key) => ({ id: key, ...data[key] }));
              setBloodStockList(bloodStockArray);
            }
          });
        })
        .catch((error) => {
          console.log(error);
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
        <Card.Title title={item.BloodType} subtitle={`Donar: ${item.DonorID}`} />
        <Card.Content>
          <View style={styles.field}>
            <Text style={styles.label}>Rh Factor:</Text>
            <Text>{item.RhFactor}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Collection Date:</Text>
            <Text>{item.CollectionDate}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Expiration Date:</Text>
            <Text>{item.ExpirationDate}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Volume:</Text>
            <Text>{item.Volume}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Location:</Text>
          </View>
          <View style={styles.field}>
          
            <Text>{item.StorageLocation}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Availability Status:</Text>
            <Text>{item.AvailabilityStatus}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Transfusion History:</Text>
            <Text>{item.TransfusionHistory}</Text>
          </View>

          <View style={{ flexDirection: 'row' }}>
                <Button style={[styles.button, { marginRight: 10,backgroundColor:'red' }]} mode="contained" onPress={() => makeCall(item.DonorID)}>
                    Call
                </Button>
                <Button style={styles.button} mode="outlined" onPress={() => handleTrackPress(item.StorageLocation)}>
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
        <Text style={styles.title}>BloodBank Storage</Text>
        
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
        data={filteredBloodStockList}
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


export default BloodStockList