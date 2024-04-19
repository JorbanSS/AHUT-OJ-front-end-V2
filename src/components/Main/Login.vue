<template>
  <div class="flex justify-center items-center h-[100vh]">
    <div class="p-10 space-y-4 w-96 rounded-2xl shadow-2xl modal-box glass">
      <button class="btn btn-md btn-circle btn-ghost absolute right-2 top-2" @click="props.init">
        <close theme="outline" size="24" />
      </button>
      <span class="flex justify-center font-bold text-3xl pb-6">
        AHUT OJ
      </span>
      <div class="flex justify-center">
        <ul class="menu bg-white lg:menu-horizontal rounded-box font-bold">
          <li v-for="item in verifyModeOptions" :key="item.value" @click="verifyMode.switch(item.value)">
            <a :class="{ 'btn-active': verifyMode.value == item.value }">
              {{ item.label }}
            </a>
          </li>
        </ul>
      </div>
      <div class="m-0 pt-0.5"></div>
      <div v-if="verifyMode.value == 0" class="space-y-3">
        <label class="input input-bordered flex items-center gap-2">
          账号
          <input type="text" class="grow" placeholder="" v-model="loginInfo.UID" name="username"
            autocomplete="username" />
        </label>
        <label class="input input-bordered flex items-center gap-2">
          密码
          <input type="password" class="grow" placeholder="" v-model="loginInfo.Pass" name="password"
            autocomplete="current-password" />
        </label>
      </div>
      <div v-if="verifyMode.value == 1" class="space-y-3">
        <label class="input input-bordered flex items-center gap-2">
          邮箱
          <input type="text" class="grow" placeholder="" v-model="loginInfo.Email" name="email" autocomplete="email" />
        </label>
        <label class="input input-bordered flex items-center gap-2">
          密码
          <input type="password" class="grow" placeholder="" v-model="loginInfo.Pass" name="password"
            autocomplete="current-password" />
        </label>
      </div>
      <div class="form-control">
        <label class="label cursor-pointer">
          <span class="label-text text-base font-bold">3 天内免登录</span>
          <input type="checkbox" class="checkbox" v-model="loginInfo.Save" />
        </label>
      </div>
      <div class="flex space-x-4 justify-center">
        <a class="link link-hover" @click="props.register">注册账户</a>
        <span>|</span>
        <a class="link link-hover">忘记密码</a>
      </div>
      <button class="btn btn-neutral w-full text-lg" @click="login()">登录</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

import { Close } from '@icon-park/vue-next';
import { push } from 'notivue';

import { _login } from '@/api/user';
import { verifyModeOptions } from '@/config';
import { useUserDataStore } from '@/store/UserData';
import { type LoginInfoType } from '@/interface/user';

const userDataStore = useUserDataStore();

interface propsType {
  init?: Function;
  register?: Function;
};

let props = withDefaults(defineProps<propsType>(), {
  init: () => { },
  register: () => { },
});

let loginInfo = reactive<LoginInfoType>({
  UID: '',
  Pass: '',
  Email: '',
  Code: '',
  Save: false,
})

let verifyMode = reactive({
  value: 0,

  switch(newValue: number) {
    this.value = newValue;
  }
})

interface LoginParamsType {
  UID?: string;
  Pass?: string;
  Email?: string;
  Code?: string;
}

function login() {
  userDataStore.init();

  let params: LoginParamsType = {};

  if (verifyMode.value == 0) {
    if (loginInfo.UID == '' || loginInfo.Pass == '') {
      push.warning({
        title: '数据错误',
        message: '未填写完整信息',
      })
      return;
    }
    params = {
      UID: loginInfo.UID,
      Pass: loginInfo.Pass,
    };
  } else if (verifyMode.value == 1) {
    if (loginInfo.Email == '' || loginInfo.Pass == '') {
      push.warning({
        title: '数据错误',
        message: '未填写完整信息',
      })
      return;
    }
    params = {
      Email: loginInfo.Email,
      Pass: loginInfo.Pass,
    };
  } else if (verifyMode.value == 2) {
    if (loginInfo.Email == '' || loginInfo.Code == '') {
      push.warning({
        title: '数据错误',
        message: '未填写完整信息',
      })
      return;
    }
    params = {
      Email: loginInfo.Email,
      Code: loginInfo.Code,
    };
  } else {
    push.warning({
      title: '数据错误',
      message: '未知的验证模式',
    })
    return;
  }

  _login(params)
    .then((data: any) => {
      localStorage.setItem("token", data.Token);
      localStorage.setItem("UID", data.UID);
      localStorage.setItem("saveLoginStatus", loginInfo.Save.toString());
      sessionStorage.setItem("userInfo", JSON.stringify(data.userInfo));
      userDataStore.login(data);
      userDataStore.updatePermissionMap(data.PermissionMap);
      props.init();
    })
}

</script>