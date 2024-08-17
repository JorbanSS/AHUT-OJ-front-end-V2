<template>
  <div class="Border rounded-2xl shadow-lg bg-white p-6">
    <div class="flex flex-col gap-3">
      <div class="flex justify-center">
        <component :is="props.IconName" theme="outline" size="32" />
      </div>
      <span class="font-bold text-xl text-center">{{ props.Title }}</span>
      <div v-if="props.Infomation">
        <div class="text-center" v-for='item in props.Infomation.split("\n")'>
          {{ item }}
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { Info } from '@icon-park/vue-next';
import { Icon } from '@icon-park/vue-next/lib/runtime';

interface propsType {
  Title: string;
  Infomation: string;
  IconName: Icon;
};

let props = withDefaults(defineProps<propsType>(), {
  Title: "",
  Infomation: "",
  IconName: Info,
});

</script>