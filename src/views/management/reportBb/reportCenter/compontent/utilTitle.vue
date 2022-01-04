<template>
  <div class="op-item" @click="clickItem">
    <p v-if="info.label" class="up">
      <i :class="'iconfont icon-' + info.icon" :title="info.title" />
    </p>
    <div class="name">
      <p v-if="info.label" :style="info.style">
        {{ info.label }}
      </p>
      <i v-else :class="'iconfont icon-' + info.icon" :title="info.title" />
      <el-cascader
        v-show="info.children"
        v-model="value"
        :options="options"
        size="mini"
        :props="{ expandTrigger: 'click' }"
        :show-all-levels="false"
        popper-class="reportMenu myTool"
        @change="handleChange"
      >
        <template slot-scope="{ data }" class="cascader">
          <i v-if="data.icon" :class="'iconfont icon-' + data.icon" style="vertical-align:middle;margin-right:5px;" />
          <span v-if="!data.type">{{ data.label }}</span>
          <span v-if="data.type" :title="data.label" class="line-style" :style="getBorderType(data.type)" />
        </template>
      </el-cascader>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UtilTitle',
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      value: [],
      options: this.info.children
    }
  },
  methods: {
    clickItem() {
      if (this.info.value !== undefined) this.$emit('start', this.info.value)
    },
    handleChange(value) {
      if (value) {
        this.$emit('start', value[value.length - 1])
        this.value = []
      }
    },
    getBorderType(type) {
      const w = type !== 'dotted' && type !== 'dashed' && type !== 'solid'
        ? '3px'
        : '1px'
      const style = {
        'border-width': `${w}`,
        'border-style': type,
        padding: '2px'
      }
      return style
    }
  }
}
</script>

<style lang="scss" scoped>
.op-item {
  text-align: center;
  padding: 0 5px;
  .up {
    height: 32px;
    box-sizing: border-box;
    & > i {
      font-size: 26px;
      color: #7a7979;
    }
  }
  .name {
    display: flex;
    position: relative;
    & > p {
      line-height: 26px;
      width: 100%;
    }
    & > i.iconfont {
      position: relative;
      top: 2px;
    }
    .el-cascader {
      & /deep/ .el-input__inner {
        position: relative;
        width: 1px !important;
        height: 20px;
        line-height: 20px;
        border: none;
        padding: 0 10px;
        background: transparent;
      }
      & /deep/ .el-input__suffix {
        right: 0;
        transform: scale(0.8);
      }
    }
  }
}
.line-style {
  display: inline-block;
  width: 100%;
}
</style>
