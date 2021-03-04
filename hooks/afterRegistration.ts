import fetch from 'isomorphic-fetch'
import { adjustMultistoreApiUrl } from '@vue-storefront/core/lib/multistore'
import rootStore from '@vue-storefront/core/store'
import { KEY } from '../index'
import * as types from '../store/mutation-types'
import { isServer } from '@vue-storefront/core/helpers'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import Vue from 'vue'

const init = async (context, config, store) => {
  let digest = null

  if (store.state.smile.customerExternalId) {
    let url = config.smile.endpoint
    url += '/digest/' + store.state.smile.customerExternalId
    url = config.storeViews.multistore ? adjustMultistoreApiUrl(url) : url

    const resp = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json'
      }
    })
    const { code, result } = await resp.json()

    if (code !== 200) {
      return
    }

    digest = result.digest
  }

  let docBody = context.document.getElementsByTagName('body')[0]
  let initTag = context.document.createElement('div')

  initTag.className = 'sweettooth-init'
  initTag.setAttribute('data-channel-api-key', config.smile.public_key)
  if (digest) {
    initTag.setAttribute('data-external-customer-id', store.state.smile.customerExternalId)
    initTag.setAttribute('data-customer-auth-digest', digest)
  }
  docBody.appendChild(initTag)

  let launcherTag = context.document.createElement('div')
  launcherTag.className = 'sweettooth-launcher'
  docBody.appendChild(launcherTag)

  let jsUrl = 'https://cdn.sweettooth.io/assets/storefront.js'
  let docHead = context.document.getElementsByTagName('head')[0]
  let docScript = context.document.getElementById('smile-script')

  if (docScript) {
    if (digest) {
      await store.dispatch(KEY + '/getCustomerWithToken', digest)

      context.Smile.setIdentifiedCustomer({
        customer: store.state.smile.customer,
        auth_token: store.state.smile.customerAuthToken
      })
    }

    context.SmileUI.init({
      channel_key: config.smile.public_key
    })
  } else {
    docScript = context.document.createElement('script')
    docScript.type = 'text/javascript'
    docScript.async = true
    docScript.src = jsUrl
    docScript.id = 'smile-script'
    docHead.appendChild(docScript)
  }
}

const destroy = async (context) => {
  let docBody = context.document.getElementsByTagName('body')[0]
  let initTag = context.document.getElementsByClassName('sweettooth-init')[0]
  let launcherTag = context.document.getElementsByClassName('sweettooth-launcher')[0]

  if (initTag) {
    docBody.removeChild(initTag)
  }
  if (launcherTag) {
    docBody.removeChild(launcherTag)
  }

  context.Smile.setIdentifiedCustomer({
    customer: null,
    auth_token: null
  })
  context.SmileUI.destroy()
}

export function afterRegistration (appConfig, store) {
  if (!isServer && appConfig.smile && appConfig.smile.public_key) {
    const w: any = window

    const reInitUI = () => {
      const _ri = () => {
        const launcher = document.getElementsByClassName('smile-launcher-frame-container')[0]

        if (launcher) {
          if (launcher.classList.contains('smile-launcher-closed')) {
            destroy(w)
            init(w, appConfig, store)
          }

          w.removeEventListener('sweettooth-ready', _ri)
        }
      }

      if (w.Smile) {
        _ri()
      } else {
        w.addEventListener('sweettooth-ready', _ri)
      }
    }

    init(w, appConfig, store)

    let reInitInterval

    EventBus.$on('user-after-loggedin', async receivedData => {
      store.commit(KEY + '/' + types.SET_CUSTOMER_EXTERNAL_ID, receivedData.id)
      if (receivedData.extension_attributes.hasOwnProperty('smile_id')) {
        await store.dispatch(KEY + '/getCustomerById', receivedData.extension_attributes.smile_id)
      } else {
        await store.dispatch(KEY + '/getCustomerByEmail', receivedData.email)
      }

      if (!store.state.smile.customer) {
        await store.dispatch(KEY + '/customerUpdated', receivedData)
        await store.dispatch(KEY + '/getCustomerByEmail', receivedData.email)
      }

      reInitUI()

      reInitInterval = setInterval(reInitUI, 60000)
    })

    EventBus.$on('user-before-logout', () => {
      store.commit(KEY + '/' + types.CLEAR)

      clearInterval(reInitInterval)

      reInitUI()
    })

    EventBus.$on('order-after-placed', event => {
      let cart = rootStore.state.cart
      let order = {
        ...event.order,
        cart
      }
      store.dispatch(KEY + '/orderUpdated', order)
    })

    EventBus.$on('smile-points-spent', () => {
      reInitUI()
    })
  }
}
