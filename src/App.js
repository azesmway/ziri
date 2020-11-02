import React from 'react'
import NetInfo from '@react-native-community/netinfo'
import { online } from '../redux/actions/onlineActions'
import { connect } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { Splash, AppMain, Auth, Pin, Profile, History, Support, Partners, More, Calc, Payment, Exit } from './screens'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { AppState } from 'react-native'
import { Icon } from 'react-native-elements'
import { t } from './utils/i18n'

const Stack = createStackNavigator()
const StackMain = createStackNavigator()
const Tab = createBottomTabNavigator()

function MainStack() {
  return (
    <StackMain.Navigator headerMode="none" initialRouteName="AppMain">
      <StackMain.Screen name="AppMain" component={AppMain} />
      <StackMain.Screen name="Calc" component={Calc} />
      <StackMain.Screen name="Payment" component={Payment} />
      <StackMain.Screen name="Exit" component={Exit} />
    </StackMain.Navigator>
  )
}

function MoreStack() {
  return (
    <StackMain.Navigator headerMode="none" initialRouteName="More">
      <StackMain.Screen name="More" component={More} />
      <StackMain.Screen name="Profile" component={Profile} />
    </StackMain.Navigator>
  )
}

function HomeTabs() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        // activeTintColor: 'tomato',
        // inactiveTintColor: 'gray',
        labelStyle: {
          fontSize: 14,
          fontWeight: 'bold'
        }
      }}
    >
      <Tab.Screen
        name="Home"
        component={MainStack}
        options={{
          tabBarLabel: t('account'),
          tabBarIcon: (props) => <Icon name="person-outline" type="MaterialIcons" color={props.color} size={props.size} />
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          tabBarLabel: t('history'),
          tabBarIcon: (props) => <Icon name="history" type="MaterialIcons" color={props.color} size={props.size} />
        }}
      />
      <Tab.Screen
        name="Partners"
        component={Partners}
        options={{
          tabBarLabel: t('partners'),
          tabBarIcon: (props) => <Icon name="people-outline" type="MaterialIcons" color={props.color} size={props.size} />
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreStack}
        options={{
          tabBarLabel: t('more'),
          tabBarIcon: (props) => <Icon name="more-horiz" type="MaterialIcons" color={props.color} size={props.size} />
        }}
      />
    </Tab.Navigator>
  )
}

class App extends React.PureComponent {
  constructor(props, content) {
    super(props, content)

    AppState.addEventListener('change', this.handleAppStateChange)
  }

  componentDidMount = async () => {
    const { reduxOnline } = this.props

    this.unsubscribe = NetInfo.addEventListener((state) => {
      reduxOnline(state.isConnected)
    })
  }

  handleAppStateChange = (nextAppState) => {
    // TODO Сделать сброс сессии после 10 мин
    console.log('nextAppState', nextAppState)
  }

  render() {
    return (
      <NavigationContainer onStateChange={(state) => {}}>
        <Stack.Navigator initialRouteName="Splash" headerMode="none">
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Auth" component={Auth} />
          <Stack.Screen name="Pin" component={Pin} />
          <Stack.Screen name="App" component={HomeTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    onlineIn: state.onlineReducer.onlineIn
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    reduxOnline: (trueFalse) => dispatch(online(trueFalse))
  }
}

// Exports
export default connect(mapStateToProps, mapDispatchToProps)(App)
