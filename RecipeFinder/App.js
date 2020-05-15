import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SplashScreen } from 'expo';
import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View, Button } from 'react-native';
import firebase from 'firebase';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import LinkingConfiguration from './navigation/LinkingConfiguration';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import SingleRecipe from './screens/SingleRecipeScreen'
import EditScreen from './screens/EditReviewScreen'
import AddScreen from './screens/AddNewScreen'
const Stack = createStackNavigator();

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  var config = {
    apiKey: "AIzaSyDKNWLf2e-ngezgd7faaBba6Ja7isdrpIE",
    authDomain: "1:743043838068:web:80596d54a43d9e95c32121.firebaseapp.com",
    databaseURL: "https://recipefinder2020.firebaseio.com/",
    storageBucket: "gs://recipefinder2020.appspot.com"
  };
  
  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
        firebase.initializeApp(config);
        setLoadingComplete(true);
      }
    loadResourcesAndDataAsync();
    console.disableYellowBox = true;

  }, []);




  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
        <NavigationContainer linking={LinkingConfiguration}>
          <Stack.Navigator initialRouteName={"Root"}>
            <Stack.Screen name="Root" options={{headerLeft: null, headerTitle: null }} component={BottomTabNavigator} />
            <Stack.Screen name="Login" options={{headerLeft: null, headerTitle: null}} component={LoginScreen} />
            <Stack.Screen name="SingleReview" options={({ route }) => ({ title: route.params.item.title } )} component={SingleRecipe} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerTitle: null}} />
            <Stack.Screen name="Edit" component={EditScreen} options={{ headerTitle: null}} />
            <Stack.Screen name="AddNewScreen" component={AddScreen} options={{ headerTitle: null}} />

          </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
