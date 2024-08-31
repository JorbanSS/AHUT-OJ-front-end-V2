<template>
  <div class="flex gap-6 flex-col" :class="{ 'md:flex-row': direction == 'row', 'md:flex-col': direction == 'column' }">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

interface ContainerProps {
  direction: "row" | "column";
};

export default defineComponent({
  name: 'Container',
  props: {
    direction: {
      type: String as PropType<ContainerProps['direction']>,
      default: 'row',
    },
  },
});

</script>