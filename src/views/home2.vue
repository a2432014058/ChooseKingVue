<template>
  <div id="app">
    <div id="chart">
    <div id="building" />
    <chart />
    </div>
    <div id="tool-bar">
      <tool-bar />
    </div>
  </div>
</template>

<script>
import Chart from "../views/Chart";
import ToolBar from "../views/ToolBar";

export default{
  components: {
    Chart,
    ToolBar,
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
  width:100%;		
  height:100%;		
  position:fixed;
  background:url("../static/land.png");
  background-size:100% 100%;
}
#chart {
  height: 100%;
  width: 60%;
  float: left;
}
#tool-bar {
  height: 100%;
  width: 40%;
  float: left;
}
</style>
