<template>
  <div v-if="pointsProductsOptions.length">
    <template v-if="affordablePointsProductsOptions.length">
      <vue-slider v-model="selected" :data="affordablePointsProductsOptions" :tooltip="tooltip" :tooltip-formatter="tooltipFormatter" :contained="true" />
      <slot name="button" :can-afford="canAfford" :purchase-reward="purchaseReward">
        <button class="button" type="submit" :disabled="!canAfford" @click="purchaseReward">{{ $t('Apply') }}</button>
      </slot>
    </template>
    <h4 v-else>{{ $t('No points') }}</h4>
  </div>
</template>

<script>
import i18n from '@vue-storefront/i18n'
import VueSlider from 'vue-slider-component/dist-css/vue-slider-component.umd.min.js'
import 'vue-slider-component/dist-css/vue-slider-component.css'
import 'vue-slider-component/theme/default.css'
import { KEY } from '../index'

export default {
  name: 'SmileRewardSlider',
  components: {
    VueSlider
  },
  props: {
    tooltip: {
      type: String,
      required: false,
      default: 'always'
    },
    tooltipFormatter: {
      type: Function,
      required: false,
      default: (item) => {
        return item ? item.reward.value : 0
      }
    }
  },
  data () {
    return {
      selected: null
    }
  },
  computed: {
    customer () {
      return this.$store.state.customer
    },
    balance () {
      return this.$store.getters[KEY + '/getCustomerPoints']
    },
    pointsProductsOptions () {
      return this.$store.getters[KEY + '/getPointsProductsSorted']
    },
    affordablePointsProductsOptions () {
      return this.pointsProductsOptions.filter(item => item.points_price <= this.balance)
    },
    canAfford () {
      return this.balance && this.selected && this.selected.points_price <= this.balance
    }
  },
  async mounted () {
    await this.$store.dispatch(KEY + '/getPointsProducts', { exchange_type: 'fixed' })

    if (this.pointsProductsOptions.length) {
      this.selected = this.pointsProductsOptions[0]
    }
  },
  methods: {
    async purchaseReward () {
      if (this.canAfford) {
        this.$store.dispatch(KEY + '/purchasePointsProducts', this.selected).then((pointsPurchase) => {
          let discountCode = pointsPurchase.fulfilled_reward.code

          this.$emit('reward-purchased', discountCode)

          this.$store.dispatch(KEY + '/updateCustomerBalance', this.customer.points_balance - pointsPurchase.points_spent)
          this.$store.dispatch(KEY + '/getCustomerById', this.customer.id)
          this.$bus.$emit('smile-points-spent')
        }).catch((err) => {
          this.$store.dispatch('notification/spawnNotification', {
            type: 'error',
            message: i18n.t(err.message),
            action1: { label: i18n.t('OK') }
          })
        })
      }
    }
  }
}
</script>