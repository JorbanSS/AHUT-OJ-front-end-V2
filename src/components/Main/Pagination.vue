<template>
  <div class="flex flex-col mx-auto py-4 [&_div]:mx-auto space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0" v-if="props.maxPage">
    <div class="join">
      <button class="join-item btn" @click="props.changePage(1)">
        <double-left theme="outline" size="20" />
      </button>
      <button class="join-item btn" @click="props.changePage(props.page - 1)">
        <left theme="outline" size="20" />
      </button>
      <button class="join-item btn">
        {{ props.page }} / {{ props.maxPage }}
      </button>
      <button class="join-item btn" @click="props.changePage(props.page + 1)">
        <right theme="outline" size="20" />
      </button>
      <button class="join-item btn" @click="props.changePage(props.maxPage)">
        <double-right theme="outline" size="20" />
      </button>
    </div>
    <div class="join">
      <input class="input input-bordered join-item w-20" v-model="toPage" type="number" min="1" :max="props.maxPage" />
      <button class="btn join-item" @click="props.changePage(toPage)">跳转</button>
    </div>
  </div>
  <div class="pt-4 pb-6 mx-auto" v-else>
    无结果
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Left, Right, DoubleLeft, DoubleRight } from '@icon-park/vue-next';

let toPage = ref();

interface propsType {
  page: number,
  maxPage: number,
  changePage: Function,
};

let props = withDefaults(defineProps<propsType>(), {
  page: 1,
  maxPage: 0,
  changePage: () => { },
});

</script>