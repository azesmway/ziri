import React from 'react'
import { ImageBackground, StatusBar, View } from 'react-native'
import { connect } from 'react-redux'
import { Body, Header, Left, Title, Button, FooterTab, Footer, Icon, Text, Form, Item, Label, Input, Right } from 'native-base'
import { user } from '../../redux/actions/userActions'

const bg = require('../../images/bg.png')

class Profile extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      lastName: this.props.userData.lastName,
      firstName: this.props.userData.firstName,
      middleName: this.props.userData.middleName,
      update: false
    }
  }

  render() {
    const { lastName, firstName, middleName } = this.state

    return (
      <View style={{ flex: 1, backgroundColor: '#0f141c' }}>
        <ImageBackground source={bg} style={{ flex: 1 }} resizeMode={'stretch'}>
          <Header style={{ backgroundColor: 'transparent' }}>
            <Left>
              <Button transparent onPress={() => this.props.navigation.goBack()} style={{ width: 60, paddingLeft: 10 }}>
                <Icon name="arrow-back" style={{ color: '#fff' }} />
              </Button>
            </Left>
            <Body>
              <Title style={{ color: '#fff' }}>Мой профиль</Title>
            </Body>
            <Right>
              <Button
                transparent
                onPress={() => {
                  this.state.update
                    ? this.setState({ update: false }, () =>
                        this.props.reduxProfile({
                          lastName: this.state.lastName,
                          firstName: this.state.firstName,
                          middleName: this.state.middleName
                        })
                      )
                    : null
                }}
              >
                <Text style={{ color: this.state.update ? '#fff' : '#3d3d3d' }}>Готово</Text>
              </Button>
            </Right>
          </Header>
          <StatusBar barStyle="light-content" />
          <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Text />
            <Form>
              <Item stackedLabel>
                <Label>Фамилия</Label>
                <Input value={lastName} onChangeText={text => this.setState({ lastName: text, update: true })} />
              </Item>
              <Item stackedLabel>
                <Label>Имя</Label>
                <Input value={firstName} onChangeText={text => this.setState({ firstName: text, update: true })} />
              </Item>
              <Item stackedLabel>
                <Label>Отчество</Label>
                <Input value={middleName} onChangeText={text => this.setState({ middleName: text, update: true })} />
              </Item>
            </Form>
          </View>
        </ImageBackground>
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    userData: state.userReducer.userData
  }
}

const mapDispatchToProps = dispatch => {
  return {
    reduxUser: userData => dispatch(user(userData))
  }
}

// Exports
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile)
