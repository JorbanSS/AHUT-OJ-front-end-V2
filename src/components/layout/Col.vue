<template>
  <div class="flex gap-6 flex-col">
    <slot></slot>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Col',
});

</script>