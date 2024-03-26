<template>

</template>

<script lang="ts" setup name="Records">

import { push } from 'notivue'


function sendMessage() {
  push.success({
  title: 'Message sent',
  message: 'Your message has been successfully sent.'
})
}
  
</script>

<style scoped>

</style>