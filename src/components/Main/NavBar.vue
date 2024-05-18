<template>
  <div class="navbar border-b bg-white fixed top-0 z-[100] backdrop-blur-md bg-opacity-60">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </div>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <NavigationBarTabs />
        </ul>
      </div>
      <RouterLink :to="{ name: 'Home' }">
        <a class="btn btn-ghost text-xl">AHUT OJ</a>
      </RouterLink>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1 text-base font-bold font-sans">
        <NavigationBarTabs />
      </ul>
    </div>
    <div class="navbar-end">
      <!-- <label class="swap swap-rotate pr-4">
        <input type="checkbox" :value="ThemeSwitchStore.theme" @click="ThemeSwitchStore.switchTheme()" />
        <SunOne theme="outline" size="24" class="swap-off fill-current" />
        <moon theme="outline" size="22" class="swap-on fill-current" />
      </label> -->
      <div v-if="userDataStore.isLogin">
        <div class="dropdown dropdown-bottom dropdown-end">
          <div tabindex="0" role="button" class="btn">
            <img
              :src="userDataStore.HeadURL != '' ? '/oss/head-images/' + userDataStore.HeadURL : 'https://cdn.pixabay.com/photo/2017/01/10/03/54/avatar-1968236_1280.png'"
              class="select-none avatar h-10 w-10 -ml-2 rounded-full" draggable="false" />
            <!-- <div class="badge badge-neutral" v-if="userDataStore.PermissionMap > 3">OP</div> -->
            <span class="-mr-1">{{ userDataStore.UserName }}</span>
          </div>
          <ul tabindex="0" class="dropdown-content z-[1] menu shadow bg-white rounded-box w-36 Border font-bold">
            <li><a @click="router.push(`/user/${userDataStore.UID}`)">
                <people theme="outline" size="18" />
                个人中心
              </a></li>
            <li v-if="userDataStore.PermissionMap > 3"><a @click="router.replace('/admin')">
                <setting-config theme="outline" size="18" />
                管理平台
              </a></li>
            <li><a @click="props.logout">
                <logout theme="outline" size="18" />
                退出登录
              </a></li>
          </ul>
        </div>
      </div>
      <a class="btn" v-else @click="props.login">登录</a>
    </div>
  </div>
  <div class="pb-[70px]"></div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

import { Logout, Moon, People, SettingConfig, SunOne } from '@icon-park/vue-next';

import { useThemeSwitchStore } from '@/stores/ThemeSwitch';
import { useUserDataStore } from '@/stores/UserData';
import NavigationBarTabs from './NavBarChildren/NavigationBarTabs.vue';

const router = useRouter();

const ThemeSwitchStore = reactive(useThemeSwitchStore());
const userDataStore = reactive(useUserDataStore());

interface propsType {
  login?: Function;
  logout?: Function;
};

let props = withDefaults(defineProps<propsType>(), {
  login: () => { },
  logout: () => { },
});

</script>