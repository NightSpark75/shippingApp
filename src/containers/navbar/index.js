'use strict'
import React, { Component } from 'react'
import { Header, Left, Body, Right, Title } from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class Navbar extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { title, left, right } = this.props
    return (
      <Header>
        {left &&
          <Left>
            <Icon name="chevron-left" size={24} color="#FFF" /> 
          </Left>
        }
        {title &&
          <Body>
            <Title>{title}</Title>
          </Body>
        }
        {right &&
          <Right>
            <Icon name="chevron-left" size={26} color="#FFF" />
          </Right>
        }
      </Header>
    )
  }
}