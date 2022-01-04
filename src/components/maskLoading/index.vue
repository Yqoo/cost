<template>
  <div
    ref="myLoadingRef"
    :class="fullscreen ? 'maskLoading-FullScreen' : 'maskLoading'"
    :style="{
      zIndex: 2002,
      background: 'rgba(' + background + ')',
      fontSize: fontSize + 'px',
      color: color
    }"
  >
    <img
      class="loading-icon"
      :src="iconSrc"
      alt="loading"
      :style="{ width: iconWidth + 'px', height: iconHeight + 'px' }"
    >
    <span class="loading-desc">{{ text }}</span>
  </div>
</template>

<script>
const debounce = (fn, wait = 100) => {
  if (typeof fn !== 'function') return false
  wait = typeof wait === 'number' ? wait : 100
  let timer = null
  // eslint-disable-next-line func-names
  return function () {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, wait)
  }
}
export default {
  name: 'MaskLoading',
  data() {
    return {
      fullscreen: false,
      background: '255, 255, 255, .9',
      text: '正在加载中…',
      iconSrc: null,
      iconWidth: null,
      iconHeight: null,
      color: null,
      fontSize: null
    }
  },
  mounted() {
    if (this.fullscreen) {
      document.body.style.overflow = 'hidden'
    }
    this.fn = debounce(this.resizeStyle, 100)
    window.addEventListener('resize', this.fn)
  },
  destroyed() {
    document.body.style.overflowX = 'hidden'
    window.removeEventListener('resize', this.fn)
    this.fn = null
  },
  methods: {
    resizeStyle() {
      const { parentNode } = this.$refs.myLoadingRef
      const node = this.$refs.myLoadingRef

      // 非全屏情况下
      const height = parentNode.clientHeight // 当前元素高度
      const width = parentNode.clientWidth // 当前元素宽度

      const { x, y } = parentNode.getBoundingClientRect()

      // 给蒙版赋值
      node.style.top = `${y}px`
      node.style.left = `${x}px`
      node.style.width = `${width}px`
      node.style.height = `${height}px`
    }
  }
}
</script>

<style lang="scss">
.maskLoading {
  position: fixed;
  z-index: 2000;
  background: rgba(255, 255, 255, .1);
  width: 100%;
  height: 100%;
  color: rgb(65, 62, 62);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  flex-flow: column;
  .loading-desc {
      display: inline-block;
      z-index: 100001;
      padding-left: 20px;
  }

}
.maskLoading-FullScreen {
  @extend .maskLoading;
  width: 100vw;
  height: 100vh;
  top: 0;
  background: (255, 255, 255, .9);
}
.loading-icon {
  width: 80px;
  height: 80px;
  object-fit: cover;
 /*  animation: rotate 2s linear infinite;
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  } */
}
</style>
