'use strict'
import React, { Component } from 'react'
import axios from 'axios'
import { AppRegistry } from 'react-native'
import { Container, Header, Content, StyleProvider } from 'native-base'
import { Form, Item, Input, Left, Body, Right, Title, Label, Toast } from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Button, Text } from 'native-base'
import { NavigationActions, withNavigation } from 'react-navigation'
import config from '../../config'
import { jwtPayload, LocalStorage } from '../../lib'
import { connect } from 'react-redux'
import { userLogin } from '../../actions'

export default class Navbar extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  componentDidMount() {

  }

  pressLeft() {

  }

  render() {
    const { title, left, right } = this.props
    return (
        <Header>
            <Left>
              {left && 
                <Icon name="chevron-left" size={24} color="#FFF" />
              }
            </Left>
          <Body>
            <Title>{title}</Title>
          </Body>
            <Right>
              {right && 
                <Icon name="chevron-left" size={26} color="#FFF" />
              }
            </Right>
        </Header>
    )
  }
}