<template>
  <div v-if="loading" id="custom-loading" class="el-loading-mask custom-loading">
    <div class="el-loading-spinner">
      <div class="loading-text">
        {{ text }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: '拼命加载中…'
    }
  }
  // watch: {
  //   loading() {
  //     this.setParentStyle()
  //   }
  // },
  // mounted() {
  //   this.setParentStyle()
  // },
  // methods: {
  //   setParentStyle() {
  //     let ele = document.getElementById('custom-loading').parentNode
  //     if (!ele.style.position) ele.style.position = this.loading ? 'relative' : ''
  //     ele = null
  //   }
  // }
}
</script>

<style lang="scss" scoped>

</style>
