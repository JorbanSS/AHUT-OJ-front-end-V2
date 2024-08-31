<template>
  <div id="chart_problemIndex"></div>
</template>

<script lang="ts" setup name="Main">
import { onMounted, reactive, watch } from 'vue';

import ApexCharts from 'apexcharts';

import { chartDefaultConfig, ratingToColorMap } from '@/config';
import { MapStringNumber } from '@/interfaces/common';

interface propsType {
  problemIndex: MapStringNumber;
};

let props = withDefaults(defineProps<propsType>(), {
  problemIndex: () => ({}),
});

let chartOptions = reactive({
  title: {
    text: '题目索引',
    align: 'center',
  },
  chart: {
    type: 'bar',
    toolbar: chartDefaultConfig.toolbar,
    height: 320,
  },
  legend: {
    show: false,
  },
  plotOptions: {
    bar: {
      distributed: true,
      dataLabels: {
        position: 'top',
      },
    },
  },
  colors: ['#061020'],
  series: [
    {
      name: '数量',
      data: []
    }
  ],
});

function renderChart() {
  let problemIndexDistribution: any = []
  Object.entries(props.problemIndex).forEach((item) => {
    problemIndexDistribution.push({
      x: item[0],
      y: Number(item[1]),
    });
  });
  chartOptions.series[0].data = problemIndexDistribution;
  let chart = new ApexCharts(document.querySelector("#chart_problemIndex"), chartOptions);
  chart.render();
}

watch(() => props.problemIndex, () => {
  renderChart();
})

onMounted(() => {
  renderChart();
});

</script>