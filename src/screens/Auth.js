import React, { PureComponent } from 'react'
import { View, Text, Dimensions, StatusBar, ImageBackground, Platform } from 'react-native'
import { AuthApple, AuthGoogle } from './auth'
import { user } from '../../redux/actions/userActions'
import { connect } from 'react-redux'
import { Card, CardItem, Body } from 'native-base'
import Spinner from 'react-native-loading-spinner-overlay'
import * as Storage from '../stores/Storage'
import { t } from '../utils/i18n'

const { width, height } = Dimensions.get('window')
const bg = require('../../images/bg.png')

class Auth extends PureComponent {
  constructor(props, content) {
    super(props, content)

    this.state = {
      loggedIn: false,
      userData: this.props.userData,
      spinner: false,
      error: ''
    }
  }

  componentDidUpdate = async (prevProps, prevState) => {
    const { loggedIn } = this.state
    const { navigation } = this.props

    if (loggedIn) {
      if (Storage.getSessionKey() === '') {
        navigation.navigate('Pin')
      } else {
        navigation.navigate('App')
      }
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.userData !== prevState.userData) {
      return { loggedIn: true }
    } else {
      return null
    }
  }

  setSpinner = () => {
    this.setState({ spinner: !this.state.spinner })
  }

  setError = (error) => {
    this.setState({ error: error })
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f141c' }}>
        <ImageBackground source={bg} style={{ flex: 1 }} resizeMode={'stretch'}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
            <StatusBar barStyle="light-content" />
            <Spinner visible={this.state.spinner} textContent={'Авторизация...'} textStyle={{ color: '#fff' }} />
            <Card style={{ width: width - 20 }}>
              <CardItem header bordered>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{t('auth')}</Text>
              </CardItem>
              <CardItem>
                <Body>
                  {this.state.error === '' ? (
                    <View>
                      <Text>{t('textlogin')}</Text>
                      <Text />
                      <Text />
                      <Text />
                    </View>
                  ) : (
                    <View>
                      <Text style={{ color: 'red' }}>{this.state.error}</Text>
                      <Text />
                      <Text />
                      <Text />
                    </View>
                  )}
                  <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    {Platform.OS !== 'android' ? (
                      <AuthApple setSpinner={this.setSpinner} setError={this.setError} />
                    ) : (
                      <AuthGoogle setSpinner={this.setSpinner} setError={this.setError} />
                    )}
                  </View>
                </Body>
              </CardItem>
            </Card>
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

const mapDispatchToProps = (dispatch) => {
  return {
    reduxUser: (userData) => dispatch(user(userData))
  }
}

// Exports
export default connect(mapStateToProps, mapDispatchToProps)(Auth)
