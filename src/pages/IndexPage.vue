<template>
  <q-page class="row items-center justify-evenly">
    <example-component
      title="Example component"
      active
      :todos="todos"
      :meta="meta"
    ></example-component>
    <div>
      Counter: {{ counter }}
    </div>
    <div>
      DoubleCount: {{ doubleCount }}
    </div>
    <div>
      <q-btn @click="increment" icon="add" />
      <q-btn @click="decrement" icon="remove" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { Meta, Todo } from 'components/models'
import ExampleComponent from 'components/ExampleComponent.vue'
import { onMounted, ref } from 'vue'
import { useAuthStore, useCounterStore } from 'stores/example-store'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const router = useRouter()

const store = useCounterStore()
const authStore = useAuthStore()

const { counter, doubleCount } = storeToRefs(store)

const { increment, decrement } = store

const todos = ref<Todo[]>([
  {
    id: 1,
    content: 'ct1'
  },
  {
    id: 2,
    content: 'ct2'
  },
  {
    id: 3,
    content: 'ct3'
  },
  {
    id: 4,
    content: 'ct4'
  },
  {
    id: 5,
    content: 'ct5'
  }
])
const meta = ref<Meta>({
  totalCount: 1200
})

onMounted(() => {
  console.log('authenticated ' + authStore.authenticated)
  if (!authStore.authenticated) {
    router.push('/login')
  }
})
</script>
