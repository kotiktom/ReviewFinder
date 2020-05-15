import * as React from 'react';
import { View  } from 'react-native';
import { Image, Tile } from 'react-native-elements';

export default function ReviewComponent(props, navigate) {

const HandleNavigation = () => {
    navigate("SingleReview", props);
}

return (
<Tile
imageSrc={{uri: props.item.imagePath}}
captionStyle={{color: 'black'}}
title={props.item.title}
onPress={HandleNavigation}
/>
)}