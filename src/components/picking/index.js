'use strict'
import React, { Component } from 'react'
import axios from 'axios'
import Realm from 'realm'
import { pickingRealm, itemsRealm } from '../../realm/schema'
import { AppRegistry, StyleSheet, NativeModules, DeviceEventEmitter, RefreshControl, ActivityIndicator, View } from 'react-native'
import { Drawer, Container, Content, StyleProvider, Header, Left, Body, Right } from 'native-base'
import { Button, Title, Icon, Text, List, ListItem } from 'native-base'
import { NavigationActions, withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { toast, loadToken } from '../../lib'
import config from '../../config'
import getTheme from '../../nativeBase/components'
import material from '../../nativeBase/variables/material'
import Sidebar from '../sidebar'

let n = 0

class Picking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuShow: false,
      refreshing: false,
      pickingList: [],
      goPicking: false,
    };
  }

  componentDidMount() {
    this.setState({ refreshing: true }, () => {
      this.checkPicking()
    })
  }

  checkPicking() {
    let realm = new Realm({schema: [pickingRealm]})
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
    if (!this.state.goPicking) {
      this.setState({ goPicking: true })
      const navigationAction = NavigationActions.navigate({
        routeName: 'PickingStart',
        params: { 
          picking: item, 
          /* 
          unlock: () => {
            self.setState({ goPicking: false })
          }
          */
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
    const { pickingList, message } = this.state
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
              <List
                dataArray={pickingList}
                renderRow={(item, index) => (
                  <ListItem key={index} onPress={this.goPickingStart.bind(this, item)}>
                    <Text>{'單號:' + item.sticu + ' 站碼:' + item.ststop}</Text>
                  </ListItem>
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
  message: {
    marginLeft: 20,
  }
});

function mapStateToProps(state) {
  const { login } = state
  return {
    login
  }
}

export default connect(mapStateToProps)(withNavigation(Picking))
AppRegistry.registerComponent('Picking', () => Picking);