import axios from 'axios'
import { loadToken } from '../lib'
import config from '../config'

export function savePieces(data, success, error) {
  let token = loadToken()
  const Auth = 'Bearer ' + token
  let formData = new FormData()
  formData.append('spno', data.tmy59spno)
  formData.append('date', data.tmtrdj)
  formData.append('pieces', data.pieces)
  axios.post(config.route.shippingPieces, formData, { headers: { Authorization: Auth } })
  .then((res) => {
    success(res)
  }).catch((err) => {
    error(err)
  })
}

export function getShippingInfo(spno, success, error) {
  let token = loadToken()
  const Auth = 'Bearer ' + token
  axios.get(config.route.shipping + spno + '/' + config.date, { headers: { Authorization: Auth } })
  .then((res) => {
    success(res)
  }).catch((err) => {
    error(err)
  })
}