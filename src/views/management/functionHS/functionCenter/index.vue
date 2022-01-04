<template>
  <div>
    <LeftWorkbench ref="leftWorkbench" :width="width" title="函数中心" class="left" :additional="0">
      <el-button
        v-if="apis.includes('/bbFunctionFolderController/add')"
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
      <ToolsBar
        slot="toolsBar"
        module-name="FunctionCenter"
        :items="btns"
        class="toolsBar"
        @btnsHandler="btnsHandler"
      >
        <div slot="select">
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
        </div>
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
      <div slot="grid" :class="schema === 'F' ? 'cardBox' : ''">
        <div v-if="schema==='F'" class="cardSchema">
          <div class="addRow">
            <el-card
              shadow="hover"
            >
              <div class="plusSing">
                <p @click="listHandler('icon')">
                  <i class="el-icon-plus" />
                </p>
              </div>
            </el-card>
          </div>
          <div
            v-for="item in cardsData"
            :key="item.id"
            v-waiting="cards.loading"
            class="boxBard"
          >
            <el-card
              :key="item.id"
              shadow="hover"
              :class="{ borderStyle: item.borderStyle }"
              @dblclick.native="listHandler('dblClICK', item)"
            >
              <div>
                <div class="boxBard_header">
                  <p>
                    <el-checkbox v-model="item.checked" />
                  </p>
                  <p>
                    <el-tooltip
                      v-if="apis.includes('/bbFunctionDefineController/export')"
                      class="item"
                      effect="dark"
                      content="导出"
                      placement="top"
                    >
                      <span class="el-icon-download" @click="listHandler('share', item)" />
                    </el-tooltip>
                    <el-tooltip
                      v-if="apis.includes('/bbFunctionDefineController/update')"
                      class="item"
                      effect="dark"
                      content="修改"
                      placement="top"
                    >
                      <span class="el-icon-edit" @click="listHandler('edit', item)" />
                    </el-tooltip>
                    <el-tooltip
                      v-if="apis.includes('/bbFunctionDefineController/delete')"
                      class="item"
                      effect="dark"
                      content="删除"
                      placement="top"
                    >
                      <span class="el-icon-delete" @click="listHandler('del', item)" />
                    </el-tooltip>
                  </p>
                </div>
                <div class="boxBard_image" @click="checkCards('body', item)">
                  <p>
                    <img :src="require('@/assets/images/middleImg/hswj.png')" alt="">
                  </p>
                  <p>
                    <span :title="item.name">函数名称： {{ item.name }}</span><br>
                    <span
                      style="width: 150px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"
                      :title="item.flSnAndName"
                    >
                      所属分类： {{ item.flSnAndName }}
                    </span>
                  </p>
                </div>
                <p class="boxBard_footer" @click="checkCards('body', item)">
                  <span class="font" :title="item.chineseName">中文名称： {{ item.chineseName }}</span>
                </p>
              </div>
            </el-card>
          </div>
        </div>
        <div v-if="schema==='T'" class="tableSchema">
          <Table
            ref="table"
            v-waiting="cards.loading"
            number
            :data="cardsData"
            :columns="columns"
            :tools="tableTools"
            :multiple="true"
            :search="false"
            @toolshandler="tableToolsHandler"
            @refresh="refresh"
            @select="select"
            @search="searchData"
            @dblclick="dblclick"
          />
        </div>
      </div>
    </RightWorkbench>
    <FunctionTree
      v-if="functionTree.show"
      :show.sync="functionTree.show"
      :usn="functionTree.usn"
      :tree-node="tree.treeNode"
      :fd-data="tree.data"
      @refshTree="getfunctionTree"
    />
    <FunctionList
      v-if="functionList.show"
      :show.sync="functionList.show"
      :usn="functionList.usn"
      :target-node="targetNode"
      :fd-data="tree.data"
      @refshList="refshList"
    />
    <Upload
      v-if="upload.show"
      :show.sync="upload.show"
      :action="upload.action"
      :format="['xls', 'xlsx', 'xml']"
      :params="upload.params"
      @success="uploadSuccess"
    />
  </div>
</template>

<script>
/* eslint-disable object-curly-newline */
export default {
  name: 'FunctionCenter',
  components: {
    FunctionTree: () => import('./dialog/functionTree'),
    FunctionList: () => import('./dialog/functionList')
  },
  data() {
    return {
      content: '',
      schema: 'F',
      width: 300,
      middleDragTop: this.width,
      tree: {
        loading: false,
        data: [],
        treeNode: {}
      },
      cards: { // 卡片
        data: [],
        loading: false,
        selectChecked: []
      },
      functionTree: {
        show: false,
        usn: ''
      },
      functionList: {
        show: false,
        usn: ''
      },
      targetNode: {},
      upload: {
        show: false,
        action: '',
        params: {}
      }
    }
  },
  computed: {
    apis() {
      return this.$tools.getModuleAPIS('FunctionCenter')
    },
    cardsData() {
      if (this.content) {
        return this.cards.data.filter(
          // eslint-disable-next-line consistent-return
          item => {
            if (item.name !== null && item.name.indexOf(this.content) !== -1) {
              return item
            }
            if (item.chineseName !== null && item.chineseName.indexOf(this.content) !== -1) {
              return item
            }
            if (item.flSnAndName !== null && item.flSnAndName.indexOf(this.content) !== -1) {
              return item
            }
          }
        )
      } return this.cards.data
    },
    columns() {
      return [
        { label: '函数名称', prop: 'name' },
        { label: '中文名称', prop: 'chineseName' },
        { label: '所属分类', prop: 'flSnAndName' },
        { label: '操作', prop: undefined }
      ]
    },
    tableTools() {
      return [
        {
          icon: 'el-icon-edit-outline',
          type: 'edit',
          title: '修改'
        },
        {
          icon: 'el-icon-delete-solid',
          type: 'del',
          title: '删除'
        }
      ]
    },
    btns() {
      return [
        { method: 'add', name: '新增', api: '/bbFunctionDefineController/add' },
        { method: 'edit', name: '修改', api: '/bbFunctionDefineController/update' },
        { method: 'del', name: '删除', api: '/bbFunctionDefineController/delete' },
        {
          method: 'more',
          name: '更多',
          children: [
            { method: 'educe', name: '导出', api: '/bbFunctionDefineController/export' },
            { method: 'import', name: '导入', api: '/bbFunctionDefineController/importFile' }
          ]
        }
      ]
    }
  },
  watch: {
    targetNode(val) {
      if (Object.keys(val).length) {
        this.getFunctionList({ id: val.id, type: val.icon })
      }
    }
  },
  created() {
    this.getfunctionTree()
    this.getFunctionList({})
  },
  methods: {
    uploadSuccess() {
      this.getfunctionTree()
    },
    dblclick(obj) {
      const { row } = obj
      const { id, name } = row
      const p = { id, name }
      this.$router.push({ path: `/functionDesign/${encodeURIComponent(JSON.stringify(p))}` })
    },
    refshList() {
      this.getfunctionTree()
      this.getFunctionList({})
    },
    select(select) {
      this.cards.selectChecked = [...select]
    },
    tableToolsHandler(obj) {
      const { type, scope } = obj
      const DEAL = {
        edit: () => {
          this.functionList.show = true
          this.functionList.usn = scope.row.id
        },
        del: () => {
          this.del([scope.row.id])
        }
      }
      DEAL[type]()
    },
    checkCards(type, item) { // 点击卡片
      const DEAL = {
        body: () => {
          const { data } = this.cards
          data.forEach(s => {
            if (s.id === item.id) {
              item.borderStyle = true
            } else s.borderStyle = false
          })
        }
      }
      DEAL[type]()
    },
    getFunctionList({ id = '', type = 'fl' }) {
      this.cards.loading = true
      this.$api.functionCenter.getFunctionList({ flId: id, type }).then(s => {
        this.cards.data = s.data.map(l => ({
          ...l,
          borderStyle: false,
          checked: false
        }))
        this.cards.loading = false
      }).catch(e => {
        this.$message.error(e.message)
        this.cards.loading = false
      })
    },
    refresh() { // 刷新
      this.getFunctionList({ id: this.targetNode.id, type: this.targetNode.icon })
    },
    searchData(query) { // 搜索
      this.content = query
    },
    getfunctionTree() { // 获取函数分类树
      this.tree.loading = true
      this.$api.functionCenter.getfunctionTree().then(s => {
        this.tree.data = [...s.data]
        this.tree.loading = false
      }).catch(e => {
        this.$message.error(e.message)
        this.tree.loading = false
      })
    },
    addUnit() { // 添加函数中心
      this.functionTree.show = true
      this.functionTree.usn = ''
      this.tree.treeNode = {}
    },
    rightmenus(node) { // 树节点功能
      const { id, children } = node
      const { apis } = this
      const rm = [
        { label: '添加函数分类', icon: 'el-icon-circle-plus-outline', type: 'add', api: '/bbFunctionFolderController/add' },
        { label: '修改函数分类', icon: 'el-icon-edit-outline', type: 'edit', api: '/bbFunctionFolderController/add' },
        { label: '删除函数分类', icon: 'el-icon-delete', type: 'del', api: '/bbFunctionFolderController/delete' }
      ]
      const hs = [
        { label: '修改函数', icon: 'el-icon-edit-outline', type: 'ediths', api: '/bbFunctionDefineController/update' },
        { label: '删除函数', icon: 'el-icon-delete', type: 'delhs', api: '/bbFunctionDefineController/delete' }
      ]
      const ls = node.icon === 'fl' ? rm : hs
      return ls.filter(l => apis.includes(l.api))
    },
    rightmenusHandler(obj) { // 树节点功能事件
      const { data, type } = obj
      const Deal = {
        add: () => {
          this.functionTree.show = true
          this.functionTree.usn = ''
          this.tree.treeNode.label = data.label
          this.tree.treeNode.id = data.id
        },
        edit: () => {
          this.functionTree.show = true
          this.functionTree.usn = data.id
        },
        del: () => {
          this.$confirm('当前操作将会删除选中数据，是否继续？', '删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$api.functionCenter.delfunctionTree({
              id: data.id
            }).then(res => {
              this.$message.success('删除成功')
              this.getfunctionTree()
            }).catch(e => this.$message.error(e.message))
          }).catch(e => e)
        },
        ediths: () => {
          this.functionList.show = true
          this.functionList.usn = data.id
        },
        delhs: () => {
          this.del([data.id])
        }
      }
      Deal[type]()
    },
    setTargetNode(node) { // 树节点点击
      this.targetNode = { ...node }
    },
    btnsHandler(met) { // toolsBar事件
      const DEAL = {
        add: () => {
          this.functionList.show = true
          this.functionList.usn = ''
        },
        edit: () => {
          const check = this.cards.data.filter(l => l.checked)
          if (
            (this.schema === 'F' && check.length !== 1)
            || (this.schema === 'T' && this.cards.selectChecked.length !== 1)
          ) {
            this.$message.warning('只能进行单条数据的修改')
          } else if (this.schema === 'F') {
            this.functionList.show = true
            this.functionList.usn = check[0].id
          } else if (this.schema === 'T') {
            this.functionList.show = true
            this.functionList.usn = this.cards.selectChecked[0].id
          }
        },
        del: () => {
          const check = this.cards.data.filter(l => l.checked)
          if (
            (this.schema === 'F' && check.length < 1)
            || (this.schema === 'T' && this.cards.selectChecked.length < 1)
          ) {
            this.$message.warning('请选择要删除的数据')
          } else if (this.schema === 'F') {
            const IDS = check.map(s => s.id)
            this.del(IDS)
          } else if (this.schema === 'T') {
            const IDS = this.cards.selectChecked.map(s => s.id)
            this.del(IDS)
          }
        },
        import: () => {
          const { baseURL } = this.$http.defaults
          this.upload.action = `${baseURL}/bbFunctionDefineController/importFile`
          this.upload.show = true
        },
        educe: () => {
          const check = this.cards.data.filter(l => l.checked)
          if (
            (this.schema === 'F' && check.length < 1)
            || (this.schema === 'T' && this.cards.selectChecked.length < 1)
          ) {
            this.$message.warning('请先选择要导出的数据')
          } else if (this.schema === 'F') {
            this.$exportFn({
              url: '/bbFunctionDefineController/export',
              name: '函数中心'
            })
          }
        }
      }
      DEAL[met]()
    },
    listHandler(type, item) { // 卡片header操作
      const Deal = {
        share: () => {
          if (this.schema === 'F') {
            this.$exportFn({
              url: '/bbFunctionDefineController/export',
              name: '函数中心'
            })
          }
        },
        edit: () => {
          this.functionList.show = true
          this.functionList.usn = item.id
        },
        del: () => {
          this.del([item.id])
        },
        icon: () => {
          this.functionList.show = true
          this.functionList.usn = ''
        },
        dblClICK: () => {
          // this.$router.push({
          //   name: 'FunctionDesign',
          //   params: { ...item }
          // })
          const { id, name } = item
          const p = { id, name }
          this.$router.push({ path: `/functionDesign/${encodeURIComponent(JSON.stringify(p))}` })
        }
      }
      Deal[type]()
    },
    del(id) {
      this.$confirm('当前操作将会删除选中数据，是否继续？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.functionCenter.delFunctionList({
          id: id.join(',')
        }).then(res => {
          this.$message.success('删除成功')
          this.getfunctionTree()
          this.getFunctionList({})
          if (this.schema === 'T') this.$refs.table.clearSelection()
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
.right {
  .toolsBar {
    margin-bottom: 10px;
  }
  .cardBox{
    height:calc(100% - 86px);
    overflow-y: auto;
  }
  .cardSchema {
    display: flex;
    align-content: flex-start;
    flex-wrap: wrap;
    overflow-y: auto;
    padding: 5px;
    .addRow {
      margin-right: 10px;
      .el-card {
        width: 220px;
        height: 160px;
      }
      margin-top: 5px;
      .plusSing {
      text-align: center;
      }
      .el-icon-plus {
        font-size: 80px;
        line-height: 130px;
        color: #4390de;
      }
    }
    .boxBard {
      padding: 5px;
      .el-card {
        width: 220px;
        height: 160px;
        /deep/ .el-card__body {
          padding: 5px 10px;
        }
      }
      &_header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        span {
          padding: 5px;
        }
        .el-icon-download {
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
        margin-bottom: 10px;
        display: flex;
        p:nth-child(1) {
          margin-right: 10px;
          img {
            width: 60px;
            height: 70px;
          }
        }
        p:nth-child(2) {
          span {
            display: inline-block;
            margin-top: 10px;
          }
        }
      }
      &_footer {
        text-align: left;
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
