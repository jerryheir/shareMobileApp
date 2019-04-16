import React, { Component } from 'react';
import { View } from 'react-native';
import SwipeList from './src/Components/SwipeList';

export default class App extends Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#c0c0c0', justifyContent: 'flex-end' }}>
          <SwipeList />
      </View>
    )
  }
}
