import React, { PureComponent } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { user } from '../../../redux/actions/userActions'
import { connect } from 'react-redux'
import { firebase } from '@react-native-firebase/app'
import '@react-native-firebase/auth'
import InstagramLogin from 'react-native-instagram-login'

class AuthInstagram extends PureComponent {
  constructor(props, content) {
    super(props, content)

    this.state = {}

    this.setIgToken = async data => {
      console.log(data)
    }
  }

  render() {
    return (
      <View>
        <TouchableOpacity onPress={() => this.instagramLogin.show()}>
          <Text style={{ color: 'black' }}>Login</Text>
        </TouchableOpacity>
        <InstagramLogin
          ref={ref => (this.instagramLogin = ref)}
          appId="2453653708297364"
          appSecret="777bac8bfab5e3e4c8d74cb041e6cac0"
          // redirectUrl="https://www.facebook.com"
          scopes={['basic']}
          onLoginSuccess={this.setIgToken}
          onLoginFailure={data => console.log(data)}
        />
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
)(AuthInstagram)
