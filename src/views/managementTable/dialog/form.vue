<template>
  <el-dialog
    v-dialogDrag
    :modal="false"
    width="80%"
    :visible.sync="show"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="() => $emit('update:show', false)"
  >
    <div slot="title">
      {{ status === 'add' ? '新增' : '编辑' }}自定数据
    </div>
    <el-form
      ref="form"
      v-waiting="loading"
      :model="form"
      :rules="rules"
      size="mini"
      label-width="80px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="编码" prop="sn">
            <el-input v-model="form.sn" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="来源类型" prop="type">
            <el-select v-model="form.type" style="width: 100%;">
              <el-option label="第三方档案" :value="2" />
              <el-option label="手动建档" :value="3" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="+form.type === 2" label="数据源" prop="dataSourceSn">
            <el-select v-model="form.dataSourceSn" size="mini" style="width: 100%;">
              <el-option
                v-for="ds in dataSourceList"
                :key="ds.id"
                :label="ds.name"
                :value="ds.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="上级表" prop="pname">
            <el-select v-model="form.pname" style="width: 100%" clearable>
              <el-option value="" style="height: 250px; overflow-y: auto; padding: 0px">
                <Tree
                  :data="treeData"
                  :search="false"
                  in-box
                  @setTargetNode="setPid"
                />
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="+form.type === 2" label="保存至本库" prop="saveToLocal">
            <el-radio v-model="form.saveToLocal" :label="true">
              是
            </el-radio>
            <el-radio v-model="form.saveToLocal" :label="false">
              否
            </el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="数据表" prop="tab">
        <el-input v-model="form.tab" disabled />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item
            v-if="+form.type === 2 && form.saveToLocal && !form.pname"
            label="自动同步"
            prop="autoSync"
          >
            <el-radio v-model="form.autoSync" :label="true">
              是
            </el-radio>
            <el-radio v-model="form.autoSync" :label="false">
              否
            </el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="form.autoSync" label="频率(天)" prop="syncFrequency">
            <el-input-number
              v-model="form.syncFrequency"
              controls-position="right"
              :min="1"
              step-strictly
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="+form.type === 2 && form.dataSourceSn">
        <el-col :span="6">
          <el-form-item prop="querySql">
            <template slot="label">
              <span>SQL(查询)</span>
              <el-button
                type="text"
                size="mini"
                @click="isHasShowPdialog"
              >
                解析SQL
              </el-button>
            </template>
            <el-input
              v-model="form.querySql"
              type="textarea"
              :rows="8"
              @change="pickParams"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="SQL(新增)" prop="insertSql">
            <el-input
              v-model="form.insertSql"
              type="textarea"
              :rows="8"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="SQL(修改)" prop="updateSql">
            <el-input
              v-model="form.updateSql"
              type="textarea"
              :rows="8"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="SQL(删除)" prop="deleteSql">
            <el-input
              v-model="form.deleteSql"
              type="textarea"
              :rows="8"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item prop="cols">
        <template slot="label">
          <span>列配置</span>
          <el-button
            type="text"
            size="mini"
            @click="addField"
          >
            添加字段
          </el-button>
        </template>
        <cols
          ref="cols"
          :meta="meta"
          :ztsn="ztsn"
          :additional-headers="additionalHeaders"
          :options="options"
        />
      </el-form-item>
      <el-form-item v-if="+form.type === 2" label="用户参数" prop="params">
        <paramsComp :table-data="paramsTableData" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="info" size="mini" @click="() => $emit('update:show', false)">
        取消
      </el-button>
      <el-button v-show="+form.type === 2" type="success" size="mini" @click="previewTable">
        预览
      </el-button>
      <el-button type="primary" size="mini" @click="save">
        确定
      </el-button>
    </div>
    <pDialog
      v-if="pDialogShow"
      :show.sync="pDialogShow"
      :cs="userParams"
      @confirmParams="analysisSQL"
    />
    <preview
      v-if="preview.show"
      :show.sync="preview.show"
      :cols="preview.cols"
      :table-data="preview.tableData"
    />
  </el-dialog>
</template>

<script>
import cols from './cols'
import QS from 'qs'

export default {
  components: {
    cols,
    paramsComp: () => import('./params'),
    pDialog: () => import('./pDialog'),
    preview: () => import('./preview.vue')
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    meta: {
      type: Object,
      default: () => {}
    },
    td: {
      type: Array,
      default: () => []
    },
    businessId: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: 'add'
    },
    ztsn: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      form: {
        sn: '',
        name: '',
        pid: '',
        pname: '',
        tab: `sys_dt_${new Date().getTime()}`,
        cols: '',
        type: 3,
        dataSourceSn: '',
        insertSql: '',
        querySql: 'select id,name from t_test where id={{id}}',
        updateSql: '',
        deleteSql: '',
        params: '',
        saveToLocal: false,
        autoSync: false,
        syncFrequency: 1
      },
      rules: {
        sn: [{ required: true, message: '请填写编码', trigger: 'blur' }],
        name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
        tab: [{ required: true, message: '请填写表名', trigger: 'blur' }],
        type: [{ required: true, message: '请选择来源类型', trigger: 'blur' }],
        dataSourceSn: [{ required: true, message: '请填写选择数据源', trigger: 'blur' }],
        querySql: [{ required: true, message: '请填写查询Sql', trigger: 'blur' }],
        syncFrequency: [{ required: true, message: '请填写频率', trigger: 'blur' }]
        /*  insertSql: [{ required: true, message: '请填写新增Sql', trigger: 'blur' }],
        updateSql: [{ required: true, message: '请填写修改Sql', trigger: 'blur' }],
        deleteSql: [{ required: true, message: '请填写删除Sql', trigger: 'blur' }] */
      },
      dataSourceList: [],
      tree: {
        data: []
      },
      pDialogShow: false,
      userParams: [], // 用户参数
      preview: {
        show: false,
        cols: [],
        tableData: [],
        status: 'analysis' // view
      },
      paramsTableData: [],
      options: [],
      treeData: []
    }
  },
  computed: {
    additionalHeaders() {
      const { type, pid } = this.form
      return type === 2 && pid ? [{ label: '上下级', prop: 'map_' }] : []
    }
  },
  watch: {
    // eslint-disable-next-line object-shorthand
    'form.pid': {
      immediate: true,
      handler(val, oldV) {
        if (val) {
          this.form.autoSync = false
          this.$api.business.getSupAndSubOps({
            tabId: val
          }).then(s => {
            this.options = s.data
            oldV && this.$refs.cols.clearTableOptions('map_')
          }).catch(e => this.$message.error(e.message))
        }
      }
    },
    // eslint-disable-next-line object-shorthand
    'preview.show'(bool) {
      if (!bool) this.preview.status = 'analysis'
    },
    status: {
      immediate: true,
      handler: 'getInfo'
    },
    // eslint-disable-next-line object-shorthand
    'form.type'(val) {
      this.$refs.cols.clearTable()
      this.$refs.form.clearValidate('sql_')
      if (val === 2) this.getDataSourceList()
    }
  },
  created() {
    this.getParentTree()
  },
  methods: {
    pidChange(value) {
      console.log(value)
    },
    getPerviewTableData(obj) {
      this.$http.post('/businessTab/review', QS.stringify({
        sql: this.form.querySql,
        dataSourceId: this.form.dataSourceSn,
        cs: JSON.stringify(obj)
      })).then(s => {
        this.preview.tableData = s.data
        this.preview.show = true
      }).catch(e => {
        this.$message.error(e.message)
      })
    },
    previewTable() {
      this.preview.status = 'view'
      this.isHasShowPdialog()
    },
    analysisSQL(obj) {
      this.loading = true
      const { form } = this
      this.$api.business.getColumnsBySql({
        sql: form.querySql,
        dataSourceId: form.dataSourceSn,
        cs: JSON.stringify(obj)
      }).then(s => {
        if (this.preview.status === 'view') {
          this.preview.cols = s.data.filter(d => !d.hidden).map(m => ({
            label: m.name,
            prop: m.name
          }))
          this.getPerviewTableData(obj)
        } else {
          const col = this.$refs.cols
          col && col.setRows(s.data.map(d => d.name))
        }
        this.loading = false
      }).catch(e => {
        this.$message.error(e.message)
        this.loading = false
      })
    },
    setParamsTableData(names) {
      const oldNames = this.paramsTableData.map(o => o.name)
      names.forEach(n => {
        if (!oldNames.includes(n)) {
          this.paramsTableData.push({
            name: n,
            title: n,
            type: 'string',
            pattern: '无'
          })
        }
      })
      this.paramsTableData = this.paramsTableData.filter(p => names.includes(p.name))
    },
    isHasShowPdialog() {
      if (this.userParams.length) this.pDialogShow = true
      else this.analysisSQL({})
    },
    pickParams(sql) {
      const re = /{{\s*(\S+)\s*}}/g
      const res = []
      let t
      // eslint-disable-next-line no-cond-assign
      while (t = re.exec(sql)) {
        res.push(t[1])
      }
      const def = ['uid', 'range', 'year', 'zth', 'datetime', 'date', 'time', 'timeStamp']
      this.userParams = res.filter(r => !def.includes(r))
      this.setParamsTableData(this.userParams)
    },
    getInfo(id) {
      if (id !== 'add') {
        this.loading = true
        this.$api.business.getGlbInfo({ id }).then(s => {
          Object.keys(this.form).forEach(key => {
            if (key === 'cols') {
              this.$nextTick(() => {
                this.$refs.cols.initRows(JSON.parse(s.data.cols))
              })
            } else if (key === 'params') {
              if (s.data.params) {
                this.paramsTableData = JSON.parse(s.data.params)
                this.userParams = JSON.parse(s.data.params).map(d => d.name)
              }
            } else this.form[key] = s.data[key]
          })
          this.loading = false
        }).catch(e => {
          this.loading = false
          this.$message.error(e.message)
        })
      }
    },
    getParentTree() {
      this.$api.business.getGlbLeftTree({
        tabId: this.status === 'add' ? '' : this.status,
        businessId: this.businessId,
        ztsn: this.ztsn
      }).then(s => {
        this.treeData = [s.data]
      }).catch(e => this.$message.error(e.message))
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = { ...this.form }
          const { complete, data } = this.checkTableDataComplete()
          if (complete) {
            this.loading = true
            let url = 'addGlb'
            if (this.status !== 'add') {
              url = 'updateGlb'
              params.id = this.status
            }
            if (+params.type === 2) {
              params.params = JSON.stringify(this.paramsTableData)
            }
            this.$api.business[url]({
              ...params,
              cols: JSON.stringify(data),
              businessId: this.businessId
            }).then(s => {
              if (s.message === 'SUCCESS') {
                this.$emit('update:show', false)
                this.$emit('refresh', s.data)
              }
            }).catch(e => {
              this.loading = false
              this.$message.error(e.message)
            })
          }
        }
      })
    },
    checkSNandName(data, result) {
      const req = data.map(d => d.required)
      if (!req.includes(true)) {
        this.$message.warning('必须至少一行数据必填为勾选状态！')
        result.complete = false
      }
      return result
    },
    checkTableDataComplete() {
      const td = this.$refs.cols.getTableData()
      const result = { complete: true, data: td }
      for (let i = 0, len = td.length; i < len; i++) {
        if (td[i].name === '' || td[i].title === '') {
          this.$message.warning(`列表配置第${i + 1}行数据填写不完整，请填写完整！`)
          result.complete = false
          break
        }
      }
      if (this.form.type === 2 && this.form.pid) {
        if (!td.some(t => t.map_)) {
          result.complete = false
          this.$message.warning('列配置的上下级至少需保持一行有值！')
        }
      }
      if (!td.some(t => t.queryColumn)) {
        result.complete = false
        this.$message.warning('列配置至少一行需普通查询！')
      }
      /* if (!td.some(t => t.singleFlag)) {
        result.complete = false
        this.$message.warning('列配置至少一行需勾选唯一标识！')
      } */
      return result.complete ? this.checkSNandName(td, result) : result
    },
    setPid(node) {
      if (node.disabled) this.$message.warning('当前节点无法选择！')
      else {
        this.form.pname = node.label
        this.form.pid = node.id
      }
    },
    addField() {
      this.$refs.cols.addRow()
    },
    getDataSourceList() {
      if (this.dataSourceList.length === 0) {
        this.$api.record.getDataSourceList().then(s => {
          this.dataSourceList = [...s.data]
        }).catch(e => this.$message.error(e.message))
      }
    }
  }
}
</script>

<style>

</style>
