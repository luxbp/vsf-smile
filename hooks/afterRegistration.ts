export function afterRegistration({ Vue, config, store, isServer }) {
  Vue.prototype.$bus.$on('user-before-logout', () => {
    store.commit('smile/CLEAR')
  })

  Vue.prototype.$bus.$on('user-after-loggedin', receivedData => {
    if (receivedData.extension_attributes.hasOwnProperty('smile_id')) {
      store.dispatch('smile/getCustomerById', receivedData.extension_attributes.smile_id)
    } else {
      store.dispatch('smile/getCustomerByEmail', receivedData.email)
    }
  })
}
