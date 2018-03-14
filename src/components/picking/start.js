'use strict'
import React, { Component } from 'react'
import axios from 'axios'
import Realm from 'realm'
import { itemsRealm, pickingRealm } from '../../realm/schema'
import { AppRegistry, StyleSheet, NativeModules, DeviceEventEmitter, View } from 'react-native'
import { Container, Content, StyleProvider, Header, Left, Body, Right } from 'native-base'
import { Button, Title, Text, Icon, List, ListItem } from 'native-base'
import { NavigationActions, withNavigation } from 'react-navigation'
import { toast, loadToken } from '../../lib'
import config from '../../config'
import getTheme from '../../nativeBase/components'
import material from '../../nativeBase/variables/material'

class PickingStart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isSubmiting: false,
      pickingItems: [],
    };
  }

  componentDidMount() {
    this.getPickingItems()
  }

  getPickingItems() {
    this.setState({ isLoading: true })
    const self = this
    const { state } = this.props.navigation
    let token = loadToken()
    const Auth = 'Bearer ' + token;
    axios.get(config.route.pickingItems + state.params.picking.ststop + '/' + config.date, { headers: { Authorization: Auth } })
      .then(function (response) {
        if (response.code = 200) {
          self.setState({
            pickingItems: response.data,
            isLoading: false,
          })
        } else {
          alert(response.data.error)
        }
      }).catch(function (error) {
        alert(error)
      })
  }

  goBack() {
    this.props.navigation.state.params.unlock();
    this.props.navigation.goBack()
  }

  setItem(item, index) {
    const num = '品項' + (Number(index) + 1 < 10 ? '0' : '') + (Number(index) + 1)
    const pslocn = ' [' + item.pslocn.trim() + ']'
    const psrmk = ' [' + item.psrmk.trim() + ']'
    const pslitm = ' [' + item.pslitm.trim() + ']'
    const pslotn = ' [' + item.pslotn.trim() + ']'
    const amt = ' ' + item.pssoqs + '/' + item.pspqoh
    return (
      num + pslitm + pslotn + amt
    )
  }

  pickingStart() {
    this.setState({ isSubmiting: true })
    const self = this
    let formData = new FormData()
    formData.append('stop', this.props.navigation.state.params.picking.ststop)
    formData.append('date', config.date)
    let token = loadToken()
    const Auth = 'Bearer ' + token;
    axios.post(config.route.pickingStart, formData, { headers: { Authorization: Auth } })
      .then(function (response) {
        if (response.code = 200) {
          self.goItems()
        } else {
          alert(response.data.error)
          self.setState({ isSubmiting: false })
        }
      }).catch(function (error) {
        alert(error)
        self.setState({ isSubmiting: false })
      })
  }

  goItems() {
    const { picking } = this.props.navigation.state.params
    const { pickingItems } = this.state 

    this.setCurrentPicking(picking, pickingItems)
    this.setState({ isSubmiting: false })
    const navigationAction = NavigationActions.navigate({
      routeName: 'PickingItems',
    })
    this.props.navigation.dispatch(navigationAction)
  }

  setCurrentPicking(picking, items) {
    let realm = new Realm({schema: [pickingRealm, itemsRealm]})
    realm.write(()=> {
      let deletePicking = realm.objects(pickingRealm.name)
      realm.delete(deletePicking)
      realm.create(pickingRealm.name, picking)

      let deleteItems = realm.objects(itemsRealm.name)
      realm.delete(deleteItems)
      items.map((row) => {
        realm.create(itemsRealm.name, row)
      })
    })
    realm.close()
  }

  submitButton () {
    if (this.state.isSubmiting) {
      return (
        <Button block disabled style={{ margin: 10 }}>
          <Text>處理中...</Text>
        </Button>
      )
    } else {
      return (
        <Button block primary onPress={this.pickingStart.bind(this)} style={{ margin: 10 }}>
          <Text>開始揀料</Text>
        </Button>
      )
    }
  }

  render() {
    const { state } = this.props.navigation
    const { pickingItems } = this.state
    const { picking } = state.params
    return (
      <StyleProvider style={getTheme(material)} >
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={this.goBack.bind(this)}>
                <Icon name='ios-arrow-back-outline' />
              </Button>
            </Left>
            <Body>
              <Title>揀料確認</Title>
            </Body>
            <Right>
            </Right>
          </Header>
          <Content style={styles.content}>
            <Text>{'揀料單號:' + picking.sticu}</Text>
            <Text>{'站碼:' + picking.ststop}</Text>
            <Text>{'日期:' + picking.staddj.substring(0, 10)}</Text>
            <List
              dataArray={pickingItems}
              renderRow={(item, section, row, high) => (
                <ListItem key={row} style={styles.row}>
                  <Text>{this.setItem(item, row)}</Text>
                </ListItem>
              )}
            />
            {this.state.isLoading &&
              <Text>揀料資料讀取中...</Text>
            }
            {!this.state.isLoading &&
              this.submitButton()
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
  row: {
    marginLeft: 0,
  }
});

export default withNavigation(PickingStart)
AppRegistry.registerComponent('PickingStart', () => PickingStart);