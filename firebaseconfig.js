import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref, set,get, push,update,remove,onValue,child } from "firebase/database";


const firebaseConfig = {
    apiKey: "AIzaSyDHNpoWt51kNQvXT2hzKoqFFKGIUkPrj_Y",
    authDomain: "blood-donation-3aa50.firebaseapp.com",
    projectId: "blood-donation-3aa50",
    storageBucket: "blood-donation-3aa50.appspot.com",
    messagingSenderId: "69206112896",
    appId: "1:69206112896:web:780f1ed11a07ad6fb4c465"
};


export const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export function register(name, phoneNumber, email, userType, password) {
    const dbb = getDatabase();
    const userRef = ref(dbb, 'users/' + phoneNumber);
    onValue(userRef, (snapshot) => {
      const user = snapshot.val();
      if (user !== null && user.phoneNumber === phoneNumber) {
        //alert('User phone number already exists');
      } else {
        set(userRef, {
          name: name,
          usertype: userType,
          email: email,
          password: password,
          phoneNumber:phoneNumber
        });
        alert('Registration Successful');
      }
    });
  }

  export function addDonarBLoodDetails(phone,name,bloodgroup,location,healthIssue,age,dob,locationlag,locationlat) {
    const dbb = getDatabase();
    set(ref(dbb, 'Donars/' + phone), {
        name: name,
        bloodgroup:bloodgroup,
        location: location,
        healthIssue:healthIssue,
        age:age,
        dob:dob,
        locationlag:locationlag,
        locationlat:locationlat
    });
    alert("Updated Successfull")
}


export function addBloodStock(phone, BloodType, RhFactor, DonorID, CollectionDate, ExpirationDate, Volume, StorageLocation, AvailabilityStatus, TransfusionHistory,locationlag,locationlat) {
    const dbb = getDatabase();
    const newBloodStockRef = push(ref(dbb, 'BloodStock'));  
    set(newBloodStockRef, {
      phone: phone,
      BloodType: BloodType,
      RhFactor: RhFactor,
      DonorID: DonorID,
      CollectionDate: CollectionDate,
      ExpirationDate: ExpirationDate,
      Volume: Volume,
      StorageLocation: StorageLocation,
      AvailabilityStatus: AvailabilityStatus,
      TransfusionHistory: TransfusionHistory,
      locationlag:locationlag,
      locationlat:locationlat
    });
    alert("Blood Stock added successfully");
  }


  export function addMarker(id, title, latitude, longitude) {
    const coordinate = { latitude, longitude };
    const marker = { id, title, coordinate };
    const dbb = getDatabase();
    const newmarkerRef = push(ref(dbb, 'markers'));
    set(newmarkerRef, marker);  
    alert("Marker added successfully");
  }
  
  

 
  