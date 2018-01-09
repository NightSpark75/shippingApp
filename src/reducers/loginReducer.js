import {
  LOGIN_USER,
  USER_MENU,
} from '../constants/actionType'

const initalState = {
  user_info: '',
  user_menu: [],
}

export default function login(state = initalState, action) {
  switch (action.type) {
      case LOGIN_USER:
          return Object.assign({}, state, {
              user_info: action.user_info
          })
      case USER_MENU:
          return Object.assign({}, state, {
              user_menu: action.user_menu
          })
      default:
          return state
  }
}
