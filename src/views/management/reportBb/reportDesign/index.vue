<template>
  <div>
    <LeftWorkbench ref="leftWorkbench" :width="width" title="报表设计" :additional="0" class="left">
      <el-button
        v-if="apis.includes('/bbReportCategoryController/add')"
        slot="addUnit"
        class="el-icon-plus"
        style="padding:0"
        size="mini"
        type="text"
        @click="addUnit"
      />
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
    <RightWorkbench :margin-left="width" class="right" :additional="0">
      <ToolsBar slot="toolsBar" :items="btns" class="toolsBar" module-name="ReportDesign" @btnsHandler="btnsHandler">
        <!-- <div slot="select">
          <span style="margin-right: 10px">查看</span>
          <el-button
            type="primary"
            :plain="schema==='T'"
            size="mini"
            title="文件模式"
            icon="el-icon-picture-outline"
            @click="schema='F'"
          />
          <el-button
            type="primary"
            :plain="schema==='F'"
            size="mini"
            title="列表模式"
            icon="el-icon-s-operation"
            @click="schema='T'"
          />
        </div> -->
      </ToolsBar>
      <Search slot="search" :show-icon="true" class="search" :content.sync="content" @search="searchData">
        <el-button
          slot="refresh"
          size="mini"
          type="text"
          icon="el-icon-refresh-right"
          @click="refresh"
        >
          刷新
        </el-button>
      </Search>
      <div slot="grid" v-waiting="loading" class="content">
        <div v-if="schema==='F'" class="file">
          <div v-if="apis.includes('/bbReportFormsController/add')" class="addCard">
            <el-card shadow="hover">
              <div @click="listHandler('addBbList')">
                <p><i class="el-icon-plus" /></p>
              </div>
            </el-card>
          </div>
          <div v-for="item in bbCards" :key="item.id" class="card">
            <el-card
              :key="item.id"
              shadow="hover"
              :class="{ borderStyle: item.borderStyle }"
              @dblclick.native="listHandler('dblClick', item)"
            >
              <div class="maincontext">
                <p class="header">
                  <span />
                  <span
                    v-show="apis.includes('/bbReportFormsDataController/createMenu')"
                    @click="listHandler('menu', item)"
                  >
                    <i class="el-icon-menu" title="生成菜单" />
                  </span>
                  <span v-show="apis.includes('/bbReportFormsController/update')" @click="listHandler('edit', item)">
                    <i class="el-icon-edit" title="修改" />
                  </span>
                  <span v-show="apis.includes('/bbReportFormsController/delete')" @click="listHandler('del', item)">
                    <i class="el-icon-delete" title="删除" />
                  </span>
                </p>
                <p class="image" @click="listHandler('checkBbList', item)">
                  <img :src="require('@/assets/images/middleImg/bbsj.png')" alt="">
                </p>
                <p class="footer" @click="listHandler('checkBbList', item)">
                  <span :title="item.name" class="font">{{ item.name }}</span>
                </p>
              </div>
            </el-card>
          </div>
        </div>
        <div v-if="schema==='T'">
          222
        </div>
      </div>
    </RightWorkbench>
    <Classify
      v-if="classify.show"
      :show.sync="classify.show"
      :usn="classify.usn"
      :tree-data="tree.data"
      :info="classify.info"
      @refshTree="getTree"
    />
    <ReportList
      v-if="reportList.show"
      :show.sync="reportList.show"
      :usn="reportList.usn"
      :pid-data="tree.data"
      :node="targetNode"
      @refshBbList="refshBbList"
    />
    <Menu v-if="menu.show" :id="menu.id" :show.sync="menu.show" :api="menu.api" />
  </div>
</template>

<script>
export default {
  name: 'ReportDesign',
  components: {
    Classify: () => import('./dialog/classify'),
    ReportList: () => import('./dialog/reportList'),
    Menu: () => import('@/components/record/dialog/menu')
  },
  data() {
    return {
      targetNode: {},
      loading: false,
      width: 300,
      middleDragTop: this.width,
      content: '',
      schema: 'F',
      bbList: [], // 报表列表
      tree: {
        loading: false,
        data: []
      },
      classify: { // 报表分类
        show: false,
        usn: '',
        info: {}
      },
      reportList: {
        show: false,
        usn: ''
      },
      menu: {
        show: false,
        id: '',
        api: ''
      }
    }
  },
  computed: {
    apis() {
      return this.$tools.getModuleAPIS('ReportDesign')
    },
    bbCards() {
      if (this.content) {
        return this.bbList.filter(l => l.name !== null && l.name.indexOf(this.content) !== -1)
      } return this.bbList
    },
    btns() {
      return [
        { method: 'add', name: '新增', api: '/bbReportFormsController/add' },
        { method: 'edit', name: '修改', api: '/bbReportFormsController/update' },
        { method: 'del', name: '删除', api: '/bbReportFormsController/delete' }
      ]
    }
  },
  watch: {
    targetNode(val) {
      if (Object.keys(val).length) {
        this.getBbList({
          flId: val.id,
          type: val.icon
        })
      }
    }
  },
  created() {
    this.getTree()
    this.getBbList({})
  },
  methods: {
    refshBbList(id) { // 新增修改后刷新页面
      this.getTree()
      this.getBbList({ flId: id })
    },
    listHandler(type, data) {
      const DEAL = {
        menu: () => {
          Object.assign(this.menu, {
            id: data.id,
            show: true,
            api: 'bbReportFormsDataController'
          })
        },
        checkBbList: () => {
          this.bbList.forEach(l => {
            if (l.id === data.id) {
              data.borderStyle = true
            } else l.borderStyle = false
          })
        },
        addBbList: () => {
          this.reportList.show = true
          this.reportList.usn = ''
        },
        share: () => {},
        edit: () => {
          this.reportList.show = true
          this.reportList.usn = data.id
        },
        del: () => {
          this.del([data.id])
        },
        dblClick: () => {
          const { id, name } = data
          const p = { id, name }
          this.$router.push({ path: `/reportCenter/${encodeURIComponent(JSON.stringify(p))}` })
        }
      }
      DEAL[type]()
    },
    // reportDesign
    getBbList({ flId = '', type = 'fl' }) {
      this.loading = true
      this.$api.reportDesign.getBbList({
        flId,
        type
      }).then(s => {
        this.bbList = s.data[0] === null
          ? []
          : s.data.map(l => ({
            ...l,
            borderStyle: false
          }))
        this.loading = false
      }).catch(e => {
        this.loading = false
        this.$message.error(e.message)
      })
    },
    getTree() { // 获取左侧树
      this.tree.loading = true
      this.$api.reportDesign.getTree().then(s => {
        this.tree.data = [...s.data]
        this.tree.loading = false
      }).catch(e => {
        this.tree.loading = false
        this.$message.error(e.message)
      })
    },
    addUnit() { // 报表设计添加
      this.classify.show = true
      this.classify.usn = ''
      this.classify.info = {}
    },
    rightmenus(node) { // 左树功能
      const fl = [
        {
          label: '添加报表分类', icon: 'el-icon-circle-plus-outline', type: 'add', api: '/bbReportCategoryController/add'
        },
        {
          label: '修改报表分类', icon: 'el-icon-edit-outline', type: 'edit', api: '/bbReportCategoryController/update'
        },
        {
          label: '删除报表分类', icon: 'el-icon-delete', type: 'del', api: '/bbReportCategoryController/delete'
        }
      ]
      return node.icon === 'fl' ? fl.filter(l => this.apis.includes(l.api)) : []
    },
    rightmenusHandler(obj) { // 左树功能事件
      const { type, data } = obj
      const DEAL = {
        add: () => {
          this.classify.show = true
          this.classify.usn = ''
          this.classify.info = { ...data }
        },
        edit: () => {
          this.classify.show = true
          this.classify.usn = data.id
          this.classify.info = {}
        },
        del: () => {
          this.$confirm('当前操作将会删除选中数据，是否继续？', '删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$api.reportDesign.delTree({
              id: data.id
            }).then(res => {
              this.$message.success('删除成功')
              this.getTree()
            }).catch(e => this.$message.error(e.message))
          }).catch(e => e)
        }
      }
      DEAL[type]()
    },
    setTargetNode(node) { // 左树树节点
      this.targetNode = node
    },
    btnsHandler(met) {
      const DEAL = {
        add: () => {
          this.reportList.show = true
          this.reportList.usn = ''
        },
        edit: () => {
          const arr = this.bbList.filter(l => l.borderStyle)
          if (arr.length) {
            this.reportList.show = true
            this.reportList.usn = arr[0].id
          } else this.$message.warning('请选择要修改的数据')
        },
        del: () => {
          const arr = this.bbList.filter(l => l.borderStyle)
          if (arr.length) {
            const ID = arr.map(l => l.id)
            this.del(ID)
          } else this.$message.warning('请选择要删除的数据')
        }
      }
      DEAL[met]()
    },
    refresh() {
      this.getBbList({ flId: this.targetNode.id, type: this.targetNode.icon })
    },
    searchData(query) {
      this.content = query
    },
    del(id) {
      this.$confirm('当前操作将会删除选中数据，是否继续？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.reportDesign.delBbList({
          id: id.join(',')
        }).then(res => {
          this.$message.success('删除成功')
          this.getTree()
          this.getBbList({ flId: this.targetNode.id, type: this.targetNode.icon })
        }).catch(e => this.$message.error(e.message))
      }).catch(e => e)
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
.content {
  height: calc(100% - 105px);
  .file {
    height: 100%;
    padding: 10px;
    display: flex;
    align-content: flex-start;
    flex-wrap: wrap;
    overflow-y: auto;
    .addCard {
      margin-right: 15px;
      .el-card {
        width: 100px;
        height: 131px;
        margin-top: 10px;
      }
      p {
        text-align: center;
        .el-icon-plus {
          color: #4390de;
          font-size: 80px;
          line-height: 120px;
        }
      }
    }
    .card {
      margin-right: 15px;
      .el-card {
        width: 100px;
        height: 131px;
        margin-top: 10px;
      }
      .header {
        text-align: right;
        span {
          margin-right: 5px;
        }
        .el-icon-upload {
          color: #66EFEF;
        }
        .el-icon-download {
          color: #FDE2B2;
        }
        .el-icon-edit {
          color: #67C23A;
        }
        .el-icon-menu {
          color: #409EFF;
        }
      }
      .image {
        text-align: center;
        img {
          width: 80px;
          height: 70px;
        }
      }
      .footer {
        text-align: center;
        .font {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          padding: 0 4px;
        }
      }
    }
  }
}
</style>
