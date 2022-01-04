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
      {{ status === 'add' ? '添加' : '编辑' }}{{ meta.outer === 'system' ? '系统' : '账套' }}档案
    </div>
    <el-form
      ref="form"
      v-waiting="loading"
      :model="form"
      :rules="rules"
      size="mini"
      label-width="80px"
      status-icon
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="分类" prop="catName">
            <el-select v-model="form.catName" style="width: 100%;">
              <el-option value="" style="height: 250px; overflow-y:auto;padding: 0px">
                <Tree
                  :data="typeTree"
                  :search="false"
                  in-box
                  @setTargetNode="setCatId"
                />
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="编码" prop="sn">
            <el-input v-model="form.sn" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="来源类型" prop="type">
            <el-select v-model="form.type" style="width: 100%;">
              <el-option label="本系统" :value="1" />
              <el-option label="第三方档案" :value="2" />
              <el-option label="手动建档" :value="3" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="数据类型" prop="dataType">
            <el-select v-model="form.dataType">
              <el-option label="树形" :value="1" />
              <el-option label="列表" :value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item v-if="+form.dataType === 1" label="树模式" prop="treeUseId">
            <el-select v-model="form.treeUseId">
              <el-option label="使用编码" :value="false" />
              <el-option label="使用ID" :value="true" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item v-if="+form.dataType === 1 && form.treeUseId === false">
            <span slot="label">
              <span style="color: red;padding-right:4px;">*</span>
              <span>编码方案</span>
            </span>
            <Bmfa
              :bmgz-boxs="bmgzBoxs"
              :used-bmgz.sync="usedBmgz"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="+form.type === 2" label="数据源" prop="dataSourceSn">
        <el-select v-model="form.dataSourceSn" size="mini">
          <el-option
            v-for="ds in dataSourceList"
            :key="ds.id"
            :label="ds.name"
            :value="ds.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="[1, 2].includes(+form.type)" prop="sql_">
        <template slot="label">
          <span>SQL</span>
          <el-button
            type="text"
            size="mini"
            @click="analysisSQL(form.sql_)"
          >
            解析SQL
          </el-button>
        </template>
        <el-input
          v-model="form.sql_"
          type="textarea"
          placeholder=" "
          :rows="4"
        />
      </el-form-item>
      <el-form-item prop="cols">
        <template slot="label">
          <span>列配置</span>
          <el-button
            v-if="[2, 3].includes(+form.type)"
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
          :type="+form.type"
        />
      </el-form-item>
      <el-form-item v-if="[2, 3].includes(+form.type)" label="数据表" prop="tab">
        <el-input v-model="form.tab" />
      </el-form-item>
    </el-form>
    <preview
      v-if="preview.show"
      :show.sync="preview.show"
      :type="+form.type"
      :sql="form.sql_"
      :data-source-id="form.dataSourceSn"
      :cols="preview.cols"
    />
    <div slot="footer">
      <el-button
        v-if="[1, 2].includes(+form.type)"
        type="success"
        size="mini"
        @click="previewTable"
      >
        预览
      </el-button>
      <el-button type="info" size="mini" @click="() => $emit('update:show', false)">
        取消
      </el-button>
      <el-button type="primary" size="mini" @click="save">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import cols from './cols'
import Bmfa from '@/components/Bmfa'

export default {
  name: 'Form',
  components: {
    cols,
    Bmfa,
    preview: () => import('./preview')
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
    status: {
      type: String,
      default: 'add'
    },
    ztsn: {
      type: String,
      default: ''
    },
    typeDialogParent: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      form: {
        catId: '',
        catName: '',
        sn: '',
        name: '',
        type: 1,
        dataSourceSn: '',
        dataType: 1,
        treeUseId: true,
        bmfa: '',
        sql_: '',
        cols: [],
        tab: `sys_dossier_data_${new Date().getTime()}`
      },
      rules: {
        catName: [{ required: true, message: '请选择分类', trigger: 'blur' }],
        sn: [{ required: true, message: '请填写编码', trigger: 'blur' }],
        name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择来源类型', trigger: 'change' }],
        dataType: [{ required: true, message: '请选择数据类型', trigger: 'change' }],
        treeUseId: [{ required: true, message: '请选择树模式', trigger: 'change' }],
        bmfa: [{ required: true, message: '请填写编码方案', trigger: 'blur' }],
        sql_: [{ required: true, message: '请填写sql', trigger: 'blur' }],
        tab: [{ required: true, message: '请填写数据表', trigger: 'blur' }],
        dataSourceSn: [{ required: true, message: '请选择数据源', trigger: 'blur' }]
      },
      dataSourceList: [],
      typeTree: [],
      hasNotAllowdParams: false,
      bmgzBoxs: {
        0: ''
      },
      usedBmgz: '0',
      preview: {
        show: false,
        cols: []
      }
    }
  },
  watch: {
    status: {
      immediate: true,
      handler: 'getInfo'
    },
    // eslint-disable-next-line object-shorthand
    'form.type'(val) {
      this.$refs.cols.clearTable()
      this.$refs.form.clearValidate('sql_')
      if (val === 2) this.getDataSourceList()
    },
    typeDialogParent: {
      immediate: true,
      handler(val) {
        if (val && val.type === 'category') {
          this.form.catName = val.label
          this.form.catId = val.sn
        }
      }
    }
  },
  created() {
    this.getTypeTree()
  },
  methods: {
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = { ...this.form }
          let bmfaSuccess = true
          if (!this.form.treeUseId && +this.form.dataType === 1) { // 校验编码规则
            const bmfa = Object.values(this.bmgzBoxs).filter(item => item !== '')
            params.bmfa = bmfa.join('-')
            bmfaSuccess = !!bmfa.length
          }
          if (bmfaSuccess) {
            const { complete, data } = this.checkTableDataComplete()
            if (complete) {
              if (params.type === 1 && this.hasNotAllowdParams) {
                this.$message.warning('sql语句包含错误系统参数!')
              } else {
                this.loading = true
                delete params.catName
                let api = 'save'
                if (this.status !== 'add') {
                  api = 'updateDangAn'
                  params.id = this.status
                }
                if (this.meta.outer === 'treatment') params.ztsn = this.ztsn
                this.$api.record[api](this.meta.inner, {
                  ...params,
                  cols: JSON.stringify(data)
                }).then(s => {
                  if (s.message === 'SUCCESS') {
                    this.$emit('update:show', false)
                    this.$emit('refresh', s.data)
                  }
                  this.loading = false
                }).catch(e => {
                  this.loading = false
                  this.$message.error(e.message)
                })
              }
            }
          } else this.$message.warning('编码规则至少一位')
        }
      })
    },
    analysisSQL(sql) {
      this.loading = true
      this.$api.record.analysisSQL({
        type: this.form.type,
        sql: this.form.sql_,
        dataSourceId: this.form.dataSourceSn
      }).then(s => {
        const col = this.$refs.cols
        col && col.setRows(s.data.map(d => d.name))
        this.loading = false
      }).catch(e => {
        this.loading = false
        this.$message.error(e.message)
      })
    },
    previewTable() {
      const { complete, data } = this.checkTableDataComplete()
      if (complete) {
        const rows = data.filter(d => !d.hidden).map(m => ({
          label: m.title,
          prop: m.name
        }))
        this.preview.cols = rows
        this.preview.show = true
      }
    },
    getInfo(val) {
      if (val !== 'add') {
        this.loading = true
        this.$api.record.getInfoById(this.meta.inner, {
          id: val,
          ztsn: this.meta.outer === 'treatment' ? this.ztsn : ''
        }).then(s => {
          Object.keys(this.form).forEach(key => {
            if (key === 'cols') {
              this.$nextTick(() => {
                this.$refs.cols.initRows(JSON.parse(s.data.cols))
              })
            } else this.form[key] = s.data[key]
          })
          this.setBmgzValue(s.data)
          this.loading = false
        }).catch(e => {
          this.loading = false
          this.$message.error(e.message)
        })
      }
    },
    setBmgzValue(data) {
      const { bmfa, usedBmgz } = data
      if (bmfa) {
        bmfa.split('-').forEach((item, index) => {
          this.$set(this.bmgzBoxs, index, item)
        })
        this.usedBmgz = usedBmgz
      }
    },
    checkSNandName(data, result) {
      const sn = []
      const name = []
      const queryColumn = []
      const singleFlag = []
      data.forEach(d => {
        sn.push(d.isSnField)
        name.push(d.isNameField)
        queryColumn.push(d.queryColumn)
        singleFlag.push(d.singleFlag)
      })
      if (!sn.includes(true)) {
        this.$message.warning('编码字段至少选择一个！')
        result.complete = false
      }
      if (!name.includes(true)) {
        this.$message.warning('名称字段至少选择一个！')
        result.complete = false
      }
      if (!queryColumn.includes(true)) {
        this.$message.warning('普通查询字段至少选择一个！')
        result.complete = false
      }
      if (!singleFlag.includes(true)) {
        this.$message.warning('唯一标识字段至少选择一个！')
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
      return result.complete ? this.checkSNandName(td, result) : result
    },
    formatterSQL(sql) {
      const fields = this.pickFields(sql)
      this.hasNotAllowdParams = sql && this.pickParams(sql)
      const col = this.$refs.cols
      col && col.setRows(fields)
    },
    pickParams(sql) {
      const re = /{{\s*(\S+)\s*}}/g
      const res = []
      let t
      // eslint-disable-next-line no-cond-assign
      while (t = re.exec(sql)) {
        res.push(t[1])
      }
      const def = ['uid', 'range', 'year', 'zth', 'datetime', 'date', 'unitId']
      const Flag = Array.from(new Set(res)).some(item => !def.includes(item))
      return Flag
    },
    deepFields(str) {
      const arr = str.split(',')
      const kg = /(^\s+)|(\s+$)|\s+/g
      let kgRes
      const lastArr = arr.map(item => {
        const asIndex = item.indexOf('as')
        if (asIndex !== -1) return item.slice(asIndex + 2).trim()
        // eslint-disable-next-line no-cond-assign
        if (kgRes = kg.exec(item.trim())) {
          return item.trim().slice(kgRes.index).trim()
        }
        return item.trim()
      })
      return lastArr
    },
    pickFields(sql) {
      const reg = /\/\*字段\*\//g
      let result
      const index = []
      // eslint-disable-next-line no-cond-assign
      while (result = reg.exec(sql)) {
        index.length < 2 ? index.push(result.index) : ''
      }
      return index.length === 2 ? this.deepFields(sql.slice(index[0] + 6, index[1]).trim()) : null
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
    },
    setCatId(node) {
      this.form.catName = node.label
      this.form.catId = node.id
    },
    getTypeTree() {
      this.$api.record.getTypeTree({
        ztsn: this.meta.outer === 'treatment' ? this.ztsn : ''
      }).then(s => {
        this.typeTree = [...s.data]
      }).catch(e => {
        this.$message.error(e.message)
      })
    }
  }
}
</script>

<style>

</style>
