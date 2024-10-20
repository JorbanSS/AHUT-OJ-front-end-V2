<template>
  <Col class="max-w-6xl mx-auto py-6">
    <slot></slot>
  </Col>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainContainer',
});

</script>