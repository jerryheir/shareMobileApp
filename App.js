import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import * as firebase from 'firebase';
import SwipeList from './src/Components/SwipeList';
import Drawer from "react-native-draggable-view";
import { Icon } from "native-base";

const config = {
  apiKey: "AIzaSyBk7zpKToQkbjqN6beYYO9puZsJU-Hskj0",
  authDomain: "workraven-4cae3.firebaseapp.com",
  databaseURL: "https://workraven-4cae3.firebaseio.com",
  projectId: "workraven-4cae3",
  storageBucket: "workraven-4cae3.appspot.com",
  messagingSenderId: "55823499582"
};
firebase.initializeApp(config);

export default class App extends Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#F2F2F2' }}>
        <Drawer
        initialDrawerSize={0.13}
        renderContainerView={() => (
            <View style={{ padding: 21, backgroundColor: 'pink', flex: 1 }} />
        )}
        renderDrawerView={() => (
            <SwipeList />
        )}
        finalDrawerHeight={Dimensions.get('window').height/3}
        renderInitDrawerView={() => (
            <View style={{ backgroundColor: '#F2F2F2' }}>
              <Icon type="MaterialIcons" name="drag-handle" style={{ fontSize: 30, color: '#696969', alignSelf: 'center', }} />
            </View>
        )}
        />
      </View>
    )
  }
}
