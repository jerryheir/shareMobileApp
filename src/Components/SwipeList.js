import React, { Component } from 'react'
import { Text, View, Dimensions, FlatList, TouchableOpacity } from 'react-native'
import SwipeListAtom from './SwipeListAtom';
import { Icon } from 'native-base';

console.disableYellowBox = true;
const {width} = Dimensions.get('window');

export default class SwipeList extends Component {
    state = {
        enable: true,
        data: [
          {
            key: '0',
            price: '2000',
            proName: 'Desmond Tutu',
            status: 'In Transit',
            category: 'Plumbing Services'
          },
          {
              key: '1',
              price: '2000',
              proName: 'Oluwajibidi Seyilawyer',
              status: 'Investigating',
              category: 'Carpentry Services'
          },
          {
            key: '2',
            price: '1000',
            proName: 'James Comey',
            status: 'In transit',
            category: 'Carpentry Services'
        }
        ],
        order: '0',
        expand: false,
        show: true
    }

    success = (key) => {
        const data = this.state.data.filter(item => item.key !== key);
        this.setState({
          data,
        });
    }

    onLongPress = (key) => {
      console.log(key)
        let array = [];
        let res = this.state.data.filter((_, i) => _.key !== key);
        let obj = this.state.data.filter((_, i) => _.key === key);
        this.setState({ data: [...obj, ...res], order: key }, 
        ()=>{
            this.state.data.map((val, key)=>{
                array.push({ key: key.toString(), proName: val.proName, status: val.status, category: val.category })
            })
            this.setState({ data: array, order: array[0].key })
        })
    }

    _renderRow = ({ item }) => {
      const data = item;
        return (
            <SwipeListAtom
            data={data}
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
            const { proName, category, status } = val;
            array.push({ key: key.toString(), proName, category, status })
        })
        this.setState({ data: array, show: (array && array.length) ? true : false }, ()=> {
            this.setState({ order: (array && array.length) ? this.state.data[0].key : '0' })
        })
    }
    ChangeColorFunction = () => {
      let ColorCode = 'rgb(' + (Math.floor(Math.random() * 250)) + ',' + (Math.floor(Math.random() * 100)) + ',' + (Math.floor(Math.random() * 250 )) + ')';
      return ColorCode
    }

    display = () => {
        if (this.state.show && this.state.data.length === 1) {
          return (
            <View style={{ backgroundColor: '#FFF', paddingTop: 11, paddingBottom: 11 }}>
              <FlatList
              style={{ flexGrow: 0 }}
              data={this.state.data}
              renderItem={this._renderRow}
              />
            </View>
          )
        } else if (this.state.show && this.state.data.length > 1) {
          return (
            <View style={{ backgroundColor: '#FFF', paddingTop: 11, paddingBottom: 8 }}>
              <FlatList
              style={{ flexGrow: 0 }}
              data={this.state.expand ? this.state.data : this.state.data.filter((val, key)=> key === 0)}
              renderItem={this._renderRow}
              overScrollMode={false}
              />
              <View style={{ 
                height: 1, 
                width: Dimensions.get('window').width - 150, 
                alignSelf: 'center', 
                borderBottomColor: '#c0c0c0', 
                borderBottomWidth: 1,
                marginTop: 8
              }} />
              <View style={{
                minHeight: 40,
                flexDirection: 'row', 
                paddingHorizontal: 21,
                alignItems: 'center'
              }}>
                <View
                style={{ flex: .2, flexDirection: 'row', height: 30, alignItems: 'center' }}
                >
                  {
                    this.state.data.map((value, key)=>{
                      if (key !== 0){
                      return(
                      <View style={{ 
                        position: 'absolute', 
                        top: 2, 
                        left: 11 * (key - 1), 
                        backgroundColor: this.ChangeColorFunction(), 
                        height: 25, 
                        width: 25, 
                        borderRadius: 12,
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Text style={{ color: '#FFF' }}>{value.proName.charAt(0).toUpperCase()}</Text>
                      </View>)
                      }
                    })
                  }
                </View>
                <View
                style={{ flexDirection: 'row', height: 30, alignItems: 'center',flex: .65 }}
                >
                  <Text style={{ fontSize: 10 }}>{this.state.data.length - 1}+</Text>
                  <Text style={{ fontSize: 10 }}>more professionals</Text>
                </View>
                <TouchableOpacity 
                style={{ flexDirection: 'row', height: 30, alignItems: 'center', flex: .2 }}
                onPress={()=>{
                  this.setState({ expand: !this.state.expand })
                }}
                >
                  <Text style={{ fontSize: 10, textAlign: 'right' }}>{this.state.expand ? 'Collapse' : 'Expand'}</Text>
                  <Icon
                  type={'MaterialIcons'}
                  name={!this.state.expand ? 'arrow-drop-down' : 'arrow-drop-up'}
                  style={{ color: '#696969', alignSelf: 'flex-end' }}
                  />
                </TouchableOpacity>
              </View>
            </View>
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
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', backgroundColor: '#c0c0c0' }}>
        {this.display()}
      </View>
    )
  }
}

