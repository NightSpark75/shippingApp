import { AsyncStorage } from 'react-native';

const key_list = [
    {name: '@stdnative:user_class'}, // 記錄使用者類別
];

export default class LocalStorage {
    // AsyncStorage.setItem('@MySuperStore:key', 'I like to save it.');
    // getItem(key, callback?)
    // removeItem(key, callback?) 
    

    async init() {
        this.initValue('@stdnative:user_class', 'DEF');
        
    }

    async initValue(key, value) {
        try {
            let current_value = await AsyncStorage.getItem(key);
            if (current_value === null) {
                await AsyncStorage.setItem(key, value);
            } 
        } catch (error) {
            console.log('key:' + key + ' init error:' + error);
        }
    }

    async getValue(key) {
        return await AsyncStorage.getItem(key);
    }
}