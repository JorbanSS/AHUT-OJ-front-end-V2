<template>
  <div class="flex justify-center items-center h-[100vh]">
    <div class="p-10 space-y-4 w-[410px] rounded-2xl shadow-2xl modal-box glass">
      <button class="btn btn-md btn-circle btn-ghost absolute right-2 top-2" @click="props.init">
        <close theme="outline" size="24" />
      </button>
      <span class="flex justify-center font-bold text-3xl pb-6">
        AHUT OJ
      </span>
      <label class="input input-bordered flex items-center gap-2">
        姓名
        <input type="text" class="grow" placeholder="" />
      </label>
      <label class="input input-bordered flex items-center gap-2">
        账号
        <input type="text" class="grow" placeholder="" />
      </label>
      <div class="label" style="margin-top: -0.2rem; margin-bottom: -0.5rem;">
        <span class="label-text-alt">格式：学校首字母大写+学号，例：AHUT229074001</span>
      </div>
      <label class="input input-bordered flex items-center gap-2">
        邮箱
        <input type="text" class="grow" placeholder="" />
      </label>
      <div class="join">
        <label class="input input-bordered flex items-center gap-2 join-item">
          验证码
          <input type="text" class="grow" placeholder="" />
        </label>
        <button class="btn join-item">发送</button>
      </div>
      <label class="input input-bordered flex items-center gap-2">
        密码
        <input type="password" class="grow" placeholder="" />
      </label>
      <div class="flex space-x-4 justify-center">
        <a class="link link-hover" @click="props.login">登录账户</a>
        <span>|</span>
        <a class="link link-hover">忘记密码</a>
      </div>
      <button class="btn btn-neutral w-full text-lg" @click="register()">注册</button>
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

interface propsType {
  init?: Function;
  login?: Function;
  register?: Function;
};

var props = withDefaults(defineProps<propsType>(), {
  init: () => { },
  register: () => { },
});

let loginInfo = reactive<LoginInfoType>({
  UID: '',
  Pass: '',
  save: false,
})

function register() {
  if (loginInfo.UID == '' || loginInfo.Pass == '') {
    push.error({
      title: '数据错误',
      message: '未填写完整信息',
    })
    return;
  }
}


</script>

<style scoped></style>