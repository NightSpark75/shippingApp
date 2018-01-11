import { AsyncStorage } from 'react-native'
import config from '../../config'
const app = '@' + config.name + ':'

const key = {
  token: app + 'token',  // 記錄使用者類別
  update: app + 'update', // 是否檢查更新
}

export class LocalStorage {
  // AsyncStorage.setItem('@MySuperStore:key', 'I like to save it.')
  // getItem(key, callback?)
  // removeItem(key, callback?) 


  async init() {
    this.initValue(key.token, null)
    this.initValue(key.update, false)
  }

  async initValue(key, value) {
    try {
      let current_value = await AsyncStorage.getItem(key)
      if (current_value === null) {
        await AsyncStorage.setItem(key, value)
      }
    } catch (error) {
      console.log('key:' + key + ' init error:' + error)
    }
  }

  async setValue(key, value) {
    await AsyncStorage.setItem(app + key, value)
  }

  async getValue(key) {
    return await AsyncStorage.getItem(app + key)
  }
}