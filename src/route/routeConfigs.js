import Scan from '../containers/scan'
import Update from '../containers/update'
import Login from '../containers/login'
import Sample from '../containers/sample'
import SampleDetail from '../containers/sample/detail'
import ShippingInfo from '../containers/shipping/index'

export default {
  Scan: {
    screen: Scan,
    navigationOptions: ({ navigation }) => ({
      header: null,
      headerBackTitle: null,
    }),
  },
  Update: {
    screen: Update,
    natigationOptions: ({ navigation }) => ({
      header: null,
      headerBackTitle: null,
    }),
  },
  Login: {
    screen: Login,
    navigationOptions: ({ navigation }) => ({
      header: null,
      headerBackTitle: null,
    }),
  },
  Sample: {
    screen: Sample,
    navigationOptions: ({ navigation }) => ({
      header: null,
      headerBackTitle: null,
    }),
  },
  SampleDetail: {
    screen: SampleDetail,
    navigationOptions: ({ navigation }) => ({
      header: null,
      headerBackTitle: null,
    }),
  },
  ShippingInfo: {
    screen: ShippingInfo,
    navigationOptions: ({ navigation }) => ({
      header: null,
      headerBackTitle: null,
    })
  },
}