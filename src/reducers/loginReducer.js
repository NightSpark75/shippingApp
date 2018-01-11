import {
  USER_LOGIN,
  USER_LOGOUT,
} from '../constants/actionType'

const initalState = {
  user: {},
}

export default function login(state = initalState, action) {
  switch (action.type) {
    case USER_LOGIN:
      return Object.assign({}, state, {
        user: action.user
      })
    case USER_LOGOUT:
      return Object.assign({}, state, {
        user: {},
      })
    default:
      return state
  }
}
