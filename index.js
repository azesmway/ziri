/**
 * @format
 */

import { AppRegistry } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store/store'
import { PersistGate } from 'redux-persist/es/integration/react'
import React from 'react'

const ZIRI = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
)

AppRegistry.registerComponent(appName, () => ZIRI)
