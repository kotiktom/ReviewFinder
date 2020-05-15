import React, {useEffect, useState} from 'react';
import { View, StyleSheet, Dimensions, ImageBackground  } from 'react-native';
import { Image, Tile, Text, Divider, Button  } from 'react-native-elements';
import MapView, { Marker } from 'react-native-maps';
import * as firebase from 'firebase';

export default function SingleReview(props) {

const { navigate } = props.navigation;
const location = props.route.params.item.location;
const dimensions = Dimensions.get('window');
const imageHeight = Math.round(dimensions.width * 9 / 16);
const screenWidth = dimensions.width;

const [area, setArea] = useState({})
const [allowedToEdit, setAllowedToEdit] = useState(false);
const [imagePath, setImagePath] = useState('')


// Load relevant information from given props to state in order to be shown for user.
useEffect(() => {
    HandleEditAuthentication(props.route.params.item.owner)
    setImagePath(props.route.params.item.imagePath);
    location != null ?
    setArea({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: location.longitudeDelta,
        longitudeDelta : location.latitudeDelta,   
    })
    : setArea(null);
}, [])

// Local navigation handler.
const handleEditNavigation = () => {
    navigate("Edit", props.route.params.item)
}
// Check if user is allowed to edit current posti. If user is listed as owner of the review, 'Edit' button will appear.
  const HandleEditAuthentication = (owner) => {
    const userID = firebase.auth().currentUser.uid.toString();
    if(userID == owner)
     { props.navigation.setOptions({headerRight: () => <View style={{padding: 5}}><Button title={"Edit"} onPress={handleEditNavigation}/></View>}) }
    else 
    { return null; }
    }

return (
<View style={styles.container}>
<ImageBackground source={{uri: 'https://i.pinimg.com/236x/1d/e7/33/1de7332240c373a99f7317900b9bf431.jpg'}} style={{width: '100%', height: '100%'}}>
{imagePath != null ? ( <Image
    source={{ uri: imagePath }}
     style={{ width: screenWidth, height: imageHeight }}
    />) : null}

    
<Text h2={true}>{props.route.params.item.title}</Text>
<Divider style={{ backgroundColor: 'blue', width: screenWidth }} />
<Text>{props.route.params.item.description}</Text>
{area != null ?<MapView style={styles.mapContainer} region={area}>
<MapView.Marker
    coordinate={{
    latitude: parseFloat(area.latitude),
    longitude: parseFloat(area.longitude)
        }}
    />
</MapView>
: null}
</ImageBackground>
</View> 
)}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    },
    mapContainer: {
    position: 'absolute',
    bottom: 0,
    width: "100%",
    height: "20%"
    },
    imageContainer: {
    width: "100%",
    height: "20%"
    },
    mapStyle: {
    flex: 8,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
    }
  });