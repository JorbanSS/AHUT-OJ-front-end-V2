<template>
  <NavBar />
  <div v-auto-animate>
    <RouterView></RouterView>
  </div>
</template>

<script lang="ts" setup name="Admin">
import NavBar from '@/components/Admin/NavBar.vue';

</script>

<style scoped>

</style>