<template>
  <div class="vocational">
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
        :module-name="from === 'treatment' ? 'Business' : 'SysBusiness'"
        :items="btns"
        :show-zt="from === 'treatment' ? true : false"
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
              inactive-text="是"
              active-text="否"
              active-color="#4390ee"
              :disabled="!apis.includes('/defineBusiness/updateStatus')"
              @change="changeStatus(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="apis.includes('/defineBusiness/createMenu')"
              type="text"
              size="mini"
              icon="el-icon-menu"
              title="生成菜单"
              @click="toolshandler('menu', scope)"
            />
            <el-button
              v-if="apis.includes('/defineBusiness/update')"
              type="text"
              size="mini"
              icon="el-icon-edit-outline"
              title="编辑"
              @click="toolshandler('update', scope)"
            />
            <el-button
              v-if="apis.includes('/defineBusiness/delete')"
              type="text"
              size="mini"
              icon="el-icon-delete"
              title="删除"
              @click="toolshandler('del', scope)"
            />
            <el-button
              v-if="apis.includes('/businessTab/pages')"
              type="text"
              size="mini"
              icon="el-icon-document"
              title="管理表"
              @click="toolshandler('glb', scope)"
            />
            <el-button
              v-if="apis.includes('/businessTab/listData')"
              type="text"
              size="mini"
              icon="el-icon-pie-chart"
              title="管理数据"
              @click="toolshandler('glsj', scope)"
            />
            <el-button
              v-if="apis.includes('/businessTab/exportData')"
              type="text"
              size="small"
              icon="el-icon-download"
              title="导出Excel"
              @click="toolshandler('download', scope)"
            />
            <el-upload
              ref="upload"
              style="display: inline-block; padding: 0px 5px"
              name="file"
              :action="upload.url"
              :data="upload.data"
              :limit="1"
              :format="['xlsx','xls']"
              :show-file-list="false"
              :headers="{
                Authorization: upload.auth
              }"
              :before-upload="beforeUpload"
              :on-success="uploadSuccess"
              :on-error="uploadError"
            >
              <el-button
                v-if="apis.includes('/businessTab/importData')"
                type="text"
                size="small"
                icon="el-icon-upload"
                title="导入Excel"
                @click="toolshandler('imp', scope)"
              />
            </el-upload>
          </template>
        </el-table-column>
      </el-table>
    </RightWorkbench>
    <typeDialog
      v-if="type.show"
      :show.sync="type.show"
      :from="from"
      :ztsn="ztsn"
      :status="type.status"
      :parent="type.parent"
      :obj-info="objInfo"
      @refresTree="refresTree"
    />
    <Business
      v-if="bus.show"
      :show.sync="bus.show"
      :from="from"
      :status="bus.status"
      :ztsn="ztsn"
      :obj-info="objInfo"
      @refresh="busRefresh"
    />
    <Menu :id="menu.id" :show.sync="menu.show" api="defineBusiness" />
  </div>
</template>

<script>
/* eslint-disable object-curly-newline */
import Sortable from 'sortablejs'

export default {
  name: 'Vocational',
  components: {
    typeDialog: () => import('./dialog/type'),
    Business: () => import('./dialog/business'),
    Menu: () => import('@/components/record/dialog/menu')
  },
  props: {
    from: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      width: 300,
      middleDragTop: this.width,
      height: 500,
      tree: {
        loading: false,
        data: [],
        focusId: [],
        targetNode: {}
      },
      table: {
        loading: false,
        data: [],
        selection: []
      },
      type: {
        show: false,
        status: 'add',
        parent: {}
      },
      bus: {
        show: false,
        status: 'add'
      },
      ztsn: '', // 账套编码
      upload: { // 上传时所需参数
        url: '',
        auth: '',
        data: {
          bid: ''
        }
      },
      objInfo: {},
      menu: {
        show: false,
        id: ''
      }
    }
  },
  computed: {
    apis() {
      const { from } = this
      return this.$tools.getModuleAPIS(from === 'treatment' ? 'Business' : 'SysBusiness')
    },
    btns() {
      return [
        {
          method: 'add', name: '新增', icon: 'el-icon-circle-plus-outline', api: '/defineBusiness/add'
        },
        { method: 'update', name: '编辑', icon: 'el-icon-edit-outline', api: '/defineBusiness/update' },
        { method: 'del', name: '删除', icon: 'el-icon-delete', api: '/defineBusiness/delete' },
        { method: 'sort', name: '保存排序', icon: 'el-icon-delete', api: '/defineBusiness/sort' }
      ]
    }
  },
  watch: {
    // eslint-disable-next-line object-shorthand
    'type.show'(bool) {
      if (!bool) this.type.status = 'add'
    },
    // eslint-disable-next-line object-shorthand
    'bus.show'(bool) {
      if (!bool) {
        this.bus.status = 'add'
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
        this.objInfo.label = val.label
        this.objInfo.id = val.id
        this.objInfo.type = val.type
      }
    }
  },
  created() {
    if (this.from === 'system') {
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
    ztChange(obj) {
      this.ztsn = obj.acsetId
      this.getPage({
        ztsn: obj.acsetId
      })
      this.getTree()
    },
    rightmenus(node) {
      const rm = {
        root: [{ label: '添加分类', icon: 'el-icon-circle-plus-outline', type: 'add', api: '/businessCategory/add' }],
        sysRoot: [{ label: '添加分类', icon: 'el-icon-circle-plus-outline', type: 'add', api: '/businessCategory/add' }],
        ztRoot: [{ label: '添加分类', icon: 'el-icon-circle-plus-outline', type: 'add', api: '/businessCategory/add' }],
        category: [
          { label: '添加分类', icon: 'el-icon-circle-plus-outline', type: 'add', api: '/businessCategory/add' },
          { label: '编辑分类', icon: 'el-icon-edit', type: 'update', api: '/businessCategory/update' },
          { label: '删除分类', icon: 'el-icon-delete', type: 'del', api: '/businessCategory/delete' }
        ],
        business: []
      }
      const flag = node.sys && this.from === 'treatment'
      const lst = flag ? [] : rm[node.type]
      return lst.filter(l => this.apis.includes(l.api))
    },
    rightmenusHandler(obj) {
      const { data, type } = obj
      const METHODS = {
        add: () => {
          this.type.show = true
          this.objInfo.label = data.label
          this.objInfo.id = data.id
          this.objInfo.type = data.type
        },
        update: () => {
          this.type.status = data.id
          this.type.show = true
        },
        del: () => {
          this.$confirm('当前操作将会删除该数据，是否继续？', '删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$api.business.delType({
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
    setTargetNode(node) {
      this.tree.targetNode = node
      this.getPage({
        type: node.type,
        id: node.id
      })
    },
    btnsHandler(type) {
      const METHODS = {
        add: () => {
          this.bus.show = true
        },
        update: () => {
          const { selection } = this.table
          if (selection.length === 1) {
            this.bus.status = selection[0].id
            this.bus.show = true
          } else this.$message.warning('请选择一行数据进行编辑！')
        },
        del: () => {
          const { selection } = this.table
          if (selection.length) this.delRows(selection)
          else this.$message.warning('请先选择要删除的数据！')
        },
        sort: () => {
          this.table.loading = true
          const sort = this.table.data.map((item, index) => ({
            id: item.id,
            sort: index
          }))
          this.$api.business.sort({
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
    toolshandler(type, scope) {
      const METHODS = {
        menu: () => {
          this.menu.id = scope.row.id
          this.menu.show = true
        },
        update: () => {
          this.bus.status = scope.row.id
          this.bus.show = true
        },
        del: () => {
          this.delRows([scope.row])
        },
        glsj: () => {
          const param = {
            id: scope.row.id,
            name: scope.row.name,
            sn: scope.row.sn,
            from: this.from,
            ztsn: this.ztsn
          }
          this.$router.push({ path: `/businessData/${encodeURIComponent(JSON.stringify(param))}` })
        },
        glb: () => {
          const param = {
            id: scope.row.id,
            name: scope.row.name,
            sn: scope.row.sn,
            from: this.from,
            ztsn: this.ztsn
          }
          this.$router.push({ path: `/managementTable/${encodeURIComponent(JSON.stringify(param))}` })
        },
        imp: () => {
          const { baseURL } = this.$http.defaults
          this.upload.url = `${baseURL}/businessTab/importData`
          this.upload.auth = this.$tools.getCookie()
          this.upload.data = {
            bid: scope.row.id,
            ztsn: this.from === 'treatment' ? this.ztsn : ''
          }
        },
        download: () => {
          this.$tools.downloadWithToken('/businessTab/exportData', {
            bid: scope.row.id,
            ztsn: this.from === 'treatment' ? this.ztsn : ''
          }, `${scope.row.name}.xls`)
        }
      }
      METHODS[type]()
    },
    beforeUpload(file) {
      const { name } = file
      const arr = name.split('.')
      const type = arr[arr.length - 1]
      if (['xls', 'xlsx'].includes(type)) {
        return true
      }
      this.$message.warning('请上传Excel文件！')
      return false
    },
    uploadSuccess(res, file) {
      const type = +res.code === 200 ? 'success' : 'warning'
      this.$message[type](res.message)
    },
    uploadError(err, file) {
      this.$message.error(err.message)
    },
    // eslint-disable-next-line object-curly-newline
    getPage({ page, size, type = 'root', id = '', ztsn = '' }) {
      this.table.loading = true
      const params = {
        type,
        id,
        ztsn: this.from === 'treatment' ? this.ztsn : ''
      }
      this.$api.business.getOutPage(params).then(s => {
        this.table.data = [...s.data]
        this.table.loading = false
      }).catch(e => {
        this.table.loading = false
        this.$message.error(e.message)
      })
    },
    getTree(expand = []) {
      this.tree.loading = true
      const params = this.from === 'treatment' ? { ztsn: this.ztsn } : {}
      this.$api.business.getOutLeftTree(params).then(s => {
        this.tree.data = [...s.data]
        this.tree.focusId = expand
        this.tree.loading = false
      }).catch(e => {
        this.tree.loading = false
        this.$message.error(e.message)
      })
    },
    changeStatus(row) {
      this.$api.business.changeBusStatus({
        id: row.id,
        status: row.status,
        ztsn: this.from === 'treatment' ? this.ztsn : ''
      }).then(s => {
        this.$message.success('修改状态成功！')
      }).catch(e => this.$message.error(e.message))
    },
    delRows(rows) {
      this.$confirm('当前操作将会删除所选数据，是否继续？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = rows.map(row => row.id)
        this.$api.business.delBusiness({ ids: ids.join(',') }).then(s => {
          this.getTree()
          const type = this.tree.targetNode ? this.tree.targetNode.type : 'root'
          const id = this.tree.targetNode ? this.tree.targetNode.id : ''
          this.getPage({
            type,
            id
          })
          this.$refs.table.clearSelection()
        }).catch(e => this.$message.error(e.message))
      }).catch(e => e)
    },
    busRefresh(id) {
      this.getTree([id])
      this.getPage({ id })
    },
    refresTree(id) {
      this.getTree([id])
    },
    select(rows) {
      this.table.selection = [...rows]
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
    getRowKey(row) {
      return row.id
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
  .vocational {
    height: 100%;
  }
</style>
