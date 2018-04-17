'use strict'
import React, { Component } from 'react'
import axios from 'axios'
import { AppRegistry, StyleSheet, NativeModules, DeviceEventEmitter, AppState } from 'react-native'
import { StyleProvider, Drawer, Container, Content, Header, Left, Body, View, Button, Title, Text, Label, Input, Item } from 'native-base'
import { NavigationActions, withNavigation } from 'react-navigation'
import config from '../../config'
import { toast, loadToken } from '../../lib'
import getTheme from '../../nativeBase/components'
import material from '../../nativeBase/variables/material'
import Sidebar from '../sidebar'

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
    };
  }

  componentDidMount() {
    AppState.addEventListener('change', this.thisAppState.bind(this))
    DeviceEventEmitter.addListener('onScanBarcode', this.getShippingInfo.bind(this))
    DeviceEventEmitter.addListener('onRefreshMessage', (msg) => toast(msg))
    ScanModule.enabledScan()
  }

  thisAppState(appState) {
    if (appState === 'active') {
      ScanModule.enabledScan()
    } else {
      ScanModule.disabledScan()
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change')
    DeviceEventEmitter.removeListener('onScanBarcode')
    DeviceEventEmitter.removeListener('onRefreshMessage')
    ScanModule.disabledScan()
  }

  getShippingInfo(spno) {
    toast(spno)
    const self = this
    this.setState({ 
      isSuccess: false, 
      shipping: {},
      message: '資料處理中...',
    })
    let token = loadToken()
    const Auth = 'Bearer ' + token
    axios.get(config.route.shipping + spno + '/' + config.date, { headers: { Authorization: Auth } })
      .then(function (response) {
        if (response.code = 200) {
          self.setState({
            shipping: response.data,
            isSuccess: true,
            message: ''
          })
        } else {
          self.setState({ message: response.data.error })
        }
      }).catch(function (error) {
        self.setState({ message: JSON.stringify(error.response.data.message) })
      })
  }

  savePieces() {
    let self = this
    let { pieces, shipping } = this.state
    if (pieces === null)  return
    this.setState({ isSubmit: true })
    let token = loadToken()
    const Auth = 'Bearer ' + token
    let formData = new FormData()
    formData.append('spno', shipping.tmy59spno)
    formData.append('date', shipping.tmtrdj)
    formData.append('pieces', pieces)
    axios.post(config.route.shippingPieces, formData, { headers: { Authorization: Auth } })
    .then(function (response) {
      if (response.code = 200) {
        toast('托運確認作業完成')
        self.clearInfo()
      } else {
        alert(response.data.error)
        self.setState({ isSubmit: false })
        toast('確認作業尚未成功，請重新確認一次!')
      }
    }).catch(function (error) {
      alert(error)
      self.setState({ isSubmit: false })
    })
  }

  clearInfo() {
    this.setState({ 
      isSuccess: false,
      isSubmit: false,
      pieces: null, 
      shipping: {}, 
      message: '請掃描條碼查詢托運資料',
    })
  }

  render() {
    const { shipping, message, isSuccess, isSubmit, pieces } = this.state
    return (
      <StyleProvider style={getTheme(material)}>
        <Drawer
          ref={(ref) => { this.drawer = ref; }}
          content={<Sidebar navigator={this.navigator} />}
          onClose={() => this.closeDrawer()}
        >
          <Container>
            <Header>
              <Left></Left>
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
                        autoFocus={true}
                        value={pieces}
                        onSubmitEditing={this.savePieces.bind(this)}
                      />
                    </Item>
                  }
                  {pieces && !isSubmit &&
                    <Button block primary large onPress={this.savePieces.bind(this)} style={styles.button}>
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