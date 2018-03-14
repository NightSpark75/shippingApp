import Realm from 'realm'
import { itemsRealm, pickingRealm } from '../../realm/schema'
import { 
  addRealmData, 
  updateRealmData,
  deleteAllRealmData, 
  deleteOneRealmData,
  fetchAllRealmData, 
  fetchRealmData,
} from '../../realm'

export function startPicking(picking) {
  deleteAllRealmData(pickingRealm)
  addRealmData(pickingRealm, [picking])
}

export function removePicking() {
  deleteAllRealmData(pickingRealm)
}

export function startItems(items) {
  deleteAllRealmData(itemsRealm)
  addRealmData(itemsRealm, items)
}

export function removeItems() {
  deleteAllRealmData(itemsRealm)
}

export function getAllItems() {
  return fetchAllRealmData(itemsRealm)
}
export function updateItems(item) {
  updateRealmData(itemsRealm, [item])
}

export function pickedItems(item) {
  let realm = new Realm({schema: [itemsRealm]})
  realm.write(() => {
    let obj = realm.objects(itemsRealm.name)
    let data = obj.filtered('psrmk == "' + item.psrmk + '" AND pslitm == "' + item.pslitm + '" AND pslotn == "' + item.pslotn + '"')
    data[0].picked = 1
  })
  let newItems = fetchAllRealmData(itemsRealm)
  return newItems
}