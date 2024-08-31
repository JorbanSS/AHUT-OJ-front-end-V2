<template>
  <div id="chart_language"></div>
</template>

<script lang="ts" setup name="Main">
import { onMounted, reactive, watch } from 'vue';

import ApexCharts from 'apexcharts';

import { chartDefaultConfig } from '@/config';
import { MapStringNumber } from '@/interfaces/common';

interface propsType {
  language: MapStringNumber;
};

let props = withDefaults(defineProps<propsType>(), {
  language: () => ({}),
});

let chartOptions = reactive({
  title: {
    text: '提交语言',
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

interface languageDistributionType {
  series: number[];
  labels: string[];
  colors: string[];
}

function renderChart() {
  let languageDistribution: languageDistributionType = {
    series: [],
    labels: [],
    colors: [],
  }
  Object.entries(props.language).forEach((item) => {
    languageDistribution.series.push(Number(item[1]))
    languageDistribution.labels.push(item[0].toString());
  });
  chartOptions.series = languageDistribution.series;
  chartOptions.labels = languageDistribution.labels;
  let chart = new ApexCharts(document.querySelector("#chart_language"), chartOptions);
  chart.render();
}

watch(() => props.language, () => {
  renderChart();
})

onMounted(() => {
  renderChart();
});

</script>