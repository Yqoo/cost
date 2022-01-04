<template>
  <div class="middleDrag" :style="{ marginTop: marginTop + 'px' }">
    <!-- class="iconfont icon-yidongshu" -->
    <i
      class="iconfont icon-tuozhuai"
      @mousedown="move"
    />
  </div>
</template>

<script>
export default {
  name: 'MiddleDrag',
  props: {
    marginTop: {
      type: Number,
      default: () => 400
    }
  },
  methods: {
    move(e) {
      // console.log(e)
      const el = e.target
      const disX = e.clientX - el.offsetLeft
      document.onmousemove = ve => {
        this.$emit('move', ve.clientX - disX)
      }
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.middleDrag {
  float: left;
  i {
    cursor: e-resize;
    font-size: 20px;
    color: #409eff;
    position: absolute;
  }
}
</style>
