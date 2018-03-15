'use strict'
import React, { Component } from 'react'
import Realm from 'realm'
import { itemsRealm, pickingRealm } from '../../realm/schema'
import { AppRegistry, StyleSheet, NativeModules, DeviceEventEmitter, Alert, BackHandler } from 'react-native'
import { Container, Content, StyleProvider, Header, Left, Body, Right } from 'native-base'
import { Button, Title, Text, Icon } from 'native-base'
import { Form, Item, Input, Label } from 'native-base'
import { NavigationActions, withNavigation } from 'react-navigation'
import { toast, loadToken } from '../../lib'
import Toast from 'react-native-root-toast'
import getTheme from '../../nativeBase/components'
import material from '../../nativeBase/variables/material'

const ScanModule = NativeModules.ScanModule

class PickingItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      pslocn: '',
      psrmk: '',
      pslitm: '',
      pslotn: '',
      pssoqs: 0,
      psuom: '',
      scan: 1,
      s_psrmk: styles.scanInfo,
      s_pslitm: styles.scanInfo,
      s_pslotn: styles.scanInfo,
      s_pssoqs: '',
      passing: true,
      message: '',
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => this.cancelPicking())
    DeviceEventEmitter.addListener('onScanBarcode', this.onScanBarcode.bind(this))
    DeviceEventEmitter.addListener('onRefreshMessage', this.onUpdateMessage)
    ScanModule.enabledScan()
    let items = this.getAllItems()
    this.setState({ items: items }, () => this.checkFinished())
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () => { })
    DeviceEventEmitter.removeListener('onScanBarcode', this.onScanBarcode.bind(this))
    DeviceEventEmitter.removeListener('onRefreshMessage', this.onUpdateMessage)
    ScanModule.disabledScan()
  }

  onUpdateMessage = (str='') => {
    toast(str)
  }

  onScanBarcode(code) {
    const { scan, psrmk, pslitm, pslotn } = this.state
    if (scan === 1) {
      if (code === psrmk.trim()) {
        this.setState({
          s_psrmk: styles.scanInfoSuccess,
          scan: 2,
          message: '',
        })
      } else {
        this.setState({ message: '儲位錯誤(' + code + ')' })
      }
    }
    if (scan === 2) {
      if (code === pslitm.trim()) {
        this.setState({
          s_pslitm: styles.scanInfoSuccess,
          scan: 3,
          message: '',
        })
      } else {
        this.setState({ message: '料號錯誤(' + code + ')' })
      }
    }
    if (scan === 3) {
      if (code === pslotn.trim()) {
        this.setState({
          s_pslotn: styles.scanInfoSuccess,
          scan: 4,
          message: '',
        })
      } else {
        this.setState({ message: '批號錯誤(' + code + ')' })
      }
    }
  }

  onAmtChange(e) {
    this.setState({ s_pssoqs: e.nativeEvent.text })
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
    const { psrmk, pslitm, pslotn } = this.state
    let realm = new Realm({ schema: [pickingRealm, itemsRealm] })
    realm.write(() => {
      let obj = realm.objects(itemsRealm.name)
      let data = obj.filtered('psrmk == "' + psrmk + '" AND pslitm == "' + pslitm + '" AND pslotn == "' + pslotn + '"')
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
      this.setState({
        pslocn: data[0].pslocn,
        psrmk: data[0].psrmk,
        pslitm: data[0].pslitm,
        pslotn: data[0].pslotn,
        pssoqs: data[0].pssoqs,
        psuom: data[0].psuom,
        scan: 1,
        s_psrmk: styles.scanInfo,
        s_pslitm: styles.scanInfo,
        s_pslotn: styles.scanInfo,
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
    const { items, item, scan, passing, s_pslitm, s_pslotn, s_psrmk, s_pssoqs, message } = this.state
    return (
      <StyleProvider style={getTheme(material)} >
        {item === null ?
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
              <Text style={s_psrmk}>{'儲位: ' + this.state.psrmk.trim()}</Text>
              <Text style={s_pslitm}>{'料號: ' + this.state.pslitm.trim()}</Text>
              <Text style={s_pslotn}>{'批號: ' + this.state.pslotn.trim()}</Text>
              <Text style={styles.pickingInfo}>{'揀貨數量: ' + this.state.pssoqs + ' ' + this.state.psuom.trim()}</Text>
              {scan === 4 && !passing &&
                <Form>
                  <Item floatingLabel>
                    <Label>輸入揀貨數量</Label>
                    <Input
                      keyboardType="numeric"
                      onChange={this.onAmtChange.bind(this)}
                      autoFocus={true}
                      value={s_pssoqs.toString()}
                      onSubmitEditing={() => this.checkAmt()}
                    />
                  </Item>
                </Form>
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