import React, { PureComponent } from 'react'
import { user } from '../../../redux/actions/userActions'
import { connect } from 'react-redux'
import { firebase } from '@react-native-firebase/app'
import '@react-native-firebase/auth'
import { LoginButton, AccessToken } from 'react-native-fbsdk'

class AuthFacebook extends PureComponent {
  constructor(props, content) {
    super(props, content)

    this.state = {}
  }

  render() {
    const perm = ['email', 'public_profile']
    const { setSpinner } = this.props

    return (
      <LoginButton
        style={{ width: 190, height: 40 }}
        permissions={perm}
        onLoginFinished={(error, result) => {
          setSpinner()
          if (error) {
            console.log('login has error: ' + result.error)
          } else if (result.isCancelled) {
            console.log('login is cancelled.')
          } else {
            try {
              AccessToken.getCurrentAccessToken().then(async data => {
                if (data) {
                  let userData = {}
                  userData.facebook = {}
                  const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken)
                  const userCredential = await firebase.auth().signInWithCredential(credential)
                  userData.facebook.user = userCredential.additionalUserInfo.profile
                  userData.userFirebase = {}
                  userData.userFirebase.uid = userCredential.user.uid

                  this.props.setSpinner()
                  this.props.reduxUser(userData)
                }
              })
            } catch (e) {
              this.props.setSpinner()
              console.log(e)
            }
          }
        }}
        onLogoutFinished={() => console.log('logout.')}
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
)(AuthFacebook)
