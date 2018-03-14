import Toast from 'react-native-root-toast'
import base64 from 'base-64'
import Realm from 'realm'
import { systemRealm } from '../../realm/schema'

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
  let realm = new Realm({schema: [systemRealm]})
  realm.write(()=> {
    let data = realm.objects(systemRealm.name).filtered('id == "token"')
    if (data.length > 0) {
      data[0].value = token
    } else {
      realm.create(systemRealm.name, {id: 'token', value: token})
    }
  })
  realm.close()
}

export function removeToken() {
  let realm = new Realm({schema: [systemRealm]})
  realm.write(()=> {
    let data = realm.objects(systemRealm.name).filtered('id == "token"')
    realm.delete(data)
  })
  realm.close()
}

export function loadToken() {
  let realm = new Realm({schema: [systemRealm]})
  let token = ''
  realm.write(()=> {
    let data = realm.objects(systemRealm.name).filtered('id == "token"')
    if (data.length > 0) {
      token = data[0].value
    }
  })
  realm.close()
  return token
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