import React from 'react'
import { ImageBackground, StatusBar, View, SafeAreaView, Text } from 'react-native'
import { Icon, ListItem } from 'react-native-elements'
import { user } from '../../redux/actions/userActions'
import { connect } from 'react-redux'
import { Body, Header, Left, Title } from 'native-base'

const bg = require('../../images/bg.png')

class More extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  renderListProfile() {
    return (
      <ListItem
        key={'7'}
        title={'Профайл'}
        leftIcon={{ name: 'people', color: '#8c8c8c' }}
        chevron
        containerStyle={{ borderBottomWidth: 1, borderBottomColor: '#e0e0e0' }}
        onPress={() => this.props.navigation.navigate('Profile')}
      />
    )
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f141c' }}>
        <ImageBackground source={bg} style={{ flex: 1 }} resizeMode={'stretch'}>
          <Header style={{ backgroundColor: 'transparent' }}>
            <Left />
            <Body style={{ flex: 4, alignItems: 'flex-end' }}>
              <Title style={{ color: '#fff' }}>Дополнительно</Title>
            </Body>
          </Header>
          <StatusBar barStyle="light-content" />
          <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View>
              <Text />
            </View>
            {this.renderListProfile()}
          </SafeAreaView>
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
)(More)
