import React, { PureComponent } from 'react'
import {View, Text, Alert} from 'react-native';
import { Button } from 'native-base'
import DeviceInfo from 'react-native-device-info'
import { user } from '../../../redux/actions/userActions'
import { connect } from 'react-redux'
import auth from '@react-native-firebase/auth'
import messaging from '@react-native-firebase/messaging'
import { appleAuth, AppleButton } from '@invertase/react-native-apple-authentication'
import Post from '../../fetch/Post'

class AuthApple extends PureComponent {
  constructor(props, content) {
    super(props, content)

    this.authCredentialListener = null
    this.user = null

    this.state = {
      credentialStateForUser: -1
    }

    this.onAppleButtonPress = async () => {
      const { reduxUser, setSpinner, setError } = this.props
      let userData = {}
      this.props.setSpinner()

      try {
        const appleAuthRequestResponse = await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.LOGIN,
          requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME]
        })

        const { user: newUser, email, nonce, identityToken, realUserStatus, fullName, authorizationCode } = appleAuthRequestResponse
        userData.user_os = 'ios'
        userData.user_os_id = appleAuthRequestResponse.user
        userData.device_id = DeviceInfo.getUniqueId()
        userData.email = email
        userData.first_name = fullName.givenName
        userData.last_name = fullName.familyName
        userData.middle_name = ''
        userData.pin_code = ''

        const credentialState = await appleAuth.getCredentialStateForUser(newUser)

        if (identityToken && credentialState === appleAuth.State.AUTHORIZED) {
          const appleCredential = await auth.AppleAuthProvider.credential(identityToken, nonce)
          const userCredential = await auth().signInWithCredential(appleCredential)

          userData.firebase_id = userCredential.user.uid
          userData.isNewUser = userCredential.additionalUserInfo.isNewUser

          if (userCredential && userCredential.user && userCredential.user.uid) {
            if (!DeviceInfo.isEmulatorSync()) {
              const authStatus = await messaging().requestPermission()
              const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL

              if (enabled) {
                messaging()
                  .registerDeviceForRemoteMessages()
                  .then(async (result) => {
                    userData.fcmToken = await messaging().getToken()

                    if (!userData.email) {
                      userData.email = userCredential.user.email
                    }

                    Post.User_Register(JSON.stringify(userData)).then((result) => {
                      console.log('User_Register', JSON.stringify(result))
                      setSpinner()

                      if (result.success) {
                        reduxUser(userData)
                      } else {
                        setError(result.exception_code_name)
                      }
                    })
                  })
              }
            } else {
              setSpinner()
              Alert.alert('Ошибка!', 'Проблема авторизации. Попробуйте авторизоваться позже.')
            }
          }
        }
      } catch (error) {
        setSpinner()

        if (error.code === appleAuth.Error.CANCELED) {
          console.log('User canceled Apple Sign in.')
        } else {
          console.log(error)
        }
      }
    }

    this.fuickData = () => {
      const userData = {
        user_os: 'android',
        user_os_id: '113660642580409770053',
        device_id: '7B2E65A7-381E-4BD5-8457-3BEC6E1174BB',
        email: 'azesm.way@gmail.com',
        first_name: 'Alexey',
        last_name: 'Zolotaryov',
        middle_name: '',
        firebase_id: 'vWYlPrPE90POQsM0NYLnVwFrIyc2',
        isNewUser: true,
        apnsToken: 'A850AD34A74DDEEB7F02C560CFFBB0A80306F6AB46474F6DED8888287470EDEA',
        fcmToken:
          'fN3p3xMiAqU:APA91bHhUoyTym_H0Cta3nJ3dBE6Fqw9fPpHgPAoT_HDRBTW1pbz8ZM-QJ5qMZz8HYvuyRs8LjVopYvyYPEBzXKxHTQDTXmVcJ5FKkrD3g5p0_6ar4uURPUBem5GjExeZ4QNk9d54Br3'
      }

      this.props.reduxUser(userData)
    }

    this.fetchAndUpdateCredentialState = async () => {
      if (this.user === null) {
        this.setState({ credentialStateForUser: 'N/A' })
      } else {
        const credentialState = await appleAuth.getCredentialStateForUser(this.user)
        if (credentialState === appleAuth.State.AUTHORIZED) {
          this.setState({ credentialStateForUser: 'AUTHORIZED' })
        } else {
          this.setState({ credentialStateForUser: credentialState })
        }
      }
    }
  }

  componentDidMount() {
    /**
     * subscribe to credential updates.This returns a function which can be used to remove the event listener
     * when the component unmounts.
     */
    this.authCredentialListener = appleAuth.onCredentialRevoked(async () => {
      this.fetchAndUpdateCredentialState().catch((error) => this.setState({ credentialStateForUser: `Error: ${error.code}` }))
    })

    this.fetchAndUpdateCredentialState()
      .then((res) => this.setState({ credentialStateForUser: res }))
      .catch((error) => this.setState({ credentialStateForUser: `Error: ${error.code}` }))
  }

  componentWillUnmount() {
    /**
     * cleans up event listener
     */
    this.authCredentialListener()
  }

  render() {
    const { onlineIn } = this.props

    if (onlineIn) {
      if (!appleAuth.isSupported) {
        return null
      }

      if (!DeviceInfo.isEmulatorSync()) {
        return (
          <AppleButton
            style={{ width: 190, height: 40 }}
            cornerRadius={5}
            buttonStyle={AppleButton.Style.BLACK}
            buttonType={AppleButton.Type.SIGN_IN}
            onPress={() => this.onAppleButtonPress()}
          />
        )
      } else {
        return (
          <View style={{ flex: 1 }}>
            <Text>FUCK DATA</Text>
            <Button onPress={this.fuickData}>
              <Text>{'FUCK DATA'}</Text>
            </Button>
          </View>
        )
      }
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Text>FUCK DATA</Text>
          <Button title={'FUCK DATA'} onPress={this.fuickData} />
        </View>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    userData: state.userReducer.userData,
    onlineIn: state.onlineReducer.onlineIn
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    reduxUser: (userData) => dispatch(user(userData))
  }
}

// Exports
export default connect(mapStateToProps, mapDispatchToProps)(AuthApple)
