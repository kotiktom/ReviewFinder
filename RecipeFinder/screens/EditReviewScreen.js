import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import * as firebase from 'firebase';
import * as Location from 'expo-location';

import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Dimensions } from 'react-native';
import { Input, Button, Image  } from 'react-native-elements';
import { setWorldOriginAsync } from "expo/build/AR";

export default function EditReviewScreen(props) {
    const { navigate } = props.navigation;
    const { params } = props.route;
    const [imagePath, setImagePath] = useState('');
    const [title, setTitle] = useState('');
    const [key, setKey] = useState('');
    const [imageId, setImageId] = useState('');
    const [ReviewId, setReviewId] = useState('');
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState({});
    const [owner, setOwner] = useState('');

    const dimensions = Dimensions.get('window');
    const imageHeight = Math.round(dimensions.width * 9 / 16);
    const imageWidth = dimensions.width;

    // Set selected review's data to state in case of user going back to earlier screen by accident. State will remain in case of return. 
    useEffect(() => {
      setTitle(params.title);
      setImagePath(params.imagePath)
      setImageId(params.imageId)
      setReviewId(params.ReviewId)
      setDescription(params.description)
      setLocation(params.location)
      setKey(params.key);
      setOwner(params.owner)
    getPermissionAsync();
    }, []);

  // Ask for permission to use camera.
  const getPermissionAsync = async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
    }
  };

    // Ask for permission to use location.
  const getLocation = async () => {
    // Check permission
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
    Alert.alert('No permission to access location');
    }
    else {
    let location = await Location.getCurrentPositionAsync({});
    setLocation({...location.coords, latitudeDelta: 0.0322, longitudeDelta: 0.0221 });
    }};

    // Send update request to Firebase based on user and review key attribute.
    const updateItem = () => {
      const userID = firebase.auth().currentUser.uid.toString();
      try {
        firebase.database()
          .ref("recipefinder2020:/" + userID + "/" + key)
          .update({
            title: title,
            description: description,
            imageId: imageId,
            imagePath: imagePath,
            location: location
          });
          navigate("Root");
      } catch (error) {
        console.log("Error on updating the data", error);
      }
    };
    
    // Delete review based on owner/child keypair. Only creator is able to delete their own creation withing consumer client.
    const deleteReview = () => {
      try {
        var ref = firebase.database().ref("recipefinder2020:").child(owner).child(key);
        ref.remove()
        .then(function() {
          console.log("Remove succeeded.")
        })
        .catch(function(error) {
          console.log("Remove failed: " + error.message)
        });
        navigate("Root");
      } catch (error) {
        console.log(error.message);
      }
    };

  // Upload image to Firebase as XMLHttpRequest. Part of projects "Used some complex REST API's" requirement.
  // Combination of XML, HTTP and Firebase.
  const uploadImageAsync = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    var randomId = Math.floor(Math.random() * 10000000000000) + 1 ;
    setImageId(randomId);
    const ref = firebase.storage().ref().child(randomId.toString());
    const snapshot = await ref.put(blob);
    blob.close();

    return await snapshot.ref.getDownloadURL();
  };
  
  // Using imagepicker select photo from gallery or camera.
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        setImagePath(await uploadImageAsync(result.uri));
      }
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <View style={styles.container}>
    <Input placeholder="Title" label="Title"
    onChangeText={(title) => setTitle(title)}
    value={title}
    />
    <Input placeholder="Description" label="Description"
    onChangeText={(description) => setDescription(description)}
    value={description}
    />
    <View style={{justifyContent: 'space-around', flexDirection: 'row', paddingBottom: 5  }}>
    <Button title={"Add your location"} onPress={getLocation}/>
    <Button title={"Add image"} onPress={pickImage}/>
    </View>

    <View style={{justifyContent: 'space-evenly', flexDirection: "row"}}>
    {imagePath != null ? ( <Image
    source={{ uri: imagePath }}
     style={{ width: imageWidth, height: imageHeight }}
    />) : null}
    </View>
    
    <View style={{flex: 2, justifyContent: 'space-evenly'}}>
    <Button title={"Save Review"} onPress={updateItem}/>
    <Button title={"Delete Review"} onPress={deleteReview}/>
    </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 4,
      backgroundColor: '#fff',
    },
  });