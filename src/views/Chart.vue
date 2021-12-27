<template>
  <div id="chart" ref="chart"></div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { globalBus } from '../store/index';
export default {
  name: "Chart",
  data() {
    return {
      chartInstance: null,
    };
  },
  computed: {
    ...mapState(["persons", "outPersons", "showMarker"]),
  },
  mounted() {
    this.initChart();
    this.save()
    this.load()
  },
  methods: {
    ...mapMutations(["initPersons", "clearPersons", "leavePerson"]),
    // 初始化图表
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.chart);
      const initOption = {
        title: {
          text: "猴子选大王",
        },
        tooltip: {
          trigger: "item",
          formatter: function (arg) {
            return arg.value + ': ' + arg.name;
          },
        },
        toolbox: {},
        series: [
          {
            name: "Persons",
            type: "graph",
            label: {
              show: true,
              position: "inside",
              fontSize: 10,
              offset: [0, 2],
            },
            data: this.persons.concat(this.outPersons),
          },
        ],
      };
      this.chartInstance.setOption(initOption);
      window.onresize = () => {
        this.chartInstance.resize();
      };
    },
    load() {
      globalBus.$on('data', (da) => {
        console.log(da)
        const data= JSON.parse(localStorage.getItem('data'))
        console.log(data)
        this.chartInstance.setOption(data)
      });
    },
    save() {
      globalBus.$on('save', (da) => {
        console.log(da)
        const data =JSON.stringify(this.chartInstance.getOption())
        console.log(data)
        localStorage.setItem("data",data)
      });
    }
  },
  watch: {
    persons() {
     const data = {
       series: [
         {
           type: "graph",
           data: this.persons.concat(this.outPersons).concat(this.showMarker),
         },
       ],
     }
     this.chartInstance.setOption(data)
    },
  },
};
</script>

<style scoped>
#chart {
  margin: 20px;
  height: 100%;
  width: 100%;
}
</style>
