<template>
  <div
    class="rightWorkbench"
    :style="{
      marginLeft: marginLeft + 23 +'px',
      borderRadius: borderRadius + 'px',
      width: 'calc(100% - '+(marginLeft + 35)+'px)',
      height: 'calc(99% - '+ additional +'px)',
      marginTop: top + 'px'
    }"
  >
    <slot name="toolsBar" />
    <slot name="search" />
    <slot name="table" />
    <slot name="page" />
    <slot name="grid" />
  </div>
</template>

<script>
export default {
  name: 'RightWorkbench',
  props: {
    marginLeft: {
      type: Number,
      required: true
    },
    borderRadius: {
      type: Number,
      default: 5
    },
    additional: { // 额外需要减去的高度
      type: Number,
      default: 0
    },
    top: {
      type: Number,
      default: 10
    }
  }
}
</script>

<style lang='scss' scoped>
.rightWorkbench {
  border: 1px solid #ddd;
  margin-right: 3px;
}
</style>
