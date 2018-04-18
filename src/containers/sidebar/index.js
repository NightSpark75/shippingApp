'use strict'
import React, { Component } from 'react'
import { AppRegistry } from 'react-native'
import { withNavigation } from 'react-navigation'
import { 
  Drawer, 
  Container, 
  Content, 
  StyleProvider, 
  Header, 
  Left, 
  Body, 
  Right,
  Button, 
  Title, 
  Icon, 
  Text, 
  List, 
  ListItem
} from 'native-base'
import { removeToken, confirm, navigationReset, navigationGo } from '../../lib'
import getTheme from '../../nativeBase/components';
import material from '../../nativeBase/variables/material';

class Sidebar extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.removeUserInfo = this.removeUserInfo.bind(this)
    this.logout = this.logout.bind(this)
  }

  goPage(page, params={}) {
    this.props.closeDrawer
    navigationGo(this, page, params)
  }

  logout() {
    confirm('登出', '您確定要登出系統？', this.removeUserInfo, () => null)
  }

  removeUserInfo() {
    removeToken()
    navigationReset(this, 'Login')
  }

  render() {
    return (
      <StyleProvider style={getTheme(material)}>
        <Container style={{backgroundColor: '#fff', margin: 0}}>
          <Content>
            <List>
              <ListItem icon onPress={this.logout}>
                <Left>
                  <Icon name="ios-log-out" />
                </Left>
                <Body>
                  <Text>
                    登出
                  </Text>
                </Body>
              </ListItem>
            </List>
          </Content>
        </Container>
      </StyleProvider>
    )
  }
}

export default withNavigation(Sidebar)
AppRegistry.registerComponent('Sidebar', () => Sidebar)