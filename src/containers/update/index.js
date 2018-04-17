'use strict'
import React, { Component } from 'react'
import axios from 'axios'
import { AppRegistry, StyleSheet, Text, View, Button, Alert } from 'react-native'
import { Toast } from 'native-base'
import { NavigationActions, withNavigation } from 'react-navigation'
import FileTransfer from '@remobile/react-native-file-transfer'
import RNFS from 'react-native-fs'
import config from '../../config'
import RNRestart from 'react-native-restart'
import { NativeModules } from 'react-native'
import { jwtPayload, saveToken, loadToken, removeToken, LocalStorage } from '../../lib'

const VERSION = config.version
const VERSION_NUMBER = config.version_number
const URL_VERSION = config.url_version
const URL_DOWNLOAD = config.url_download

class Update extends Component {
  constructor(props) {
    super(props)

    this.state = {
      message: '檢查更新中...',
      path: '',
      new_version: null,
      update: false,
      login: false,
    }
  }

  componentDidMount() {  
    this.checkLogin()
    this.checkUpdate()
  }

  async checkLogin() {
    let token = loadToken()
    let payload = jwtPayload(token)
    if (payload) {
      this.checkTokenExp(payload, token)
    }
  }

  checkTokenExp(payload, token) {
    if (payload.exp*1000 < new Date().getTime()) {
      this.refreshToken(token)
    } else {
      this.setState({login: true})
    }
  }

  refreshToken(token) {
    let self = this
    let form_data = new FormData()
    form_data.append('token', token)
    axios.post(config.route.refresh, form_data)
      .then(function (response) {
        if (response.code = 200) {
          self.setToken(response.data.token)
        } else {
          removeToken()
        }
      }).catch(function (error) {
        removeToken()
      })
  }

  setToken(token) {
    const { dispatch } = this.props
    saveToken(token)
    payload = jwtPayload(token)
    this.setState({login: true})
  }
  
  checkUpdate() {
    let self = this
    fetch(URL_VERSION, { mode: 'cors' })
      .then((response) => response.json())
      .then((json) => {
        let bundlePath = RNFS.DocumentDirectoryPath + '/index.android.bundle'
        let file_size = json.size
        self.setState({
          message: '最新版本為：' + json.version,
          new_version: json.version,
        })
        if (json.result && (parseInt(json.version_number) > parseInt(VERSION_NUMBER))) {
          let fileTransfer = new FileTransfer()
          let msg
          self.setState({ message: '更新檔下載中...' })
          
          fileTransfer.download(
            encodeURI(URL_DOWNLOAD),
            bundlePath,
            (result) => {
              console.log(result)
              self.setState({
                message: '程式已更新，請重新啟動!!',
                update: true,
              })
            },
            (err) => {
              console.log(err)
              self.setState({ message: err.exception })
            },
            true
          )
        } else {
          self.setState({ message: '沒有新版本需要更新...' })
          self.goLogin()
        }
      })
      .catch(function (error) {
        self.setState({ message: error.exception })
      })
  }

  goLogin() {
    const { login } = this.state
    let route = login ? 'ShippingInfo': 'Login'
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: route,
        })
      ]
    })
    this.props.navigation.dispatch(resetAction)
  }

  goRestart() {
    NativeModules.Common.reloadBundle()
  }

  render() {
    const { message, update, path } = this.state
    return (
      <View style={styles.container}>
        <Text style={styles.info}>
          目前版本：{VERSION}
        </Text>
        <Text style={styles.message}>
          {message}
        </Text>
        {update &&
          <Button
            title="重新啟動應用程式"
            onPress={this.goRestart.bind(this)}
            style={styles.restart}
          />
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  info: {
    fontSize: 16,
    textAlign: 'center',
    margin: 10,
    color: '#000',
  },
  message: {
    fontSize: 20,
    textAlign: 'center',
    margin: 30,
    color: '#000',
  },
  restart: {
    textAlign: 'center',
    fontSize: 26,
    color: '#64B5F6',
    margin: 10,
  }
})

export default withNavigation(Update)
AppRegistry.registerComponent('Update', () => Update)