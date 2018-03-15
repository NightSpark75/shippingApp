'use strict'
import React, { Component } from 'react'
import Realm from 'realm'
import { itemsRealm, pickingRealm } from '../../realm/schema'
import { AppRegistry, StyleSheet, NativeModules, DeviceEventEmitter, Alert, BackHandler } from 'react-native'
import { Container, Content, StyleProvider, Header, Left, Body } from 'native-base'
import { Button, Title, Text, Icon, Item, Input, Label } from 'native-base'
import { NavigationActions, withNavigation } from 'react-navigation'
import { toast } from '../../lib'
import getTheme from '../../nativeBase/components'
import material from '../../nativeBase/variables/material'

const ScanModule = NativeModules.ScanModule
const msgOption = ['儲位', '料號', '批號']

class PickingItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      pslocn: '',
      pickValue: [],
      pssoqs: 0,
      psuom: '',
      scan: 0,
      scanStyle_0: styles.scanInfo,
      scanStyle_1: styles.scanInfo,
      scanStyle_2: styles.scanInfo,
      s_pssoqs: '',
      passing: true,
      message: '',
    };
  }

  componentDidMount() {
    let items = this.getAllItems()
    this.setState({ items: items }, () => {
      this.checkFinished()
      BackHandler.addEventListener('hardwareBackPress', () => this.cancelPicking())
      DeviceEventEmitter.addListener('onScanBarcode', this.onScanBarcode.bind(this))
      DeviceEventEmitter.addListener('onRefreshMessage', (msg) => toast(msg))
      ScanModule.enabledScan()
    })
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress')
    DeviceEventEmitter.removeListener('onScanBarcode')
    DeviceEventEmitter.removeListener('onRefreshMessage')
    ScanModule.disabledScan()
  }

  onScanBarcode(code) {
    const { scan, pickValue } = this.state
    if (code === pickValue[scan].trim() && scan < 3) {
      this.setState({
        ['scanStyle_' + scan]: styles.scanInfoSuccess,
        scan: scan + 1,
        message: '',
      })
    }
    if (code !== pickValue[scan].trim() && scan < 3) {
      this.setState({ message: msgOption[scan] + '錯誤(' + code + ')' })
    }
  }

  checkAmt() {
    const { s_pssoqs, pssoqs } = this.state
    if (Number(s_pssoqs) === Number(pssoqs)) {
      this.setState({
        passing: true,
        message: '',
      })
    } else {
      this.setState({
        passing: false,
        message: '揀貨數量錯誤' + s_pssoqs
      })
    }
  }

  getAllItems() {
    let realm = new Realm({ schema: [pickingRealm, itemsRealm] })
    let data = realm.objects(itemsRealm.name)
    let items = []
    data.map((item) => items.push(item))
    realm.close()
    return items
  }

  cancelPicking() {
    Alert.alert(
      '放棄揀貨',
      '您確定要放棄揀貨？此動作會清除本機上的揀貨記錄',
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

  picked() {
    const { pickValue } = this.state
    let realm = new Realm({ schema: [pickingRealm, itemsRealm] })
    realm.write(() => {
      let obj = realm.objects(itemsRealm.name)
      let data = obj.filtered('psrmk == "' + pickValue[0] + '" AND pslitm == "' + pickValue[1] + '" AND pslotn == "' + pickValue[2] + '"')
      data[0].picked = 1
    })
    realm.close()
    this.checkFinished()
  }

  checkFinished() {
    const { items } = this.state
    let realm = new Realm({ schema: [pickingRealm, itemsRealm] })
    let obj = realm.objects(itemsRealm.name)
    let data = obj.filtered('picked == 0')
    if (data.length > 0) {
      let pickValue = []
      pickValue.push(data[0].psrmk)
      pickValue.push(data[0].pslitm)
      pickValue.push(data[0].pslotn)
      this.setState({
        pslocn: data[0].pslocn,
        pickValue: pickValue,
        pssoqs: data[0].pssoqs,
        psuom: data[0].psuom,
        scan: 0,
        scanStyle_0: styles.scanInfo,
        scanStyle_1: styles.scanInfo,
        scanStyle_2: styles.scanInfo,
        s_pssoqs: '',
        passing: false,
      })
      realm.close()
      return
    }
    realm.close()
    this.goPickingEnd()
  }

  goPickingEnd() {
    const navigationAction = NavigationActions.navigate({
      routeName: 'PickingEnd',
    })
    this.props.navigation.dispatch(navigationAction)
  }

  render() {
    const { items, scan, passing, pickValue, s_pssoqs, message } = this.state
    return (
      <StyleProvider style={getTheme(material)} >
        {pickValue.length === 0 ?
          <Container>
            <Header>
              <Left>
                {/*
                <Button transparent onPress={this.cancelPicking.bind(this)} style={{ width: 50 }}>
                  <Icon name='md-close' />
                </Button>
                */}
              </Left>
              <Body>
                <Title style={{ width: 100 }}>揀貨作業</Title>
              </Body>
            </Header>
            <Content style={styles.content}>
              <Text style={styles.pickingInfo}>資料處理中...</Text>
            </Content>
          </Container>
          :
          <Container>
            <Header>
              <Left>
                <Button transparent onPress={this.cancelPicking.bind(this)} style={{ width: 50 }}>
                  <Icon name='md-close' />
                </Button>
              </Left>
              <Body>
                <Title style={{ width: 100 }}>揀貨作業</Title>
              </Body>
            </Header>
            <Content style={styles.content}>
              <Text style={styles.pickingInfo}>{'倉別: ' + this.state.pslocn.trim()}</Text>
              <Text style={this.state.scanStyle_0}>{'儲位: ' + pickValue[0].trim()}</Text>
              <Text style={this.state.scanStyle_1}>{'料號: ' + pickValue[1].trim()}</Text>
              <Text style={this.state.scanStyle_2}>{'批號: ' + pickValue[2].trim()}</Text>
              <Text style={styles.pickingInfo}>{'揀貨數量: ' + this.state.pssoqs + ' ' + this.state.psuom.trim()}</Text>
              {scan === 3 && !passing &&
                <Item floatingLabel>
                  <Label>輸入揀貨數量</Label>
                  <Input
                    keyboardType="numeric"
                    onChange={(e) => this.setState({ s_pssoqs: e.nativeEvent.text })}
                    autoFocus={true}
                    value={s_pssoqs.toString()}
                    onSubmitEditing={() => this.checkAmt()}
                  />
                </Item>
              }
              {message !== '' &&
                <Text style={styles.message}>{message}</Text>
              }
              {passing &&
                <Button block primary large onPress={this.picked.bind(this)}>
                  <Text>確認</Text>
                </Button>
              }
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
  scanInfo: {
    fontSize: 20,
    fontWeight: '400',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#f0ad4e',
    borderRadius: 1,
    padding: 5,
    marginTop: 2,
    marginBottom: 3,
  },
  scanInfoSuccess: {
    fontSize: 20,
    fontWeight: '400',
    borderStyle: 'solid',
    borderWidth: 4,
    borderColor: '#36D025',
    borderRadius: 1,
    padding: 5,
    marginTop: 2,
    marginBottom: 3,
  },
  pickingInfo: {
    fontSize: 20,
    fontWeight: '400',
    padding: 5,
    marginTop: 2,
    marginBottom: 3,
  },
  message: {
    fontSize: 20,
    color: '#f0ad4e',
    marginTop: 20,
    marginBottom: 20,
  }
});

export default withNavigation(PickingItems)
AppRegistry.registerComponent('PickingItems', () => PickingItems);