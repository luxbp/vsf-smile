import { apiStatus } from '../../../lib/util'
import { Router } from 'express'
import crypto from 'crypto'

module.exports = ({ config, db }) => {

  let smileApi = Router()

  /**
   * Generate Digest
   */
  smileApi.get('/digest/:customerId', (req, res) => {
    let customerId = req.params.customerId,
      secret = config.extensions.smile.api.key,
      text = customerId + secret,
      digest = crypto.createHash('md5').update(text).digest('hex')

    apiStatus(res, { digest }, 200)
  })

  /**
   * Activities
   */
  smileApi.post('/activities', (req, res) => {
    let activity = req.body.activity

    if (!activity || !activity.customer_id || !activity.token) {
      apiStatus(res, {
        error: 'Activity is required'
      }, 422)
      return
    }

    if (config.extensions.smile.demo) {
      apiStatus(res, { status: 'OK' }, 200)
      return
    }

    let request = require('request')
    request({
      url: config.extensions.smile.api.url + '/activities',
      method: 'POST',
      auth: {
        bearer: config.extensions.smile.api.key
      },
      json: true,
      body: {
        activity
      }
    }, (error, response, body) => {
      if (error) {
        apiStatus(res, error, 500)
      } else if (body.hasOwnProperty('error')) {
        apiStatus(res, body.error, 500)
      } else {
        apiStatus(res, body, 200)
      }
    })
  })

  /**
   * Customers
   */
  smileApi.get('/customers/email/:email', (req, res) => {
    if (config.extensions.smile.demo) {
      let result = {
        "customers": [
          {
            "id": 10,
            "first_name": "Fred",
            "last_name": "Flinstone",
            "email": req.params.email,
            "date_of_birth": "1988-07-24",
            "points_balance": 4700,
            "referral_url": "http://i.refs.cc/9qr5Pw",
            "vip_tier_id": null,
            "state": "member",
            "created_at": "2019-01-08T11:12:14.111Z",
            "updated_at": "2019-01-08T11:12:14.111Z"
          },
          {
            "id": 9,
            "first_name": "Arthur",
            "last_name": "Read",
            "email": req.params.email,
            "date_of_birth": "1999-02-14",
            "points_balance": 2300,
            "referral_url": "http://i.refs.cc/5ps3Pk",
            "vip_tier_id": null,
            "state": "member",
            "created_at": "2018-11-03T12:05:29.121Z",
            "updated_at": "2018-11-03T12:05:29.121Z"
          }
        ],
        "metadata": {
          "next_cursor": "aWQ6MixkaXJlY3Rpb246bmV4dA==",
          "previous_cursor": null
        }
      }
      apiStatus(res, result, 200)
      return
    }

    let request = require('request')
    request({
      url: config.extensions.smile.api.url + '/customers',
      method: 'GET',
      auth: {
        bearer: config.extensions.smile.api.key
      },
      json: true,
      qs: {
        email: req.params.email
      }
    }, (error, response, body) => {
      if (error) {
        apiStatus(res, error, 500)
      } else if (body.hasOwnProperty('error')) {
        apiStatus(res, body.error, 500)
      } else {
        apiStatus(res, body.customers, 200)
      }
    })
  })

  smileApi.get('/customers/:id', (req, res) => {

    if (config.extensions.smile.demo) {
      let result = {
        "customer": {
          "id": req.params.id,
          "first_name": "Jane",
          "last_name": "Bond",
          "email": "jane@smile.io",
          "state": "member",
          "date_of_birth": "1967-10-29",
          "points_balance": 5000,
          "referral_url": "http://i.refs.cc/j2Fw55",
          "vip_tier_id": null,
          "created_at": "2017-04-04T15:10:42.030Z",
          "updated_at": "2017-04-04T15:10:42.030Z"
        }
      }
      apiStatus(res, result, 200)
      return
    }

    let request = require('request')
    request({
      url: config.extensions.smile.api.url + '/customers/' + req.params.id,
      method: 'GET',
      auth: {
        bearer: config.extensions.smile.api.key
      },
      json: true,
      qs: req.query
    }, (error, response, body) => {
      if (error) {
        apiStatus(res, error, 500)
      } else if (body.hasOwnProperty('error')) {
        apiStatus(res, body.error, 500)
      } else {
        apiStatus(res, body, 200)
      }
    })
  })

  smileApi.get('/customers', (req, res) => {

    if (config.extensions.smile.demo) {
      let result = {
        "customers": [
          {
            "id": 10,
            "first_name": "Fred",
            "last_name": "Flinstone",
            "email": "fred@smile.io",
            "date_of_birth": "1988-07-24",
            "points_balance": 4700,
            "referral_url": "http://i.refs.cc/9qr5Pw",
            "vip_tier_id": null,
            "state": "member",
            "created_at": "2019-01-08T11:12:14.111Z",
            "updated_at": "2019-01-08T11:12:14.111Z"
          },
          {
            "id": 9,
            "first_name": "Arthur",
            "last_name": "Read",
            "email": "arthur@smile.io",
            "date_of_birth": "1999-02-14",
            "points_balance": 2300,
            "referral_url": "http://i.refs.cc/5ps3Pk",
            "vip_tier_id": null,
            "state": "member",
            "created_at": "2018-11-03T12:05:29.121Z",
            "updated_at": "2018-11-03T12:05:29.121Z"
          }
        ],
        "metadata": {
          "next_cursor": "aWQ6MixkaXJlY3Rpb246bmV4dA==",
          "previous_cursor": null
        }
      }
      apiStatus(res, result, 200)
      return
    }

    let request = require('request')
    request({
      url: config.extensions.smile.api.url + '/customers',
      method: 'GET',
      auth: {
        bearer: config.extensions.smile.api.key
      },
      json: true,
      qs: req.query
    }, (error, response, body) => {
      if (error) {
        apiStatus(res, error, 500)
      } else if (body.hasOwnProperty('error')) {
        apiStatus(res, body.error, 500)
      } else {
        apiStatus(res, body, 200)
      }
    })
  })

  /**
   * Points Products
   */
  smileApi.get('/points_products/:id', (req, res) => {

    if (config.extensions.smile.demo) {
      let result = {
        "points_product": {
          "id": req.params.id,
          "exchange_type": "fixed",
          "exchange_description": "500 Pins",
          "points_price": 500,
          "variable_points_step": null,
          "variable_points_step_reward_value": null,
          "variable_points_min": null,
          "variable_points_max": null,
          "reward": {
            "id": 228015,
            "name": "Free T-shirt",
            "description": null,
            "image_url": "https://platform-images.smilecdn.co/3755938.png",
            "created_at": "2017-12-07T20:15:27.881Z",
            "updated_at": "2017-12-07T20:15:27.881Z"
          },
          "created_at": "2017-12-07T20:15:27.893Z",
          "updated_at": "2017-12-07T20:15:27.893Z"
        }
      }
      apiStatus(res, result, 200)
      return
    }

    let request = require('request')
    request({
      url: config.extensions.smile.api.url + '/points_products/' + req.params.id,
      method: 'GET',
      auth: {
        bearer: config.extensions.smile.api.key
      },
      json: true
    }, (error, response, body) => {
      if (error) {
        apiStatus(res, error, 500)
      } else if (body.hasOwnProperty('error')) {
        apiStatus(res, body.error, 500)
      } else {
        apiStatus(res, body, 200)
      }
    })
  })

  smileApi.post('/points_products/:id/purchase', (req, res) => {

    let { customer_id, points_to_spend } = req.body

    if (!customer_id) {
      apiStatus(res, {
        error: 'Customer ID is required'
      }, 422)
      return
    }

    if (config.extensions.smile.demo) {
      let result = {
        "points_purchase": {
          "id": 81,
          "customer_id": customer_id,
          "points_product_id": req.params.id,
          "points_spent": points_to_spend,
          "reward_fulfillment": {
            "id": 137,
            "name": "$5 off",
            "code": "discount-e26d02e39149",
            "created_at": "2017-05-15T08:35:08.883Z",
            "updated_at": "2017-05-15T08:35:08.883Z"
          },
          "created_at": "2017-05-15T08:35:08.920Z",
          "updated_at": "2017-05-15T08:35:08.920Z"
        }
      }
      apiStatus(res, result, 200)
      return
    }

    let request = require('request')
    request({
      url: config.extensions.smile.api.url + '/points_products/' + req.params.id + '/purchase',
      method: 'POST',
      auth: {
        bearer: config.extensions.smile.api.key
      },
      json: true,
      body: {
        customer_id,
        points_to_spend
      }
    }, (error, response, body) => {
      if (error) {
        apiStatus(res, error, 500)
      } else if (body.hasOwnProperty('error')) {
        apiStatus(res, body.error, 500)
      } else {
        apiStatus(res, body, 200)
      }
    })
  })

  smileApi.get('/points_products', (req, res) => {

    if (config.extensions.smile.demo) {
      let result = {
        "points_products": [
          {
            "id": 133577,
            "exchange_type": "fixed",
            "exchange_description": "500 Pins",
            "points_price": 500,
            "variable_points_step": null,
            "variable_points_step_reward_value": null,
            "variable_points_min": null,
            "variable_points_max": null,
            "reward": {
              "id": 228015,
              "name": "Free T-shirt",
              "description": null,
              "image_url": "https://platform-images.smilecdn.co/3755938.png",
              "created_at": "2017-12-07T20:15:27.881Z",
              "updated_at": "2017-12-07T20:15:27.881Z"
            },
            "created_at": "2017-12-07T20:15:27.893Z",
            "updated_at": "2017-12-07T20:15:27.893Z"
          },
          {
            "id": 113700,
            "exchange_type": "fixed",
            "points_price": 1000,
            "variable_points_step": null,
            "variable_points_step_reward_value": null,
            "variable_points_min": null,
            "variable_points_max": null,
            "exchange_description": "1000 Pins",
            "reward": {
              "id": 162070,
              "name": "Free Blue Sunglasses",
              "description": null,
              "image_url": "https://platform-images.smilecdn.co/3755938.png",
              "created_at": "2017-08-16T16:51:54.736Z",
              "updated_at": "2017-08-16T16:51:54.736Z"
            },
            "created_at": "2017-08-16T16:51:54.748Z",
            "updated_at": "2017-09-08T00:11:19.000Z"
          }
        ]
      }
      apiStatus(res, result, 200)
      return
    }

    let request = require('request')
    request({
      url: config.extensions.smile.api.url + '/points_products',
      method: 'GET',
      auth: {
        bearer: config.extensions.smile.api.key
      },
      json: true,
      qs: req.query
    }, (error, response, body) => {
      if (error) {
        apiStatus(res, error, 500)
      } else if (body.hasOwnProperty('error')) {
        apiStatus(res, body.error, 500)
      } else {
        apiStatus(res, body, 200)
      }
    })
  })

  /**
   * Points Transactions
   */
  smileApi.post('/points_transactions', (req, res) => {

    let points_transaction = req.body.points_transaction

    if (!points_transaction || !points_transaction.customer_id || !points_transaction.points_change || !points_transaction.description) {
      apiStatus(res, {
        error: 'Points transaction is required'
      }, 422)
      return
    }

    if (config.extensions.smile.demo) {
      let result = {
        "points_transaction": {
          "id": 133577,
          "customer_id": points_transaction.customer_id,
          "points_change": points_transaction.points_change,
          "description": points_transaction.description,
          "internal_note": "This customer makes a purchase at least once a month and is always so cheery on support. Sending them a little token of appreciation.",
          "created_at": "2017-12-07T20:15:27.893Z",
          "updated_at": "2017-12-07T20:15:27.893Z"
        }
      }
      apiStatus(res, result, 200)
      return
    }

    let request = require('request')
    request({
      url: config.extensions.smile.api.url + '/points_transactions',
      method: 'POST',
      auth: {
        bearer: config.extensions.smile.api.key
      },
      json: true,
      body: {
        points_transaction
      }
    }, (error, response, body) => {
      if (error) {
        apiStatus(res, error, 500)
      } else if (body.hasOwnProperty('error')) {
        apiStatus(res, body.error, 500)
      } else {
        apiStatus(res, body, 200)
      }
    })
  })

  smileApi.get('/points_transactions/:id', (req, res) => {

    if (config.extensions.smile.demo) {
      let result = {
        "points_transaction": {
          "id": 133577,
          "customer_id": 1,
          "points_change": 500,
          "description": "Placed an order",
          "internal_note": null,
          "created_at": "2017-12-07T20:15:27.893Z",
          "updated_at": "2017-12-07T20:15:27.893Z"
        }
      }
      apiStatus(res, result, 200)
      return
    }

    let request = require('request')
    request({
      url: config.extensions.smile.api.url + '/points_transactions/' + req.params.id,
      method: 'GET',
      auth: {
        bearer: config.extensions.smile.api.key
      },
      json: true
    }, (error, response, body) => {
      if (error) {
        apiStatus(res, error, 500)
      } else if (body.hasOwnProperty('error')) {
        apiStatus(res, body.error, 500)
      } else {
        apiStatus(res, body, 200)
      }
    })
  })

  smileApi.get('/points_transactions', (req, res) => {

    if (config.extensions.smile.demo) {
      let result = {
        "points_transactions": [
          {
            "id": 133578,
            "customer_id": 1,
            "points_change": -500,
            "description": "Spent points on reward - $5 off",
            "internal_note": null,
            "created_at": "2017-12-07T20:15:27.893Z",
            "updated_at": "2017-12-07T20:15:27.893Z"
          },
          {
            "id": 133577,
            "customer_id": 1,
            "points_change": 500,
            "description": "Placed an order",
            "internal_note": null,
            "created_at": "2017-12-07T20:15:27.893Z",
            "updated_at": "2017-12-07T20:15:27.893Z"
          }
        ]
      }
      apiStatus(res, result, 200)
      return
    }

    let request = require('request')
    request({
      url: config.extensions.smile.api.url + '/points_transactions',
      method: 'GET',
      auth: {
        bearer: config.extensions.smile.api.key
      },
      json: true,
      qs: req.query
    }, (error, response, body) => {
      if (error) {
        apiStatus(res, error, 500)
      } else if (body.hasOwnProperty('error')) {
        apiStatus(res, body.error, 500)
      } else {
        apiStatus(res, body, 200)
      }
    })
  })

  /**
   * Events
   */
  smileApi.post('/event/:entity/:action', (req, res) => {

    let topic = req.params.entity + '/' + req.params.action

    let data = req.body.data

    if (!data) {
      apiStatus(res, {
        error: 'Data is required'
      }, 422)
      return
    }

    let request = require('request')
    request({
      url: config.extensions.smile.api.url + '/events',
      method: 'POST',
      auth: {
        bearer: config.extensions.smile.api.key
      },
      json: true,
      body: {
        event: {
          topic,
          data
        }
      }
    }, (error, response, body) => {
      if (error) {
        apiStatus(res, error, 500)
      } else {
        apiStatus(res, body, response.statusCode)
      }
    })
  })

  return smileApi
}
