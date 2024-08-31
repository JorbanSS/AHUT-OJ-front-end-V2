<template>
  <div id="chart_verdict"></div>
</template>

<script lang="ts" setup name="Main">
import { onMounted, reactive, watch } from 'vue';

import ApexCharts from 'apexcharts';

import { chartDefaultConfig } from '@/config';
import { MapStringNumber } from '@/interfaces/common';

interface propsType {
  verdict: MapStringNumber;
};

let props = withDefaults(defineProps<propsType>(), {
  verdict: () => ({}),
});

let chartOptions = reactive({
  title: {
    text: '提交结果',
    align: 'center',
  },
  chart: {
    type: 'pie',
    toolbar: chartDefaultConfig.toolbar,
    height: 320,
  },
  series: Array<number>(),
  labels: Array<string>(),
  colors: Array<string>(),
});

interface VerdictDistributionType {
  series: number[];
  labels: string[];
  colors: string[];
}

function renderChart() {
  let verdictDistribution: VerdictDistributionType = {
    series: [],
    labels: [],
    colors: [],
  }
  Object.entries(props.verdict).forEach((item) => {
    verdictDistribution.series.push(Number(item[1]))
    verdictDistribution.labels.push(item[0].toString());
  });
  chartOptions.series = verdictDistribution.series;
  chartOptions.labels = verdictDistribution.labels;
  let chart = new ApexCharts(document.querySelector("#chart_verdict"), chartOptions);
  chart.render();
}

watch(() => props.verdict, () => {
  renderChart();
})

onMounted(() => {
  renderChart();
})

</script>