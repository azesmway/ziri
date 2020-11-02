import React, { PureComponent } from 'react'
import { Button, View } from 'react-native'
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
                userData.fcmToken = await messaging().getToken()
              }
            } else {
              userData.fcmToken = ''
            }

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

// 'appleAuthRequestResponse', { user: '001047.e5efa2ae925f407a8e759e5885b1dac4.1307',
//   email: 'azesm@me.com',
//   authorizedScopes: [],
//   fullName:
//     { namePrefix: null,
//       givenName: 'Алексей',
//       familyName: 'Золотарев',
//       nickname: null,
//       middleName: null,
//       nameSuffix: null },
//   identityToken: 'eyJraWQiOiI4NkQ4OEtmIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiY29tLmF6ZXNtLnppcmkiLCJleHAiOjE1ODM0ODU4ODUsImlhdCI6MTU4MzQ4NTI4NSwic3ViIjoiMDAxMDQ3LmU1ZWZhMmFlOTI1ZjQwN2E4ZTc1OWU1ODg1YjFkYWM0LjEzMDciLCJub25jZSI6ImE1M2ZlNGVkMThkMDMwMThjYWNiOWJmYTA4MWU2MDFlZDVhODJhODc2NDIwNzc4ODI0MGM3NzBmYjZjYzNlYzkiLCJjX2hhc2giOiJ1bjlZWHRzTnVzNEF5b3RKVmJnRVdnIiwiZW1haWwiOiJhemVzbUBtZS5jb20iLCJlbWFpbF92ZXJpZmllZCI6InRydWUiLCJhdXRoX3RpbWUiOjE1ODM0ODUyODUsIm5vbmNlX3N1cHBvcnRlZCI6dHJ1ZX0.hc4EYLrhDSXkEGzjFVwXYFwdTf8kAIv_vdbAaM8kkU4-_KCOkzf5lFU1Fvlqe4rBRVkkkkbGRM3dXKguWA9fOLi3UC3KQeGhjZnLiJFjrGruDLt3nPAYPaQZWQEkGcERKkZW-8AN7Y812wNAoLO6QjWbtnhYRNbMLeFB5SJup0a40dHW-qM63Aqo5_k8RGvpv0-MLO6ZTdY1OysVgy4lChxZMiiuH9CgfggG9hPG7Asb_AH8m5DW7WvVj34f6C9tSr2prS9sP09yGU5FATLT0uovazM97VbPo8GRRBjaZcF5V-pqi0BQg4mhFxGzEIevW0pSBSFy_8Y_uUOEOZkiYQ',
//   authorizationCode: 'c6040adb32e61409284ddc3834540168b.0.nrqux.MQ1t4gn4Td6Rs60R0TB6Tw',
//   realUserStatus: 1,
//   state: null,
//   nonce: 'hRM9XQrLLRIMRgyAzGMjcdQMm5QI.jMu' }

// 'firebase userCredential', { additionalUserInfo:
//     { profile:
//         { iat: 1583485285,
//           nonce: 'a53fe4ed18d03018cacb9bfa081e601ed5a82a8764207788240c770fb6cc3ec9',
//           sub: '001047.e5efa2ae925f407a8e759e5885b1dac4.1307',
//           c_hash: 'un9YXtsNus4AyotJVbgEWg',
//           email: 'azesm@me.com',
//           iss: 'https://appleid.apple.com',
//           email_verified: 'true',
//           aud: 'com.azesm.ziri',
//           auth_time: 1583485285,
//           exp: 1583485885,
//           nonce_supported: true },
//       username: null,
//       providerId: 'apple.com',
//       isNewUser: true },
//   user:
//     { _auth:
//         { _app:
//             { _name: '[DEFAULT]',
//               _deleted: false,
//               _deleteApp: [Function: bound deleteApp],
// _options:
// { projectId: 'azesm-ziri',
//   databaseURL: 'https://azesm-ziri.firebaseio.com',
//   messagingSenderId: '738460598912',
//   appId: '1:738460598912:ios:547dbb0981603d2dac9c65',
//   clientId: '738460598912-gp464nui0ko24mi18o1e7b4su8ckiefu.apps.googleusercontent.com',
//   storageBucket: 'azesm-ziri.appspot.com',
//   apiKey: 'AIzaSyC4J431Z2MR3u9hwAdCSzWEbekQ0H1oTxA' },
// _automaticDataCollectionEnabled: true,
//   _initialized: true,
//   _nativeInitialized: true },
// _nativeModule:
// { sendPasswordResetEmail: [Function],
//   addAuthStateListener: [Function],
//   removeAuthStateListener: [Function],
//   addIdTokenListener: [Function],
//   removeIdTokenListener: [Function],
//   setAppVerificationDisabledForTesting: [Function],
//   useUserAccessGroup: [Function],
//   signOut: [Function],
//   signInAnonymously: [Function],
//   signInWithEmailAndPassword: [Function],
//   signInWithEmailLink: [Function],
//   createUserWithEmailAndPassword: [Function],
//   delete: [Function],
//   reload: [Function],
//   sendEmailVerification: [Function],
//   updateEmail: [Function],
//   updatePassword: [Function],
//   updatePhoneNumber: [Function],
//   updateProfile: [Function],
//   getIdToken: [Function],
//   getIdTokenResult: [Function],
//   signInWithCredential: [Function],
//   confirmPasswordReset: [Function],
//   applyActionCode: [Function],
//   checkActionCode: [Function],
//   sendSignInLinkToEmail: [Function],
//   signInWithCustomToken: [Function],
//   signInWithPhoneNumber: [Function],
//   verifyPhoneNumber: [Function],
//   confirmationResultConfirm: [Function],
//   linkWithCredential: [Function],
//   unlink: [Function],
//   reauthenticateWithCredential: [Function],
//   fetchSignInMethodsForEmail: [Function],
//   setLanguageCode: [Function],
//   useDeviceLanguage: [Function],
//   verifyPasswordResetCode: [Function],
//
//   APP_USER:
//   { '[DEFAULT]':
//     { phoneNumber: null,
//       isAnonymous: false,
//       email: 'azesm@me.com',
//       refreshToken: 'AEu4IL3iFd5nIWNDRr4CYCEnvSbT0a_bGs1mWxl3w0aOpJ6DiWU4HsV6t7qoFBU4Q7-VA4JgRRymb8wSPBomw7kVtrLFRRniv2nFUvVMBxb6l-ANvYtiIPEIzWJ4u4_Sl8CvWgIH1GFszNwiIg42jwIWFwxa6bjoQzFJJMQnz-6Dsx6VYjewfhXa7PdChJfke0ZDQWmbyzvDOZkhN0musV6WdUQNVOKYin7mDLS7SEP8mRnPRTfoYCUa6gdL1VSpArwlNzrc3OTqrEi3kO7ppvVzJgEzjj1xfw',
//       metadata: { creationTime: 1583311307771, lastSignInTime: 1583334570510 },
//       uid: 'LIVHVwxepIeuNbMO0ge74zV0JBk1',
//         photoURL: null,
//       providerId: 'firebase',
//       emailVerified: true,
//       providerData:
//       [ { providerId: 'apple.com',
//         uid: '001047.e5efa2ae925f407a8e759e5885b1dac4.1307',
//         email: 'azesm@me.com' } ],
//         displayName: null } },
//   APP_LANGUAGE: {},
//   getConstants: [Function] },
// _customUrlOrRegion: undefined,
//   _config:
// { statics:
// { AppleAuthProvider: [Function: AppleAuthProvider],
//   EmailAuthProvider: [Function: EmailAuthProvider],
//   PhoneAuthProvider: [Function: PhoneAuthProvider],
//   GoogleAuthProvider: [Function: GoogleAuthProvider],
//   GithubAuthProvider: [Function: GithubAuthProvider],
//   TwitterAuthProvider: [Function: TwitterAuthProvider],
//   FacebookAuthProvider: [Function: FacebookAuthProvider],
//   OAuthProvider: [Function: OAuthProvider],
//   PhoneAuthState:
//   { CODE_SENT: 'sent',
//     AUTO_VERIFY_TIMEOUT: 'timeout',
//     AUTO_VERIFIED: 'verified',
//     ERROR: 'error' } },
//   version: '6.3.4',
//     namespace: 'auth',
//   nativeModuleName: 'RNFBAuthModule',
//   nativeEvents:
//   [ 'auth_state_changed',
//     'auth_id_token_changed',
//     'phone_auth_state_changed' ],
//     hasMultiAppSupport: true,
//   hasCustomUrlOrRegionSupport: false,
//   ModuleClass: [Function: FirebaseAuthModule] },
// _user: [Circular],
//   _settings: null,
//   _authResult: true,
//   _languageCode: undefined },
// _user:
// { phoneNumber: null,
//   isAnonymous: false,
//   email: 'azesm@me.com',
//   refreshToken: 'AEu4IL2spa06ooEd2-x0Hnax5VxdihNpZ_LFmiO1VPbJrYXMcqNqDYNC2xWaKbcghsGtRdVex7KKRXjirL9GOuN9OF673_4J9i5a4wFwLM7O40nBLV_MFl4TbE1DDgmj53Q9xlsr0hyRK_dHNo5WeP6bTDM1XagOMYyDbf07nqqA6sXAyDPedkqobRGiTn1FM_KtLx350aaFoeEZCEBF7pgvKdzgrYtsKG3p4ftN4SNm5Xuc87jg_fKxkSeDbBUwZqiWDATp-eBMiaei9Gt0AUGOJZpnTdej5g',
//   metadata: { creationTime: 1583485286554, lastSignInTime: 1583485286554 },
//   uid: '0XepjcRJATg5OqWGcPFVHrALSUq1',
//     photoURL: null,
//   providerId: 'firebase',
//   emailVerified: true,
//   providerData:
//   [ { providerId: 'apple.com',
//     uid: '001047.e5efa2ae925f407a8e759e5885b1dac4.1307',
//     email: 'azesm@me.com' } ],
//     displayName: null } } }

// --------------------------------------------- ставим второй раз -------------------------

// 'appleAuthRequestResponse', { user: '001047.e5efa2ae925f407a8e759e5885b1dac4.1307',
//   email: null,
//   authorizedScopes: [],
//   fullName:
//     { namePrefix: null,
//       givenName: null,
//       familyName: null,
//       nickname: null,
//       middleName: null,
//       nameSuffix: null },
//   identityToken: 'eyJraWQiOiJlWGF1bm1MIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiY29tLmF6ZXNtLnppcmkiLCJleHAiOjE1ODM0ODYxNzEsImlhdCI6MTU4MzQ4NTU3MSwic3ViIjoiMDAxMDQ3LmU1ZWZhMmFlOTI1ZjQwN2E4ZTc1OWU1ODg1YjFkYWM0LjEzMDciLCJub25jZSI6IjNkODMxOGVkYzRjMmE1NmJiNzk5MDQ3MDc3MDUzMTUyNmQ3NzBiZWM3N2FhNmJhYjgwM2FlNzU0YjIzYzE1YmEiLCJjX2hhc2giOiJrdGFtV3ZPQVo1ekFlVURFMmw3ZzhBIiwiZW1haWwiOiJhemVzbUBtZS5jb20iLCJlbWFpbF92ZXJpZmllZCI6InRydWUiLCJhdXRoX3RpbWUiOjE1ODM0ODU1NzEsIm5vbmNlX3N1cHBvcnRlZCI6dHJ1ZX0.Rca39XnYREhFo4OZwnQ3vTZHjwcMJwV1N6tslJSztl0D2bSbCIq5ptTT1ekGvXZqrdb8EP5nkKCVxLJ0KqOqKRVdtrqmqvWXLxb_NsR7bp_IkQykM_zf93mMxBvFQworljiKaWlQTmKNMeMARKVSduURNF8PaPKW7pQ8YUbJvSb_9jTDbI0XDgOPCz4rRLhWmh977X5-7N2NKtB8KuJP1LIqxRhtkk9VDJoMMxMA1_jBFca6vR1-VviLc01JLJNPzdzjAnzFaclCGZ3OZMpCK0_x210ErYADSKx1h80C8KbKp7J4wS-5FyjERoedhvgXjpknxVOiyhfFr7bdYQDFrQ',
//   authorizationCode: 'cac538bbb71d34003926016c1dd2f2e7e.0.nrqux.e0SrjFpt4SmRgjO2XfHvTg',
//   realUserStatus: 1,
//   state: null,
//   nonce: 'thySRSjzVuPQ2Psdy1_vfCrb4cVR0iCH' }

// 'firebase userCredential', { additionalUserInfo:
//     { profile:
//         { iat: 1583485571,
//           nonce: '3d8318edc4c2a56bb7990470770531526d770bec77aa6bab803ae754b23c15ba',
//           sub: '001047.e5efa2ae925f407a8e759e5885b1dac4.1307',
//           c_hash: 'ktamWvOAZ5zAeUDE2l7g8A',
//           email: 'azesm@me.com',
//           iss: 'https://appleid.apple.com',
//           email_verified: 'true',
//           aud: 'com.azesm.ziri',
//           auth_time: 1583485571,
//           exp: 1583486171,
//           nonce_supported: true },
//       username: null,
//       providerId: 'apple.com',
//       isNewUser: false },
//   user:
//     { _auth:
//         { _app:
//             { _name: '[DEFAULT]',
//               _deleted: false,
//               _deleteApp: [Function: bound deleteApp],
// _options:
// { projectId: 'azesm-ziri',
//   databaseURL: 'https://azesm-ziri.firebaseio.com',
//   messagingSenderId: '738460598912',
//   appId: '1:738460598912:ios:547dbb0981603d2dac9c65',
//   clientId: '738460598912-gp464nui0ko24mi18o1e7b4su8ckiefu.apps.googleusercontent.com',
//   storageBucket: 'azesm-ziri.appspot.com',
//   apiKey: 'AIzaSyC4J431Z2MR3u9hwAdCSzWEbekQ0H1oTxA' },
// _automaticDataCollectionEnabled: true,
//   _initialized: true,
//   _nativeInitialized: true },
// _nativeModule:
// { sendPasswordResetEmail: [Function],
//   addAuthStateListener: [Function],
//   removeAuthStateListener: [Function],
//   addIdTokenListener: [Function],
//   removeIdTokenListener: [Function],
//   setAppVerificationDisabledForTesting: [Function],
//   useUserAccessGroup: [Function],
//   signOut: [Function],
//   signInAnonymously: [Function],
//   signInWithEmailAndPassword: [Function],
//   signInWithEmailLink: [Function],
//   createUserWithEmailAndPassword: [Function],
//   delete: [Function],
//   reload: [Function],
//   sendEmailVerification: [Function],
//   updateEmail: [Function],
//   updatePassword: [Function],
//   updatePhoneNumber: [Function],
//   updateProfile: [Function],
//   getIdToken: [Function],
//   getIdTokenResult: [Function],
//   signInWithCredential: [Function],
//   confirmPasswordReset: [Function],
//   applyActionCode: [Function],
//   checkActionCode: [Function],
//   sendSignInLinkToEmail: [Function],
//   signInWithCustomToken: [Function],
//   signInWithPhoneNumber: [Function],
//   verifyPhoneNumber: [Function],
//   confirmationResultConfirm: [Function],
//   linkWithCredential: [Function],
//   unlink: [Function],
//   reauthenticateWithCredential: [Function],
//   fetchSignInMethodsForEmail: [Function],
//   setLanguageCode: [Function],
//   useDeviceLanguage: [Function],
//   verifyPasswordResetCode: [Function],
//   APP_USER:
//   { '[DEFAULT]':
//     { phoneNumber: null,
//       isAnonymous: false,
//       email: 'azesm@me.com',
//       refreshToken: 'AEu4IL2spa06ooEd2-x0Hnax5VxdihNpZ_LFmiO1VPbJrYXMcqNqDYNC2xWaKbcghsGtRdVex7KKRXjirL9GOuN9OF673_4J9i5a4wFwLM7O40nBLV_MFl4TbE1DDgmj53Q9xlsr0hyRK_dHNo5WeP6bTDM1XagOMYyDbf07nqqA6sXAyDPedkqobRGiTn1FM_KtLx350aaFoeEZCEBF7pgvKdzgrYtsKG3p4ftN4SNm5Xuc87jg_fKxkSeDbBUwZqiWDATp-eBMiaei9Gt0AUGOJZpnTdej5g',
//       metadata: { creationTime: 1583485286554, lastSignInTime: 1583485286554 },
//       uid: '0XepjcRJATg5OqWGcPFVHrALSUq1',
//         photoURL: null,
//       providerId: 'firebase',
//       emailVerified: true,
//       providerData:
//       [ { providerId: 'apple.com',
//         uid: '001047.e5efa2ae925f407a8e759e5885b1dac4.1307',
//         email: 'azesm@me.com' } ],
//         displayName: null } },
//   APP_LANGUAGE: {},
//   getConstants: [Function] },
// _customUrlOrRegion: undefined,
//   _config:
// { statics:
// { AppleAuthProvider: [Function: AppleAuthProvider],
//   EmailAuthProvider: [Function: EmailAuthProvider],
//   PhoneAuthProvider: [Function: PhoneAuthProvider],
//   GoogleAuthProvider: [Function: GoogleAuthProvider],
//   GithubAuthProvider: [Function: GithubAuthProvider],
//   TwitterAuthProvider: [Function: TwitterAuthProvider],
//   FacebookAuthProvider: [Function: FacebookAuthProvider],
//   OAuthProvider: [Function: OAuthProvider],
//   PhoneAuthState:
//   { CODE_SENT: 'sent',
//     AUTO_VERIFY_TIMEOUT: 'timeout',
//     AUTO_VERIFIED: 'verified',
//     ERROR: 'error' } },
//   version: '6.3.4',
//     namespace: 'auth',
//   nativeModuleName: 'RNFBAuthModule',
//   nativeEvents:
//   [ 'auth_state_changed',
//     'auth_id_token_changed',
//     'phone_auth_state_changed' ],
//     hasMultiAppSupport: true,
//   hasCustomUrlOrRegionSupport: false,
//   ModuleClass: [Function: FirebaseAuthModule] },
// _user: [Circular],
//   _settings: null,
//   _authResult: true,
//   _languageCode: undefined },
// _user:
// { phoneNumber: null,
//   isAnonymous: false,
//   email: 'azesm@me.com',
//   refreshToken: 'AEu4IL2Ekt985kK4Bwd4GGfvo9HEvRiUTf09hP2u8e7Xf9X_CNuG6GyyH_uaQuy9kUjCIjf5qij6QsHPZKSPQz0YnM_jVWSlghUAUmTdhhTbLLz6o5BNNPzcP1o1RlEsthTGiODmmGJp8BfMTi_ZULAjPvY2og4il2eA1MlULr9jFVOTNUqFvmjiEBlXniQPOvmEsa7-PCVfcpR9N9tXgks_ex57zgZsaUByRoiIPAfCZTMw93dJMleY8u_Br51LXIJ-PqCsZVl87e8BXA8N6v0Bkg16_JeX6Q',
//   metadata: { creationTime: 1583485286554, lastSignInTime: 1583485572240 },
//   uid: '0XepjcRJATg5OqWGcPFVHrALSUq1',
//     photoURL: null,
//   providerId: 'firebase',
//   emailVerified: true,
//   providerData:
//   [ { providerId: 'apple.com',
//     uid: '001047.e5efa2ae925f407a8e759e5885b1dac4.1307',
//     email: 'azesm@me.com' } ],
//     displayName: null } } }
