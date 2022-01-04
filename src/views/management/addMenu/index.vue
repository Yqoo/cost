<template>
  <div style="width:100%;">
    <!-- https://www.baidu.com/ -->
    <iframe :src="iframeUrl" frameborder="0" style="width:100%;height:100%" />
  </div>
</template>

<script>
export default {
  name: 'AddMenu',
  data() {
    return {
      iframeUrl: ''
    }
  },
  created() {
    const site = window.location.hash.lastIndexOf('/')
    const param = window.location.hash.slice(site + 1)
    this.iframeUrl = JSON.parse(decodeURIComponent(param)).url
  },
  beforeRouteEnter(to, from, next) {
    if (to.params.param) {
      const p = JSON.parse(decodeURIComponent(to.params.param))
      to.meta.title = p.name
    }
    next()
  },
  beforeRouteUpdate(to, from, next) {
    if (to.params.param) {
      const p = JSON.parse(decodeURIComponent(to.params.param))
      to.meta.title = p.name
    }
    next()
  }
}
</script>

<style lang="scss" scoped>

</style>
