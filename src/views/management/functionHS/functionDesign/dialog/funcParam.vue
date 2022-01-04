<template>
  <div>
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :model="false"
      width="60%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="closeDialog"
    >
      <div slot="title">
        {{ usn ? '编辑' : '新增' }}函数参数
      </div>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="mini"
        label-width="80px"
      >
        <div>
          <div class="name">
            <el-form-item label="参数名称" prop="name" style="width: 45%">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="中文名称" prop="chineseName" style="width: 45%">
              <el-input v-model="form.chineseName" />
            </el-form-item>
          </div>
          <div class="and">
            <el-form-item label="字段型" prop="columnType">
              <el-checkbox v-model="form.columnType" />
            </el-form-item>
            <el-form-item v-if="form.columnType" label="参数关系" prop="relationNext">
              <el-select v-model="form.relationNext">
                <el-option
                  v-for="i in csData"
                  :key="i"
                  :label="i"
                  :value="i"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="排序" prop="orderBy" class="orderBy">
              <el-input v-model="form.orderBy" type="number" min="1" size="mini" />
            </el-form-item>
          </div>
        </div>
        <el-form-item label="参数说明" prop="desc">
          <el-input v-model="form.desc" type="textarea" />
        </el-form-item>
      </el-form>
      <div v-if="form.columnType" class="andTable">
        <el-table
          ref="andData"
          :data="andData"
          style="width:100%"
          height="300"
          size="mini"
          @selection-change="selectChageAndData"
        >
          <el-table-column type="selection" width="30" />
          <el-table-column label="序号" type="index" width="50" />
          <el-table-column label="字段" prop="">
            <template slot-scope="scope">
              <el-select v-model="scope.row.field" size="mini">
                <el-option
                  v-for="i in fieldData"
                  :key="i.field"
                  :label="i.field"
                  :value="i.field"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="标题">
            <template slot-scope="scope">
              <el-input v-model="scope.row.title" size="mini" />
            </template>
          </el-table-column>
          <el-table-column label="操作符">
            <template slot-scope="scope">
              <el-select v-model="scope.row.czf" size="mini">
                <el-option v-for="i in czfList" :key="i" :label="i" :value="i" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="传入值类型">
            <template slot-scope="scope">
              <el-select v-model="scope.row.afferentType" size="mini" @change="e => navchange(e, scope.row)">
                <el-option v-for="i in afferentTypeData" :key="i.value" :label="i.label" :value="i.value" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="具体传入值">
            <template slot-scope="scope">
              <el-select v-if="scope.row.afferentType === 'fixed'" v-model="scope.row.specificData" size="mini">
                <el-option v-for="it in specificDataList" :key="it.value" :label="it.label" :value="it.value" />
              </el-select>
              <el-button v-else size="mini" type="info" @click.native="tableRowHandler('andType', scope)">
                {{ scope.row.afferentType === 'enum' ? '枚举选值' : 'sql选值' }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="导航框">
            <template slot-scope="scope">
              <el-select v-if="scope.row.afferentType === 'fixed'" v-model="scope.row.navigation" size="mini">
                <el-option v-for="i in navigationList" :key="i.value" :label="i.label" :value="i.value" />
              </el-select>
              <span v-else>{{ getNavigation1(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="日期类型">
            <template v-if="scope.row.navigation === 'date'" slot-scope="scope">
              <el-select v-model="scope.row.dateType" size="mini">
                <el-option v-for="i in dateTypeList" :key="i.value" :label="i.label" :value="i.value" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="必填">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.must"
                inactive-text="否"
                active-text="是"
                active-color="#4390ee"
              />
            </template>
          </el-table-column>
          <el-table-column label="字段关系">
            <template slot-scope="scope">
              <el-select v-model="scope.row.paramRelation" size="mini">
                <el-option v-for="i in csData" :key="i" :label="i" :value="i" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot="header">
              <span style="padding-right:10px;">操作</span>
              <el-button
                type="text"
                size="small"
                icon="el-icon-circle-plus"
                title="添加"
                @click="tableRowHandler('andTableAdd')"
              />
            </template>
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                icon="el-icon-delete"
                title="删除"
                @click="tableRowHandler('andTableDel', scope)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else>
        <el-table
          ref="tableData"
          :data="tableData"
          style="width:100%"
          height="300"
          size="mini"
          @selection-change="selectChage"
        >
          <el-table-column type="selection" width="30" />
          <el-table-column label="序号" type="index" width="50" />
          <el-table-column label="选择类型">
            <template slot-scope="scope">
              <el-select v-model="scope.row.type" size="mini">
                <el-option v-for="i in typeList" :key="i.value" :label="i.label" :value="i.value" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="中文名称">
            <template slot-scope="scope">
              <el-input v-model="scope.row.chineseName" size="mini" />
            </template>
          </el-table-column>
          <el-table-column label="具体传入值">
            <template slot-scope="scope">
              <el-select v-model="scope.row.specificValue" size="mini">
                <el-option v-for="i in specificValueList" :key="i.value" :label="i.label" :value="i.value" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="导航框" prop="navigation">
            <template slot-scope="scope">
              {{ getNavigation(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot="header">
              <span style="padding-right:10px;">操作</span>
              <el-button
                type="text"
                size="small"
                icon="el-icon-circle-plus"
                title="添加"
                @click="tableRowHandler('tableDataAdd')"
              />
            </template>
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                icon="el-icon-delete"
                title="删除"
                @click="tableRowHandler('tableDataDel', scope)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer">
        <el-button type="info" size="mini" @click="closeDialog">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="save">
          确定
        </el-button>
      </div>
    </el-dialog>
    <SetEnum
      v-if="setEnum.show"
      :show.sync="setEnum.show"
      :row="row"
      @update="setParam"
    />
    <SetSql
      v-if="setSql.show"
      :show.sync="setSql.show"
      :row="row"
      :ds-sn="dsSn"
      @update="setParam"
    />
  </div>
</template>

<script>
export default {
  name: 'FuncParam',
  components: {
    SetEnum: () => import('./setEnum'),
    SetSql: () => import('./setSql')
  },
  props: {
    fieldData: {
      type: Array,
      default: () => []
    },
    show: {
      type: Boolean,
      default: false
    },
    usn: {
      type: String,
      default: ''
    },
    dsSn: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const validatorName = (rule, value, callback) => {
      const reg = /[a-zA-Z]/
      const reg2 = /^[0-9A-Za-z]{1,20}$/
      if (!value) return callback(new Error('参数名称不能为空'))
      if (!reg.test(value.charAt(0))) return callback(new Error('参数名称必须以字母开头'))
      if (!reg2.test(value)) return callback(new Error('参数名称由1-20位数字和字母组成且必须以字母开头'))
      return callback()
    }
    return {
      form: {
        name: '',
        chineseName: '',
        columnType: true,
        relationNext: 'AND',
        orderBy: 1,
        desc: ''
      },
      rules: {
        name: [{ required: true, validator: validatorName, trigger: 'blur' }],
        chineseName: [{ required: true, message: '请输入中文名称', trigger: 'blur' }],
        relationNext: [{ required: true, message: '请选择参数关系', trigger: 'change' }],
        orderBy: [{ required: true, message: '请填写序号', trigger: 'blur' }]
      },
      andData: [], // 有参数关系时
      tableData: [], // 没有车参数关系时
      csData: ['AND', 'OR'], // 参数关系
      czfList: ['=', '>', '<', '>=', '<=', 'in', 'like'], // 操作符
      afferentTypeData: [ // 传入值类型
        { label: '固定值', value: 'fixed' }, { label: 'sql', value: 'sql' }, { label: '枚举', value: 'enum' }
      ],
      specificDataList: [{ label: '手工输入', value: 'sgsr' }, { label: '系统预置', value: 'xtyz' }], // 具体传入值
      navigationList: [ // 导航
        { label: '数字输入框', value: 'number' },
        { label: '普通输入框', value: 'text' },
        { label: '时间输入框', value: 'time' },
        { label: '日期输入框', value: 'date' }
      ],
      dateTypeList: [
        { label: 'yyyy', value: 'yyyy' },
        { label: 'yyyyMM', value: 'yyyyMM' },
        { label: 'yyyyMMdd', value: 'yyyyMMdd' },
        { label: 'yyyy-MM', value: 'yyyy-MM' },
        { label: 'yyyy-MM-dd', value: 'yyyy-MM-dd' },
        { label: 'yyyy/MM', value: 'yyyy/MM' },
        { label: 'yyyy/MM/dd', value: 'yyyy/MM/dd' }
      ],
      typeList: [{ label: 'dataBase', value: 'dataBase' }], // 选择类型
      specificValueList: [
        { label: '参数', value: 'param', navigation: '输入框' },
        { label: '实例', value: 'example', navigation: '下拉框' }
      ],
      setEnum: { // 设置枚举
        show: false
      },
      copyDate: [],
      setSql: { // 设置sql
        show: false
      },
      row: {} // 行数据
    }
  },
  computed: {
    getNavigation1() {
      return row => {
        const { afferentType, id } = row
        const nav = afferentType === 'sql' ? '对话框' : '下拉框'
        this.$set(this.andData[this.andData.findIndex(l => l.id === id)],
          'navigation',
          nav)
        return nav
      }
    },
    getNavigation() {
      return val => {
        const { specificValue, id } = val
        const { navigation } = this.specificValueList.filter(
          l => l.value === specificValue
        )[0]
        this.$set(this.tableData[this.tableData.findIndex(l => l.id === id)],
          'navigation',
          navigation)
        return navigation
      }
    }
  },
  watch: {
    item: {
      immediate: true,
      handler(val) {
        if (Object.keys(val).length) {
          const {
            id, chineseName, columnType, desc, name, orderBy, relationNext, tableList
          } = val
          Object.assign(this.form, {
            id,
            chineseName,
            columnType,
            desc,
            name,
            orderBy,
            relationNext
          })
          columnType ? this.andData = tableList : this.tableData = tableList
          columnType
            ? this.copyDate = JSON.parse(JSON.stringify(this.andData))
            : this.copyDate = JSON.parse(JSON.stringify(this.tableData))
        }
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('restore', {
        data: this.copyDate,
        id: this.item.id
      })
      this.$emit('update:show', false)
    },
    navchange(e, row) {
      if (e === 'fixed') {
        this.$set(this.andData[this.andData.findIndex(L => L.id === row.id)], 'navigation', 'text')
      }
    },
    setParam(obj) {
      const { id, children } = obj
      const index = this.andData.findIndex(l => l.id === id)
      this.$set(this.andData[index], 'children', children)
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = { ...this.form }
          const tableList = params.columnType ? this.andData : this.tableData
          const result = params.columnType ? this.verifyAndData() : this.verifyTableData()
          if (result.flag) {
            if (this.$parent.paramData.some(e => e.name === params.name && e.id !== params.id)) {
              this.$message.warning('参数名称已存在')
            } else {
              const json = {
                id: this.usn ? this.row.id : Math.random(),
                ...params,
                tableList
              }
              this.$emit('update', json)
              this.$emit('update:show', false)
            }
          } else this.$message.warning(result.message)
        }
      })
    },
    verifyAndData() {
      const { andData } = this
      const result = {
        message: '验证成功',
        flag: true
      }
      const obj = {}
      for (let i = 0, len = andData.length; i < len; i++) {
        // console.log(andData[i])
        if (andData[i].title === '') {
          result.flag = false
          result.message = `第${i + 1}行数据填写不完整`
          break
        }
        if (obj[andData[i].field + andData[i].title]) {
          result.flag = false
          result.message = `第${i + 1}行字段标题填写重复`
          break
        } else {
          obj[andData[i].field + andData[i].title] = true
        }
        if (andData[i].navigation === 'date' && !andData[i].dateType) {
          result.flag = false
          result.message = `第${i + 1}行日期类型不能为空`
          break
        }
        if (
          andData[i].afferentType === 'sql'
          && (Object.keys(andData[i].children).length === 0
          || Object.prototype.toString.call(andData[i].children) !== '[object Object]')
        ) {
          result.flag = false
          result.message = `第${i + 1}行请设置sql选值`
          break
        }
        if (
          andData[i].afferentType === 'enum'
          && (Object.keys(andData[i].children).length === 0
          || Object.prototype.toString.call(andData[i].children) === '[object Object]')
        ) {
          result.flag = false
          result.message = `第${i + 1}行请设置枚举选值`
          break
        }
        if (
          this.$parent.addPa.oldCanShuData.length
          && this.$parent.addPa.oldCanShuData.some(
            l => `${l.name}${l.chineseName}` === `${andData[i].field}${andData[i].title}`
          )
        ) {
          result.flag = false
          result.message = `第${i + 1}字段+标题与原始参数重复`
          break
        }
      }
      return result
    },
    verifyTableData() {
      const { tableData } = this
      const result = {
        message: '验证成功',
        flag: true
      }
      const obj = {}
      for (let i = 0, len = tableData.length; i < len; i++) {
        if (tableData[i].chineseName === '') {
          result.flag = false
          result.message = `第${i + 1}行数据填写不完整`
          break
        }
        if (obj[tableData[i].chineseName + tableData[i].type]) {
          result.flag = false
          result.message = `第${i + 1}行选择类型中文名称填写重复`
          break
        } else {
          obj[tableData[i].chineseName + tableData[i].type] = true
        }
      }
      return result
    },
    tableRowHandler(type, scope) {
      const DEAL = {
        andTableDel: () => {
          this.andData.splice(scope.$index, 1)
        },
        andTableAdd: () => {
          this.$set(this.andData, this.andData.length, {
            id: Math.random(),
            field: this.fieldData.length ? this.fieldData[0].field : '',
            title: '',
            czf: '=',
            afferentType: 'fixed',
            specificData: 'sgsr',
            navigation: 'text',
            must: true,
            paramRelation: 'AND',
            children: {}
          })
        },
        tableDataAdd: () => {
          this.$set(this.tableData, this.tableData.length, {
            id: Math.random(),
            type: 'dataBase',
            chineseName: '数据库',
            specificValue: 'param',
            navigation: '',
            children: {}
          })
        },
        tableDataDel: () => {
          this.tableData.splice(scope.$index, 1)
        },
        andType: () => {
          this.row = scope.row
          if (scope.row.afferentType === 'sql') {
            this.setSql.show = true
          } else if (scope.row.afferentType === 'enum') {
            this.setEnum.show = true
          }
        }
      }
      DEAL[type]()
    },
    selectChageAndData(select) {
      // console.log(select)
    },
    selectChage(select) {
      // console.log(1, select)
    }
  }
}
</script>

<style lang="scss" scoped>
.name {
  display: flex;
  justify-content: space-between;
}
.and {
  display: flex;
  justify-content: space-between;
}
</style>
