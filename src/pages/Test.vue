<template>
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div
      style="max-width: 500px; margin: 0 auto; background-color: #fff; border-radius: 10px; padding: 20px; box-shadow: 0 8px 8px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #007bff; text-align: center; font-weight: 800; font-size: 30px;">Welcome to AHUT OJ!</h2>
      <p style="font-size: 16px; line-height: 1.6; margin-top: 20px;">Hi, UserName:</p>
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 8px;">为了验证您的邮箱地址，请使用以下验证码：</p>
      <div
        style="background-color: #1B232F; color: #eee; border-radius: 8px; padding: 10px; text-align: center; margin-top: 20px; width: 230px; margin: auto;">
        <h3 style="font-size: 30px; margin: 0; letter-spacing: 4px; font-weight: 800;">EG2BF3</h3>
      </div>
      <p style="font-size: 16px; line-height: 1.6; margin-top: 20px">请将验证码输入到注册页面以完成验证。如果您未进行注册操作，请忽略此邮件。</p>
      <span style="font-size: 16px; line-height: 1.6;">感谢您选择 AHUT OJ，Happy coding！</span>
      <p style="font-size: 16px; line-height: 1.6; text-align: center; font-size: 14px; margin-top: 12px; color: #888;">Copyright © 2019 - 2024 All right reserved.</p>
    </div>
  </div>
</template>


<script lang="ts" setup name="Records">

import { push } from 'notivue'


function sendMessage() {
  push.success({
    title: 'Message sent',
    message: 'Your message has been successfully sent.'
  })
}

</script>

<style scoped></style>