<template>
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
          <div class="stat-title">RJFang</div>
          <div class="stat-desc text-secondary">Owned 12 xcpc awards.</div>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="Training">

</script>

<style scoped>

</style>