import { MutationTree } from 'vuex'
import * as types from './mutation-types'
import SmileState from '../types/SmileState'
import Customer from '../types/Customer'

export const mutations: MutationTree<SmileState> = {
  [types.CLEAR] (state) {
    state.customer = null
  },
  [types.SET_CUSTOMER] (state, customer: Customer) {
    state.customer = customer
  }
}
