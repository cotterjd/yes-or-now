import Vue from "vue"
import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

const defaultState = {
  addingName: false,
  gameStarted: false,
  playerTurn: '',
  players: [],
  statement: '',
}

export default createStore({
  state: defaultState,
  getters: {
  },
  mutations: {
    updateState(state, newState) {
      Object.assign(state, newState)
    }
  },
  actions: {
    enterGame({ commit, state }, data) {
      const newState = {
        players: Array.from(new Set([...state.players, data.player])),
        addingName: false,
        gameStarted: true,
      }
      data.socket.send(JSON.stringify(newState)) 
      commit('updateState', newState)
    },
    startStopGame({ commit, state }, socket) {
      const newState = state.gameStarted ? defaultState : {
        addingName: true
      }
      socket.send(JSON.stringify(newState)) 
      commit('updateState', newState)
    },
  },
  modules: {
  },
  plugins: [createPersistedState()],
})
