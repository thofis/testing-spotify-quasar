import { defineStore } from 'pinia'
import TopItems = MyTypes.TopItems

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
    clientId: import.meta.env.VITE_CLIENT_ID,
  }),
  getters: {
    authenticated: (state) => state.token !== undefined && state.token != '',
  },
  actions: {
    storeToken(token: string) {
      console.log('storing token: ' + token)
      this.token = token
    },
  },
})

export const useSpotifyStore = defineStore('spotify', {
  state: () => ({
    topArtists: null as unknown as TopItems,
  }),
  getters: {},
  actions: {
    storeArtists(artists: TopItems) {
      this.topArtists = artists
    },
  },
})


