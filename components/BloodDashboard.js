import React, { useState,useEffect  } from 'react';
import { StyleSheet, View, Text,ImageBackground,FlatList ,Modal} from 'react-native';
import { Button, Card, IconButton,Portal, TextInput,Title } from 'react-native-paper';
import { getDatabase, ref, onValue ,remove,update} from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';



const BloodDashboard = ({ navigation }) => {

    const [modalVisible, setModalVisible] = useState(false);
    const [currentid, setcurrentid] = useState('');
   

    const [bloodType, setBloodType] = useState('');
    const [rhFactor, setRhFactor] = useState('');
    const [donorID, setDonorID] = useState('');
    const [collectionDate, setCollectionDate] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [volume, setVolume] = useState('');
    const [storageLocation, setStorageLocation] = useState('');
    const [availabilityStatus, setAvailabilityStatus] = useState('');
    const [transfusionHistory, setTransfusionHistory] = useState('');

    const [bloodStockList, setBloodStockList] = useState([]);

    const deleteBloodStock = (id) => {
        const dbb = getDatabase();
        remove(ref(dbb, `BloodStock/${id}`));
        alert("Blood Stock Deleted")
      };

      const handleUpdate = () => {

        updateBloodStock(currentid);
      };

      const updateBloodStock = (id) => {
        const dbb = getDatabase();
        update(ref(dbb, `BloodStock/${id}`), {
          BloodType: bloodType,
          RhFactor: rhFactor,
          DonorID: donorID,
          CollectionDate: collectionDate,
          ExpirationDate: expirationDate,
          Volume: volume,
          StorageLocation: storageLocation,
          AvailabilityStatus: availabilityStatus,
          TransfusionHistory: transfusionHistory,
        });
        setModalVisible(false);
      };

    useEffect(() => {
        const dbb = getDatabase();
        AsyncStorage.getItem('phone').then((phone) => {
          const bloodStockRef = ref(dbb, 'BloodStock');
      
          onValue(bloodStockRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              const bloodStockArray = Object.keys(data)
                .filter((key) => data[key].phone === phone) 
                .map((key) => ({ id: key, ...data[key] }));
              setBloodStockList(bloodStockArray);
            }
          });
        })
        .catch((error) => {
          console.log(error);
        });
      }, []);

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
                <Button style={[styles.button, { marginRight: 10,backgroundColor:'red' }]} mode="contained" onPress={() => deleteBloodStock(item.id)}>
                    Delete
                </Button>
                <Button style={styles.button} mode="outlined" onPress={() => { setModalVisible(true);setcurrentid(item.id);}}>
                    Edit
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
  
    <View style={styles.overlay} />
    <View style={styles.container}>
        <View style={styles.header}>
        <Text style={styles.title}>Blood Stock Available</Text>
      </View>
      <FlatList
        data={bloodStockList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>

  
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
        <ImageBackground
    source={require('../assets/bg2.jpg')}
    style={styles.background}
  >
    <ScrollView showsVerticalScrollIndicator={false}>
    <View style={styles.container}>
   
      <Card style={styles.card}>
        <Card.Title title="Update Blood Stock Information" />
        <Card.Content>
          <TextInput
            label="Blood Type"
            value={bloodType}
            onChangeText={setBloodType}
            style={styles.input}
          />
          <TextInput
            label="Rh Factor"
            value={rhFactor}
            onChangeText={setRhFactor}
            style={styles.input}
          />
          <TextInput
            label="Donor Phone"
            value={donorID}
            onChangeText={setDonorID}
            style={styles.input}
          />
          <TextInput
            label="Collection Date"
            value={collectionDate}
            onChangeText={setCollectionDate}
            style={styles.input}
          />
          <TextInput
            label="Expiration Date"
            value={expirationDate}
            onChangeText={setExpirationDate}
            style={styles.input}
          />
          <TextInput
            label="Volume"
            value={volume}
            onChangeText={setVolume}
            style={styles.input}
          />
          <TextInput
            label="Storage Location"
            value={storageLocation}
            onChangeText={setStorageLocation}
            style={styles.input}
          />
          <TextInput
            label="Availability Status"
            value={availabilityStatus}
            onChangeText={setAvailabilityStatus}
            style={styles.input}
          />
            <TextInput
            label="Transfusion History"
            value={transfusionHistory}
            onChangeText={setTransfusionHistory}
            style={styles.input}
          />
          <View style={{ flexDirection: 'row' }}>
            <Button style={[styles.button, { marginRight: 10 }]} mode="contained" onPress={handleUpdate}>
                Update
            </Button>
            <Button style={styles.button} mode="outlined" onPress={() => setModalVisible(false)}>
                Cancel
            </Button>
            </View>

        </Card.Content>
       
      </Card>
      
    </View>
    </ScrollView>
   
    </ImageBackground>
        </Modal>
   


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

export default BloodDashboard;
