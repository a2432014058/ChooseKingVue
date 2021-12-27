<template>
    <router-view v-if="isRouterAlive"></router-view>
</template>

<script>
export default {
  name: 'App',
  data(){
    return {
      isRouterAlive: true
    }
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  computed:{
    layout(){
      return this.$route.meta.layout
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style>

</style>