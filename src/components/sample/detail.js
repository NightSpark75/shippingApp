'use strict'
import React, { Component } from 'react'
import { AppRegistry, StyleSheet, NativeModules, DeviceEventEmitter } from 'react-native'
import { Container, Content, StyleProvider, Header, Left, Body, Right } from 'native-base'
import { Button, Title, Icon } from 'native-base'
import { NavigationActions, withNavigation } from 'react-navigation'
import Toast from 'react-native-root-toast'
import getTheme from '../../nativeBase/components';
import material from '../../nativeBase/variables/material';

class SampleDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    
  }

  componentWillUnmount() {
    
  }

  render() {
    return (
      <StyleProvider style={getTheme(material)}>
        <Container>
          <Header>
            <Left>
              <Button transparent>
                <Icon name='arrow-back' />
              </Button>
            </Left>
            <Body>
              <Title>Header</Title>
            </Body>
            <Right>
              <Button transparent>
                <Text>Cancel</Text>
              </Button>
            </Right>
          </Header>
        </Container>
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

export default withNavigation(SampleDetail)
AppRegistry.registerComponent('SampleDetail', () => SampleDetail);