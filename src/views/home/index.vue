<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const count = ref(0)
const router = useRouter()

const goto = () => {
  router.push('/403')
}
</script>

<template>
  <div>
    <h1>Home Page</h1>
    <p>Count: {{ count }}</p>
    <button @click="count++">Increment</button>
    <button @click="goto">403</button>
  </div>
</template>
