import React, {useState, useEffect} from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Firebase from "firebase";


export default function LoginScreen(props) {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const { navigate } = props.navigation;

// Check if user is already logged in, if that is the case user is automaticly moved to 'Root'
useEffect(() => {
  async function CheckIfLoggedIn() {
    try {
      Firebase.auth().onAuthStateChanged(user => {
      user ? navigate("Root") : null;
      })

    } catch (e) {
      console.warn(e);
    }
  }
  CheckIfLoggedIn();
}, []);

  const signUp = () => {
    navigate("SignUp")
  }
  // Authorize with Firebase and check if user exists..
  const Authorize = () => {
    Firebase.auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => navigate("Root"))
    .catch(function(error) {

      console.log("error code: ", error.code);
      console.log("error message: ,", error.message);

    });
  }

  return (
    <View style={styles.container}>
    <ImageBackground source={{uri: 'https://i.pinimg.com/236x/1d/e7/33/1de7332240c373a99f7317900b9bf431.jpg'}} style={{width: '100%', height: '100%'}}>
    <Input placeholder="Email" label="Email"
    onChangeText={(firstname) => setEmail(firstname)}
    value={email}
    />
    <Input placeholder="Password" label="Password"
    onChangeText={(firstname) => setPassword(firstname)}
    value={password}
    />
    <Button raised onPress={Authorize}
    title="Login" />
    <Button raised onPress={signUp}
    title="Sign Up" />
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