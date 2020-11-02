const initialState = {
  userData: {}
}

// Reducers (Modifies The State And Returns A New State)
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'USER': {
      return {
        // State
        ...state,
        // Redux Store
        userData: action.userData
      }
    }
    // Default
    default: {
      return state
    }
  }
}

// Exports
export default userReducer
