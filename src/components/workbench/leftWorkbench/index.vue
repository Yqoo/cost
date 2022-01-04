<template>
  <div
    class="leftWorkbench"
    :style="{ width: width + 'px', borderRadius: borderRadius + 'px', height: 'calc(99% - '+ additional +'px)'}"
  >
    <div slot :class="{ title: title }" class="unit">
      <p>{{ title }}</p>
      <slot name="addUnit" />
      <!-- <p class="el-icon-plus" @click="add" /> -->
    </div>
    <slot name="select" />
    <slot name="tree" />
    <slot name="list" />
  </div>
</template>

<script>
export default {
  name: 'LeftWorkbench',
  props: {
    width: {
      type: Number,
      default: () => 250
    },
    borderRadius: {
      type: Number,
      default: () => 5
    },
    title: {
      type: String,
      default: ''
    },
    additional: { // 额外需要减去的高度
      type: Number,
      default: 0
    }
  },
  methods: {
  }
}
</script>

<style lang='scss' scoped>
.leftWorkbench {
  // margin-top: 10px;
  border: 1px solid #ddd;
  float: left;
  .title {
    padding: 5px 10px;
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #ccc;
  }
  .unit {
    display: flex;
    justify-content: space-between;
    .el-icon-plus {
      font-size: 18px;
    }
  }
}
</style>
