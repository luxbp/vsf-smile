import { Module } from 'vuex'
import { mutations } from './mutations'
import { getters } from './getters'
import { actions } from './actions'
import { state } from './state'
import SmileState from '../types/SmileState'

export const module: Module<SmileState, any> = {
    namespaced: true,
    mutations,
    actions,
    getters,
    state
}
