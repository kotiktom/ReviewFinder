import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import * as firebase from 'firebase';
import { View } from 'react-native';
import { SearchBar } from 'react-native-elements';

import TabBarIcon from '../components/TabBarIcon';
import AllReviews from '../screens/AllReviewsScreen';
import UserReviews from '../screens/UserReviewsScreen';
import RecipeMapScreen from '../screens/ReviewMapScreen'
import { Button,  } from 'react-native-elements';

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator(props) {
  const {navigate} = props.navigation;
  props.navigation.setOptions({headerRight: () => <View style={{padding: 5}}><Button title={"New"} onPress={AddNew}/></View>})
  props.navigation.setOptions({headerLeft: () =>  <View style={{padding: 5}}><Button title={"Logout"} onPress={Logout}/></View>})

  const Logout = () => {
    firebase.auth().signOut();
    navigate('Login');
  }
  const AddNew = () => {
    navigate('AddNewScreen');
  }

  return (
    <BottomTab.Navigator initialRouteName={"AllReviews"}>
      <BottomTab.Screen
        name="AllReviews"
        component={AllReviews}
        options={{
          title: 'Reviews',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-code-working" />,
        }}
      />
      <BottomTab.Screen
        name="UserReviews"
        component={UserReviews}
        options={{
          title: 'Your Reviews',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-book" />,
        }}
      />
      <BottomTab.Screen
        name="ReviewMap"
        component={RecipeMapScreen}
        options={{
          title: 'Review map',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-book" />,
        }}
      />
    </BottomTab.Navigator>
  );
}

