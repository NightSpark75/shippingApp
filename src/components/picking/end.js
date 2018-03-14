'use strict'
import React, { Component } from 'react'
import Realm from 'realm'
import { itemsRealm, pickingRealm } from '../../realm/schema'
import { AppRegistry, StyleSheet, NativeModules, DeviceEventEmitter, Alert } from 'react-native'
import { Container, Content, StyleProvider, Header, Left, Body, Right } from 'native-base'
import { Button, Title, Text, Icon } from 'native-base'
import { NavigationActions, withNavigation } from 'react-navigation'
import { removePicking, removeItems } from '../../lib'
import Toast from 'react-native-root-toast'
import getTheme from '../../nativeBase/components'
import material from '../../nativeBase/variables/material'

class PickingEnd extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
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
    realm.close()
  }

  render() {
    const { state } = this.props.navigation;
    return (
      <StyleProvider style={getTheme(material)} >
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={this.cancelPicking.bind(this)}>
                <Icon name='ios-trash' />
              </Button>
            </Left>
            <Body>
              <Title>完成揀料</Title>
            </Body>
            <Right>
            </Right>
          </Header>
          <Content>
            <Text>完成!!</Text>
          </Content>
        </Container>
      </StyleProvider>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    padding: 10
  },
});

export default withNavigation(PickingEnd)
AppRegistry.registerComponent('PickingEnd', () => PickingEnd);