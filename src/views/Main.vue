<template>
  <NavBar></NavBar>
  <keep-alive>
    <div class="max-w-6xl mx-auto m-6" style="min-height: calc(100vh - 124px - 48px)" v-auto-animate>
      <RouterView></RouterView>
    </div>
  </keep-alive>
  <Footer></Footer>
</template>

<script lang="ts" setup name="Main">
import { onMounted } from 'vue';
import { RouterView, useRoute } from 'vue-router';

import Footer from '@/components/Main/Footer.vue';
import NavBar from '@/components/Main/NavBar.vue';

const route = useRoute();

onMounted(() => {

});

</script>

<style lang="scss" scoped>
.coverBox {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  filter: blur(3px);
}
</style>