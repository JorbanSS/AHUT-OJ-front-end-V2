<template>
  <li v-for="item in adminNavItems" :key="item.title">
    <RouterLink :to="item.to" v-if="typeof item.to != 'undefined'"
      :class="{ 'btn-active': route.path.split('/')[2].toLowerCase() == item.to.name.substring(5).toLowerCase() }">
      <component :is="item.icon" theme="outline" size="18" />
      {{ item.title }}
    </RouterLink>
    <details v-else>
      <summary>
        <toolkit theme="outline" size="18" />
        {{ item.title }}
      </summary>
      <ul class="p-2 z-10 w-36">
        <li v-for="subitem in item.subItems" :key="subitem.title">
          <RouterLink :to="subitem.to" v-if="typeof subitem.to != 'undefined'">
            <component :is="subitem.icon" theme="outline" size="18" />
            {{ subitem.title }}
          </RouterLink>
        </li>
      </ul>
    </details>
  </li>
</template>

<script lang="ts" setup>
import { RouterLink, useRoute } from 'vue-router';

import { Toolkit } from '@icon-park/vue-next';

import { adminNavItems } from '@/config';
import { useThemeSwitchStore } from '@/stores/ThemeSwitch';

const route = useRoute();
const ThemeSwitchStore = useThemeSwitchStore();

</script>

<style scoped></style>