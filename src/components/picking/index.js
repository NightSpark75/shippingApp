'use strict'
import React, { Component } from 'react'
import axios from 'axios'
import Realm from 'realm'
import { pickingRealm, itemsRealm } from '../../realm/schema'
import { AppRegistry, StyleSheet, NativeModules, DeviceEventEmitter, RefreshControl, ActivityIndicator, View, ListView } from 'react-native'
import { Drawer, Container, Content, StyleProvider, Header, Left, Body, Right, Spinner } from 'native-base'
import { Button, Title, Icon, Text, List, ListItem } from 'native-base'
import { NavigationActions, withNavigation } from 'react-navigation'
import { toast, loadToken } from '../../lib'
import config from '../../config'
import getTheme from '../../nativeBase/components'
import material from '../../nativeBase/variables/material'
import Sidebar from '../sidebar'

let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
let doubleClick = false

class Picking extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menuShow: false,
      refreshing: false,
      isLoading: false,
      pickingList: [],
      goPicking: false,
      vs: ds.cloneWithRows([]),
    };
  }

  componentDidMount() {
    this.setState({ refreshing: true }, () => {
      this.checkPicking()
    })
  }

  checkPicking() {
    let realm = new Realm({ schema: [pickingRealm] })
    let data = realm.objects(pickingRealm.name)
    if (data.length === 0) {
      realm.close()
      this.getPickingList()
    } else {
      realm.close()
      this.goCurrentPicking()
    }
  }

  getPickingList() {
    const self = this
    let token = loadToken()
    const Auth = 'Bearer ' + token;
    axios.get(config.route.pickingList + '/' + config.date, { headers: { Authorization: Auth } })
      .then(function (response) {
        if (response.code = 200) {
          self.setState({
            pickingList: response.data,
            refreshing: false,
            vs: ds.cloneWithRows(response.data)
          })
        } else {
          alert(response.data.error)
        }
      }).catch(function (error) {
        alert(error)
      })
  }

  goCurrentPicking() {
    const navigationAction = NavigationActions.navigate({
      routeName: 'PickingItems',
    })
    this.props.navigation.dispatch(navigationAction)
  }

  goPickingStart(item) {
    const self = this
    if (!doubleClick) {
      doubleClick = true
      const navigationAction = NavigationActions.navigate({
        routeName: 'PickingStart',
        params: {
          picking: item,
          unlock: () => {
            doubleClick = false
          }
        },
      })
      this.props.closeDrawer
      this.props.navigation.dispatch(navigationAction)
    }
  }

  closeDrawer = () => {
    this.drawer._root.close()
  }

  openDrawer = () => {
    this.drawer._root.open()
  }

  onRefresh() {
    this.setState({
      refreshing: true,
      pickingList: [],
    }, () => this.getPickingList())
  }

  render() {
    const { pickingList, message, isLoading } = this.state
    return (
      <StyleProvider style={getTheme(material)}>
        <Drawer
          ref={(ref) => { this.drawer = ref; }}
          content={<Sidebar navigator={this.navigator} />}
          onClose={() => this.closeDrawer()}
        >
          <Container>
            <Header>
              <Left>
                <Button transparent onPress={this.openDrawer.bind(this)}>
                  <Icon name='menu' />
                </Button>
              </Left>
              <Body>
                <Title>揀料單列表</Title>
              </Body>
            </Header>
            <Content
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh.bind(this)}
                  colors={['red', 'orange']}
                />
              }
            >
              <ListView
                enableEmptySections = {true}
                style={styles.listView}
                dataSource={this.state.vs}
                renderRow={(rowData) => (
                  <Text
                    style={styles.listItems}
                    onPress={this.goPickingStart.bind(this, rowData)}
                  >
                    {'單號:' + rowData.sticu + ' 站碼:' + rowData.ststop}
                  </Text>
                )}
              />
            </Content>
          </Container>
        </Drawer>
      </StyleProvider>
    )
  }
}

const styles = StyleSheet.create({
  listView: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  listItems: {
    fontSize: 24,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: '#000',
    padding: 10
  },
});

export default withNavigation(Picking)
AppRegistry.registerComponent('Picking', () => Picking);