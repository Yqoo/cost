<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="mini"
      label-width="100px"
      status-icon
    >
      <el-form-item label="函数" prop="hsIds">
        <el-select v-model="form.hsIds" multiple placeholder="请选择函数" style="width:100%">
          <el-option
            v-for="item in listFuction"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="table">
      <div class="glda">
        <span class="span">关联档案</span>
        <el-table
          ref="table"
          v-waiting="glTable.loading"
          class="elTabl"
          :data="glTable.data"
          size="mini"
          style="width: 100%"
          height="300"
          :highlight-current-row="true"
          border
          align="center"
          :row-class-name="tableRowClassName"
          @row-click="rowClick"
        >
          <el-table-column label="关联档案" prop="status">
            <template slot-scope="scope">
              <Treeselect
                v-model="scope.row.dossierId"
                :multiple="false"
                flat
                :clearable="false"
                :options="gldaData"
                :disabled="scope.row.syzt"
                :normalizer="normalizer"
                placeholder="请选择关联档案"
                open-on-focus
                @select="selectChange"
                @input="inputValue"
              />
            </template>
          </el-table-column>
          <el-table-column label="字段" prop="status">
            <template slot-scope="scope">
              <el-select v-model="scope.row.dossier_field_" placeholder="选择字段" size="mini">
                <el-option
                  v-for="item in gldazd[scope.row.dossierId]"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="显示名称" prop="dossierXsName">
            <template slot-scope="scope">
              <el-input v-model="scope.row.dossierXsName" size="mini" :disabled="true" />
            </template>
          </el-table-column>
          <el-table-column label="显示编码" prop="sn_">
            <template slot-scope="scope">
              <el-input v-model="scope.row.dossierXssn" size="mini" :disabled="true" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80px">
            <template slot="header">
              <span style="padding-right:10px;">操作</span>
              <el-button
                type="text"
                size="small"
                icon="el-icon-circle-plus"
                title="添加"
                @click="tableRowHandler('gladd')"
              />
            </template>
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                icon="el-icon-delete"
                title="删除"
                @click="tableRowHandler('gldel', scope)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="dagx">
        <span class="span">档案关系</span>
        <el-table
          ref="table"
          v-waiting="daTable.loading"
          class="elTabl"
          :data="dossierData"
          size="mini"
          style="width: 100%"
          height="300"
          :highlight-current-row="true"
          border
          align="center"
        >
          <el-table-column label="函数" prop="status">
            <template slot-scope="scope">
              <el-select
                :ref="scope.row.hx_id_"
                v-model="scope.row.hx_id_"
                placeholder="请选择函数"
                size="mini"
                :disabled="scope.row.syzt"
                @focus="getData"
                @change="getDacs(scope.row)"
              >
                <el-option
                  v-for="item in dadaData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="参数" prop="status">
            <template slot-scope="scope">
              <el-select v-model="scope.row.hx_param_" placeholder="请选择参数" size="mini">
                <el-option
                  v-for="item in dacs"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80px">
            <template slot="header">
              <span style="padding-right:10px;">操作</span>
              <el-button
                type="text"
                size="small"
                icon="el-icon-circle-plus"
                title="添加"
                @click="tableRowHandler('daadd')"
              />
            </template>
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                icon="el-icon-delete"
                title="删除"
                @click="tableRowHandler('dadel', scope)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'Glda',
  components: {
    Treeselect
  },
  props: {
    formData: {
      type: Object,
      default: () => {}
    },
    getInfoData: {
      type: Object,
      default: () => {}
    },
    usn: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isShow: false,
      listFuction: [], // 函数下拉数据
      gldaData: [], // 关联档案数据
      gldazd: {}, // 关联档案字段
      dadaData: [],
      dacs: [],
      form: {
        hsIds: []
      },
      glTable: {
        loading: false,
        data: []
      },
      daTable: {
        loading: false,
        data: []
      },
      rules: {
        hsIds: [{ required: true, message: '请选择函数', trigger: 'change' }]
      },
      targetNode: {},
      obj: [],
      table: [],
      rowIndex: 0,
      id: ''
    }
  },
  computed: {
    dossierData() {
      const { rowIndex } = this
      return this.glTable.data[rowIndex] ? this.glTable.data[rowIndex].children : []
    }
  },
  watch: {
    usn: {
      immediate: true,
      handler: 'getInfoDesc'
    }
  },
  created() {
    this.getListFunction()
    this.getGlda()
  },
  methods: {
    getInfoDesc(val) { // table回显
      if (val) {
        this.$api.reportxm.getXmDacs({ id: val }).then(s => {
          const { data } = s
          this.id = data.id
          this.form.hsIds = data.hsIds.split(',')
          const arr = []
          for (let i = 0, len = this.listFuction.length; i < len; i++) {
            if (this.form.hsIds.includes(this.listFuction[i].id)) {
              arr.push(this.listFuction[i])
            }
          }
          this.dadaData = [...arr]
          const { listDossiers } = data
          for (let i = 0, len = listDossiers.length; i < len; i++) {
            this.$set(this.glTable.data, this.glTable.data.length, {
              dossierId: listDossiers[i].dossierId,
              dossier_field_: listDossiers[i].dossierField,
              dossier_sn_: listDossiers[i].dossierSn,
              dossier_type_: listDossiers[i].dossierType,
              dossierXsName: listDossiers[i].dossierXsName,
              dossierXssn: listDossiers[i].dossierXssn,
              id: listDossiers[i].id,
              syzt: listDossiers[i].syzt,
              children: []
            })
            listDossiers[i].bbDossierhxs.forEach(el => {
              this.$set(this.glTable.data[i].children, this.glTable.data[i].children.length, {
                dossier_sn_: el.dossierSn,
                id: el.id,
                dossier_type_: el.dossiertype,
                hx_id_: el.hxId,
                hx_param_: el.hxParam,
                syzt: el.syzt
              })
            })
            this.getDacs(this.glTable.data[i].children)
          }
          this.inputValue(this.glTable.data)
        }).catch(e => this.$message.error)
      }
    },
    rowClick(row, column) { // 关联档案行点击
      if (column.label !== '操作') this.rowIndex = row.rowIndex
    },
    tableRowClassName({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.rowIndex = rowIndex
    },
    verifyArr() { // 保存时验证数组
      const flag = {
        done: true,
        message: '验证通过'
      }
      const obj = {}
      const daobj = {}
      for (let i = 0, len = this.glTable.data.length; i < len; i++) {
        if (this.glTable.data[i].dossierId === null || this.glTable.data[i].dossier_field_ === '') {
          flag.done = false
          flag.message = `关联档案第${i + 1}行数据填写不完整`
          break
        }
        if (obj[this.glTable.data[i].dossierId]) {
          flag.done = false
          flag.message = `第${i + 1}行关联档案重复`
          break
        } else obj[this.glTable.data[i].dossierId] = true
      }
      for (let i = 0, len = this.dossierData.length; i < len; i++) {
        if (this.dossierData[i].hx_id_ === '' || this.dossierData[i].hx_param_ === '') {
          flag.done = false
          flag.message = `档案关系数据表第${i + 1}行数据填写不完整`
          break
        }
        if (daobj[this.dossierData[i].hx_id_] && daobj[this.dossierData[i].hx_param_]) {
          flag.done = false
          flag.message = `档案关系数据表第${i + 1}行数据填写重复`
          break
        } else {
          daobj[this.dossierData[i].hx_id_] = true
          daobj[this.dossierData[i].hx_param_] = true
        }
      }
      return flag
    },
    save() {
      const flag = this.verifyArr()
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = { ...this.formData }
          params.hsIds = this.form.hsIds.join(',')
          if (this.id) params.id = this.id
          if (flag.done) {
            const table = [...this.glTable.data]
            this.send(params, table)
          } else this.$message.warning(flag.message)
        }
      })
    },
    send(params, table) {
      const formData = new FormData()
      Object.keys(params).forEach(key => {
        formData.append(key, params[key])
      })
      table.forEach(e => {
        delete e.rowIndex
        delete e.syzt
        e.children.forEach(s => {
          delete s.syzt
        })
      })
      const tableData = JSON.stringify(table)
      formData.append('dossiers', tableData)
      const flag = this.verifyArr()
      if (flag.done) {
        if (!this.id) {
          this.$http.post('/bbReportXmController/add', formData).then(s => {
            this.$message.success('保存成功')
            this.$emit('refresh', s.data)
          }).catch(e => this.$message.error(e.message))
        } else {
          this.$http.post('/bbReportXmController/update', formData).then(s => {
            this.$message.success('修改成功')
            this.$emit('refresh', s.data)
          }).catch(e => this.$message.error(e.message))
        }
      } else this.$message.warning(flag.message)
    },
    getDacs(row) { // 获取参数data
      row.hx_param_ = ''
      if (Array.isArray(row)) {
        row.forEach(el => {
          this.$api.reportxm.getDacs({ hxId: el.hx_id_ }).then(s => {
            this.dacs = [...s.data]
          }).catch(e => this.$message.error(e.message))
        })
      } else {
        this.$api.reportxm.getDacs({ hxId: row.hx_id_ }).then(s => {
          this.dacs = [...s.data]
        }).catch(e => this.$message.error(e.message))
      }
    },
    getData() { // 获取函数data
      if (this.form.hsIds.length) {
        const arr = []
        for (let i = 0, len = this.listFuction.length; i < len; i++) {
          if (this.form.hsIds.includes(this.listFuction[i].id)) {
            arr.push(this.listFuction[i])
          }
        }
        this.dadaData = [...arr]
      } else this.$message.warning('请选择函数')
    },
    getGlda() { // 获取关联档案下拉列表
      this.$api.reportxm.getGlda({ ztsn: '' }).then(s => {
        this.gldaData = [...s.data]
      }).catch(e => this.$message.error(e.message))
    },
    getListFunction() { // 获取函数下拉列表
      this.$api.reportxm.getListFunction().then(s => {
        this.listFuction = [...s.data]
      }).catch(e => this.$message.error(e.message))
    },
    normalizer(node) { // treeSelect组件数据重组
      if (node.children === [] || node.children === null) {
        delete node.children
      }
      let flag = false
      if (node.type === 'dossier' || node.type === 'tab' || node.type === 'kjkm') flag = false
      else flag = true
      return {
        ...node,
        isDisabled: !!flag
      }
    },
    inputValue(node) { // treeSelect组件获取数据改变
      if (Array.isArray(node)) {
        node.forEach(el => {
          this.$api.reportxm.getCols({ sn: el.dossier_sn_, type: el.dossier_type_ }).then(s => {
            this.obj = []
            const { data } = s.data
            data.forEach(e => {
              const obj = {}
              Object.keys(e).forEach(key => {
                obj.id = key
                obj.name = e[key]
              })
              this.$set(this.obj, this.obj.length, obj)
            })
            const obj = { ...this.obj }
            this.$set(this.gldazd, el.dossierId, obj)
          }).catch(e => this.$message.error(e.message))
        })
      }
      if (node === this.targetNode.id) {
        this.$api.reportxm.getCols({ sn: this.targetNode.icon, type: this.targetNode.type }).then(s => {
          this.$set(this.glTable.data, this.rowIndex, {
            dossierId: node,
            dossier_field_: '',
            dossier_sn_: this.targetNode.icon,
            dossier_type_: this.targetNode.type,
            dossierXsName: s.data.name_,
            dossierXssn: s.data.sn_,
            id: '',
            children: []
          })
          this.obj = []
          const { data } = s.data
          data.forEach(e => {
            const obj = {}
            Object.keys(e).forEach(key => {
              obj.id = key
              obj.name = e[key]
            })
            this.$set(this.obj, this.obj.length, obj)
          })
          const obj = { ...this.obj }
          this.$set(this.gldazd, node, obj)
        }).catch(e => this.$message.error(e.message))
      }
    },
    selectChange(node, row) { // treeSelect组件获取数据
      this.targetNode = node
    },
    tableRowHandler(type, scope) { // table事件
      const Deal = {
        gladd: () => {
          this.$set(this.glTable.data, this.glTable.data.length, {
            dossierId: null,
            dossier_field_: '',
            dossier_sn_: '',
            dossier_type_: '',
            dossierXsName: '',
            dossierXssn: '',
            children: [],
            id: ''
          })
          this.rowIndex = this.glTable.data.length - 1
        },
        gldel: () => {
          if (scope.row.syzt) this.$message.warning('当前数据已被量度使用 不能删除')
          else {
            this.glTable.data.splice(scope.$index, 1)
            this.rowIndex = this.glTable.data.length - 1
          }
        },
        daadd: () => {
          if (this.glTable.data.length) {
            this.$set(this.glTable.data[this.rowIndex].children, this.glTable.data[this.rowIndex].children.length, {
              dossier_sn_: this.targetNode.icon,
              dossier_type_: this.targetNode.type,
              hx_id_: '',
              hx_param_: '',
              id: ''
            })
          } else this.$message.warning('请先选择关联档案数据')
        },
        dadel: () => {
          const { rowIndex } = this
          if (scope.row.syzt) this.$message.warning('当前数据已被使用，不可删除')
          else this.glTable.data[rowIndex].children.splice(scope.$index, 1)
        }
      }
      Deal[type]()
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  display: flex;
  justify-content: space-between;
}
.span {
  padding: 0 5px;
  display: inline-block;
  margin: 5px 0;
}
.glda {
  width: calc(100% - 40%);
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-right: 10px;
}
.dagx {
  width: calc(100% - 60%);
  border: 1px solid #ddd;
  border-radius: 5px;
}
.vue-treeselect {
  position: absolute!important;
  top: 0px;
  left: 3px;
}
</style>
