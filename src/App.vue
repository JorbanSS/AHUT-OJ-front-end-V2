<template>
  <Main></Main>
  <Notivue v-slot="item">
    <NotivueSwipe :item="item">
      <Notification :item="item" :theme="pastelTheme" />
    </NotivueSwipe>
  </Notivue>
</template>

<script lang="ts" setup name="App">
import { Notification, Notivue, NotivueSwipe, pastelTheme } from 'notivue';

import Main from '@/pages/Main.vue';

</script>