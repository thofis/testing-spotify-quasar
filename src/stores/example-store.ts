import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    counter: 0,
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    increment() {
      this.counter++
    },
    decrement() {
      console.log('dec: ' + this.counter)
      this.counter--
    },
  },
})

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
  }),
  getters: {
    authenticated: (state) => state.token != '',
  },
  actions: {
    storeToken(token: string) {
      this.token = token
    },
  },
})

