<template>
  <div class="treeBox" :style="{ height: boxHeight }">
    <Search
      v-if="search"
      :content.sync="content"
      @update:content="searchNode"
    />
    <el-tree
      ref="tree"
      :node-key="nodeKey"
      :show-checkbox="checkBox"
      :data="data"
      :props="nodeProps"
      :check-strictly="strictly"
      :filter-node-method="filterNode"
      :style="{ height: height || treeHeight}"
      :expand-on-click-node="false"
      :default-expanded-keys="defaultExpandedKeys"
      :default-checked-keys="defaultCheckedKeys"
      :default-expand-all="defaultExpandAll"
      :current-node-key="currentNodeKey"
      highlight-current
      @node-click="getNode"
      @check="check"
      @check-change="checkChange"
    >
      <span slot-scope="{ node }" :class="{ 'custom-tree-node': true, isDisabled: node.disabled && inBox }">
        <span>
          <i
            :class="'iconfont ' + node.data.icon"
            style="font-size:14px;padding-right:3px;"
          />
          <el-tooltip
            class="item"
            effect="dark"
            :content="node.label"
            placement="top"
            :enterable="false"
          >
            <span> {{ node.label }}</span>
            <!-- <span> {{ node.label | ellipsis }}</span> -->
          </el-tooltip>
        </span>
        <span class="btnsText">
          <el-button
            v-for="btn in ruleRightMenus(node)"
            :key="btn.type"
            :icon="btn.text ? '' : btn.icon"
            size="mini"
            type="text"
            :title="btn.label"
            @click.native.stop="inlineMenusHandler(node.data, btn.type, node)"
          >
            {{ btn.text ? btn.label : '' }}
          </el-button>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>

export default {
  name: 'Tree',
  components: {
    Search: () => import('@/components/treeNode/search')
  },
  props: {
    checkBox: { // 是否显示复选框
      type: Boolean,
      default: false
    },
    strictly: { // 是否严格的遵循父子不互相关联
      type: Boolean,
      default: true
    },
    search: { // 是否启用搜索
      type: Boolean,
      default: true
    },
    nodeProps: { // 树节点信息
      type: Object,
      default: () => ({
        children: 'children',
        label: 'label'
      })
    },
    data: { // 数据
      type: Array,
      required: true,
      default: () => []
    },
    rightmenus: { // 右键功能过滤方法
      type: Function,
      default() {}
    },
    defaultExpandedKeys: {
      type: Array,
      default: () => []
    },
    defaultCheckedKeys: {
      type: Array,
      default: () => []
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    currentNodeKey: {
      type: String,
      default: ''
    },
    nodeKey: {
      type: String,
      default: 'id'
    },
    inBox: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      content: '',
      treeHeight: 'calc(100% - 40px)',
      boxHeight: '100%'
    }
  },
  mounted() {
    const el = document.querySelector('.treeBox')
    // eslint-disable-next-line max-len
    if (el && el.previousElementSibling && !this.inBox) {
      this.treeHeight = `calc(100% - (40px + ${el.previousElementSibling.offsetHeight}px))`
      this.boxHeight = `calc(100% - (10px + ${el.previousElementSibling.offsetHeight}px))`
    }
  },
  methods: {
    ruleRightMenus(node) { // 此为放弃右键 将图标放于node节点上
      return this.rightmenus(node.data)
    },
    inlineMenusHandler(data, type, node) { // 此为放弃右键 将图标放于node节点上
      this.$emit('update:rightmenus', {
        data,
        type,
        node
      })
    },
    async contextmenu(event, data) {
      // 将当前节点上传父组件 根据节点信息做数据处理
      await this.$emit('setTargetNode', data)
      if (this.rightmenus.length === 0) return false
      this.rightmenus.forEach(menu => {
        this.$set(menu, 'onClick', () => this.$emit('update:rightmenus', {
          data,
          type: menu.type
        }))
      })
      this.$contextmenu({
        items: this.rightmenus,
        event,
        customClass: 'customContextmenu',
        zIndex: 1000003,
        minWidth: 130
      })
      return true
    },
    searchNode(val) {
      this.$refs.tree.filter(val)
    },
    filterNode(value, data) {
      if (!value) return true
      const d = data.label || data.name
      return d.indexOf(value) !== -1
    },
    getNode(data, node) {
      this.$emit('setTargetNode', data)
    },
    remove(node) {
      this.$refs.tree.remove(node)
    },
    append(data, parentNode) {
      this.$refs.tree.append(data, parentNode)
    },
    check(data, self) {
      this.$emit('check', self)
    },
    checkChange(obj, statu, child) {
      this.$emit('check-change', { obj, statu, child })
    },
    getCheckedKeys() {
      return this.$refs.tree.getCheckedKeys()
    },
    getCheckedNodes() {
      return this.$refs.tree.getCheckedNodes()
    }
  }
}
</script>

<style lang='scss' scoped>
.treeBox {
  height: 100%;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;
  .el-tree {
    height: calc(100% - 40px);
    overflow-y: auto;
    font-size: 12px;
    display: inline-block;
    min-width: 100%;
    /deep/ .el-tree-node__content {
      width: 258px;
    }
  }
}
.btnsText {
  position: absolute;
  right: 5px;
  background: #fff;
}
.isDisabled {
  cursor: not-allowed;
}
</style>
