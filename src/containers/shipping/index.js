'use strict'
import React, { Component } from 'react'
import axios from 'axios'
import { AppRegistry, StyleSheet, NativeModules, DeviceEventEmitter, AppState } from 'react-native'
import { 
  StyleProvider, 
  Drawer, 
  Container, 
  Content, 
  Header, 
  Left, 
  Body, 
  View, 
  Button, 
  Title, 
  Text, 
  Label, 
  Input, 
  Item, 
  Icon 
} from 'native-base'
import { NavigationActions, withNavigation } from 'react-navigation'
import config from '../../config'
import { toast, loadToken } from '../../lib'
import getTheme from '../../nativeBase/components'
import material from '../../nativeBase/variables/material'
import Sidebar from '../sidebar'
import { savePieces, getShippingInfo } from '../../api'

const ScanModule = NativeModules.ScanModule

class Shipping extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isSuccess: false,
      isSubmit: false,
      shipping: {},
      pieces: null,
      message: '請掃描條碼查詢托運資料',
    }

    this.savePieces = this.savePieces.bind(this)
    this.getShippingInfo = this.getShippingInfo.bind(this)
    this.openDrawer = this.openDrawer.bind(this)
    this.closeDrawer = this.closeDrawer.bind(this)
  }

  componentDidMount() {
    AppState.addEventListener('change', this.thisAppState.bind(this))
    DeviceEventEmitter.addListener('onScanBarcode', this.getShippingInfo)
    DeviceEventEmitter.addListener('onRefreshMessage', (msg) => toast(msg))
    ScanModule.enabledScan()
  }

  thisAppState(appState) {
    if (appState === 'active') ScanModule.enabledScan()
    if (appState !== 'active') ScanModule.disabledScan()
  }

  componentWillUnmount() {
    AppState.removeEventListener('change')
    DeviceEventEmitter.removeListener('onScanBarcode')
    DeviceEventEmitter.removeListener('onRefreshMessage')
    ScanModule.disabledScan()
  }

  getShippingInfo(spno) {
    toast(spno)
    this.setState({ 
      isSuccess: false, 
      shipping: {},
      message: '資料處理中...',
    })
    const success = (res) => {
      this.setState({
        shipping: res.data,
        isSuccess: true,
        message: ''
      })
    }
    const error = (err) => {
      this.setState({ message: JSON.stringify(err.response.data.message) })
    }
    getShippingInfo(spno, success, error)
  }

  savePieces() {
    let self = this
    let { pieces, shipping } = this.state
    if (pieces === null)  return
    this.setState({ isSubmit: true })
    const data = {
      tmy59spno: shipping.tmy59spno,
      tmtrdj: shipping.tmtrdj,
      pieces: pieces,
    }
    const success = (res) => {
      toast('托運確認作業完成')
      this.setState({ 
        isSuccess: false,
        isSubmit: false,
        pieces: null, 
        shipping: {}, 
        message: '請掃描條碼查詢托運資料',
      })
    }
    const error = (err) => {
      alert(err)
      this.setState({ isSubmit: false })
    }
    savePieces(data, success, error)
  }

  openDrawer() {
    this.drawer._root.open()
  }

  closeDrawer() {
    this.drawer._root.close()
  }

  render() {
    const { shipping, message, isSuccess, isSubmit, pieces } = this.state
    return (
      <StyleProvider style={getTheme(material)}>
        <Drawer
          ref={(ref) => { this.drawer = ref; }}
          content={<Sidebar navigator={this.navigator} />}
          onClose={this.closeDrawer}
        >
          <Container>
            <Header>
              <Left>
                <Button transparent onPress={this.openDrawer} style={{ width: 50 }}>
                  <Icon name='menu' />
                </Button>
              </Left>
              <Body>
                <Title>托運單確認</Title>
              </Body>
            </Header>
            <Content style={styles.content}>
              {isSuccess > 0 ?
                <View>
                  <Text style={styles.pickingInfo}>{'查貨序號:' + shipping.tmy59spno}</Text>
                  <Text style={styles.pickingInfo}>{'訂單日期:' + shipping.tmtrdj.substr(0, 10)}</Text>
                  <Text style={styles.pickingInfo}>{'托運日期:' + shipping.tmaddj.substr(0, 10)}</Text>
                  <Text style={styles.pickingInfo}>{'貨運商號碼:' + shipping.tmcars}</Text>
                  <Text style={styles.pickingInfo}>{'貨運商名稱:' + shipping.cars_na}</Text>
                  <Text style={styles.pickingInfo}>{'客戶編號:' + shipping.tman8}</Text>
                  <Text style={styles.pickingInfo}>{'客戶名稱:' + shipping.tmalph}</Text>
                  {Number(shipping.tm1in1) > 0 &&
                    <Text style={styles.pickingInfo}>{'件數:' + shipping.tm1in1}</Text>
                  }
                  <Text style={styles.pickingInfo}>{'指送時間:' + shipping.dltm_na}</Text>
                  <Text style={styles.pickingInfo}>{'指定收件人:' + shipping.tmalph1}</Text>
                  {Number(shipping.tm1in1) === 0 &&
                    <Item floatingLabel>
                      <Label>輸入件數</Label>
                      <Input
                        keyboardType="numeric"
                        onChange={(e) => this.setState({ pieces: e.nativeEvent.text })}
                        value={pieces}
                        onSubmitEditing={this.savePieces}
                      />
                    </Item>
                  }
                  {pieces && !isSubmit &&
                    <Button block primary large onPress={this.savePieces} style={styles.button}>
                      <Text>確認</Text>
                    </Button>
                  }
                  {pieces && isSubmit &&
                    <Button block disabled large style={styles.button}>
                      <Text>資料處理中...</Text>
                    </Button>
                  }
                </View>
              :
                <Text style={styles.message}>{message}</Text>
              }
            </Content>
          </Container>
          </Drawer>
      </StyleProvider>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    padding: 10
  },
  message: {
    fontSize: 20,
    textAlign: 'center',
  },
  pickingInfo: {
    fontSize: 20,
  },
  button: {
    marginTop: 10,
  },
})

export default withNavigation(Shipping)
AppRegistry.registerComponent('Shipping', () => Shipping);