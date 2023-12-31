<template>
  <div class="row">
    <q-card class="full-width flex flex-center">
      <q-card-section>
        Counter: {{ counter }}
      </q-card-section>
      <q-card-section>
        DoubleCount: {{ doubleCount }}
      </q-card-section>
      <q-card-section>
        <q-btn @click="increment"
               icon="add" />
        <q-btn @click="decrement"
               icon="remove" />
      </q-card-section>
    </q-card>
  </div>
  <div class="row">
    <q-card v-if="!authStore.authenticated"
            class="full-width flex flex-center">
      <q-card-section>
        Login with Spotify
      </q-card-section>
      <q-card-section>
        <q-btn @click="redirectToAuthCodeFlow(clientId)"
               icon="login"
               round />
      </q-card-section>
    </q-card>
    <q-card v-if="authStore.authenticated">
      <q-card-section>
        {{ authStore.token }}
      </q-card-section>
      <q-card-section>
        {{ email }}
      </q-card-section>
    </q-card>
  </div>
  <div class="row">
    <q-card-section>
      <q-btn @click="fetchTopItems"
             label="Fetch Top Artists" />
    </q-card-section>
    <q-card-section v-if="topArtists !== null">
      <q-list bordered
              separator>
        <q-item v-for="(artist, index) in topArtists.items"
                :key="index">
          <q-item-section>{{ artist.name }} - popularity {{ artist.popularity }}</q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </div>

</template>

<script setup
        lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore, useCounterStore, useSpotifyStore } from 'stores/example-store'
import { storeToRefs } from 'pinia'
import { api } from 'boot/axios'
import TopItems = MyTypes.TopItems
import UserProfile = MyTypes.UserProfile

const store = useCounterStore()
const authStore = useAuthStore()
const spotifyStore = useSpotifyStore()

const { counter, doubleCount } = storeToRefs(store)
const { increment, decrement } = store

const { topArtists } = storeToRefs(spotifyStore)

const email = ref('')

const { clientId } = authStore
const params = new URLSearchParams(window.location.search)
const code = params.get('code')

onMounted(async () => {
  console.log('in onMounted')
  // if (!code) {
  //   console.log('initiate login with client id ' + clientId)
  //   redirectToAuthCodeFlow(clientId)
  // } else {
  if (code) {
    const accessToken = await getAccessToken(clientId, code)
    authStore.storeToken(accessToken)
    console.log(authStore.token)
    console.log(authStore.authenticated)
    const profile = await fetchProfile(accessToken)
    console.log(`My Spotify email is ${profile.email}`)
    email.value = profile.email
  }
})

async function redirectToAuthCodeFlow(clientId: string) {
  const verifier = generateCodeVerifier(128)
  const challenge = await generateCodeChallenge(verifier)

  localStorage.setItem('verifier', verifier)

  const params = new URLSearchParams()
  params.append('client_id', clientId)
  params.append('response_type', 'code')
  params.append('redirect_uri', 'http://localhost:9000')
  params.append('scope', 'user-read-private user-read-email user-top-read')
  params.append('code_challenge_method', 'S256')
  params.append('code_challenge', challenge)

  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`
}

async function getAccessToken(clientId: string, code: string): Promise<string> {
  const verifier = localStorage.getItem('verifier')

  const params = new URLSearchParams()
  params.append('client_id', clientId)
  params.append('grant_type', 'authorization_code')
  params.append('code', code)
  params.append('redirect_uri', 'http://localhost:9000')
  params.append('code_verifier', verifier!)

  const result = await api.post('https://accounts.spotify.com/api/token',
    params,
    {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    })
  const { access_token } = await result.data
  return access_token
}

async function fetchProfile(token: string): Promise<UserProfile> {
  const result = await api.get('/v1/me',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  return await result.data
}

async function fetchTopItems() {
  const result = await api.get('/v1/me/top/artists ',
    {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    },
  )
  const topItems: TopItems = result.data
  console.log(topItems)
  spotifyStore.storeArtists(topItems)
}

function generateCodeVerifier(length: number) {
  let text = ''
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

async function generateCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier)
  const digest = await window.crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}
</script>
