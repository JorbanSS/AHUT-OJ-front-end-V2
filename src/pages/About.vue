<template>
  <div class="card Border bg-white shadow-lg p-6">
    <div role="tablist" class="tabs tabs-bordered w-fit">
      <a role="tab" class="tab" v-for="item in aboutNavItems" :key="item.label"
        :class="{ 'tab-active': tabInfo.activeTab == item.value }" @click="tabInfo.switch(item.value)">{{ item.label }}</a>
    </div>
    <div></div>
    <MdPreview editorId="OJInfo" :modelValue="MD_OJInfo" v-if="tabInfo.activeTab == 0" />
    <MdPreview editorId="Requirements" :modelValue="MD_Requirements" v-if="tabInfo.activeTab == 1" />
    <div v-if="tabInfo.activeTab == 2">
      <MdPreview editorId="AboutOJ" :modelValue="MD_AboutOJ"/>
    </div>
  </div>
</template>

<script lang="ts" setup name="About">
import { ref, reactive, onMounted, watch } from 'vue';
import { MdPreview, MdCatalog } from 'md-editor-v3';
import { push } from 'notivue';
import 'md-editor-v3/lib/preview.css';
import { aboutNavItems } from '@/config';

import MD_OJInfo from '@/assets/ts/About/OJInfo';
import MD_Requirements from '@/assets/ts/About/Requirements';
import MD_AboutOJ from '@/assets/ts/About/AboutOJ';

let tabInfo = reactive({
  activeTab: 0,
  switch(index: number) {
    this.activeTab = index;
  }
});

</script>

<style scoped></style>