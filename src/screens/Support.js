import React from 'react'
import { ImageBackground, StatusBar, View } from 'react-native'
import { user } from '../../redux/actions/userActions'
import { connect } from 'react-redux'
import { Body, Header, Left, Title, Button, Icon, Text, Right } from 'native-base'

const bg = require('../../images/bg.png')

class Support extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f141c' }}>
        <ImageBackground source={bg} style={{ flex: 1 }} resizeMode={'stretch'}>
          <Header style={{ backgroundColor: 'transparent' }}>
            <Left>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name="arrow-back" style={{ color: '#fff' }} />
              </Button>
            </Left>
            <Body style={{ flex: 4, alignItems: 'flex-end' }}>
              <Title style={{ color: '#fff' }}>Поддержка</Title>
            </Body>
          </Header>
          <StatusBar barStyle="light-content" />
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
)(Support)
