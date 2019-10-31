import SmileState from '../types/SmileState'
import { GetterTree } from 'vuex'

export const getters: GetterTree<SmileState, any> = {
  getPointsProductsSorted: state => state.pointsProducts.sort((a, b) => a.points_price - b.points_price),
  getCustomerPoints: state => state.customer ? state.customer.points_balance : 0,
  getCustomerPointsInCents: state => state.customer ? state.customer.points_balance / 100 : 0,
}
