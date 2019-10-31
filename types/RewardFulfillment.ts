import Reward from './Reward'

export default interface RewardFulfillment extends Reward {
  code: string,
  used_at: Date
}
