import Toast from 'react-native-root-toast'
import base64 from 'base-64'
import { systemRealm } from '../../realm/schema/system'
import { 
  addRealmData, 
  updateRealmData,
  deleteAllRealmData, 
  deleteOneRealmData,
  fetchAllRealmData, 
  fetchRealmData,
} from '../../realm'

export function jwtPayload(token) {
  try {
    const code = token.split('.')[1]
    let payload = base64.decode(code)
    return JSON.parse(payload)
  } catch (e) {
    return null;
  }
}

export function saveToken(token) {
  let data = fetchRealmData(systemRealm, 'id == \'token\'')
  if (data.length > 0) {
    data[0].value = token
    updateRealmData(systemRealm, data)
  }
  addRealmData(systemRealm, [{id: 'token', value: token}])
}

export function removeToken() {
  deleteOneRealmData(systemRealm, 'id == \'token\'')
}

export function loadToken() {
  let data = fetchRealmData(systemRealm, 'id == \'token\'')
  if (data.length > 0) {
    return data[0].value
  }
  return ''
}

export function toast(message) {
  /*****
   * option
   * duration: Toast.durations.LONG, // toast显示时长
   * position: Toast.positions.BOTTOM, // toast位置
   * shadow: true, // toast是否出现阴影
   * animation: true, // toast显示/隐藏的时候是否需要使用动画过渡
   * hideOnPress: true, // 是否可以通过点击事件对toast进行隐藏
   * delay: 0, // toast显示的延时
   * onShow: () => { // toast出现回调（动画开始时） }
   * onShown: () => { // toast出现回调（动画结束时） }
   * onHide: () => { // toast隐藏回调（动画开始时） }
   */
  Toast.show(message, {position: Toast.positions.BOTTOM})
}