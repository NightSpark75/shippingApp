import axios from 'axios'
import config from '../config'

export function login(id, password, success, error) {
  let formData = new FormData()
  formData.append('id', id)
  formData.append('password', password)
  formData.append('prg', config.programID)
  axios.post(config.route.login, formData)
  .then((res) => {
    success(res)
  }).catch((err) => {
    error(err)
  })
}