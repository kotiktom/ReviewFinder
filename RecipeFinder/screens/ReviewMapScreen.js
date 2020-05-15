import React, {useEffect, useState} from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as firebase from 'firebase';
import * as Location from 'expo-location';

export default function ReviewMapScreen(props) {

const { navigate } = props.navigation;
const [mapLoaded, setMapLoaded] = useState(false);
const [list, setList] = useState([]);
const [area, setArea] = useState({});
const [location, setLocation] = useState({});
const dimensions = Dimensions.get('window');
const imageHeight = Math.round(dimensions.width * 9 / 16);
const imageWidth = dimensions.width;

// Load all reviews from Firebase, get user's current location and set location accordingly.
useEffect(() => {
    firebase.database()
      .ref("recipefinder2020:/")
      .on("value", snapshot => {
        var array = []
        snapshot.forEach(childSnapshot => {
                const data = childSnapshot.val();
                if (data != null) {
                  const Reviews = Object.values(data);
                  const keys = Object.keys(data);
          
                  for (const [i, e] of Reviews.entries()) {
                    Reviews[i].key = keys[i];
                  }
                array = array.concat(Reviews);
                setList(array);    
              }
          })
      });
     getLocation();
      setArea({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0322,
        longitudeDelta : 0.0221,    
    })
    setMapLoaded(true);
    }, []);

    // Ask for users location. If 'No' is given, user is left hovering over africa.
    const getLocation = async () => {
        //Check permission
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
        Alert.alert('No permission to access location');
        }
        else {
        let location = await Location.getCurrentPositionAsync({});
        setLocation({...location.coords, latitudeDelta: 0.0322, longitudeDelta: 0.0221 });
        }};

return (
<View style={styles.container}>
{ mapLoaded ? <MapView style={styles.mapContainer} region={area}>
          {list.map((marker) => (
            <Marker
              coordinate={{
                latitude:  parseFloat(marker.location.latitude),
                longitude: parseFloat(marker.location.longitude),
              }}
              title={marker.title}
              onPress={() => navigate("SingleReview", props={ item: marker})}
            />
          ))}
        </MapView> : null}
</View>
)
}

const styles = StyleSheet.create({
container: {
  flex: 8,
  backgroundColor: "#fff",
  alignItems: "center",
  justifyContent: "center",
    },
    mapContainer: {
    position: 'absolute',
    bottom: 0,
    width: "100%",
    height: "100%"
    }
})
