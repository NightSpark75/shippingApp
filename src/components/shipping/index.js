'use strict'
import React, { Component } from 'react'
import axios from 'axios'
import { AppRegistry, StyleSheet, NativeModules, DeviceEventEmitter, AppState } from 'react-native'
import { StyleProvider, Container, Content, Header, Left, Body, View,  Button, Title, Text } from 'native-base'
import { NavigationActions, withNavigation } from 'react-navigation'
import config from '../../config'
import { toast } from '../../lib'
import getTheme from '../../nativeBase/components'
import material from '../../nativeBase/variables/material'

const ScanModule = NativeModules.ScanModule

class Shipping extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isSuccess: false,
      shipping: {},
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
    spno = '3010223276'
    toast(spno)
    const self = this
    this.setState({ 
      isSuccess: false, 
      shipping: {},
      message: '資料處理中...',
    })
    axios.get(config.route.shipping + spno + '/' + config.date)
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

  clearInfo() {
    this.setState({ 
      isSuccess: false,
      shipping: {}, 
      message: '請掃描條碼查詢托運資料',
    })
  }

  render() {
    const { shipping, message, isSuccess } = this.state
    return (
      <StyleProvider style={getTheme(material)}>
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
                <Text style={styles.pickingInfo}>{'件數:' + shipping.tm1in1}</Text>
                <Text style={styles.pickingInfo}>{'指送時間:' + shipping.dltm_na}</Text>
                <Text style={styles.pickingInfo}>{'指定收件人:' + shipping.tmalph1}</Text>
                <Button block primary large onPress={this.clearInfo.bind(this)} style={styles.button}>
                  <Text>確認</Text>
                </Button>
              </View>
            :
              <Text style={styles.message}>{message}</Text>
            }
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
  message: {
    fontSize: 20,
    textAlign: 'center',
  },
  pickingInfo: {
    marginLeft: 10,
    fontSize: 20,
  },
  button: {
    marginTop: 10,
  },
})

export default withNavigation(Shipping)
AppRegistry.registerComponent('Shipping', () => Shipping);

/*
<Text style={styles.pickingInfo}>{'查貨序號:' + shipping.tmy59spno}</Text>
                <Text style={styles.pickingInfo}>{'訂單日期:' + shipping.tmtrdj}</Text>
                <Text style={styles.pickingInfo}>{'托運日期:' + shipping.tmaddj}</Text>
                <Text style={styles.pickingInfo}>{'訂單號碼:' + ''}</Text>
                <Text style={styles.pickingInfo}>{'貨運商號碼:' + shipping.tmcars}</Text>
                <Text style={styles.pickingInfo}>{'貨運商名稱:' + ''}</Text>
                <Text style={styles.pickingInfo}>{'客戶編號:' + shipping.tman8}</Text>
                <Text style={styles.pickingInfo}>{'客戶名稱:' + shipping.staddj}</Text>
                <Text style={styles.pickingInfo}>{'件數:' + shipping.tm1in1}</Text>
                <Text style={styles.pickingInfo}>{'指送時間:' + shipping.tmy59dltm}</Text>
                <Text style={styles.pickingInfo}>{'指定收件人:' + ''}</Text>
                <Button block primary large onPress={this.clearInfo.bind(this)}>
                  <Text>確認</Text>
                </Button>
*/