import Customer from './Customer'
import PointsProduct from './PointsProduct'

// This object should represent structure of your modules Vuex state
// It's a good practice is to name this interface accordingly to the KET (for example mailchimpState)
export default interface SmileState {
  customer: Customer,
  customerExternalId: string,
  customerAuthToken: string,
  pointsProducts: PointsProduct[]
}
