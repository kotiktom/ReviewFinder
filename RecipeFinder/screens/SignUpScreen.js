import React, { useState } from "react";
import { View, ImageBackground } from "react-native";
import { Input, Button, Text } from 'react-native-elements';
import firebase from "firebase";

export default function SignUpScreen(props) {
const { navigate } = props.navigation;
const [email, setEmail] = useState("");
const [error, setError] = useState("");
const [password, setPassword] = useState("");

// Create new user to Firebase.
const HandleSignUp = () => {
    firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        try {
          var user = firebase.auth().currentUser;
          user.sendEmailVerification();
          navigate("Login");
        } catch (err) {
          console.log("Error on email sending", err);
        }
      })
      .catch((error) => setError(error.message));
  };

  return (
      <View>
       <ImageBackground source={{uri: 'https://i.pinimg.com/236x/1d/e7/33/1de7332240c373a99f7317900b9bf431.jpg'}} style={{width: '100%', height: '100%'}}>
        {error ? <Text>error</Text> : null}
          <Input
            placeholder="Email"
            label="Email"
            onChangeText={(email) => setEmail(email)}
            value={email}
          />
          <Input
            placeholder="Password"
            label="Password"
            onChangeText={(password) => setPassword(password)}
            value={password}
            secureTextEntry
          />
          <Button title={"Sign up"} onPress={HandleSignUp}>
          </Button>
          </ImageBackground>
      </View>
  )
}