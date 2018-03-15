'use strict'
import React, { Component } from 'react'
import axios from 'axios'
import Realm from 'realm'
import { itemsRealm, pickingRealm } from '../../realm/schema'
import { AppRegistry, StyleSheet, NativeModules, DeviceEventEmitter, Alert, View, BackHandler } from 'react-native'
import { Container, Content, StyleProvider, Header, Left, Body, Right } from 'native-base'
import { Button, Title, Text, Icon } from 'native-base'
import { NavigationActions, withNavigation } from 'react-navigation'
import { loadToken } from '../../lib'
import config from '../../config'
import Toast from 'react-native-root-toast'
import getTheme from '../../nativeBase/components'
import material from '../../nativeBase/variables/material'

class PickingEnd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sticu: '',
      ststop: '',
      staddj: '',
      isSubmiting: false,
    }
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => this.cancelPicking())
    this.getPickingInfo()
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () => { })
  }

  getPickingInfo() {
    let realm = new Realm({ schema: [pickingRealm, itemsRealm] })
    let data = realm.objects(pickingRealm.name)
    this.setState({ 
      sticu: data[0].sticu,
      ststop: data[0].ststop,
      staddj: data[0].staddj,
    }, () => realm.close())
  }

  cancelPicking() {
    Alert.alert(
      '放棄揀料',
      '您確定要放棄揀料？此動作會清除本機上的揀料記錄',
      [
        { text: '確定', onPress: () => this.goBackPicking() },
        { text: '取消', onPress: () => null },
      ],
      { cancelable: false }
    )
    return true
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

  pickingEnd() {
    this.setState({ isSubmiting: true })
    const { sticu, ststop } = this.state
    const self = this
    let formData = new FormData()
    formData.append('stop', ststop)
    formData.append('date', config.date)
    let token = loadToken()
    const Auth = 'Bearer ' + token;
    axios.post(config.route.pickingEnd, formData, { headers: { Authorization: Auth } })
      .then(function (response) {
        if (response.code = 200) {
          alert('單號:' + sticu + ', 站碼:' + ststop + ' 已完成鍊料')
          self.goBackPicking()
        } else {
          alert(response.data.error)
          self.setState({ isSubmiting: false })
        }
      }).catch(function (error) {
        alert(error)
        self.setState({ isSubmiting: false })
      })
  }

  removePicking() {
    let realm = new Realm({ schema: [pickingRealm, itemsRealm] })
    realm.write(() => {
      let deletePicking = realm.objects(pickingRealm.name)
      realm.delete(deletePicking)
      let deleteItems = realm.objects(itemsRealm.name)
      realm.delete(deleteItems)
    })
    realm.close()
  }

  submitButton() {
    if (this.state.isSubmiting) {
      return (
        <Button block disabled style={{ margin: 10 }}>
          <Text>處理中...</Text>
        </Button>
      )
    } else {
      return (
        <Button block primary onPress={this.pickingEnd.bind(this)} style={{ margin: 10 }}>
          <Text>完成揀料</Text>
        </Button>
      )
    }
  }

  render() {
    const { state } = this.props.navigation;
    const { ststop, sticu, staddj } = this.state
    return (
      <StyleProvider style={getTheme(material)} >
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={this.cancelPicking.bind(this)} style={{ width: 50 }}>
                <Icon name='md-close' />
              </Button>
            </Left>
            <Body>
              <Title>完成揀料</Title>
            </Body>
          </Header>
          <Content style={styles.content}>
            {ststop !== '' &&
              <View>
                <Text style={styles.pickingInfo}>{'揀料單號:' + sticu}</Text>
                <Text style={styles.pickingInfo}>{'站碼:' + ststop}</Text>
                <Text style={styles.pickingInfo}>{'日期:' + staddj.substring(0, 10)}</Text>
                <Text style={styles.message}>
                  所有品項已完成，按下按鈕完成揀料...
                </Text>
                {this.submitButton()}
              </View>
            }
          </Content>
        </Container>
      </StyleProvider>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  pickingInfo: {
    fontSize: 20,
  },
  message: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 16,
  },
});

export default withNavigation(PickingEnd)
AppRegistry.registerComponent('PickingEnd', () => PickingEnd);