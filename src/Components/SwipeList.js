import React, { Component } from 'react'
import { Text, View, Alert, TouchableOpacity, Dimensions, Platform, Animated, Easing, StyleSheet } from 'react-native'
import DraggableFlatList from 'react-native-draggable-flatlist'
import SwipeListAtom from './SwipeListAtom';
import SortableList from "react-native-sortable-list";
import SwipeOut from "react-native-swipeout";
import { Icon } from "native-base";

const {width} = Dimensions.get('window');
console.disableYellowBox = true;

export default class SwipeList extends Component {
    state = {
        enable: true,
        data: [
            {
                key: '0',
                color: 'blue',
                label: 'Desmond Tutu',
                status: 'In Transit',
                profession: 'Plumbing Services'
            },
            {
                key: '1',
                color: 'red',
                label: 'Oluwajibidi Seyilawyer',
                status: 'Investigating',
                profession: 'Carpentry Services'
            },
            {
                key: '2',
                color: 'blue',
                label: 'Friends and foes',
                status: 'Arrived',
                profession: 'Carpentry Services'
            },
            {
                key: '3',
                color: 'green',
                label: 'Jeremiah Nwaeze',
                status: 'On the job',
                profession: 'Electrical Works'
            },
            {
                key: '4',
                color: '#BE64FF',
                label: 'Promise Tochi',
                status: 'Completed',
                profession: 'Plumbing Services'
            },
            {
                key: '5',
                color: '#c0c0c0',
                label: 'Amadikwa Chinedu',
                status: 'In Transit',
                profession: 'Electrical Works'
            }
        ],
        order: '0',
        show: true
    }

    success = (key) => {
        const data = this.state.data.filter(item => item.key !== key);
        this.setState({
          data,
        });
      }
    
      setScrollEnabled = (enable) => {
        this.setState({
          enable,
        });
      }

    renderItem = ({ item, index, move, moveEnd, isActive }) => {
        return (
            <SwipeListAtom
            success={this.success}
            setScrollEnabled={enable => this.setScrollEnabled(enable)}
            label={item.label}
            onLongPress={move}
            onPressOut={moveEnd}
            backgroundColor={isActive ? 'transparent' : '#BE64FF'}
            isActive={isActive}
            />
        )
    }
    onLongPress = (key) =>{
        let array = [];
        let res = this.state.data.filter((_, i) => _.key !== key);
        let obj = this.state.data.filter((_, i) => _.key === key);
        this.setState({ data: [...obj, ...res], order: key }, 
            ()=>{
                this.state.data.map((val, key)=>{
                    array.push({ key: key.toString(), label: val.label, status: val.status, color: val.color, profession: val.profession })
                })
                this.setState({ data: array, order: array[0].key })
            })
    }

    _renderRow = ({data, active}) => {
        return (
            <Row 
            data={data} 
            active={active} 
            remove={this.remove} 
            first={this.state.order} 
            onLongPress={this.onLongPress}
            />
        )
    }

    remove = async (key) => {
        let array = [];
        let res = this.state.data.filter((_, i) => _.key !== key);
        res.map((val, key)=>{
            array.push({ key: key.toString(), label: val.label })
        })
        this.setState({ data: array, show: (array && array.length) ? true : false }, ()=> {
            this.setState({ order: (array && array.length) ? this.state.data[0].key : '0' })
        })
        
    }

    display = () =>{
        if (this.state.show){
            return (
                <SortableList
                style={[styles.list, { maxHeight: Dimensions.get('window').height - Dimensions.get('window').height/2.7 }]}
                contentContainerStyle={styles.contentContainer}
                data={this.state.data}
                onChangeOrder={(order)=>{
                    this.setState({ order: order[0] })
                }}
                renderRow={this._renderRow} />
            )
        } else {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 42}}>
                    <Text style={{ textAlign: 'center' }}>You cancelled all bookings</Text>
                </View>
            )
        }
    }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#F2F2F2' }}>
        {this.display()}
      </View>
    )
  }
}

class Row extends Component {

    constructor(props) {
      super(props);
  
      this._active = new Animated.Value(0);
  
      this._style = {
        ...Platform.select({
          ios: {
            transform: [{
              scale: this._active.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.1],
              }),
            }],
            shadowRadius: this._active.interpolate({
              inputRange: [0, 1],
              outputRange: [2, 10],
            }),
          },
  
          android: {
            transform: [{
              scale: this._active.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.07],
              }),
            }],
            elevation: this._active.interpolate({
              inputRange: [0, 1],
              outputRange: [2, 6],
            }),
          },
        })
      };
      this.state = {
        close: false
      }
    }
  
    componentWillReceiveProps(nextProps) {
      if (this.props.active !== nextProps.active) {
        Animated.timing(this._active, {
          duration: 300,
          easing: Easing.bounce,
          toValue: Number(nextProps.active),
        }).start();
      }
    }
  
    render() {
     const {data, active, first} = this.props;
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
                        {cancelable: false},
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
        <Animated.View style={[
          styles.row,
          this._style,
        ]}>
            <SwipeOut 
            style={[{ flex: 1, backgroundColor: active || (first.toString() === data.key) ? '#BE64FF' : '#FFF', width: width - 87, borderTopLeftRadius: 7, borderBottomLeftRadius: 7,  }]}
            left={swipeoutBtns}
            autoClose={true}
            close={this.state.close}
            onOpen={()=> this.setState({ close: false })}
            buttonWidth={50}
            >
                <TouchableOpacity
                onLongPress={()=>this.props.onLongPress(data.key)}
                style={{ height: 55, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 11 }}
                >
                    <View style={{ flex: .2 }}>
                        <View style={{ 
                            backgroundColor: data.color, 
                            height: 40, 
                            width: 40, 
                            borderRadius: 18,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Text style={{ color: '#FFF' }}>{data.label.charAt(0)}</Text>
                        </View>
                    </View>
                    <View style={{ flex: .5, justifyContent: 'space-between', height: 50 }}>
                        <View>
                            <Text style={{ fontSize: 10, color: active || (first.toString() === data.key)   ?  '#FFF' : '#000' }}>
                                {data.label.substring(0,20)}
                            </Text>
                            <Text style={{ fontWeight: '200', fontSize: 8, color: active || (first.toString() === data.key)   ?  '#FFF' : '#000' }}>
                                {data.profession}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', }}>
                            <Icon 
                            name="md-call"
                            style={{ fontSize: 18, color: active || (first.toString() === data.key)   ? '#FFF' : '#828282', }}
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
                                    {cancelable: false},
                                  );
                            }}
                            />
                            <Icon 
                            type={'Entypo'}
                            name="chat"
                            style={{ marginLeft: 63, fontSize: 16, color: active || (first.toString() === data.key)   ? '#FFF' : '#828282', }}
                            onPress={()=>console.log('Chat clicked')}
                            />
                        </View>
                    </View>
                    <View style={{ flex: .3 }}>
                        <Text style={{ textAlign: 'right', fontSize: 10, color: active || (first.toString() === data.key)   ?  '#FFF' : '#000' }}>
                            {data.status}
                        </Text>
                    </View>
                </TouchableOpacity>
            </SwipeOut>
            <View style={{ 
                backgroundColor: '#F2F2F2', 
                width: 50, 
                height: 55, 
                justifyContent: 'center', 
                alignItems: 'center',
                borderTopRightRadius: 7,
                borderBottomRightRadius: 7,
            }}>
                <Icon type="MaterialIcons" name="drag-handle" style={{ fontSize: 30, color: '#696969' }} />
            </View>
        </Animated.View>
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#eee',
  
      ...Platform.select({
        ios: {
          paddingTop: 20,
        },
      }),
    },
  
    title: {
      fontSize: 20,
      paddingVertical: 20,
      color: '#999999',
    },
  
    list: {
      flex: 1,
    },
  
    contentContainer: {
      width: width,
  
      ...Platform.select({
        ios: {
          paddingHorizontal: 0,
        },
  
        android: {
          paddingHorizontal: 0,
        }
      })
    },
  
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      backgroundColor: '#fff',
      padding: 0,
      height: 55,
      flex: 1,
      marginTop: 5,
      marginBottom: 10,
      borderRadius: 7,
  
      ...Platform.select({
        ios: {
          width: width - 42,
          shadowColor: 'rgba(0,0,0,0.2)',
          shadowOpacity: 1,
          shadowOffset: {height: 2, width: 2},
          shadowRadius: 2,
        },
  
        android: {
          width: width - 42,
          elevation: 0,
          marginHorizontal: 30,
        },
      })
    },
  
    image: {
      width: 50,
      height: 50,
      marginRight: 30,
      borderRadius: 25,
    },
  
    text: {
      fontSize: 24,
      color: '#222222',
    },
  });
