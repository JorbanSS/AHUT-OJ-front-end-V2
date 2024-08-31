<template>
  <div id="chart_rating"></div>
</template>

<script lang="ts" setup name="Main">
import { onMounted, reactive, watch } from 'vue';

import ApexCharts from 'apexcharts';

import { chartDefaultConfig, ratingToColorMap } from '@/config';
import { CodeforcesRatingType } from '@/interfaces/codeforces';

interface propsType {
  rating: CodeforcesRatingType;
};

let props = withDefaults(defineProps<propsType>(), {
  rating: () => ({}),
});

let chartOptions = reactive({
  title: {
    text: '历史评分',
    align: 'center',
  },
  chart: {
    type: 'area',
    toolbar: chartDefaultConfig.toolbar,
    height: 320,
    zoom: {
      autoScaleYaxis: true
    }
  },
  annotations: {
    yaxis: [
      {
        y: 30,
        borderColor: '#999',
        label: {
          show: true,
          text: 'Support',
          style: {
            color: "#fff",
            background: '#00E396'
          }
        }
      },
    ],
    xaxis: [{
      x: new Date('14 Nov 2012').getTime(),
      borderColor: '#999',
      yAxisIndex: 0,
      // label: {
      //   show: true,
      //   text: 'Rally',
      //   style: {
      //     color: "#fff",
      //     background: '#775DD0'
      //   }
      // }
    }]
  },
  tooltip: {
    x: {
      format: 'yyyy 年 M 月 d 日'
    }
  },
  xaxis: {
    type: 'datetime',
    // min: new Date('01 Mar 2024').getTime(),
    tickAmount: 6,
  },
  markers: {
    size: 5,
    style: 'hollow',
  },
  dataLabels: {
    enabled: false
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      stops: [0, 100]
    }
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    floating: true,
    offsetY: -25,
    offsetX: -5
  },
  plotOptions: {
    bar: {
      distributed: true,
      dataLabels: {
        position: 'top',
      },
    },
  },
  stroke: {
    curve: 'straight'
  },
  colors: ['#061020'],
  series: [
    {
      name: 'Rating',
      data: []
    }
  ]
});

function renderChart() {
  let problemIndexDistribution: any = []
  Object.entries(props.rating).forEach((item) => {
    problemIndexDistribution.push([
      Number(item[0]) * 1000,
      item[1].rating
    ]);
  });
  chartOptions.series[0].data = problemIndexDistribution;
  let chart = new ApexCharts(document.querySelector("#chart_rating"), chartOptions);
  chart.render();
}

watch(() => props.rating, () => {
  renderChart();
})

onMounted(() => {
  renderChart();
});

</script>