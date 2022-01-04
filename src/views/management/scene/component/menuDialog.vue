<template>
  <el-dialog
    v-dialogDrag
    :modal="false"
    width="400px"
    :visible.sync="show"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="() => $emit('update:show', false)"
  >
    <div slot="title">
      关联菜单
    </div>
    <Tree
      ref="tree"
      v-waiting="tree.loading"
      search
      :data="tree.data"
      node-key="id"
      :node-props="{
        children: 'children',
        label: 'label',
      }"
      :default-expanded-keys="checks"
      :default-checked-keys="checks"
      height="400px"
      check-box
    />
    <div slot="footer">
      <el-button type="info" size="mini" @click="() => $emit('update:show', false)">
        取消
      </el-button>
      <el-button type="primary" size="mini" @click="confirm">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    },
    checks: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tree: {
        loading: false,
        data: [],
        focusId: []
      },
      nodes: []
    }
  },
  created() {
    this.getTree()
  },
  methods: {
    confirm() {
      const nodes = this.$refs.tree.getCheckedNodes()
      if (nodes.length) {
        this.$emit('sendNode', nodes.map(node => node.id))
        this.$emit('update:show', false)
      } else this.$message.warning('请选择要关联的菜单！')
    },
    getTree() {
      this.$api.mxGraph.getFolderTree({ sceneId: this.id }).then(s => {
        s.data.disabled = true
        this.tree.data = [s.data]
      }).catch(e => this.$message.error(e.message))
    }
  }
}
</script>
