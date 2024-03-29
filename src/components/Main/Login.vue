<template>
  <div class="flex justify-center items-center h-[100vh]">
    <div class="p-10 space-y-4 w-96 rounded-2xl shadow-2xl modal-box glass">
      <button class="btn btn-md btn-circle btn-ghost absolute right-2 top-2" @click="props.init">
        <close theme="outline" size="24" />
      </button>
      <span class="flex justify-center font-bold text-3xl pb-6">
        AHUT OJ
      </span>
      <label class="input input-bordered flex items-center gap-2">
        账号
        <input type="text" class="grow" placeholder="" v-model="loginInfo.UID" name="username" autocomplete="username" />
      </label>
      <label class="input input-bordered flex items-center gap-2">
        密码
        <input type="password" class="grow" placeholder="" v-model="loginInfo.Pass" name="password" autocomplete="current-password"  />
      </label>
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
import { ref, reactive } from 'vue';
import { Close } from '@icon-park/vue-next';
import { type LoginInfoType } from '@/type';
import '@/utils/axios/request';
import { Get, Post } from '@/utils/axios/request';
import { push } from 'notivue';
import { useUserDataStore } from '@/store/UserData';

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
  Save: false,
})

function login() {
  if (loginInfo.UID == '' || loginInfo.Pass == '') {
    push.error({
      title: '数据错误',
      message: '未填写完整信息',
    })
    return;
  }

  Post('api/auth/login/', {
    UID: loginInfo.UID,
    Pass: loginInfo.Pass,
  })
    .then((res: any) => {
      let data = res.data;
      if (data.Code == 0) {
        localStorage.setItem("token", data.Token);

        localStorage.setItem("UID", data.UID);
        localStorage.setItem("saveLoginStatus", loginInfo.Save.toString());

        // userDataStore.init();
        userDataStore.login(data);
        userDataStore.updatePermissionMap(data.PermissionMap);

        props.init();
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



</script>

<style scoped></style>