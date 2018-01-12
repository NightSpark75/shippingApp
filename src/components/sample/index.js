'use strict'
import React, { Component } from 'react'
import { AppRegistry, StyleSheet, NativeModules, DeviceEventEmitter } from 'react-native'
import { Drawer, Container, Content, StyleProvider, Header, Left, Body, Right } from 'native-base'
import { Button, Title, Icon, Text } from 'native-base'
import { NavigationActions, withNavigation } from 'react-navigation'
import { toast } from '../../lib'
import getTheme from '../../nativeBase/components'
import material from '../../nativeBase/variables/material'
import Sidebar from '../sidebar'

class Sample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuShow: false,
    };
  }

  componentDidMount() {
    
  }

  componentWillUnmount() {
    
  }

  closeDrawer = () => {
    this.drawer._root.close()
  }

  openDrawer = () => {
    this.drawer._root.open()
  }

  render() {
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
                <Title>Sample page</Title>
              </Body>
            </Header>
            <Content>
              <Text>test</Text>
            </Content>
          </Container>
          </Drawer>
      </StyleProvider>
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

export default withNavigation(Sample)
AppRegistry.registerComponent('Sample', () => Sample);