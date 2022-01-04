<template>
  <el-dialog
    v-dialogDrag
    :modal="false"
    width="500px"
    :visible.sync="show"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="() => $emit('update:show', false)"
  >
    <div slot="title">
      菜单生成
    </div>
    <Tree
      :data="tree.data"
      default-expand-all
      @setTargetNode="nodeClick"
    />
    <div slot="footer" style="display: flex;justify-content: space-between;line-height: 28px;">
      <div style="font-size: 12px">
        <el-popover
          placement="bottom-start"
          width="400"
          trigger="hover"
        >
          <ul class="iconbox">
            <li v-for="icon in icons" :key="icon" @click="targetIcon = icon">
              <i :class="'iconfont ' + icon" />
            </li>
          </ul>
          <i
            slot="reference"
            :class="'iconfont ' + targetIcon"
            style="cursor: pointer;vertical-align: bottom; padding-right: 5px;"
            title="设置图标"
          />
        </el-popover>
        <span>{{ tree.targetNode.label }}</span>
      </div>
      <div>
        <el-button type="info" size="mini" @click="() => $emit('update:show', false)">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="generate">
          生成
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import Icons from '@/assets/js/icons.js'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: '',
      require: true
    },
    api: {
      type: String,
      default: '',
      require: true
    },
    from: {
      type: String,
      default: 'record'
    }
  },
  data() {
    return {
      tree: {
        data: [],
        targetNode: {}
      },
      icons: Icons,
      targetIcon: 'icon-quanjuweidu'
    }
  },
  watch: {
    show: {
      immediate: true,
      handler: 'getFloderTree'
    }
  },
  methods: {
    generate() {
      const { targetNode } = this.tree
      if (targetNode.id && this.id) {
        this.$api.record.generateMenus(this.api, {
          id: this.id,
          pid: this.tree.targetNode.id,
          icon: this.targetIcon
        }).then(s => {
          this.$message.success('添加成功')
          this.$emit('update:show', false)
        }).catch(e => this.$message.error(e.message))
      } else this.$message.warning('请先选择上级目录！')
    },
    getFloderTree(bool) {
      if (!bool) {
        this.tree.targetNode = {}
      }
      if (!this.tree.data.length) {
        this.$api.menu.folderTree().then(s => {
          this.tree.data = [s.data]
        })
      }
    },
    nodeClick(node) {
      this.tree.targetNode = node
    }
  }
}
</script>

<style lang='scss' scoped>
  .iconbox {
    height: 400px;
    overflow-y: auto;
    padding: 10px;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-content: flex-start;
    li {
      cursor: pointer;
      padding: 3px 8px;
      margin: 5px;
      border-radius: 4px;
      border: 1px solid #ddd;
      i {
        font-size: 20px;
      }
    }
    li:hover {
      background: #4390de;
      color: #fff;
    }
  }
</style>
