<template>
  <div class="search">
    <div class="input">
      <el-input
        v-model="key"
        :placeholder="placeholder"
        size="mini"
        clearable
        @keyup.enter.native="enter"
      >
        <i slot="suffix" class="el-input__icon el-icon-search" @click="enter" />
      </el-input>
      <slot name="refresh" />
    </div>
    <!-- <el-button v-if="showIcon" slot="append" icon="el-icon-search" size="mini" type="text" @click="enter" /> -->
    <slot name="button" />
  </div>
</template>

<script>
export default {
  name: 'Search',
  props: {
    content: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入搜索内容'
    },
    showIcon: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      key: this.content
    }
  },
  watch: {
    key(value) {
      this.$emit('update:content', value)
    }
  },
  methods: {
    enter() {
      this.$emit('search', this.key)
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-input {
    margin: 5px;
    width: 95%;
  }
  .input {
    display: flex;
    width: 100%;
    max-width: 300px;
  }
  .search {
    display: flex;
    justify-content: space-between;
  }
  .el-icon-search {
    padding: 0
  }
</style>
