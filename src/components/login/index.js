'use strict'
import React, { Component } from 'react'
import axios from 'axios'
import { AppRegistry } from 'react-native'
import { Container, Header, Content, StyleProvider } from 'native-base'
import { Form, Item, Input, Left, Body, Right, Title, Label} from 'native-base'
import { Button, Text, Icon } from 'native-base'
import { NavigationActions, withNavigation } from 'react-navigation'
import config from '../../config'
import { jwtPayload, toast, LocalStorage } from '../../lib'
import { connect } from 'react-redux'
import { userLogin } from '../../actions'
import Navbar from '../navbar'
import getTheme from '../../nativeBase/components';
import material from '../../nativeBase/variables/material';

const STORAGE = new LocalStorage()

class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      id: '',
      password: '',
    }
  }

  componentDidMount() {

  }
 
  login() {
    const self = this
    const { id, password } = this.state
    let form_data = new FormData()
    form_data.append('id', id)
    form_data.append('password', password)
    axios.post(config.route.login, form_data)
      .then(function (response) {
        if (response.code = 200) {
          self.setLoginUser(response.data.token)
          self.loginSuccess()
        } else {
          toast(response.data.error)
        }
      }).catch(function (error) {
        toast(error)
      })
  }

  setLoginUser(token) {
    STORAGE.setValue('token', token)
    const { dispatch } = this.props
    const user = jwtPayload(token)
    toast(user.name + '您好...')
    dispatch(userLogin(user))
  }

  loginSuccess() {
    const firstPage = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'Sample',
        })
      ]
    })
    this.props.navigation.dispatch(firstPage)
  }

  render() {
    const { id, password } = this.state
    return (
      <StyleProvider style={getTheme(material)}>
        <Container>
          <Navbar title="使用者登入"/>
          <Content>
            <Form>
              <Item floatingLabel>
                <Label>帳號</Label>
                <Input
                  onChange={e => this.setState({id: e.nativeEvent.text})}
                  value={id}
                />
              </Item>
              <Item floatingLabel last>
                <Label>密碼</Label>
                <Input
                  secureTextEntry={true}
                  onChange={e => this.setState({password: e.nativeEvent.text})}
                  value={password}
                />
              </Item>
            </Form>
            <Button block primary onPress={this.login.bind(this)} style={{margin: 10}}>
              <Text>登入</Text>
            </Button>
          </Content>
        </Container>
      </StyleProvider>
    )
  }
}

function mapStateToProps(state) {
  const { login } = state
  return {
    login
  }
}

export default connect(mapStateToProps)(withNavigation(Login))
AppRegistry.registerComponent('Login', () => Login)