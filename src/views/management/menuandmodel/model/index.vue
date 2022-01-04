<template>
  <div class="menu-comp">
    <LeftWorkbench ref="leftWorkbench" :width="width">
      <Tree
        slot="tree"
        ref="tree"
        v-waiting="tree.loading"
        search
        :data="tree.data"
        :node-props="{
          children: 'children',
          label: 'name'
        }"
        :default-expanded-keys="tree.focusId"
        @setTargetNode="setChild"
      />
    </Leftworkbench>
    <MiddleDrag :margin-top="middleDragTop" @hook:mounted="getTop" @move="move" />
    <RightWorkbench :margin-left="width">
      <ToolsBar
        slot="toolsBar"
        class="btnColor"
        module-name="Model"
        :items="btns"
        style="border-bottom: 1px solid #ddd"
        @btnsHandler="btnsHandler"
      />
      <Table
        slot="table"
        ref="table"
        v-waiting="table.loading"
        :data="table.data"
        :columns="columns"
        :search="true"
        module-name="Model"
        :tools="tableTools"
        number
        multiple
        @search="search"
        @toolshandler="tableRowHandler"
        @select="selection => table.selection = selection"
        @refresh="refresh"
        @clo-checkbox-status="rowCheckboxChange"
      />
      <Pagination
        slot="page"
        class="pagination"
        :amount="table.total"
        :page-size="table.size"
        :current-page="table.page"
        @handleSizeChange="val => table.size = val"
        @handleCurrentChange="val => table.page = val"
      />
    </RightWorkbench>

    <!-- 新增 修改模块 -->
    <el-dialog
      v-dialogDrag
      :visible.sync="form.visible"
      :modal="false"
      width="30%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      @close="closeModelFrom"
    >
      <div slot="title">
        {{ form.status === 'add' ? '新增' : '编辑' }}模块
      </div>
      <el-form
        ref="modelf"
        v-waiting="form.loading"
        :model="form.data"
        :rules="form.rules"
        size="mini"
        label-width="90px"
      >
        <el-form-item label="模块名称" prop="name">
          <el-input v-model="form.data.name" />
        </el-form-item>
        <el-form-item label="编码" prop="sn">
          <el-input v-model="form.data.sn" />
        </el-form-item>
        <div class="box">
          <el-form-item label="分配API" prop="apis">
            <el-select
              v-model="form.data.apis"
              multiple
              style="width: 85%"
              no-data-text="点击右侧搜索按钮获取API列表"
            >
              <el-option
                v-for="item in api.data"
                :key="item.path"
                :label="item.name"
                :value="item.path"
              />
            </el-select>
            <el-button type="primary" size="mini" icon="el-icon-search" @click="api.show = true" />
          </el-form-item>
        </div>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="form.data.status" :label="true">
            启用
          </el-radio>
          <el-radio v-model="form.data.status" :label="false">
            停用
          </el-radio>
        </el-form-item>
        <el-form-item label="描述" prop="desc_">
          <el-input v-model="form.data.desc_" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" size="mini" @click="form.visible = false">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="save">
          确定
        </el-button>
      </div>
    </el-dialog>
    <Apis v-if="api.show" :show.sync="api.show" :checkeds="form.data.apis" @setCheckApis="setCheckApis" />
  </div>
</template>

<script>
import Apis from './apis'

export default {
  name: 'Model',
  components: {
    Apis
  },
  data() {
    return {
      width: 300,
      middleDragTop: this.width,
      id: '',
      tree: {
        loading: false,
        data: [],
        focusId: []
      },
      table: {
        loading: false,
        data: [],
        size: 200,
        page: 1,
        total: 0,
        selection: []
      },
      form: {
        visible: false,
        loading: false,
        status: 'add',
        data: {
          name: '',
          sn: '',
          apis: [],
          status: true,
          desc_: ''
        },
        rules: {
          name: [{ required: true, message: '请填写模块名称', trigger: 'blur' }],
          sn: [{ required: true, message: '请填写模块编码', trigger: 'blur' }]
        }
      },
      rowId: '',
      api: {
        show: false,
        data: [],
        from: 'inner' // 表单  outer 外部table按钮
      }
    }
  },
  computed: {
    pageAndsize() {
      const { page, size } = this.table
      return { page, size }
    },
    btns() {
      return [
        {
          method: 'add', name: '新增', icon: 'el-icon-circle-plus-outline', api: '/model/add'
        },
        {
          method: 'del', name: '删除', icon: 'el-icon-delete', api: '/model/delete'
        }
      ]
    },
    columns() {
      return [
        { label: '名称', prop: 'name' },
        { label: '编码', prop: 'sn' },
        {
          label: '状态', prop: 'status', checkbox: true
        },
        { label: '操作', prop: undefined }
      ]
    },
    tableTools() {
      return [
        {
          icon: 'el-icon-edit-outline', title: '编辑', type: 'edit', api: '/model/update'
        },
        {
          icon: 'el-icon-delete', title: '删除', type: 'del', api: '/model/delete'
        },
        {
          icon: 'el-icon-link', title: '分配API', type: 'api', api: '/model/setApis'
        }
      ]
    }
  },
  watch: {
    pageAndsize({ page, size }) {
      this.getPage({
        page,
        size,
        all: true,
        id: this.id
      })
    }
  },
  created() {
    this.getTree()
    this.getPage({ all: true })
  },
  methods: {
    setChild(node) { // 左侧列表 node 点击
      this.id = node.id
      this.getPage({ all: true, id: this.id })
    },
    delRow(ids = []) {
      if (ids.length === 0) {
        this.$message.warning('请先选择要删除的数据!')
      } else {
        this.$confirm('当前操作将删除所选数据，是否继续？', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.menu.deleteModel({
            id: ids.join(',')
          }).then(res => {
            this.$message.success('删除成功！')
            this.getPage({ all: true })
            this.getTree()
            this.$refs.table.clearSelection()
          }).catch(e => this.$message.error(e.message))
        }).catch(e => e)
      }
    },
    rowCheckboxChange(row) {
      this.$api.menu.changeStatus({
        id: row.id,
        status: row.status
      }).then(s => {
        this.$message.success('更改状态成功！')
      }).catch(e => this.$message.error(e.message))
    },
    save() {
      this.$refs.modelf.validate(valid => {
        if (valid) {
          this.form.loading = true
          const params = { ...this.form.data }
          params.apis = params.apis.join(',')
          let url = 'addModel'
          if (this.form.status === 'update') {
            url = 'updateModel'
            params.id = this.rowId
          }
          this.$api.menu[url](params).then(s => {
            this.$message.success('保存成功')
            this.getPage({ all: true })
            this.form.status === 'add' && this.getTree()
            this.form.loading = false
            this.form.visible = false
          }).catch(e => {
            this.form.loading = false
            this.$message.error(e.message)
          })
        }
      })
    },
    closeModelFrom() {
      Object.assign(this.form.data, {
        name: '',
        sn: '',
        apis: [],
        status: false,
        desc_: ''
      })
      this.form.status = 'add'
      this.rowId = ''
    },
    setCheckApis(val) {
      if (this.api.from === 'inner') {
        this.api.data = [...val]
        this.$nextTick(() => {
          this.form.data.apis = val.map(v => v.path)
        })
      } else {
        const path = val.map(v => v.path)
        this.saveModelApis(this.rowId, path)
      }
    },
    saveModelApis(modelId, apiIds = []) {
      this.table.loading = true
      this.$api.menu.setModelApis({
        modelId,
        apis: apiIds.join(',')
      }).then(s => {
        this.table.loading = false
        this.$message.success('保存成功！')
      }).catch(e => {
        this.table.loading = false
        this.$message.error(e.message)
      })
    },
    tableRowHandler({ type, scope }) {
      const METHODS = {
        edit: () => {
          this.$api.menu.getModelDetail({
            id: scope.row.id
          }).then(s => {
            Object.keys(this.form.data).forEach(key => {
              this.form.data[key] = s.data[key]
            })
            this.echoApis(s.data.apiNames, s.data.apis)
            this.rowId = scope.row.id
            this.form.status = 'update'
            this.form.visible = true
            this.api.from = 'inner'
          }).catch(e => {
            this.$message.error(e.message)
          })
        },
        del: () => {
          this.delRow([scope.row.id])
        },
        api: () => {
          this.api.from = 'outer'
          this.rowId = scope.row.id
          this.api.show = true
        }
      }
      METHODS[type]()
    },
    echoApis(names, ids) {
      const arr = []
      names = names && names.split(',')
      ids.forEach((item, index) => {
        arr.push({
          path: item,
          name: names[index]
        })
      })
      this.api.data = arr
    },
    btnsHandler(type) {
      const METHODS = {
        add: () => {
          this.api.from = 'inner'
          this.form.visible = true
        },
        del: () => {
          const ids = this.table.selection.map(s => s.id)
          this.delRow(ids)
        }
      }
      METHODS[type]()
    },
    refresh() {
      this.getPage({ all: true })
    },
    search(query) {
      this.getPage({ query, all: true })
    },
    // eslint-disable-next-line object-curly-newline
    getPage({ page, size, query = '', all, id = '' }) {
      this.table.loading = true
      this.$api.menu.getModelPage({
        page: page || this.table.page,
        size: size || this.table.size,
        query,
        all,
        id
      }).then(s => {
        this.table.data = [...s.data.records]
        this.table.total = s.data.total
        this.table.loading = false
      }).catch(e => {
        this.table.loading = false
        this.$message.error(e.message)
      })
    },
    getTree(expand = []) {
      this.tree.loading = true
      this.$api.menu.getModelTree().then(s => {
        this.tree.data = [...s.data]
        this.tree.loading = false
      }).catch(e => {
        this.tree.loading = false
        this.$message.error(e.message)
      })
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
  .box {
    position: relative;
    .el-button {
      position: absolute;
      right: 0px;
      top: 1px
    }
  }
  .pagination {
    margin: 5px 10px 10px 0;
    text-align: right;
  }
</style>
