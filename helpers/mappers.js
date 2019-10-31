export const mapCustomer = (user) => {
  return {
    'external_id': user.id.toString(),
    'first_name': user.firstname,
    'last_name': user.lastname,
    'email': user.email,
    'external_created_at': (new Date(user.created_at)).toISOString(),
    'external_updated_at': (new Date(user.updated_at)).toISOString()
  }
}

export const mapOrder = (order) => {
  return {
    'external_id': order.id.toString(),
    'subtotal': order.cart.platformTotals.subtotal,
    'grand_total': order.cart.platformTotals.grand_total,
    'rewardable_total': order.cart.platformTotals.subtotal,
    'external_created_at': (new Date(order.created_at)).toISOString(),
    'external_updated_at': (new Date(order.updated_at)).toISOString(),
    'payment_status': 'paid'
    // 'coupons': [
    //   { 'code': '5off-j2n5jduwjttj' }
    // ]
  }
}
