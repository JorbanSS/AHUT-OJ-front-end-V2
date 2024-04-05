<template>
  <!-- <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div
        style="max-width: 500px; margin: 0 auto; background-color: #fff; border-radius: 10px; padding: 20px; box-shadow: 0 8px 8px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #007bff; text-align: center; font-weight: 800; font-size: 30px;">Welcome to AHUT OJ!</h2>
        <p style="font-size: 16px; line-height: 1.6; margin-top: 20px;">Hi, {{  }}:</p>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 8px;">为了验证您的邮箱地址，请点击以下按钮进行验证</p>
        <div 
          style="background-color: #1B232F; color: #eee; border-radius: 8px; padding: 10px; text-align: center; margin-top: 20px; width: 230px; margin: auto;">
          <a style="font-size: 30px; margin: 0; letter-spacing: 4px; font-weight: 800;" href="{{  }}" target="_blank">前往验证</a>
        </div>
        <p style="font-size: 16px; line-height: 1.6; margin-top: 20px">点击上面按钮回跳转到验证页面以完成验证。如果您未进行相关操作，请忽略此邮件。</p>
        <span style="font-size: 16px; line-height: 1.6;">感谢您选择 AHUT OJ，Happy coding！</span>
        <p
          style="font-size: 16px; line-height: 1.6; text-align: center; font-size: 14px; margin-top: 12px; color: #888;">
          Copyright © 2019 - 2024 All rights reserved.</p>
      </div>
    </div>
  </div> -->
  <div class="bg-white p-6 card shandow-lg Border">
    <button class="btn btn-neutral w-fit" @click="test()" >
      测试运行
    </button>
  </div>
</template>


<script lang="ts" setup name="Records">

import { push } from 'notivue'
import { OssUtils } from '@/utils/ossUtils';

function test() {
  push.success({
    title: '测试',
    message: '这是一条测试信息'
  })
  OssUtils.getBucketList();
}

</script>

<style scoped></style>