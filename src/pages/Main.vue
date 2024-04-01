<template>
  <NavBar :login="loginAction" :logout="logoutAction" v-if="showConfig.showNavBar" />
  <keep-alive>
    <div :class="{ 'max-w-5xl mx-auto m-6': !adminMode }"
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
import { onMounted, ref, reactive, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import NavBar from '@/components/Main/NavBar.vue';
import Footer from '@/components/Main/Footer.vue';
import Login from '@/components/Main/Login.vue';
import Register from '@/components/Main/Register.vue';
import { UserSimplifiedType, type ShowConfigType } from '@/type';
import { useUserDataStore } from '@/store/UserData';
import { Get } from '@/utils/axios/request';
import { push } from 'notivue';

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
    this.showNavBar = true;
    this.showFooter = true;
    this.showCover = false;
    this.showLogin = false;
    this.showRegister = false;
    this.showBody = true;
  },

  showLoginDialog() {
    this.showNavBar = false;
    this.showFooter = false;
    this.showCover = true;
    this.showLogin = true;
    this.showRegister = false;
    this.showBody = false;
  },

  showRegisterDialog() {
    this.showNavBar = false;
    this.showFooter = false;
    this.showCover = true;
    this.showLogin = false;
    this.showRegister = true;
    this.showBody = false;
  },
})


onMounted(() => {
  showConfig.init();
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
  let userInfo: any = sessionStorage.getItem("userInfo");
  let data: UserSimplifiedType = {
    UID: "",
    UserName: "",
    PermissionMap: 0,
  };

  if (token && userInfo && userInfo != "") {
    userInfo = JSON.parse(userInfo);
    if (userInfo && userInfo.UID && userInfo.UID == UID) {
      data.UID = userInfo.UID;
      if (userInfo.UserName) {
        data.UserName = userInfo.UserName;
      }
      else {  // 数据不同步
        userDataStore.init();
        return;
      }
      getUserPermission(data.UID);
      data.PermissionMap = userInfo.permissionMap;
      userDataStore.loginSimplified(data);
      userDataStore.updatePermissionMap(data.PermissionMap);
    }
    else {  // 数据不同步
      userDataStore.init();
      return;
    }
    showConfig.init();
  }
  if (saveLoginStatus == "true" && token != null) {
    Get('api/user/info', {})
      .then((res: any) => {
        let data = res.data;
        if (data.Code == 0) {
          getUserPermission(data.UID);
          userDataStore.login(data);
          showConfig.init();
          push.success({
            title: '登录成功',
            message: `${data.UserName}，欢迎回来`,
          })
        }
        else {
          push.error({
            title: `Error: ${data.Code}`,
            message: `${data.Msg}`,
          })
        }
      })
      .catch((err: any) => {
        console.log(err);
      })
  }
}

async function getUserPermission(UID: string) {
  Get('api/admin/permission/' + UID, {})
    .then((res: any) => {
      let data = res.data;
      if (data.Code == 0) {
        let permissionMap = data.PermissionMap;
        userDataStore.updatePermissionMap(permissionMap);
      }
      else {
        push.error({
          title: `Error: ${data.Code}`,
          message: `${data.Msg}`,
        })
      }
    })
    .catch((err: any) => {
      console.log(err);
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
  // getUserPermission(userDataStore.UID);
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