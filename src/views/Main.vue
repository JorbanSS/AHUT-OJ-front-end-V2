<template>

  <div v-auto-animate>

    <NavBar :login="loginAction" :logout="logoutAction"
      v-if="showConfig.showNavBar && route.name != 'Editor' && route.name != 'RankingView'">
    </NavBar>

    <keep-alive>
      <div
        :style="adminMode || route.name == 'RankingView' ? 'min-height: calc(100vh)' : 'min-height: calc(100vh - 126px)'"
        v-auto-animate v-if="showConfig.showBody">
        <RouterView></RouterView>
      </div>
    </keep-alive>

    <Footer
      v-if="showConfig.showFooter && route.name != 'Editor' && route.name != 'RankingView' && (route.matched.length == 0 || route.matched[0].name != 'Problem')">
    </Footer>

    <div class="coverBox" v-if="showConfig.showCover" style="background: linear-gradient(to bottom right, #BBB, #DDD);">
      <!-- #50A3A2, #53E3A6) -->
      <ul class="bg-bubbles">
        <li v-for="i in 10" :key="i"></li>
      </ul>
      <div class="cover"></div>
    </div>
    
    <component :is="Login" :init="initAction" :register="registerAction" :forget="forgetAction" v-if="showConfig.showLogin" />
    <component :is="Register" :init="initAction" :login="loginAction" :forget="forgetAction" v-if="showConfig.showRegister" />
    <component :is="ForgetPass" :init = "initAction" :login="loginAction" :register="registerAction" v-if="showConfig.showForget"/>
    <component :is="Editor" v-if="showConfig.showEditor" />

  </div>

</template>

<script lang="ts" setup name="Main">
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';

import { push } from 'notivue';

import { _getUserInfo, _getUserPermission } from '@/apis/user';
import Footer from '@/components/Main/Footer.vue';
import Login from '@/components/Main/Login.vue';
import NavBar from '@/components/Main/NavBar.vue';
import ConfirmModdal from "@/components/Main/ConfirmModal.vue"
import Register from '@/components/Main/Register.vue';
import ForgetPass from '@/components/Main/ForgetPass.vue';
import Editor from '@/components/Main/Editor.vue';
import { useUserDataStore } from '@/stores/UserData';
import { type ShowConfigType } from '@/interfaces/oj';
import { type UserSimplifiedType } from '@/interfaces/user';
import { useWebSocketStore } from '@/stores/WebSocket';

const userDataStore = useUserDataStore();
const route = useRoute();
const WebSocketStore = useWebSocketStore();

let adminMode = ref<boolean>(false);

let showConfig = reactive<ShowConfigType>({
  showNavBar: true,
  showFooter: true,
  showBody: true,
  showCover: false,
  showLogin: false,
  showRegister: false,
  showEditor: false,
  showForget: false,

  init() {
    this.showNavBar = this.showFooter = this.showBody = true;
    this.showCover = this.showLogin = this.showRegister = this.showEditor = this.showForget = false;
  },

  showLoginDialog() {
    this.showCover = this.showLogin = true;
    this.showNavBar = this.showFooter = this.showRegister = this.showBody = this.showEditor = this.showForget = false;
  },

  showRegisterDialog() {
    this.showCover = this.showRegister = true;
    this.showNavBar = this.showFooter = this.showLogin = this.showBody = this.showEditor = this.showForget = false;
  },

  showForgetDialog(){
    this.showCover = this.showForget = true;
    this.showNavBar = this.showFooter = this.showRegister = this.showBody = this.showEditor = this.showLogin = false;
  },

  showEditorDialog() {
    this.showEditor = true;
    this.showNavBar = this.showFooter = this.showLogin = this.showRegister = this.showBody = this.showCover = this.showForget = false;
  },
})

function loginAction() {
  showConfig.showLoginDialog();
}

function logoutAction() {
  push.success({
    title: "已退出登录",
    message: `${userDataStore.UserName}，欢迎再次使用`,
  })
  showConfig.init();
  userDataStore.logout();
  if (WebSocketStore.socket) {
    WebSocketStore.socket.close();
  }
  WebSocketStore.init();
  WebSocketStore.initOpen();
}

function initAction() {
  showConfig.init();
}

function registerAction() {
  showConfig.showRegisterDialog();
}

function forgetAction(){
  showConfig.showForgetDialog();
}

function autoLogin() {
  let token = localStorage.getItem("token");
  let UID = localStorage.getItem("UID");
  let saveLoginStatus = localStorage.getItem("saveLoginStatus");
  let permissionMap = localStorage.getItem("permissionMap");
  let userInfoString = sessionStorage.getItem("userInfo");

  if (permissionMap) userDataStore.updatePermissionMap(+permissionMap);

  if (token && userInfoString) {
    let userInfo = JSON.parse(userInfoString);
    if (UID && userInfo.UID == UID) {
      userDataStore.getUserPermission(UID);
      userDataStore.loginSimplified(userInfo);
    } else {  // 数据不同步
      userDataStore.init();
      return;
    }
    showConfig.init();
    return;
  }

  if (saveLoginStatus == "true" && token) {
    _getUserInfo({})
      .then((data: any) => {
        userDataStore.getUserPermission(data.UID);
        userDataStore.login(data);
        showConfig.init();
        push.success({
          title: '登录成功',
          message: `${data.UserName}，欢迎回来`,
        })
      })
  } else {
    userDataStore.init();
  }
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

function getUserInfo() {
  let params = {
    UID: localStorage.getItem("UID"),
  };
  if (params.UID && params.UID != "") {
    _getUserInfo(params)
      .then((data: any) => {
        userDataStore.login(data);
      })
  }
}

// onMounted(() => {
//   if(userDataStore.isLogin){
//     WebSocketStore.connectWebSocket();
//   }
// });

// onUnmounted(() => {
//   if (WebSocketStore.socket) {
//     WebSocketStore.socket.close();
//   }
// });不需要手动关闭

watch(() => WebSocketStore.socketMessage, (newMessage) => {
  handleMessage(newMessage);
});

const handleMessage = (message: any) => {
  // Handle different types of messages
  switch (message.type) {
    case 'type1':
      console.log('Handle type1 message:', message);
      break;
    case 'type2':
      console.log('Handle type2 message:', message);
      break;
    default:
      console.log('Handle default message:', message);
      break;
  }
};

const socketMessage = ref(WebSocketStore.socketMessage);

onMounted(() => {
  showConfig.init();
  autoLogin();
  getUserInfo();
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