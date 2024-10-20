<template>
  <div class="flex gap-6 flex-col md:flex-row">
    <slot></slot>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Row',
});

</script>