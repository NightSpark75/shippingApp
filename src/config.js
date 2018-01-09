const app_name = 'PDASample'
const app_number = '201'
const major = '000'
const minor = '01'
const build = '00'

export default {
  name: app_name,
  app_number: app_number,
  version: parseInt(major) + '.' + parseInt(minor) + '.' + parseInt(build),
  version_number: parseInt(app_number + major + minor + build),
  url_version: 'http://172.17.100.51/api/native/pad/bundle/version/' + app_number,
  url_download: 'http://172.17.100.51/api/native/pad/bundle/download/' + app_number,

  route: {

  },
}