import React, { PureComponent } from 'react'
import DeviceInfo from 'react-native-device-info'
import { user } from '../../../redux/actions/userActions'
import { connect } from 'react-redux'
import { firebase } from '@react-native-firebase/app'
import '@react-native-firebase/auth'
import '@react-native-firebase/messaging'
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-community/google-signin'
import Post from '../../fetch/Post'

class AuthGoogle extends PureComponent {
  constructor(props, content) {
    super(props, content)

    this.state = {
      isSigninInProgress: false
    }

    this.signIn = async () => {
      this.props.setSpinner()
      try {
        await GoogleSignin.hasPlayServices()
        const userInfo = await GoogleSignin.signIn()
        const { accessToken, idToken } = await GoogleSignin.getTokens()
        let userData = {}
        userData.user_os = 'android'
        userData.user_os_id = userInfo.user.id
        userData.device_id = DeviceInfo.getUniqueId()
        userData.email = userInfo.user.email
        userData.first_name = userInfo.user.givenName
        userData.last_name = userInfo.user.familyName
        userData.middle_name = ''
        userData.pin_code = ''

        const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken)
        const userCredential = await firebase.auth().signInWithCredential(credential)

        if (GoogleSignin.isSignedIn() && userCredential && userCredential.user && userCredential.user.uid) {
          userData.firebase_id = userCredential.user.uid
          userData.isNewUser = userCredential.additionalUserInfo.isNewUser

          if (!DeviceInfo.isEmulatorSync()) {
            const defaultAppMessaging = firebase.messaging()

            if (!defaultAppMessaging.isRegisteredForRemoteNotifications) {
              await defaultAppMessaging.registerForRemoteNotifications()
            }

            const requestPermission = await firebase.messaging().requestPermission()

            if (requestPermission) {
              userData.apnsToken = await firebase.messaging().getAPNSToken()
              userData.fcmToken = await firebase.messaging().getToken()
            }
          } else {
            userData.apnsToken = ''
            userData.fcmToken = ''
          }

          Post.User_Register(JSON.stringify(userData)).then(result => {
            this.props.setSpinner()
            if (result.success) {
              this.props.reduxUser(userData)
            } else {
              this.props.setError(result.exception_code_name)
            }
          })
        }
      } catch (error) {
        this.props.setSpinner()
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          console.log('SIGN_IN_CANCELLED')
        } else if (error.code === statusCodes.IN_PROGRESS) {
          console.log('IN_PROGRESS')
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          console.log('PLAY_SERVICES_NOT_AVAILABLE')
        } else {
          console.log(error)
        }
      }
    }
  }

  componentDidMount = async () => {
    await GoogleSignin.configure()
  }

  render() {
    return (
      <GoogleSigninButton
        style={{ width: 192, height: 48 }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={this.signIn}
        disabled={this.state.isSigninInProgress}
      />
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
)(AuthGoogle)
