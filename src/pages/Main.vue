<template>
  <NavBar :login="loginAction" :logout="logoutAction" v-if="showConfig.showNavBar" />
  <keep-alive>
    <div :class="{ 'max-w-6xl mx-auto m-6': !adminMode }"
      :style="adminMode ? 'min-height: calc(100vh)' : 'min-height: calc(100vh - 124px - 48px)'" style="" class=""
      v-if="showConfig.showBody">
      <RouterView></RouterView>
    </div>
  </keep-alive>
  <Footer v-if="showConfig.showFooter" />
  <div class="coverBox" v-if="showConfig.showCover" style="background: linear-gradient(to bottom right, #BBB, #DDD);">
    <!-- #50A3A2, #53E3A6) -->
    <ul class="bg-bubbles">
      <li v-for="i in 10" :key="i"></li>
    </ul>
    <div class="cover" />
  </div>
  <component :is="Login" :init="initAction" :register="registerAction" v-if="showConfig.showLogin" />
  <component :is="Register" :init="initAction" :login="loginAction" v-if="showConfig.showRegister" />
</template>

<script lang="ts" setup name="Main">
import { onMounted, reactive, ref, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';

import { push } from 'notivue';

import { _getUserInfo, _getUserPermission } from '@/api/user';
import Footer from '@/components/Main/Footer.vue';
import Login from '@/components/Main/Login.vue';
import NavBar from '@/components/Main/NavBar.vue';
import Register from '@/components/Main/Register.vue';
import { useUserDataStore } from '@/store/UserData';
import { type ShowConfigType } from '@/type/oj';
import { type UserSimplifiedType } from '@/type/user';

const userDataStore = useUserDataStore();
const route = useRoute();

let adminMode = ref<boolean>(false);

let showConfig = reactive<ShowConfigType>({
  showNavBar: true,
  showFooter: true,
  showCover: false,
  showLogin: false,
  showRegister: false,
  showBody: true,

  init() {
    this.showNavBar = this.showFooter = this.showBody = true;
    this.showCover = this.showLogin = this.showRegister = false;
  },

  showLoginDialog() {
    this.showNavBar = this.showFooter = this.showRegister = this.showBody = false;
    this.showCover = this.showLogin = true;
  },

  showRegisterDialog() {
    this.showCover = this.showRegister = true;
    this.showNavBar = this.showFooter = this.showLogin = this.showBody = false;
  },
})

function loginAction() {
  showConfig.showLoginDialog();
}

function logoutAction() {
  push.success({
    title: '已退出登录',
    message: `${userDataStore.UserName}，欢迎再次光临`,
  })
  showConfig.init();
  userDataStore.logout();
}

function initAction() {
  showConfig.init();
}

function registerAction() {
  showConfig.showRegisterDialog();
}

async function autoLogin() {
  let token = localStorage.getItem("token");
  let UID = localStorage.getItem("UID");
  let saveLoginStatus = localStorage.getItem("saveLoginStatus");
  let userInfoString = sessionStorage.getItem("userInfo") as string;

  let data: UserSimplifiedType = {
    UID: "",
    UserName: "",
    PermissionMap: 0,
  };

  if (token && userInfoString && userInfoString != "") {
    let userInfo = JSON.parse(userInfoString);
    if (userInfo.UID == UID) {
      data.UID = userInfo.UID;
      if (userInfo.UserName) {
        data.UserName = userInfo.UserName;
      }
      else {  // 数据不同步
        userDataStore.init();
        return;
      }
      data.PermissionMap = userInfo.PermissionMap;
      userDataStore.loginSimplified(data);
      userDataStore.updatePermissionMap(data.PermissionMap);
    }
    else {  // 数据不同步
      userDataStore.init();
      return;
    }
    showConfig.init();
    // getUserPermission(userDataStore.UID);
    return;
  }

  if (saveLoginStatus == "true" && token != null) {
    let params = {
      // UID: userDataStore.UID,
    };
    _getUserInfo(params)
      .then((data: any) => {
        getUserPermission(data.UID);
        userDataStore.login(data);
        showConfig.init();
        push.success({
          title: '登录成功',
          message: `${data.UserName}，欢迎回来`,
        })
      })
  }
  else {
    userDataStore.init();
  }
}

async function getUserPermission(UID: string) {
  _getUserPermission({}, UID)
    .then((data: any) => {
      let permissionMap = data.PermissionMap;
      userDataStore.updatePermissionMap(permissionMap);
    })
}

watch(() => route.path, () => {
  let page = route.path.split('/')[1];
  if (page == 'admin') {
    showConfig.showNavBar = false;
    showConfig.showFooter = false;
    showConfig.showCover = false;
    showConfig.showLogin = false;
    showConfig.showRegister = false;
    showConfig.showBody = true;
    adminMode.value = true;
  }
  else {
    adminMode.value = false;
    showConfig.init();
  }
})

onMounted(() => {
  showConfig.init();
  autoLogin();
});

</script>

<style lang="scss" scoped>
.coverBox {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  filter: blur(3px);
}
</style>