<template>
  <Container direction="column" class="max-w-6xl mx-auto py-6">
    <slot></slot>
  </Container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainContainer',
});

</script>