<template>
  <div class="navbar bg-white">
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
      <RouterLink :to="{ name: 'Admin' }">
        <a class="btn btn-ghost text-xl">AHUT OJ 管理平台</a>
      </RouterLink>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1 text-base font-bold font-sans">
        <NavigationBarTabs />
      </ul>
    </div>
    <div class="navbar-end">
      <label class="swap swap-rotate pr-4">
        <input type="checkbox" :value="ThemeSwitchStore.theme" @click="ThemeSwitchStore.switchTheme()" />
        <SunOne theme="outline" size="24" class="swap-off fill-current" />
        <moon theme="outline" size="22" class="swap-on fill-current" />
      </label>
      <button class="btn" @click="router.push('/home')">
        返回首页
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useThemeSwitchStore } from '@/store/ThemeSwitch';
import NavigationBarTabs from './NavBarChildren/NavigationBarTabs.vue'
import { Moon, SunOne, People, SettingConfig, Logout } from '@icon-park/vue-next'
import { useUserDataStore } from '@/store/UserData';
import { useRouter } from 'vue-router';

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