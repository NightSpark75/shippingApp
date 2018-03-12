const app_name = 'pickingApp'
const app_number = '201'
const major = '000'
const minor = '02'
const build = '00'
const protocol = 'http'
const host = '172.17.100.51'
const url = protocol + '://' + host

export default {
  name: app_name,
  app_number: app_number,
  version: parseInt(major) + '.' + parseInt(minor) + '.' + parseInt(build),
  version_number: parseInt(app_number + major + minor + build),
  url_version: 'http://172.17.100.51/api/native/pad/bundle/version/' + app_number,
  url_download: 'http://172.17.100.51/api/native/pad/bundle/download/' + app_number,

  route: {
    login: url + '/api/jwt/login',
    refresh: url + '/api/jwt/refresh',
  },
}