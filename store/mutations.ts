import { MutationTree } from 'vuex'
import * as types from './mutation-types'
import SmileState from '../types/SmileState'
import Customer from '../types/Customer'
import PointsProduct from '../types/PointsProduct'

export const mutations: MutationTree<SmileState> = {
  [types.CLEAR] (state) {
    state.customer = null
    state.customerExternalId = null
    state.pointsProducts = []
  },
  [types.SET_CUSTOMER] (state, customer: Customer) {
    state.customer = customer
  },
  [types.UPDATE_CUSTOMER] (state, patch: object) {
    state.customer = Object.assign({}, state.customer, patch)
  },
  [types.SET_CUSTOMER_EXTERNAL_ID] (state, externalId: string) {
    state.customerExternalId = externalId
  },
  [types.SET_CUSTOMER_AUTH_TOKEN] (state, customerAuthToken: string) {
    state.customerAuthToken = customerAuthToken
  },
  [types.SET_POINTS_PRODUCTS] (state, pointsProducts: PointsProduct[]) {
    state.pointsProducts = pointsProducts
  }
}
