import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import * as firebase from 'firebase';
import * as Location from 'expo-location';

import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { Input, Button, Image  } from 'react-native-elements';
import { FlatList } from "react-native-gesture-handler";

export default function AddNewScreen(props) {
    const { navigate } = props.navigation;
    const [imagePath, setImagePath] = useState('');
    const [title, setTitle] = useState('');
    const [imageId, setImageId] = useState('');
    const [ReviewId, setReviewId] = useState('');
    const [showImage, setShowImage] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState({});

    const dimensions = Dimensions.get('window');
    const imageHeight = Math.round(dimensions.width * 9 / 16);
    const imageWidth = dimensions.width;

    useEffect(() => {
    getPermissionAsync();
    }, []);

  // Ask for permission to use camera for taking photo of food.
  const getPermissionAsync = async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
    }
  };

    // Ask for permission to use location data.
  const getLocation = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
    Alert.alert('No permission to access location');
    }
    else {
    let location = await Location.getCurrentPositionAsync({});
    console.log(location);
    setLocation({...location.coords, latitudeDelta: 0.0322, longitudeDelta: 0.0221 });
    }};

  // Save review to firebase under user. As per convention, image, title and description are mandatory.
  const saveItem = async () => {
    if (imagePath != null && title != null && description != null) {
      const userID = firebase.auth().currentUser.uid.toString();
      firebase.database()
        .ref("recipefinder2020:/" + userID + "/")
        .push({
          ReviewId: ReviewId,
          imageId: imageId,
          title: title,
          description: description,
          imagePath: imagePath,
          location: location,
          owner: userID
        });
    } else {
      Alert.alert("Please upload an image");
    }
    handleNavigation();
  };

  // Navigation handler.
  const handleNavigation = () => {
    navigate("Root");
  }

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
    setReviewId(randomId);
    const ref = firebase.storage().ref().child(randomId.toString());
    const snapshot = await ref.put(blob);
    blob.close();

    return await snapshot.ref.getDownloadURL();
  };

  // Delete image from Firebase and then clear imagePath state let user know that image has been removed.
  const deleteImage = () => {
    const userID = firebase.auth().currentUser.uid.toString();

    try {
      var image = firebase.database().ref("recipefinder2020:").child(userID).child(imageId);
      image.remove();
      setImagePath(null);
      setShowImage(false);
    } catch (error) {
      console.log("Error on deleting an image: ", error);
    }
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
      setShowImage(true);
      setShowDeleteButton(true);
    } catch (E) {
      console.log(E);
    }
  };

  return (
    <View style={styles.container}>
    <ImageBackground source={{uri: 'https://i.pinimg.com/236x/1d/e7/33/1de7332240c373a99f7317900b9bf431.jpg'}} style={{width: '100%', height: '100%'}}>
    <Input placeholder="Title" label="Title"
    onChangeText={(title) => setTitle(title)}
    value={title}
    />
    <Input placeholder="Description" label="Description"
    onChangeText={(description) => setDescription(description)}
    value={description}
    />
    <View style={{paddingBottom: 10, justifyContent: 'space-around', flexDirection: 'row',  }}>
    <Button title={"Add your location"} onPress={getLocation}/>
    <Button title={"Add image"} onPress={pickImage}/>
    </View>

    {showImage ? ( 
    <Image
    source={{ uri: imagePath }}
     style={{ width: showImage ? imageWidth : 0, height: showImage ? imageHeight : 0 }}
    />
    ) : null}

<View style={{flex: 2, justifyContent: 'space-evenly'}}>
{showImage ? (<Button title={"Delete image"} onPress={deleteImage}/>) : null}
    <Button title={"Save Review"} onPress={saveItem}/>
    </View>

    </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });