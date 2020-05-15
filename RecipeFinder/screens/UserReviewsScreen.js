import React, {useState, useEffect} from 'react';
import { View, FlatList, StyleSheet, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import { Button } from 'react-native-elements';
import firebase from 'firebase';
import ReviewComponent from '../components/ReviewComponent'
export default function AllRecepiesScreen(props) {
  const { navigate } = props.navigation;
  const [user, setUser] = useState('');
  const [list, setList] = useState('');

  useEffect(() => {
    const user = firebase.auth().currentUser.uid;
    setUser(user);

    // Load allreviews which are under the current user
    firebase.database()
    .ref("recipefinder2020:/" + user + "/")
    .on("value", (snapshot) => {
        const data = snapshot.val();
        if (data != null) {
        const Reviews = Object.values(data);
        const keys = Object.keys(data);

        for (const [i, e] of Reviews.entries()) {
          Reviews[i].key = keys[i];
        }
        if (Reviews != null) {
          setList(Reviews);
        }
      }});
  });

  const keyExtractor = (item) => {
    return item.key.toString();
  };
  

  return (
    <View style={styles.container}>
    <ImageBackground source={{uri: 'https://i.pinimg.com/236x/1d/e7/33/1de7332240c373a99f7317900b9bf431.jpg'}} style={{width: '100%', height: '100%'}}>
    <FlatList
    keyExtractor={keyExtractor}
    data={list}
    renderItem={(item) => 
      <View>
      {ReviewComponent(item, navigate)}
      </View>
    }
    />

    </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
