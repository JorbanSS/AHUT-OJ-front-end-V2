<template>
  <div class="navbar flex-row lg:flex-col bg-white lg:w-fit justify-between">
    <div class="justify-begin flex flex-row lg:flex-col">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </div>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <Tabs />
        </ul>
      </div>
      <RouterLink :to="{ name: 'Admin' }">
        <a class="btn btn-ghost text-xl whitespace-nowrap">AHUT OJ 管理平台</a>
      </RouterLink>
      <ul class="menu menu-vertical px-1 text-base font-bold font-sans w-full hidden lg:flex">
        <Tabs />
      </ul>
    </div>
    <div class="justify-begin hidden lg:flex">
    </div>
    <div class="justify-end w-full">
      <!-- <label class="swap swap-rotate pr-4">
        <input type="checkbox" :value="ThemeSwitchStore.theme" @click="ThemeSwitchStore.switchTheme()" />
        <SunOne theme="outline" size="24" class="swap-off fill-current" />
        <moon theme="outline" size="22" class="swap-on fill-current" />
      </label> -->
      <div v-if="userDataStore.isLogin" class="lg:w-full">
        <div class="dropdown dropdown-bottom dropdown-end lg:dropdown-top lg:dropdown-begin w-full">
          <div tabindex="0" role="button" class="btn w-full">
            <img :src="getHeadURL(userDataStore.HeadURL)" class="select-none avatar h-10 w-10 -ml-2 rounded-full"
              draggable="false" />
            <!-- <div class="badge badge-neutral" v-if="userDataStore.PermissionMap > 3">OP</div> -->
            <span class="-mr-1 hidden sm:block">{{ userDataStore.UserName }}</span>
          </div>
          <ul tabindex="0" class="dropdown-content z-[1] menu shadow bg-white rounded-box w-36 Border font-bold">
            <li>
              <div @click="router.push('/index')">
                <home theme="outline" size="18" />
                返回首页
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

import { Home } from '@icon-park/vue-next';

import { useThemeSwitchStore } from '@/stores/ThemeSwitch';
import { useUserDataStore } from '@/stores/UserData';
import { getHeadURL } from '@/utils/globalFunctions';
import Tabs from './NavBar/Tabs.vue';

const router = useRouter();

const ThemeSwitchStore = reactive(useThemeSwitchStore());
const userDataStore = reactive(useUserDataStore());

interface propsType {
  login?: Function;
  logout?: Function;
};

var props = withDefaults(defineProps<propsType>(), {
  login: () => { },
  logout: () => { },
});

</script>

<style scoped></style>