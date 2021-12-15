<template>
  <div id="app">
    <div id="chart">
    <div id="building" />
    <chart />
    </div>
    <div id="tool-bar">
      <justice />
    </div>
  </div>
</template>
<script>
import Chart from "../views/Chart";
import justice from "../views/justice";
export default{
  components: {
    Chart,
    justice,
  },
  data() {
    return {
      number: ''
    }
  },
  created() {
    //获取上次记录
  },
  methods: {

  }
}
</script>
<style>
html,
body {
  height: 100%;
  width: 100%;
  /* overflow: hidden; */
}

#app {
  height: 100%;
  width: 100%;
}
#building{
  background:url("../static/land.png");
  width:100%;		
  height:100%;		
  position:fixed;
  background-size:100% 100%;
}
#chart {
  height: 100%;
  width: 60%;
  float: left;
  background-image: "url(" + require("../static/land.png") + ")";
}
#tool-bar {
  height: 100%;
  width: 40%;
  float: left;
}
</style>