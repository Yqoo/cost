<template>
  <div v-waiting="loading">
    <LeftWorkbench ref="leftWorkbench" :width="width" title="会计期间方案分级">
      <Tree
        slot="tree"
        ref="tree"
        search
        :data="tree.data"
        :node-props="{
          children: 'children',
          label: 'label'
        }"
        :rightmenus="rightmenus"
        :default-expanded-keys="tree.focusId"
        @update:rightmenus="rightmenusHandler"
        @setTargetNode="setTargetNode"
      />
    </LeftWorkbench>
    <MiddleDrag :margin-top="middleDragTop" @hook:mounted="getTop" @move="move" />
    <RightWorkbench :margin-left="width">
      <ToolsBar
        slot="toolsBar"
        class="btnColor"
        module-name="Periodspland"
        :items="btns"
        style="border-bottom: 1px solid #ddd"
        @btnsHandler="btnsHandler"
      >
        <div slot="unit" />
      </ToolsBar>
      <Table
        id="print"
        slot="table"
        v-waiting="table.loading"
        :data="table.data"
        :columns="columns"
        :search="true"
        number
        :pagination="false"
        empty-text="暂无数据或请先选择会计期间方案"
        @search="search"
        @refresh="refresh"
        @select="select"
      />
    </RightWorkbench>
    <!-- 新增 修改方案 -->
    <el-dialog
      v-dialogDrag
      :visible.sync="form.visible"
      :modal="false"
      width="50%"
      :close-on-click-modal="false"
      @close="formClose"
    >
      <div slot="title">
        <!-- <i class="el-icon-circle-plus" /> -->
        <span>{{ form.statu === 'add' ? '新增' : '编辑' }}会计期间方案</span>
      </div>
      <el-collapse v-model="form.activeCollapse">
        <el-collapse-item title="基本信息" name="basic">
          <el-form
            ref="form"
            :model="form.data"
            :rules="form.rules"
            size="mini"
            label-width="90px"
            inline
          >
            <el-form-item label="代码" prop="sn">
              <el-input v-model="form.data.sn" />
            </el-form-item>
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.data.name" />
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-select v-model="form.data.type">
                <el-option label="年" :value="1" />
                <el-option label="季" :value="2" />
                <el-option label="月" :value="3" />
                <el-option label="周" :value="4" />
                <el-option label="日" :value="5" />
                <el-option label="自定义" :value="6" />
              </el-select>
            </el-form-item>
            <el-form-item label="开始日期" prop="startDate">
              <el-date-picker
                v-model="form.data.startDate"
                type="date"
                placeholder="选择日期"
                size="mini"
                value-format="timestamp"
              />
            </el-form-item>
            <el-form-item label="状态" prop="enable">
              <el-radio v-model="form.data.enable" :label="true">
                启用
              </el-radio>
              <el-radio v-model="form.data.enable" :label="false">
                停用
              </el-radio>
            </el-form-item>
            <el-form-item label=" " prop="february">
              <el-checkbox v-model="form.data.february">
                特殊配置
                <el-tooltip class="item" effect="light" content="将2月28号或2月29号设为最后一天" placement="top-start">
                  <i class="el-icon-question" style="color: red;" />
                </el-tooltip>
              </el-checkbox>
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="会计期间" name="qj">
          <el-table
            v-waiting="form.tableLoaing"
            :data="form.table"
            size="mini"
            style="width: 100%"
            height="200px"
          >
            <el-table-column type="index" label="序号" />
            <el-table-column label="会计期间名称" prop="name">
              <template slot-scope="scope">
                <el-input v-model="scope.row.name" size="mini" />
              </template>
            </el-table-column>
            <el-table-column label="开始时间" prop="startDate">
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.startDate"
                  :disabled="form.data.type !== 6"
                  type="date"
                  placeholder="选择日期"
                  size="mini"
                  style="width: 150px"
                  :clearable="false"
                  value-format="timestamp"
                  @change="startDateChange(scope)"
                />
              </template>
            </el-table-column>
            <el-table-column label="截止时间" prop="endDate">
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.endDate"
                  :disabled="form.data.type !== 6"
                  type="date"
                  placeholder="选择日期"
                  size="mini"
                  style="width: 150px"
                  value-format="timestamp"
                  :clearable="false"
                  @change="endDateChange(scope)"
                />
              </template>
            </el-table-column>
            <el-table-column v-if="form.data.type === 6" label="操作" width="60">
              <template slot-scope="scope">
                <el-button
                  v-if="form.table.length - scope.$index === 1"
                  type="text"
                  size="small"
                  icon="el-icon-circle-plus"
                  @click="formTableHandler('add', scope)"
                />
                <el-button
                  v-if="scope.$index !== 0 && form.table.length - scope.$index === 1"
                  type="text"
                  size="small"
                  icon="el-icon-delete"
                  @click="formTableHandler('del', scope)"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
      <div slot="footer">
        <el-button type="info" size="mini" @click="form.visible = false">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="confirmSave">
          确定
        </el-button>
      </div>
    </el-dialog>
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

export default {
  name: 'Periodspland',
  data() {
    return {
      loading: false,
      width: 300,
      middleDragTop: this.width,
      table: {
        data: [],
        page: 1,
        size: 200,
        total: 0,
        loading: false
      },
      tree: {
        data: [],
        targetNode: {},
        focusId: []
      },
      form: {
        visible: false,
        statu: 'add',
        activeCollapse: ['basic', 'qj'],
        data: {
          sn: '',
          name: '',
          type: 1,
          enable: true,
          startDate: '',
          february: false
        },
        rules: {
          sn: [{ required: true, message: '请填写代码', trigger: 'blur' }],
          name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
          type: [{ required: true, message: '请选择类型', trigger: 'change' }],
          startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }]
        },
        table: [],
        tableLoaing: false,
        echo: false
      },
      upload: {
        show: false,
        action: '',
        params: {}
      }
    }
  },
  computed: {
    apis() {
      return this.$tools.getModuleAPIS('Periodspland')
    },
    typeAndStart() {
      const { type, startDate } = this.form.data
      return { type, startDate }
    },
    pageChange() {
      const { size, page } = this.table
      return { size, page }
    },
    btns() { // toolsBar 按钮
      const bts = [
        {
          method: 'add', name: '新增', icon: 'el-icon-circle-plus-outline', api: '/systemKuaiJiQiJianfangAnFenLei/add'
        },
        {
          method: 'import', name: '导入', icon: 'el-icon-download', api: '/systemKuaiJiQiJianfangAn/importFile'
        },
        {
          method: 'print',
          name: '打印',
          icon: 'el-icon-printer'
        },
        {
          method: 'more',
          name: '更多',
          icon: 'el-icon-arrow-down',
          children: [
            {
              method: 'educe', name: '导出', icon: 'el-icon-top', api: '/systemKuaiJiQiJianfangAn/export'
            }

          ]
        }
      ]
      return this.tree.targetNode.isEnable === true ? bts : bts.filter(l => l.method !== 'print')
    },
    columns() { // table 表单表头
      return [
        { label: '会计期间名称', prop: 'name' },
        { label: '开始时间', prop: 'startDate' },
        { label: '结束时间', prop: 'endDate' },
        { label: '所属会计期间方案', prop: 'kjqjfaFlSn' }
      ]
    },
    auth() {
      return this.$tools.getCookie()
    }
  },
  watch: {
    typeAndStart(obj) {
      if (!this.echo) {
        this.form.table = []
        const { type, startDate } = obj
        if (startDate) {
          if (type === 6) {
            this.$set(this.form.table, 0, { name: '自定义1', startDate, endDate: '' })
          } else {
            this.getTableDate({ type, startDate })
          }
        }
      }
    },
    pageChange(obj) {
      if (this.id) {
        this.getTable({
          page: obj.page,
          size: obj.size,
          flSn: this.id
        })
      } else {
        this.getTable({
          page: obj.page,
          size: obj.size,
          flSn: 0
        })
      }
    },
    id: {
      immediate: true,
      handler(val) {
        if (val) {
          this.table.page = 1
          this.table.size = 200
          this.getTable({
            page: this.table.page,
            size: this.table.size,
            flSn: val
          })
        }
      }
    }

  },
  created() {
    this.getTree()
  },
  methods: {
    async getAll() {
      this.loading = true
      const tree = await this.$api.accounting.getProgrammeTree()
      const table = await this.$api.accounting.getProgrammePage({
        flSn: 0,
        page: this.table.page,
        size: this.table.size
      })
      this.tree.data = tree.data
      this.table.data = table.data.records
      this.table.total = table.data.total
      this.loading = false
    },
    rightmenus(node) { // tree 右键功能
      const rm = {
        1: [],
        2: [{
          label: '添加', icon: 'el-icon-circle-plus-outline', type: 'addTree', api: '/systemKuaiJiQiJianfangAnFenLei/add'
        }],
        3: [
          {
            label: '编辑', icon: 'el-icon-edit', type: 'editTree', api: '/systemKuaiJiQiJianfangAnFenLei/update'
          },
          {
            label: '删除', icon: 'el-icon-delete', type: 'delTree', api: '/systemKuaiJiQiJianfangAnFenLei/delete'
          }
        ]
      }
      return rm[node.dataType].filter(r => this.apis.includes(r.api))
    },
    startDateChange(scope) {
      const { $index, row } = scope
      const st = row.startDate
      const et = row.endDate
      if (et && st - et >= 0) {
        this.$message.warning('开始日期不能大于或等于截止日期')
        scope.row.startDate = ''
      }
      if ($index !== 0) {
        const topRowStart = new Date(this.form.table[$index - 1].startDate) // 两个期间之间 最小间隔天数为1
        topRowStart.setDate(topRowStart.getDate() + 1)
        if (st - topRowStart <= 0) {
          this.$message.warning('开始日期不能小于或等于上一期间日期')
          scope.row.startDate = ''
        }
        const _d = new Date(row.startDate)
        _d.setDate(_d.getDate() - 1)
        this.form.table[$index - 1].endDate = _d.getTime()
      }
    },
    endDateChange(scope) {
      const { $index, row } = scope
      const st = row.startDate
      const et = row.endDate
      if (st && st - et >= 0) {
        this.$message.warning('截止日期不能小于或等于开始日期')
        scope.row.endDate = ''
      } else if (this.form.table[$index + 1]) {
        const bottomRowStart = new Date(this.form.table[$index + 1].endDate) // 两个期间之间 最小间隔天数为1
        bottomRowStart.setDate(bottomRowStart.getDate() - 1)
        if (et - bottomRowStart >= 0) {
          this.$message.warning('截止日期不能大于或等于下一期间日期')
          scope.row.endDate = ''
        } else {
          const _d = new Date(et)
          _d.setDate(_d.getDate() + 1)
          this.form.table[$index + 1].startDate = _d.getTime()
        }
      }
    },
    formTableHandler(type, scope) {
      const Methods = {
        add: () => {
          const et = scope.row.endDate
          let _d = ''
          if (et) {
            _d = new Date(et)
            _d.setDate(_d.getDate() + 1)
          }
          // eslint-disable-next-line max-len
          this.$set(this.form.table, this.form.table.length, { name: `自定义${scope.$index + 2}`, startDate: _d ? _d.getTime() : _d, endDate: '' })
        },
        del: () => {
          this.form.table.splice(scope.$index, 1)
        }
      }
      Methods[type]()
    },
    confirmSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = { ...this.form.data }
          params.startDate = this.$tools.timestamp(new Date(+params.startDate), 'YYYY/MM/DD')
          const table = this.$tools.deepClone(this.form.table)
          const result = this.checkTableCols(table)
          if (!result.bool) {
            if (result.time) {
              this.$message.error(`请将当前期间<<第${result.index + 1}行>>数据填写完整`)
            } else {
              this.$message.error('当前期间时间分配不合理，请完整分配一年时间')
            }
          } else {
            this.loading = true
            table.forEach(t => {
              t.startDate = this.$tools.timestamp(new Date(+t.startDate), 'YYYY/MM/DD')
              t.endDate = this.$tools.timestamp(new Date(+t.endDate), 'YYYY/MM/DD')
              t.kjqjfaFlSn = params.sn
            })
            let api = ''
            const param = {
              ...params,
              listFangAn: JSON.stringify(table)
            }
            if (this.form.statu === 'add') {
              api = 'addKJQJFL'
            } else {
              api = 'updateKJQJFL'
              param.id = this.tree.targetNode.id
            }
            this.$api.accounting[api](param).then(s => {
              this.getTree([s.data || this.tree.targetNode.id])
              this.loading = true
              this.$message.success('保存成功')
              this.form.visible = false
            }).catch(e => {
              this.loading = false
              this.$message.error(e.message)
            })
          }
        }
      })
    },
    checkTableCols(data) {
      const { type } = this.form.data
      const result = {
        bool: true,
        index: 0,
        time: true
      }
      for (let i = 0, len = data.length; i < len; i++) {
        const flag = Object.keys(data[i]).some(key => data[i][key] === '')
        if (flag) {
          result.index = i
          result.bool = false
          break
        }
      }
      if (type === 6) { // 自定义分类需检查所填写时间是否为完整一年
        const first = new Date(data[0].startDate)
        const last = new Date(data[data.length - 1].endDate)
        first.setFullYear(first.getFullYear() + 1)
        first.setDate(first.getDate() - 1)
        if (this.$tools.timestamp(first, 'YYYY/MM/DD') !== this.$tools.timestamp(last, 'YYYY/MM/DD')) {
          result.bool = false
          result.time = false
        }
      }
      return result
    },
    formClose() {
      Object.assign(this.form.data, {
        sn: '',
        name: '',
        type: 1,
        enable: true,
        startDate: '',
        february: false
      })
      this.form.table = []
      this.form.statu = 'add'
    },
    getTableDate(obj) {
      this.form.tableLoaing = true
      const { type, startDate } = obj
      this.$api.accounting.getProgrammeTableDate({
        type,
        startDate: this.$tools.timestamp(new Date(+startDate), 'YYYY/MM/DD')
      }).then(res => {
        this.form.table = res.data
        this.form.tableLoaing = false
      }).catch(e => {
        this.$message.error(e.message)
        this.form.tableLoaing = false
      })
    },
    setTargetNode(node) {
      this.form.data.type = node.classType
      this.tree.targetNode = node
      this.id = node.sn
      this.getTable({
        page: this.table.page,
        size: this.table.size,
        flSn: this.id,
        dataType: node.dataType
      })
    },
    getTree(focusId = []) {
      this.loading = true
      this.$api.accounting.getProgrammeTree().then(res => {
        this.tree.data = res.data
        this.tree.focusId = focusId
        this.loading = false
      })
    },
    getTable({
      flSn = '', page, size, query = '', dataType = '1'
    }) {
      this.table.loading = true
      this.$api.accounting.getProgrammePage({
        flSn,
        page,
        size,
        query,
        dataType
      }).then(res => {
        this.table.data = res.data.records
        this.table.total = res.data.total
        this.table.loading = false
      })
    },
    getTop() { // 拖拽
      this.middleDragTop = this.$refs.leftWorkbench.$el.offsetHeight / 2
    },
    move(x) { // 移动
      if (x < 300) x = 300
      else if (x > 800) x = 800
      this.width = x
    },
    tableToolsHandler(obj) { // table 操作栏事件
      const { type, scope } = obj
    },
    uploadSuccess(res) {
      // ...
    },
    btnsHandler(method) { // toolsBar 点击事件
      const { label, id, sn } = this.tree.targetNode
      const Methods = {
        add: () => {
          this.form.visible = true
        },
        import: () => {
          const { baseURL } = this.$http.defaults
          this.upload.action = `${baseURL}/systemKuaiJiQiJianfangAn/importFile`
          this.upload.show = true
        },
        print: () => {
          if (label) {
            this.$printFn({
              url: '/PrintPdfController/exportPdf',
              name: '会计期间方案',
              params: {
                type: 'SystemKuaiJiQiJianFangAn',
                ids: sn,
                ztsn: ''
              }
            })
          } else this.$message.warning('请先选择需要打印的文件！')
        },
        educe: () => {
          this.$exportFn({
            url: '/systemKuaiJiQiJianfangAn/export',
            name: '会计期间方案'
          })
        }
      }
      Methods[method]()
    },
    rightmenusHandler(obj) { // tree 右键事件
      const { data, type } = obj
      const Methods = {
        addTree: () => {
          this.form.data.type = data.classType
          this.form.visible = true
        },
        delTree: () => {
          this.$confirm('此操作将会删除当前数据,是否继续？', '删除提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$api.accounting.deleteTree({ id: data.id }).then(res => {
              this.$message.success('删除成功')
              this.refresh()
              this.$refs.tree.remove(data)
            }).catch(rej => this.$message.error(rej.message))
          }).catch(e => e)
        },
        editTree: () => {
          this.loading = true
          this.tree.targetNode = data
          this.$api.accounting.getInfo({ id: data.id }).then(s => {
            const { use_ } = s.data
            this.echo = true
            Object.keys(this.form.data).forEach(key => {
              this.form.data[key] = s.data[key]
            })
            this.form.table = s.data.listFangAn.map(l => ({
              endDate: +l.endDate,
              id: l.id,
              kjqjfaFlSn: l.kjqjfaFlSn,
              name: l.name,
              startDate: +l.startDate
            }))
            this.loading = false
            this.form.statu = 'update'
            this.form.visible = true
            this.$nextTick(() => {
              this.echo = false
            })
          }).catch(e => {
            this.loading = false
            this.$message.error(e.message)
          })
        }
      }
      Methods[type]()
    },
    search(value) {
      this.getTable({
        page: this.table.page,
        size: this.table.size,
        flSn: 0,
        query: value,
        dataType: 1
      })
    },
    refresh() { // 刷新
      this.getTable({
        page: 1,
        size: this.table.size,
        flSn: 0,
        dataType: 1
      })
    },
    select(obj) { // 选中checkBox 事件
      const { selection, row } = obj
      console.log(selection, row, 'checkBox')
    }
  }
}
</script>

<style lang="scss" scoped>
.right {
  float: right;
}
.content{
  display: flex;
  justify-content: center;
  align-items: center
}
.pagination {
  text-align: right;
}
</style>
