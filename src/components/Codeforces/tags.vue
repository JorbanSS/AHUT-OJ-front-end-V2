<template>
  <div id="chart_tags"></div>
</template>

<script lang="ts" setup name="Main">
import { onMounted, reactive, watch } from 'vue';

import ApexCharts from 'apexcharts';

import { chartDefaultConfig, ratingToColorMap } from '@/config';
import { MapStringNumber } from '@/interfaces/common';

interface propsType {
  tags: MapStringNumber;
};

let props = withDefaults(defineProps<propsType>(), {
  tags: () => ({}),
});

let chartOptions = reactive({
  title: {
    text: '题目标签',
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
  let problemTagsDistribution: any = []
  Object.entries(props.tags).forEach((item) => {
    problemTagsDistribution.push({
      x: item[0],
      y: Number(item[1]),
    });
  });
  chartOptions.series[0].data = problemTagsDistribution;
  let chart = new ApexCharts(document.querySelector("#chart_tags"), chartOptions);
  chart.render();

}

watch(() => props.tags, () => {
  renderChart();
})

onMounted(() => {
  renderChart();
});

</script>