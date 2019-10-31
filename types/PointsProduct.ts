import Reward from './Reward'

export default interface PointsProduct  {
  id: number,
  exchange_type: string,
  exchange_description?: string,
  points_price: number,
  variable_points_step?: number,
  variable_points_step_reward_value?: number,
  variable_points_min?: number,
  variable_points_max?: number,
  reward: Reward,
  created_at: Date,
  updated_at: Date
}