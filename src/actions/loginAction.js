import { 
  LOGIN_USER,
  USER_MENU,
} from '../constants/actionType'

export function login_user(user_info) {
  return {type: LOGIN_USER, user_info}
}

export function user_menu(user_menu) {
  return {type: USER_MENU, user_menu}
}