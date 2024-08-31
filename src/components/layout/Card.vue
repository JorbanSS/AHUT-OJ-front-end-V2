<template>
  <div class="Border shadow-lg bg-white rounded-2xl max-w-6xl p-6">
    <slot></slot>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

export default defineComponent({
  name: "Card",
});

</script>