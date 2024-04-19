<template>
  <div class="card bg-white Border m-6 p-6">
    <div class="stats mx-auto shadow-lg Border">
      <div class="flex">
        <div class="stats shadow">
          <div class="stat">
            <div class="stat-figure text-primary">
              <cattle theme="outline" size="28" />
            </div>
            <div class="stat-title">NowCoder</div>
            <div class="stat-value text-primary">3200</div>
            <div class="stat-desc flex">
              <to-top theme="outline" size="14" />
              max. 3600
            </div>
          </div>

          <div class="stat">
            <div class="stat-figure text-secondary">
              <Ranking theme="outline" size="28" />
            </div>
            <div class="stat-title">CodeForces</div>
            <div class="stat-value text-secondary">3500</div>
            <div class="stat-desc flex">
              <to-top theme="outline" size="14" />
              max. 3900
            </div>
          </div>

          <div class="stat">
            <div class="stat-figure text-secondary">
              <div class="avatar online">
                <div class="w-16 rounded-full">
                  <img src="https://userpic.codeforces.org/2831557/title/be6ab3f7c88febd5.jpg" />
                </div>
              </div>
            </div>
            <div class="stat-value">No.1</div>
            <div class="stat-title">{{ userDataStore.UserName }}</div>
            <div class="stat-desc text-secondary">Owned 12 xcpc awards.</div>
          </div>
        </div>
      </div>
    </div>
    <div class="m-6"></div>
    <div class="flex flex-col gap-4">
      <div class="flex gap-4 items-center">
        <div class="skeleton w-16 h-16 rounded-full shrink-0"></div>
        <div class="flex flex-col gap-4">
          <div class="skeleton h-4 w-20"></div>
          <div class="skeleton h-4 w-28"></div>
        </div>
      </div>
      <div class="skeleton h-12 w-full"></div>
      <div class="skeleton h-32 w-full"></div>
    </div>
  </div>
</template>

<script lang="ts" setup name="Training">
import { useUserDataStore } from '@/stores/UserData';

const userDataStore = useUserDataStore();

</script>

<style scoped></style>