import RewardFulfillment from './RewardFulfillment'

export default interface PointsPurchase {
  id: number,
  customer_id: number,
  points_product_id: number,
  points_spent: number,
  reward_fulfillment: RewardFulfillment,
  created_at: Date,
  updated_at: Date
}