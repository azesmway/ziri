import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PINCode from '@haskkor/react-native-pincode'
import { Dimensions, ImageBackground, StatusBar, Text, TouchableOpacity, View, Alert } from 'react-native'
import Post from '../fetch/Post'
import Get from '../fetch/Get'
import * as Storage from '../stores/Storage'
import { user } from '../../redux/actions/userActions'
import Spinner from 'react-native-loading-spinner-overlay'
import { t } from '../utils/i18n'

const bg = require('../../images/bg.png')
const { width, height } = Dimensions.get('window')

class Pin extends PureComponent {
  constructor(props, content) {
    super(props, content)

    this.state = {
      pinIn: false
    }

    this.clearPin = () => {
      Alert.alert('Внимание!', 'Вы действительно желаете сбросить PIN-код?', [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Да',
          style: 'destructive',
          onPress: () => {
            Alert.prompt(
              'Проверочный код',
              'Введите проверочный код из электронного письма, отправленного Вам на почтовый ящик.',
              [
                {
                  text: 'Отменить',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel'
                },
                {
                  text: 'OK',
                  style: 'destructive',
                  onPress: password => {
                    this.props.reduxPin('')
                  }
                }
              ],
              'plain-text'
            )
          }
        }
      ])
    }
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   if (nextProps.pinData !== prevState.pinData) {
  //     return { pinIn: true }
  //   } else {
  //     return null
  //   }
  // }
  //
  // componentDidUpdate = async (prevProps, prevState) => {
  //   if (this.state.pinIn) {
  //     this.props.navigation.replace('App')
  //   }
  // }

  setFirstPinCode = async pinCode => {
    let resultRegistration = {}
    this.setState({ pinIn: true })
    const { pin_code } = this.props.userData

    if (!pin_code) {
      let userData = this.props.userData
      userData.pin_code = pinCode

      if (this.props.onlineIn) {
        resultRegistration = await Post.User_Register(JSON.stringify(userData))
      } else {
        resultRegistration = {
          success: true
        }
      }

      if (resultRegistration.success) {
        await this.props.reduxUser(userData)
        await this.loginUser()
      } else {
        console.log('resultRegistration', resultRegistration)
      }
    } else {
      await this.loginUser()
    }
  }

  loginUser = async () => {
    const { pin_code, firebase_id } = this.props.userData
    let resultLogin = {}

    let get = '?firebase_id=' + firebase_id + '&pin_code=' + pin_code

    if (this.props.onlineIn) {
      resultLogin = await Get.userLogin(get)
    } else {
      resultLogin = {
        success: true,
        session_key: '7656756JHGJHG65765765'
      }
    }

    if (resultLogin.success) {
      Storage.setSessionKey(resultLogin.session_key)
      this.props.navigation.replace('App')
    } else {
      console.log('resultLogin', resultLogin)
    }
    this.setState({ pinIn: false })
  }

  render() {
    const { pin_code, firebase_id } = this.props.userData

    return (
      <View style={{ flex: 1, backgroundColor: '#0f141c' }}>
        <ImageBackground source={bg} style={{ flex: 1 }} resizeMode={'stretch'}>
          <View style={{ width: width, height: height - 30, justifyContent: 'center', alignItems: 'center' }}>
            <StatusBar barStyle="light-content" />
            <Spinner visible={this.state.pinIn} textContent={t('loading')} textStyle={{ color: '#fff' }} />
            <PINCode
              disableLockScreen
              titleEnter={t('enter')}
              titleChoose={t('choose')}
              titleConfirm={t('confirm')}
              titleConfirmFailed={t('confirmfailed')}
              titleAttemptFailed={t('attemptfailed')}
              subtitleError={t('suberror')}
              subtitleChoose={t('subchoose')}
              status={pin_code ? 'enter' : 'choose'}
              finishProcess={async pinCode => this.setFirstPinCode(pinCode)}
              colorPassword={'#fff'}
              passwordLength={4}
              numbersButtonOverlayColor={'#fff'}
              stylePinCodeButtonNumber={'#0f141c'}
              maxAttempts={5}
              pinCodeVisible={false}
              storedPin={pin_code}
              touchIDDisabled
              stylePinCodeTextTitle={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}
              stylePinCodeTextSubtitle={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}
              stylePinCodeColorTitle={'#fff'}
              stylePinCodeColorSubtitle={'#fff'}
              buttonDeleteText={'Удалить'}
              colorPasswordEmpty={'#fff'}
              stylePinCodeCircle={{ height: 10, width: 10, borderRadius: 10 }}
              stylePinCodeColorTitleError={'#ffd800'}
              stylePinCodeColorSubtitleError={'#ffd800'}
            />
            {pin_code ? (
              <TouchableOpacity onPress={() => this.clearPin()}>
                <Text style={{ color: '#fff' }}>{t('remember')}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </ImageBackground>
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    userData: state.userReducer.userData,
    onlineIn: state.onlineReducer.onlineIn
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
)(Pin)
