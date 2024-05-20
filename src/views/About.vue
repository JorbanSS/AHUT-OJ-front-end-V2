<template>
  <div class="card Border bg-white shadow-lg p-6" v-auto-animate>
    <div role="tablist" class="tabs tabs-bordered w-fit">
      <a role="tab" class="tab" v-for="item in aboutNavItems" :key="item.label"
        :class="{ 'tab-active': tabInfo.activeTab == item.value }" @click="tabInfo.switch(item.value)">{{ item.label
        }}</a>
    </div>
    <MdPreview editorId="OJInfo" :modelValue="MD_OJInfo" v-if="tabInfo.activeTab == 0" class="-mx-4" />
    <MdPreview editorId="Requirements" :modelValue="MD_Requirements" v-if="tabInfo.activeTab == 1" class="-mx-4" />
    <div v-if="tabInfo.activeTab == 2">
      <MdPreview editorId="AboutOJ" :modelValue="MD_AboutOJ" class="-mx-4" />
      <ul class="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical px-4">
        <li>
          <div class="timeline-middle">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5">
              <path fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <div class="timeline-start md:text-end mb-10 timeline-box">
            <time class="font-mono italic">2024.4.7</time>
            <div class="text-lg font-black">AHUT OJ V2</div>
            全新 OJ 前端启用，增强了动画、UI/UX等方面。并加入了大量新功能，修复了已久的各种 bug。
          </div>
          <hr />
        </li>
        <li>
          <div class="timeline-middle">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5">
              <path fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <div class="timeline-end mb-10 timeline-box">
            <time class="font-mono italic">2022</time>
            <div class="text-lg font-black">AHUT OJ</div>
            自有 Online Judge 启用，后端为 Golang + Gin 框架，前端为 Vue 3 + Vite + Element-Plus，判题机部分为 C++ 编写。
          </div>
          <hr />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup name="About">
import { reactive } from 'vue';

import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';

import MD_AboutOJ from '@/assets/ts/About/AboutOJ';
import MD_OJInfo from '@/assets/ts/About/OJInfo';
import MD_Requirements from '@/assets/ts/About/Requirements';
import { aboutNavItems } from '@/config';

let tabInfo = reactive({
  activeTab: 0,
  switch(index: number) {
    this.activeTab = index;
  }
});

</script>

<style scoped></style>