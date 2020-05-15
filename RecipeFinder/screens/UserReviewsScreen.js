import React, {useState, useEffect} from 'react';
import { View, FlatList, StyleSheet, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import { Button } from 'react-native-elements';
import firebase from 'firebase';
import ReviewComponent from '../components/ReviewComponent'
export default function AllReviewsScreen(props) {
  const { navigate } = props.navigation;
  const [user, setUser] = useState('');
  const [list, setList] = useState('');

    // Load allreviews which are under the current user
    useEffect(() => {
      const userId = firebase.auth().currentUser.uid;
  
      firebase.database()
      .ref("recipefinder2020:/" + userId + "/")
      .on("value", snapshot => {
        var array = []
        console.log(snapshot);
        snapshot.forEach(childSnapshot => {
          const data = childSnapshot.val();
          if (data != null) {
            const Reviews = Object.values(data);
            const keys = Object.keys(data);
    
            for (const [i, e] of Reviews.entries()) {
              Reviews[i].key = keys[i];
            }
            console.log(Reviews);
          array = array.concat(Reviews);
          setList(array);    
        }})
      });
    }, [props]);

  const keyExtractor = (item) => {
    return item.ReviewId;
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
