import React, { Component } from 'react'
import { Text, View, Alert, TouchableOpacity, Dimensions, Animated, Easing, StyleSheet } from 'react-native'
import SwipeOut from "react-native-swipeout";
import { Icon } from "native-base";

const {width} = Dimensions.get('window');

export default class SwipeListAtom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      close: false
    }
  }

  render() {
   const {data, first} = this.props;
   const swipeoutBtns = [
      {
          component: (
              <TouchableOpacity style={{ 
                  backgroundColor: 'red',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 55
              }}
              onPress={()=> {
                  Alert.alert(
                      'Hello Customer',
                      'Are you sure you want to cancel this booking?',
                      [
                        {
                          text: 'No',
                          onPress: () => this.setState({ close: true }),
                          style: 'cancel',
                        },
                        {text: 'Yes', onPress: () => {
                            this.props.remove(data.key)
                        }},
                      ],
                      { cancelable: false }
                    );
              }}
              >
                  <Text style={{ color: '#FFF', fontSize: 8 }}>CANCEL</Text>
                  <Text style={{ color: '#FFF', fontSize: 8 }}>BOOKING</Text>
              </TouchableOpacity>
          )
      }
  ];

    return (
      <View style={[
        styles.row
      ]}>
          <SwipeOut 
          style={[{ flex: 1, backgroundColor: (first.toString() === data.key) ? '#FFF' : '#FFF' }]}
          left={swipeoutBtns}
          autoClose={true}
          close={this.state.close}
          onOpen={()=> this.setState({ close: false })}
          buttonWidth={50}
          >
              <TouchableOpacity
              onPress={()=>this.props.onLongPress(data.key)}
              style={{ height: 55, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 21 }}
              >
                  <View style={{ flex: .2 }}>
                      <View style={{ 
                          backgroundColor: '#5F9EA0', 
                          height: 45, 
                          width: 45, 
                          borderRadius: 22,
                          alignItems: 'center',
                          justifyContent: 'center'
                      }}>
                          <Text style={{ color: '#FFF' }}>{data.proName.charAt(0)}</Text>
                      </View>
                  </View>
                  <View style={{ flex: .5, justifyContent: 'space-between', height: 50 }}>
                      <View>
                          <Text style={{ fontSize: 10, color: (first.toString() === data.key)   ?  '#000' : '#000' }}>
                              {data.proName.substring(0,20)}
                          </Text>
                          <Text style={{ fontWeight: '200', fontSize: 8, color: (first.toString() === data.key)   ?  '#000' : '#000' }}>
                              {data.category}
                          </Text>
                      </View>
                      <View style={{ flexDirection: 'row', }}>
                          <Icon 
                          name="md-call"
                          style={{ fontSize: 18, color: (first.toString() === data.key)   ? '#000' : '#828282', }}
                          onPress={()=>{
                              Alert.alert(
                                  'Call Customer',
                                  '+2347062951438',
                                  [
                                    {
                                      text: 'No',
                                      onPress: () => this.setState({ close: true }),
                                      style: 'cancel',
                                    },
                                    {text: 'Yes', onPress: () => {
                                          this.setState({ close: true })
                                    }},
                                  ],
                                  { cancelable: false },
                                );
                          }}
                          />
                          <Icon 
                          type={'Entypo'}
                          name="chat"
                          style={{ marginLeft: 63, fontSize: 16, color: (first.toString() === data.key)   ? '#000' : '#828282', }}
                          onPress={()=>console.log('Chat clicked')}
                          />
                      </View>
                  </View>
                  <View style={{ flex: .3 }}>
                      <Text style={{ textAlign: 'right', fontSize: 10, color: (first.toString() === data.key)   ?  '#BE64FF' : '#000' }}>
                          {data.status}
                      </Text>
                  </View>
              </TouchableOpacity>
          </SwipeOut>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 0,
    height: 55,
    flex: 1,
    marginTop: 0,
    marginBottom: 0,
    width: width
  }
});