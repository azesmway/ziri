import { combineReducers } from 'redux'

// Imports: Reducers
import onlineReducer from './onlineReducer'
import userReducer from './userReducer'

// Redux: Root Reducer
const rootReducer = combineReducers({
  onlineReducer: onlineReducer,
  userReducer: userReducer
})

// Exports
export default rootReducer
