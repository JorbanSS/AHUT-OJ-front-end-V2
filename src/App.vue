<template>
  <Main />
  <Notivue v-slot="item">
    <NotivueSwipe :item="item">
      <Notification :item="item" :theme="pastelTheme" />
    </NotivueSwipe>
  </Notivue>
</template>

<script lang="ts" setup name="App">
import Main from '@/pages/Main.vue'
import { Notivue, Notification, NotivueSwipe } from 'notivue'
import { pastelTheme } from 'notivue'
</script>

<style scoped></style>