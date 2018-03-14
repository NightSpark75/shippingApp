'use strict'
import React, { Component } from 'react'
import axios from 'axios'
import { TextInput } from 'react-native'
import { AppRegistry } from 'react-native'
import { Container, Header, Content, StyleProvider } from 'native-base'
import { Form, Item, Input, Left, Body, Right, Title, Label } from 'native-base'
import { Button, Text, Icon } from 'native-base'
import { NavigationActions, withNavigation } from 'react-navigation'
import config from '../../config'
import { jwtPayload, toast, saveToken } from '../../lib'
import { connect } from 'react-redux'
import { userLogin } from '../../actions'
import Navbar from '../navbar'
import getTheme from '../../nativeBase/components';
import material from '../../nativeBase/variables/material';

class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      id: '',
      password: '',
      isLoading: false,
    }
  }

  componentDidMount() {

  }

  login() {
    const self = this
    const { id, password } = this.state
    let formData = new FormData()
    formData.append('id', id)
    formData.append('password', password)
    this.setState({ isLoading: true })
    axios.post(config.route.login, formData)
      .then(function (response) {
        if (response.code = 200) {
          self.setLoginUser(response.data.token)
          self.loginSuccess()
        } else {
          alert(response.data.error)
          self.setState({ isLoading: false })
        }
      }).catch(function (error) {
        alert(error)
        self.setState({ isLoading: false })
      })
  }

  setLoginUser(token) {
    saveToken(token)
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
          routeName: 'PickingList',
        })
      ]
    })
    this.props.navigation.dispatch(firstPage)
  }

  render() {
    const { id, password, isLoading } = this.state
    return (
      <StyleProvider style={getTheme(material)}>
        <Container>
          <Navbar title="使用者登入" />
          <Content>
            <Form>
              <Item floatingLabel>
                <Label>帳號</Label>
                <Input
                  onChange={(e) => this.setState({ id: e.nativeEvent.text })}
                  autoFocus={true}
                  value={id}
                  onSubmitEditing={() => this._password._root.focus()}
                />
              </Item>
              <Item floatingLabel last>
                <Label>密碼</Label>
                <Input
                  getRef={(c) => this._password = c}
                  secureTextEntry={true}
                  onChange={(e) => this.setState({ password: e.nativeEvent.text })}
                  value={password}
                  onSubmitEditing={() => this.login()}
                />
              </Item>
            </Form>
            {isLoading ?
              <Button block disabled style={{ margin: 10 }}>
                <Text>處理中...</Text>
              </Button>
              :
              <Button block primary onPress={this.login.bind(this)} style={{ margin: 10 }}>
                <Text>登入</Text>
              </Button>
            }
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