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
        <input type="text" class="grow" v-model="registerInfo.UserName" name="name" autocomplete="name" />
      </label>
      <label class="input input-bordered flex items-center gap-2">
        账号
        <input type="text" class="grow" v-model="registerInfo.UID" name="username" autocomplete="username" />
      </label>
      <div class="label" style="margin-top: -0.2rem; margin-bottom: -0.5rem;">
        <span class="label-text-alt">格式：学校首字母大写+学号，例：AHUT229074001</span>
      </div>
      <label class="input input-bordered flex items-center gap-2">
        邮箱
        <input type="text" class="grow" v-model="registerInfo.Email" name="email" autocomplete="email" />
      </label>
      <div class="join">
        <label class="input input-bordered flex items-center gap-2 join-item">
          验证码
          <input type="text" class="grow" v-model="registerInfo.VerifyCode" />
        </label>
        <button class="btn join-item w-[62px]" @click="sendVerifyCode()" v-if="!isCountingDown">发送</button>
        <button class="btn join-item w-[62px]" @click="push.warning({title: '操作失败', message: '请勿频繁发送邮件'})" v-else >
          <span class="countdown text-base">
            <span :style="'--value: ' + second + ';'"></span>
          </span>
        </button>
      </div>
      <label class="input input-bordered flex items-center gap-2">
        密码
        <input type="password" class="grow" v-model="registerInfo.Pass" name="password"
          autocomplete="current-password" />
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
import { type RegisterInfoType } from '@/type';
import '@/utils/axios/request';
import { Get, Post } from '@/utils/axios/request';
import { push } from 'notivue';
import { Validator } from '@/assets/ts/globalFunctions';
import axios from 'axios';

interface propsType {
  init?: Function;
  login?: Function;
  register?: Function;
};

let props = withDefaults(defineProps<propsType>(), {
  init: () => { },
  login: () => { },
});

let registerInfo = reactive<RegisterInfoType>({
  UID: '',
  Pass: '',
  Email: '',
  UserName: '',
  VerifyCode: '',
})

let isCountingDown = ref<boolean>(false);
let second = ref<number>(60);

function startCountDown() {
  second.value = 60;
  isCountingDown.value = true;
  setInterval(() => {
    if (second.value > 0) {
      second.value --;
    } else {
      isCountingDown.value = false;
      return;
    }
  }, 1000);
}

function register() {
  if (registerInfo.UID == '' || registerInfo.Pass == '' || registerInfo.Email == '' || registerInfo.UserName == '' || registerInfo.VerifyCode == '') {
    push.warning({
      title: '数据错误',
      message: '未填写完整信息',
    })
    return;
  }
  if (Validator.UserName(registerInfo.UserName) == false) {
    push.warning({
      title: '数据错误',
      message: '用户姓名格式错误，请输入完整的真实姓名',
    });
    return;
  }
  if (Validator.UID(registerInfo.UID) == false) {
    push.warning({
      title: '数据错误',
      message: '用户 UID 格式错误，正确格式为：学校首字母大写+学号，例：AHUT229074001',
    });
    return;
  }
  if (Validator.Email(registerInfo.Email) == false) {
    push.warning({
      title: '数据错误',
      message: '用户邮箱格式错误',
    });
    return;
  }
  if (Validator.Password(registerInfo.Pass) == false) {
    push.warning({
      title: '数据错误',
      message: '用户密码格式错误，正确格式为：8~20位英文数字符号组合',
    });
    return;
  }
  if (Validator.VerifyCode(registerInfo.VerifyCode.toUpperCase()) == false) {
    push.warning({
      title: '数据错误',
      message: '验证码格式错误',
    });
    return;
  }

  Post('api/auth/codeverify', {
    UID: registerInfo.UID,
    Email: registerInfo.Email,
    Code: registerInfo.VerifyCode.toUpperCase(),
  })
    .then((res: any) => {
      let data = res.data;

      if (data.Code == 0) {

        Post('api/auth/register/', {
          UID: registerInfo.UID,
          Pass: registerInfo.Pass,
          Email: registerInfo.Email,
          UserName: registerInfo.UserName,
        })
          .then((res: any) => {
            let data = res.data;
            if (data.Code == 0) {
              push.success({
                title: '注册成功',
                message: `${registerInfo.UserName}，欢迎加入 AHUT OJ!`,
              })
              props.login();
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

function sendVerifyCode() {
  if (registerInfo.Email == '' || registerInfo.UID == '' || registerInfo.UserName == '') {
    push.warning({
      title: '数据错误',
      message: '未填写完整信息',
    });
    return;
  }
  if (Validator.UserName(registerInfo.UserName) == false) {
    push.warning({
      title: '数据错误',
      message: '用户姓名格式错误，请输入完整的真实姓名',
    });
    return;
  }
  if (Validator.UID(registerInfo.UID) == false) {
    push.warning({
      title: '数据错误',
      message: '用户 UID 格式错误，正确格式为：学校首字母大写+学号，例：AHUT229074001',
    });
    return;
  }
  if (Validator.Email(registerInfo.Email) == false) {
    push.warning({
      title: '数据错误',
      message: '用户邮箱格式错误',
    });
    return;
  }

  isCountingDown.value = true;

  startCountDown();

  Post('api/auth/verifyemail/', {
    Email: registerInfo.Email,
    UID: registerInfo.UID,
    Uname: registerInfo.UserName,
    Method: 1,
  })
    .then((res: any) => {
      let data = res.data;
      if (data.Code == 0) {
        push.success({
          title: '发送成功',
          message: `验证码已发送至 ${registerInfo.Email}`,
        });
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