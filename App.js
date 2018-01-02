/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  NativeModules,
  DeviceEventEmitter,
} from 'react-native'  
const dismissKeyboard = require('dismissKeyboard')

const TestFunc = NativeModules.TestFunc

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        str: 'default',
        text: '',
    };
  }

  componentDidMount() {
    DeviceEventEmitter.addListener('onRefreshMessage', this.onUpdateMessage)
    TestFunc.enabledScan()
  }
  componentWillUnmount() {
    DeviceEventEmitter.removeListener('onRefreshMessage', this.onUpdateMessage)
    TestFunc.disabledScan()
  }

  onUpdateMessage = (e) => {
    alert(e)
    this.setState({str: e})
  }

  enabledScan()
  {
    TestFunc.enabledScan()
  }

  disabledScan()
  {
    TestFunc.disabledScan()
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          掃描模組測試程式
        </Text>
        <Button 
          style={styles.button}
          onPress={this.enabledScan.bind(this)}
          title="開啟掃描模組"
        >
        </Button>
        <Text style={styles.welcome}>
          {this.state.str}
        </Text>
        <Button 
          style={styles.button}
          onPress={this.disabledScan.bind(this)}
          title="關閉掃描模組"
        >
        </Button>
        <Text>目前螢幕寬度:{Dimensions.get('window').width}</Text>
        <Text>目前螢幕高度:{Dimensions.get('window').height}</Text> 
        <Text>目前螢幕解析度:{Dimensions.get('window').scale}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  button: {
    margin: 20,
  }
});
