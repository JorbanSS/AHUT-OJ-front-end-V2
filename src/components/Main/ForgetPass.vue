<template>
  <div class="flex justify-center items-center h-[100vh]">
    <div
      class="p-10 space-y-4 w-[410px] rounded-2xl shadow-2xl modal-box glass"
    >
      <button
        class="btn btn-md btn-circle btn-ghost absolute right-2 top-2"
        @click="props.init()"
      >
        <close theme="outline" size="24" />
      </button>
      <span class="flex justify-center font-bold text-3xl pb-6">
        忘记密码
      </span>
      <label
        class="input input-bordered flex items-center gap-2 whitespace-nowrap"
      >
        邮箱
        <input
          type="text"
          class="grow"
          v-model="forgetPassInfo.Email"
          name="email"
          autocomplete="email"
        />
      </label>
      <div class="join">
        <label
          class="input input-bordered flex items-center gap-2 join-item whitespace-nowrap"
        >
          验证码
          <input
            type="text"
            class="grow w-full"
            v-model="forgetPassInfo.VerifyCode"
          />
        </label>
        <button
          class="btn join-item w-16"
          @click="sendVerifyCode()"
          v-if="!isCountingDown"
        >
          发送
        </button>
        <button
          class="btn join-item w-16"
          @click="
            push.warning({ title: '操作失败', message: '请勿频繁发送邮件' })
          "
          v-else
        >
          <span class="countdown text-base">
            <span :style="'--value: ' + second + ';'"></span>
          </span>
        </button>
      </div>
      <label
        class="input input-bordered flex items-center gap-2 whitespace-nowrap"
      >
        密码
        <input
          type="password"
          class="grow"
          placeholder=""
          v-model="forgetPassInfo.Pass"
          name="password"
          autocomplete="current-password"
        />
      </label>
      <button class="btn btn-neutral w-full text-lg" @click="forgetPass()">
        验证
      </button>
      <div class="flex space-x-4 justify-center">
        <a class="link link-hover" @click="props.login()">登陆账户</a>
        <span>|</span>
        <a class="link link-hover" @click="props.register()">注册账户</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type ForgetPasswordInfoType } from "@/interfaces/user";
import { _codeVerify, _verifyEmail, _forgetPass } from "@/apis/user";
import { reactive, ref } from "vue";
import { push } from "notivue";
import { useConstValStore } from "@/stores/ConstVal";
import { Close } from "@icon-park/vue-next";

interface propsType {
  init?: Function;
  register?: Function;
  login?: Function;
}
let props = withDefaults(defineProps<propsType>(), {
  init: () => {},
  register: () => {},
  login: () => {},
});

let forgetPassInfo = reactive<ForgetPasswordInfoType>({
  Pass: "",
  Email: "",
  VerifyCode: "",
});

let isCountingDown = ref<boolean>(false);
let second = ref<number>(60);

function startCountDown() {
  second.value = 60;
  isCountingDown.value = true;
  setInterval(() => {
    if (second.value > 0) {
      second.value--;
    } else {
      isCountingDown.value = false;
      return;
    }
  }, 1000);
}

function sendVerifyCode() {
  if (forgetPassInfo.Email == "") {
    push.warning({
      title: "数据错误",
      message: "未填写邮箱",
    });
    return;
  }

  isCountingDown.value = true;

  startCountDown();

  let params = {
    Email: forgetPassInfo.Email,
    Method: useConstValStore().EMAIL_VERIFY_CODE,
    Type: useConstValStore().CODE_VERIFY_FORGOT_PASSWORD,
  };

  _verifyEmail(params).then(() => {
    push.success({
      title: "发送成功",
      message: `验证码已发送至 ${forgetPassInfo.Email}`,
    });
  });
}

function forgetPass() {
  if (forgetPassInfo.Email == "" || forgetPassInfo.VerifyCode == "") {
    push.warning({
      title: "数据错误",
      message: "未填写完整信息",
    });
    return;
  }
  let params = {
    Email: forgetPassInfo.Email,
    NewPassword: forgetPassInfo.Pass,
  };

  let params2 = {
    Code: forgetPassInfo.VerifyCode,
    Email: forgetPassInfo.Email,
    Type: useConstValStore().CODE_VERIFY_FORGOT_PASSWORD,
  };
  _codeVerify(params2).then(() => {
    sendForgetPassRequest(params);
  });
}

function sendForgetPassRequest(params: any) {
  _forgetPass(params).then(() => {
    push.success({
      title: "修改成功",
      message: "修改密码成功",
    });
    props.login()
  });
}
</script>
