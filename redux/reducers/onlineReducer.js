const initialState = {
  onlineIn: false
}

// Reducers (Modifies The State And Returns A New State)
const onlineReducer = (state = initialState, action) => {
  switch (action.type) {
    // Login
    case 'ONLINE': {
      return {
        // State
        ...state,
        // Redux Store
        onlineIn: action.trueFalse
      }
    }
    // Default
    default: {
      return state
    }
  }
}

// Exports
export default onlineReducer
