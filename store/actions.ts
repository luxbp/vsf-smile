import SmileState from '../types/SmileState'
import { ActionTree } from 'vuex'
import * as types from './mutation-types'
import config from 'config'
import fetch from 'isomorphic-fetch'
import { adjustMultistoreApiUrl } from '@vue-storefront/core/lib/multistore'

export const actions: ActionTree<SmileState, any> = {
  async getCustomerByEmail ({ commit }, email) {
    let url = config.smile.endpoint
    url += '/customers/email/' + email
    url = config.storeViews.multistore ? adjustMultistoreApiUrl(url) : url

    const resp = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json'
      }
    })
    const json = await resp.json()
    console.log(json.result)
    if (json.result.customers && json.result.customers.length) {
      commit(types.SET_CUSTOMER, json.result.customers[0])
      return json.result.customers[0]
    }
    return json.result
  },

  async getCustomerById ({ commit }, customer_id) {
    let url = config.smile.endpoint
    url += '/customers/' + customer_id
    url = config.storeViews.multistore ? adjustMultistoreApiUrl(url) : url

    const resp = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json'
      }
    })
    const json = await resp.json()
    console.log(json.result)
    commit(types.SET_CUSTOMER, json.result.customer)
    return json.result.customer
  },

  async getCustomers ({}, params) {
    let url = config.smile.endpoint
    url += '/customers'
    url = config.storeViews.multistore ? adjustMultistoreApiUrl(url) : url
    url = new URL(url),
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

    const resp = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json'
      }
    })
    const json = await resp.json()
    console.log(json.result)
    return json.result
  }
}
