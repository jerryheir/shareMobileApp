import React from 'react';
import {View, Text, StyleSheet, Animated, Dimensions, PanResponder, TouchableOpacity } from 'react-native';
import SwipeOut from "react-native-swipeout";
import { Icon } from "native-base";

const {width} = Dimensions.get('window');

export default class SwipeListAtom extends React.PureComponent {
  constructor(props) {
    super(props);

    this.gestureDelay = -35;
    this.scrollViewEnabled = true;

    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx > 35) {
          this.setScrollViewEnabled(false);
          let newX = gestureState.dx + this.gestureDelay;
          position.setValue({x: newX, y: 0});
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < 150) {
          Animated.timing(this.state.position, {
            toValue: {x: 0, y: 0},
            duration: 150,
          }).start(() => {
            this.setScrollViewEnabled(true);
          });
        } else {
          Animated.timing(this.state.position, {
            toValue: {x: width, y: 0},
            duration: 300,
          }).start(() => {
            this.props.success(this.props.text);
            this.setScrollViewEnabled(true);
          });
        }
      },
    });

    this.panResponder = panResponder;
    this.state = {position, close: false};
  }

  setScrollViewEnabled = (enabled) => {
    if (this.scrollViewEnabled !== enabled) {
      this.props.setScrollEnabled(enabled);
      this.scrollViewEnabled = enabled;
    }
  }

  render() {
    const swipeoutBtns = [
        {
            component: (
                <TouchableOpacity style={{ 
                    backgroundColor: 'red', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    height: 80
                }}
                onPress={()=> {
                    alert('Button Clicked!!!');
                    this.setState({ close: true })
                }}
                >
                    <Icon type={"EvilIcons"} name="trash" style={{ color: '#FFF', padding:21 }} />
                </TouchableOpacity>
            )
        }
    ];
      
    return (
      <SwipeOut 
      style={[styles.listItem, { backgroundColor: this.props.backgroundColor }]}
      right={swipeoutBtns}
      autoClose={true}
      close={this.state.close}
      onOpen={()=> this.setState({ close: false })}
      >
        <TouchableOpacity
        onLongPress={this.props.onLongPress}
        onPressOut={this.props.onPressOut}
        style={{ height: 80, justifyContent: 'center', paddingLeft: 21 }}
        >
            <Text style={{ color: this.props.isActive ? 'transparent' : '#000' }}>
              {this.props.label}
            </Text>
        </TouchableOpacity>
      </SwipeOut>
    );
  }
}

const styles = StyleSheet.create({
    listItem: {
      height: 80,
      justifyContent: 'center',
      backgroundColor: '#BE64FF',
    },
    absoluteCell: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      width: 100,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    absoluteCellText: {
      margin: 16,
      color: '#FFF',
    },
    innerCell: {
      width: width,
      height: 80,
      marginLeft: 100,
      backgroundColor: 'yellow',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });