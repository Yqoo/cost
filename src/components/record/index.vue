<template>
  <div class="record">
    <LeftWorkbench ref="leftWorkbench" :width="width">
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
        :default-expanded-keys="tree.focusId"
        :rightmenus="rightmenus"
        @update:rightmenus="rightmenusHandler"
        @setTargetNode="setTargetNode"
      />
    </Leftworkbench>
    <MiddleDrag :margin-top="middleDragTop" @hook:mounted="getTop" @move="move" />
    <RightWorkbench :margin-left="width">
      <ToolsBar
        slot="toolsBar"
        class="btnColor"
        :module-name="meta.outer === 'treatment' ? 'Dossier' : 'SysDossier'"
        :items="btns"
        :show-zt="meta.outer === 'treatment' ? true : false"
        style="border-bottom: 1px solid #ddd"
        @btnsHandler="btnsHandler"
        @ztChange="ztChange"
      />
      <el-table
        slot="table"
        ref="table"
        v-waiting="table.loading"
        :data="table.data"
        style="width: 100%"
        :height="height"
        :row-key="getRowKey"
        @selection-change="select"
      >
        <el-table-column type="selection" reserve-selection />
        <el-table-column label="名称" prop="name" />
        <el-table-column label="编码" prop="sn" />
        <el-table-column label="分类" prop="catName" />
        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :disabled="!apis.includes('/dossier/updateStatus') || !canShowTools(scope.row)"
              inactive-text="是"
              active-text="否"
              active-color="#4390ee"
              @change="changeStatus(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="canShowTools(scope.row) && apis.includes('/dossier/update')"
              type="text"
              size="mini"
              icon="el-icon-edit-outline"
              title="编辑"
              @click="toolshandler('update', scope)"
            />
            <el-button
              v-if="canShowTools(scope.row) && apis.includes('/dossier/delete')"
              type="text"
              size="mini"
              icon="el-icon-delete"
              title="删除"
              @click="toolshandler('del', scope)"
            />
            <el-button
              v-if="apis.includes('/dossier/dataPage')"
              type="text"
              size="mini"
              icon="el-icon-pie-chart"
              title="管理数据"
              @click="toolshandler('glsj', scope)"
            />
            <el-button
              v-if="apis.includes('/dossier/createMenu')"
              type="text"
              size="mini"
              icon="el-icon-menu"
              title="生成菜单"
              @click="toolshandler('menu', scope)"
            />
          </template>
        </el-table-column>
      </el-table>
    </RightWorkbench>
    <Form
      v-if="show"
      :show.sync="show"
      :meta="meta"
      :status="formStatus"
      :ztsn="ztsn"
      :type-dialog-parent="typeDialogParent"
      @refresh="refresh"
    />
    <typeDialog
      v-if="showTypeDialog"
      :show.sync="showTypeDialog"
      :meta="meta"
      :status="typeDialogStatus"
      :parent="typeDialogParent"
      :ztsn="ztsn"
      @refresTree="refresTree"
    />
    <Menu :id="menu.id" :show.sync="menu.show" api="dossier" />
  </div>
</template>

<script>
/* eslint-disable object-curly-newline */
import Sortable from 'sortablejs'

export default {
  name: 'Record',
  components: {
    Form: () => import('./dialog/form'),
    typeDialog: () => import('./dialog/type'),
    Menu: () => import('./dialog/menu')
  },
  props: {
    from: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      meta: {
        outer: '',
        inner: ''
      },
      width: 300,
      middleDragTop: this.width,
      tree: {
        loading: false,
        data: [],
        focusId: [],
        targetNode: null
      },
      table: {
        loading: false,
        data: [],
        selection: []
      },
      show: false,
      formStatus: 'add',
      showTypeDialog: false,
      typeDialogStatus: 'add',
      typeDialogParent: null,
      ztsn: '', // 账套编码
      height: 500,
      menu: {
        show: false,
        id: ''
      }
    }
  },
  computed: {
    apis() {
      const { meta } = this
      return this.$tools.getModuleAPIS(meta.outer === 'treatment' ? 'Dossier' : 'SysDossier')
    },
    btns() {
      return [
        {
          method: 'add', name: '新增', icon: 'el-icon-circle-plus-outline', api: '/dossier/add'
        },
        {
          method: 'update', name: '编辑', icon: 'el-icon-edit-outline', api: '/dossier/update'
        },
        {
          method: 'del', name: '删除', icon: 'el-icon-delete', api: '/dossier/delete'
        },
        {
          method: 'sort', name: '保存排序', icon: 'el-icon-delete', api: '/dossier/sort'
        }
      ]
    }
  },
  watch: {
    from: {
      immediate: true,
      handler: 'formatterFrom'
    },
    show(bool) {
      if (!bool) this.formStatus = 'add'
    },
    showTypeDialog(bool) {
      if (!bool) {
        this.typeDialogStatus = 'add'
        this.typeDialogParent = null
      }
    },
    pageAndSize(obj) {
      const type = this.tree.targetNode && this.tree.targetNode.type
      const id = this.tree.targetNode && this.tree.targetNode.id
      this.getPage({
        page: obj.page,
        size: obj.size,
        type: type || 'root',
        id: id || ''
      })
    },
    // eslint-disable-next-line func-names
    'tree.targetNode': function (val) {
      if (val) {
        this.typeDialogParent = {
          label: val.label,
          sn: val.id,
          type: val.type
        }
      }
    }
  },
  created() {
    if (this.meta.outer === 'system') {
      this.getTree()
      this.getPage({})
    }
  },
  mounted() {
    this.calcTableHeight()
    window.addEventListener('resize', this.calcTableHeight, false)
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('resize', this.calcTableHeight)
    })
    this.rowDrop()
  },
  methods: {
    rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      const that = this
      this.sortObj = Sortable.create(tbody, {
        onEnd(evt) {
          const { data } = that.table
          const { oldIndex, newIndex } = evt
          const temp = data.splice(oldIndex, 1)
          data.splice(newIndex, 0, ...temp)
        }
      })
    },
    canShowTools(row) {
      let flag = false
      if (this.meta.outer === 'treatment') {
        if (row.ztsn) flag = true
      } else flag = true
      return flag
    },
    ztChange(obj) {
      this.ztsn = obj.acsetId
      this.getTree()
      this.getPage({})
    },
    rightmenusHandler(obj) {
      const { data, type } = obj
      const METHODS = {
        add: () => {
          if (data.type === 'category') {
            this.typeDialogParent = {
              label: data.label,
              sn: data.id
            }
          }
          this.showTypeDialog = true
        },
        update: () => {
          this.typeDialogStatus = data.id
          this.showTypeDialog = true
        },
        del: () => {
          this.$confirm('当前操作将会删除该数据，是否继续？', '删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$api.record.deleteType(this.meta.inner, {
              id: data.id
            }).then(s => {
              this.$message.success('删除成功！')
              this.$refs.tree.remove(data)
            }).catch(e => this.$message.error(e.message))
          }).catch(e => e)
        }
      }
      METHODS[type]()
    },
    rightmenus(node) {
      const rm = {
        root: [{ label: '添加分类', icon: 'el-icon-circle-plus-outline', type: 'add', api: '/dossierCategory/add' }],
        sysRoot: [{ label: '添加分类', icon: 'el-icon-circle-plus-outline', type: 'add', api: '/dossierCategory/add' }],
        ztRoot: [{ label: '添加分类', icon: 'el-icon-circle-plus-outline', type: 'add', api: '/dossierCategory/add' }],
        category: [
          { label: '添加分类', icon: 'el-icon-circle-plus-outline', type: 'add', api: '/dossierCategory/add' },
          { label: '编辑分类', icon: 'el-icon-edit', type: 'update', api: '/dossierCategory/update' },
          { label: '删除分类', icon: 'el-icon-delete', type: 'del', api: '/dossierCategory/delete' }
        ]
      }
      const flag = node.sys && this.meta.outer === 'treatment'
      const lst = flag ? [] : rm[node.type]
      return lst ? lst.filter(l => this.apis.includes(l.api)) : []
    },
    toolshandler(type, scope) {
      const METHODS = {
        glsj: () => {
          const param = {
            name: scope.row.name,
            id: scope.row.id,
            sn: scope.row.sn,
            from: this.meta.inner,
            ztsn: this.meta.outer === 'treatment' ? this.ztsn : ''
          }
          this.$router.push({ path: `/admindata/${encodeURIComponent(JSON.stringify(param))}` })
        },
        update: () => {
          this.formStatus = scope.row.id
          this.show = true
        },
        del: () => {
          this.deleteRows([scope.row.id])
        },
        menu: () => {
          this.menu.id = scope.row.id
          this.menu.show = true
        }
      }
      METHODS[type]()
    },
    btnsHandler(type) {
      const METHODS = {
        add: () => {
          if (this.meta.outer === 'treatment') {
            this.ztsn ? this.show = true : this.$message.warning('请先选择单位和账套！')
          } else this.show = true
        },
        update: () => {
          const { selection } = this.table
          if (selection.length !== 1) this.$message.warning('请先选择一行数据进行修改！')
          else {
            const flag = this.canShowTools(selection[0])
            if (flag) {
              this.formStatus = selection[0].id
              this.show = true
            } else {
              this.$message.warning('账套档案下不允许编辑系统档案！')
            }
          }
        },
        del: () => {
          const { selection } = this.table
          const ids = this.table.selection.map(s => s.id)
          if (ids.length === 0) this.$message.warning('请先选择要删除的数据！')
          else {
            const flag = this.canShowTools(selection[0])
            flag ? this.deleteRows(ids) : this.$message.warning('账套档案下不允许删除系统档案！')
          }
        },
        sort: () => {
          this.table.loading = true
          const sort = this.table.data.map((item, index) => ({
            id: item.id,
            sort: index
          }))
          this.$api.record.sort({
            sorts: JSON.stringify(sort)
          }).then(s => {
            this.$message.success('数据排序成功！')
            this.table.loading = false
          }).catch(e => {
            this.table.loading = false
            this.$message.error(e.message)
          })
        }
      }
      METHODS[type]()
    },
    setTargetNode(node) {
      this.tree.targetNode = node
      this.getPage({ type: node.type, id: node.id })
    },
    deleteRows(ids = []) {
      this.$confirm('当前操作将会删除所选数据，是否继续？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.record.deleteDangAn(this.meta.inner, {
          id: ids.join(',')
        }).then(s => {
          const type = this.tree.targetNode ? this.tree.targetNode.type : 'root'
          const id = this.tree.targetNode ? this.tree.targetNode.id : ''
          this.getPage({
            type,
            id
          })
          this.$refs.table.clearSelection()
          this.$message.success('删除成功！')
        }).catch(e => this.$message.error(e.message))
      }).catch(e => e)
    },
    // eslint-disable-next-line object-curly-newline
    getPage({ page, size, type = 'root', id = '', ztsn = '' }) {
      this.table.loading = true
      const params = {
        type,
        id,
        ztsn: this.meta.outer === 'treatment' ? this.ztsn : ''
      }
      this.$api.record.getPage(this.meta.inner, params).then(s => {
        this.table.data = [...s.data]
        this.table.loading = false
      }).catch(e => {
        this.table.loading = false
        this.$message.error(e.message)
      })
    },
    refresTree(id) {
      this.getTree([id])
    },
    getTree(expand = []) {
      this.tree.loading = true
      const params = this.meta.outer === 'treatment' ? { ztsn: this.ztsn } : {}
      this.$api.record.getTree(this.meta.inner, params).then(s => {
        this.tree.data = [...s.data]
        this.tree.focusId = expand
        this.tree.loading = false
      }).catch(e => {
        this.tree.loading = false
        this.$message.error(e.message)
      })
    },
    formatterFrom(str) {
      const arr = str.split('-')
      Object.assign(this.meta, {
        outer: arr[0],
        inner: arr[1]
      })
    },
    changeStatus(row) {
      this.$api.record.changeStatus(this.meta.inner, {
        sn: row.sn,
        status: row.status,
        ztsn: this.meta.outer === 'treatment' ? this.ztsn : ''
      }).then(s => {
        this.$message.success('修改状态成功！')
      }).catch(e => this.$message.error(e.message))
    },
    select(rows) {
      this.table.selection = [...rows]
    },
    getRowKey(row) {
      return row.id
    },
    refresh(id) {
      this.getPage({})
      this.getTree([id])
    },
    calcTableHeight() {
      // table高度自适应
      const el = document.querySelector('.el-table')
      try {
        const boxH = document.querySelector('.routerBox').offsetHeight
        if (el) {
          this.$nextTick(() => {
            this.height = boxH - el.offsetTop - 50
          })
        }
      } catch (error) {
        // ...
      }
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

<style lang='scss' scoped>
.record {
  height: 100%;
}
</style>
