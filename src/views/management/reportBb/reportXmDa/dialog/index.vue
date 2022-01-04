<template>
  <div>
    <ToolsBar :items="btns" @btnsHandler="btnsHandler" />
    <LeftWorkbench ref="leftWorkbench" :width="width" title="报表项目" class="left" :additional="35">
      <el-button slot="addUnit" class="el-icon-plus" style="padding:0" size="mini" type="text" @click="addUnit" />
      <Tree
        slot="tree"
        ref="tree"
        v-waiting="tree.loading"
        search
        :data="tree.data"
        :node-props="{
          children: 'children',
          label: 'label'
        }"
        default-expand-all
        :rightmenus="rightmenus"
        @update:rightmenus="rightmenusHandler"
        @setTargetNode="setTargetNode"
      />
    </LeftWorkbench>
    <MiddleDrag :margin-top="middleDragTop" @hook:mounted="getTop" @move="move" />
    <RightWorkbench :margin-left="width" class="right" :additional="35">
      <div class="content">
        <div
          v-for="item in cards"
          slot="grid"
          :key="item.id"
          class="boxBard"
        >
          <el-card
            :key="item.id"
            shadow="hover"
            class="{ borderStyle: card.borderStyle }"
          >
            <div>
              <p class="boxBard_header">
                <span class="el-icon-share" />
                <span class="el-icon-edit" />
                <span class="el-icon-circle-close" />
              </p>
              <p class="boxBard_image">
                <img src="" alt="">
              </p>
              <p class="boxBard_footer">
                <span>{{ item.name }}</span>
              </p>
            </div>
          </el-card>
        </div>
      </div>
    </RightWorkbench>
  </div>
</template>

<script>
import http from '@/api/http.js'

export default {
  name: 'FunctionCenter',
  data() {
    return {
      width: 300,
      middleDragTop: this.width,
      tree: {
        loading: false,
        data: []
      },
      cards: [] // 卡片
    }
  },
  computed: {
    btns() {
      return [
        { method: 'add', name: '新增' },
        { method: 'edit', name: '修改' },
        { method: 'del', name: '删除' },
        {
          method: 'more',
          name: '更多',
          children: [
            { method: 'educe', name: '导出' }
          ]
        }
      ]
    }
  },
  methods: {
    addUnit() { // 添加函数中心
      console.log('add')
    },
    rightmenus(node) { // 树节点功能
      console.log(node)
    },
    rightmenusHandler(obj) { // 树节点功能事件
      console.log(obj)
    },
    setTargetNode(node) { // 树节点点击
      console.log(node)
    },
    btnsHandler(met) { // toolsBar事件
      const DEAL = {
        add: () => {},
        edit: () => {},
        del: () => {}
      }
      DEAL[met]()
    },
    getTop() { // 拖拽
      this.middleDragTop = this.$refs.leftWorkbench.$el.offsetHeight / 2
    },
    move(x) { // 移动
      if (x < 300) x = 300
      else if (x > 800) x = 800
      this.width = x
    }
  }
}
</script>

<style lang="scss" scoped>
.borderStyle {
  border-color: #4390de;
}
.right {
  .content {
    display: flex;
    align-content: flex-start;
    .boxBard {
      .el-card {
        width: 80px;
        height: 90px;
      }
      &_header {
        text-align: right;
        .el-icon-share {
          color: #4390de;
        }
        .el-icon-edit {
          color: green;
        }
        .el-icon-circle-close {
          color: red;
        }
      }
      &_image {
        img {
          width: 60px;
          height: 70px;
        }
      }
      &_footer {
        text-align: center;
      }
    }
  }
}
</style>
