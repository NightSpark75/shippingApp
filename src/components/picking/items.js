'use strict'
import React, { Component } from 'react'
import Realm from 'realm'
import { itemsRealm, pickingRealm } from '../../realm/schema'
import { AppRegistry, StyleSheet, NativeModules, DeviceEventEmitter, Alert } from 'react-native'
import { Container, Content, StyleProvider, Header, Left, Body, Right } from 'native-base'
import { Button, Title, Text, Icon } from 'native-base'
import { NavigationActions, withNavigation } from 'react-navigation'
import { loadToken } from '../../lib'
import Toast from 'react-native-root-toast'
import getTheme from '../../nativeBase/components'
import material from '../../nativeBase/variables/material'

let n = 0

class PickingItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      item: null,
      no: 0,
    };
  }

  componentDidMount() {
    let items = this.getAllItems()
    this.setState({ items: items }, () => this.checkFinished())
  }

  getAllItems() {
    let realm = new Realm({schema: [pickingRealm, itemsRealm]})
    let data = realm.objects(itemsRealm.name)
    //realm.close()
    return data
  }

  cancelPicking() {
    Alert.alert(
      '放棄揀料',
      '您確定要放棄揀料？此動作會清除本機上的揀料記錄',
      [
        {text: '確定', onPress: () => this.goBackPicking()},
        {text: '取消', onPress: () => null},
      ],
      { cancelable: false }
    )
  }

  goBackPicking() {
    return
    this.removePicking()
    const picking = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'PickingList',
        })
      ]
    })
    this.props.navigation.dispatch(picking)
  }

  removePicking() {
    let realm = new Realm({schema: [pickingRealm, itemsRealm]})
    realm.write(()=> {
      let deletePicking = realm.objects(pickingRealm.name)
      realm.delete(deletePicking)
      let deleteItems = realm.objects(itemsRealm.name)
      realm.delete(deleteItems)
    })
    //realm.close()
  }

  picked() {
    const { item } = this.state
    let realm = new Realm({schema: [pickingRealm, itemsRealm]})
    realm.write(() => {
      let obj = realm.objects(itemsRealm.name)
      let data = obj.filtered('psrmk == "' + item.psrmk + '" AND pslitm == "' + item.pslitm + '" AND pslotn == "' + item.pslotn + '"')
      data[0].picked = 1
    })
    //realm.close()
    //let items = realm.objects(itemsRealm.name)
    //this.setState({ items: items }, () => this.checkFinished())
    this.checkFinished()
  }

  checkFinished() {
    const { items } = this.state
    let realm = new Realm({schema: [pickingRealm, itemsRealm]})
    let obj = realm.objects(itemsRealm.name)
    let data = obj.filtered('picked == 0')
    if (data.length > 0) {
      this.setState({ item: data[0] })
      return
    }
    /*
    for (let i = 0; i < items.length; i++) {
      let item = items[i]
      if (item.picked === 0) {
        this.setState({ item: item, no: i++ })
        return
      }
    }
    */
    this.goPickingEnd()
  }

  goPickingEnd() {
    const navigationAction = NavigationActions.navigate({
      routeName: 'PickingEnd',
    })
    this.props.navigation.dispatch(navigationAction)
  }

  render() {
    const { items, item, no } = this.state
    return (
      <StyleProvider style={getTheme(material)} >
        {item === null ?
          <Container>
            <Header>
              <Left>
                <Button transparent onPress={this.cancelPicking.bind(this)}>
                  <Icon name='ios-trash' />
                </Button>
              </Left>
              <Body>
                <Title style={{ width: 100 }}>{'揀料作業'}</Title>
              </Body>
              <Right>
              </Right>
            </Header>
            <Content>
              <Text>資料處理中...</Text>
            </Content>
          </Container>
          :
          <Container>
            <Header>
              <Left>
                <Button transparent onPress={this.cancelPicking.bind(this)}>
                  <Icon name='ios-trash' />
                </Button>
              </Left>
              <Body>
                <Title style={{ width: 100 }}>{'揀料 品項' + no + '/' + items.length}</Title>
              </Body>
              <Right>
              </Right>
            </Header>
            <Content>
              <Text>{item.pslocn.trim()}</Text>
              <Text>{item.psrmk.trim()}</Text>
              <Text>{item.pslitm.trim()}</Text>
              <Text>{item.pslotn.trim()}</Text>
              <Text>{item.pssoqs + '/' + item.pspqoh + ' ' + item.psuom.trim()}</Text>
              <Button block primary onPress={this.picked.bind(this)} style={{ margin: 10 }}>
                <Text>確認</Text>
              </Button>
            </Content>
          </Container>
        }
      </StyleProvider>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    padding: 10
  },
});

export default withNavigation(PickingItems)
AppRegistry.registerComponent('PickingItems', () => PickingItems);