import React from 'react'
import { View, Image, Text, ActivityIndicator, Dimensions, StatusBar, ImageBackground } from 'react-native'
// import { CommonActions } from '@react-navigation/native'
import { connect } from 'react-redux'
import _ from 'lodash'
import * as Storage from '../stores/Storage'

const splashIconPath = '../../images/ziri.png'
const bg = require('../../images/bg.png')
const { width, height } = Dimensions.get('window')

class Splash extends React.PureComponent {
  constructor(props) {
    super(props)

    this.initializeApp = async () => {
      const { navigation, userData } = this.props
      // console.log(props)
      // const params = props.navigation.state.params
      //
      // let action: any
      //
      // if (params && params.routeName) {
      //   const { routeName, ...routeParams } = params
      //   action = CommonActions.navigate({ routeName, params: routeParams })
      // }

      if (_.isEmpty(userData)) {
        navigation.replace('Auth')
      } else if (Storage.getSessionKey() !== '') {
        navigation.replace('App')
      } else {
        navigation.replace('Pin')
      }
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f141c' }}>
        <ImageBackground source={bg} style={{ flex: 1 }} resizeMode={'stretch'}>
          <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'transparent' }}>
            <StatusBar barStyle="light-content" />
            <View
              style={{
                width: '100%',
                height: height / 2,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'transparent'
              }}
            >
              <Image
                source={require(splashIconPath)}
                style={{ width: 320, height: 100 }}
                resizeMode={'cover'}
                onLoad={this.initializeApp}
              />
            </View>
            <Text />
            <Text style={{ color: 'rgb(133,133,133)', fontSize: 16 }}>Загрузка данных...</Text>
            <Text />
            <ActivityIndicator />
          </View>
        </ImageBackground>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userData: state.userReducer.userData
  }
}

export default connect(mapStateToProps)(Splash)
