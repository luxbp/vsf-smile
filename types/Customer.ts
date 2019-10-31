export default interface Customer {
  id: number,
  external_id: string,
  first_name: string,
  last_name: string,
  email: string,
  state: string,
  date_of_birth: Date,
  points_balance: number,
  referral_url: string,
  vip_tier_id: number,
  created_at: Date,
  updated_at: Date
}
