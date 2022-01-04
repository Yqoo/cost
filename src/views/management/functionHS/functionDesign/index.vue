<template>
  <div>
    <LeftWorkbench ref="leftWorkbench" :width="width" title="函数设计" class="left" :additional="0">
      <div slot="tree" class="left_list">
        <ul>
          <li v-tooltip="functionDesc.dsId">
            原型数据库： {{ functionDesc.dsId }}
          </li>
          <li v-tooltip="functionDesc.name">
            函数名称： {{ functionDesc.name }}
          </li>
          <li v-tooltip="functionDesc.chineseName">
            中文名称： {{ functionDesc.chineseName }}
          </li>
          <li>
            返回类型：
            {{ functionDesc.returnDataType === '2' ?
              '多值' :
              (functionDesc.returnDataType === '1' ? '单值' : functionDesc.returnDataType) }}
          </li>
          <li v-tooltip="functionDesc.flSnAndName">
            所属分类： {{ functionDesc.flSnAndName }}
          </li>
          <li v-tooltip="functionDesc.describ">
            参数说明： {{ functionDesc.describ }}
          </li>
        </ul>
      </div>
    </LeftWorkbench>
    <MiddleDrag :margin-top="middleDragTop" @hook:mounted="getTop" @move="move" />
    <RightWorkbench :margin-left="width" class="right" :additional="0">
      <ToolsBar
        slot="toolsBar"
        module-name="FunctionCenter"
        :items="btns"
        class="toolsBar"
        @btnsHandler="btnsHandler"
      />
      <section slot="table" class="section">
        <div class="section_step">
          <el-steps space="12.5%">
            <el-step v-for="e in steps" :key="e" :title="e.split('*')[0]" :icon="'iconfont icon-'+e.split('*')[1]" />
          </el-steps>
        </div>
        <section>
          <div class="cont-left">
            <div class="sql-cont">
              <div class="sql-deta" :class="sqlHeight">
                <div class="sql-code">
                  <ul class="sql-title">
                    <li @click="doAction('database')">
                      <i class="el-icon-coin" style="color:#0089ff" />数据库
                    </li>
                    <li @click="doAction('yanz')">
                      <i class="el-icon-finished" style="color:#0089ff" />验证
                    </li>
                    <li @click="doAction('zhix')">
                      <i class="el-icon-document-checked" style="color:#fd4c09" />执行
                    </li>
                    <li @click="doAction('meih')">
                      <i class="el-icon-magic-stick" style="color:#78cc09" />美化
                    </li>
                  </ul>
                  <div class="sql-codemirror">
                    <codemirror
                      ref="cmCode"
                      v-model="sql"
                      :options="cmOption"
                      class="code-mirror"
                    />
                  </div>
                </div>
                <div class="sql-primitive">
                  <p class="add-param">
                    <span>原始参数</span>
                    <i class="el-icon-circle-plus-outline" @click="doAction('addFunc')" />
                  </p>
                  <ul class="param-list">
                    <li v-for="e in addPa.oldCanShuData" :key="e.name">
                      <i class="iconfont icon-yuanshics" />
                      <div><p>{{ e.name }}</p><p>{{ e.chineseName }}</p></div>
                      <div class="btns">
                        <i class="el-icon-edit" title="编辑" @click="doAction('edit', e)" />
                        <i class="el-icon-delete" title="删除" @click="doAction('del', e)" />
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <p class="sql-res">
                <span>SQL结果</span>
                <span class="colla-btns">
                  <i v-show="sqlHeight!=='big'" class="el-icon-arrow-up" title="展开" @click="collapseSQL('top')" />
                  <i v-show="sqlHeight!=='none'" class="el-icon-arrow-down" title="收缩" @click="collapseSQL('bottom')" />
                </span>
              </p>
              <div class="sql-result" :class="sqlHeight">
                <el-table
                  v-if="!table.isErr"
                  ref="sqlTable"
                  border
                  :data="table.data"
                  height="100%"
                  style="width: 100%"
                  size="mini"
                >
                  <el-table-column v-if="table.data.length !== 0" type="index" width="40" />
                  <el-table-column
                    v-for="e in table.columns"
                    :key="e + Math.random()"
                    :label="e"
                    :prop="e"
                    :show-overflow-tooltip="true"
                  />
                </el-table>
                <div v-if="table.isErr" class="table-error">
                  <span>{{ table.errorMessge }}</span>
                </div>
                <p class="tips" :style="{'background':tips.color}">
                  <i :class="tips.icon" style="margin-right:5px;" />
                  <span>{{ tips.tip }}</span>
                  <span v-show="tips.showNum" class="return-res">返回值{{ tips.num }}行</span>
                </p>
              </div>
            </div>
          </div>
          <div class="cont-right">
            <el-tabs v-model="activeName">
              <el-tab-pane label="SQL 字段" name="sql">
                <el-tree
                  ref="tree"
                  class="tree"
                  :data="tree.data"
                  node-key="field"
                  :props="tree.props"
                  default-expand-all
                  show-checkbox
                  :default-checked-keys="tree.defaultCheck"
                  :highlight-current="true"
                  :check-strictly="true"
                  @check="handleCheckChange"
                  @check-change="checkChange"
                >
                  <span slot-scope="{node, data}" class="custom-tree-node">
                    <span class="tree-data" :title="data.field + data.type">{{ data.field }}{{ data.type }}</span>
                    <span v-if="node.level !== 1" class="tree-btn">
                      <el-input
                        v-show="returnDataType !== '单值' && node.checked"
                        v-model="data.sort"
                        v-tooltip="data.sort"
                        class="data-num"
                        size="mini"
                        @change="regSort(data.sort)"
                      />
                      <i
                        class="el-icon-edit"
                        title="编辑"
                        style="color:#67C23A"
                        @click="doAction('editSqlParams', data)"
                      />
                    </span>
                  </span>
                </el-tree>
                <div class="tree-info">
                  <p>当前返回类型为： {{ returnDataType }}</p>
                  <div>
                    <p>具体返回值为： </p>
                    <ul class="tree-list">
                      <li v-for="e in tree.paramList" :key="e.field">
                        {{ e.field }},
                        {{ getParamInfo(e) }}
                      </li>
                    </ul>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="函数参数" name="param">
                <span slot="label">函数参数 <i class="el-icon-circle-plus-outline" @click="doAction('addParam')" /></span>
                <ul class="param-list func-list">
                  <li v-for="item in paramData" :key="item.name">
                    <i class="iconfont icon-kemuye" />
                    <div><p>{{ item.name }}</p><p>{{ item.chineseName }}</p></div>
                    <div class="btns">
                      <span class="relation">{{ item.columnType ? item.relationNext : '' }}</span>
                      <i class="el-icon-edit" title="编辑" @click="doAction('editParam',item)" />
                      <i class="el-icon-delete" title="删除" @click="doAction('delParam', item)" />
                    </div>
                    <ul v-if="item.columnType" class="func-param-list">
                      <li v-for="i in item.tableList" :key="i.id">
                        <span>
                          <i class="el-icon-tickets tree-icon" />
                          <span>{{ i.field }} | {{ i.title }} {{ i.czf }} {{ getAfferentType(i.afferentType) }}</span>
                        </span>
                        <span>{{ getNavigation(i.navigation) }}</span>
                        <span>{{ i.paramRelation }}</span>
                      </li>
                    </ul>
                  </li>
                </ul>
              </el-tab-pane>
            </el-tabs>
          </div>
        </section>
      </section>
    </RightWorkbench>
    <Database
      v-if="database.show"
      :show.sync="database.show"
      :tip="slogan"
      :base="dsSn"
      @dsId="dsId"
    />
    <Function
      v-if="addPa.show"
      :show.sync="addPa.show"
      :usn="addPa.usn"
      :data="addPa.oldCanShuData"
      @refshData="refshData"
    />
    <SqlParam
      v-if="sqlParam.show"
      :show.sync="sqlParam.show"
      :data="sqlParam.data"
      @refshSqlParam="refshSqlParam"
    />
    <ZhixSql
      v-if="zhixSql.show"
      :show.sync="zhixSql.show"
      :func-desc="functionDesc"
    />
    <FuncParam
      v-if="funcParam.show"
      :show.sync="funcParam.show"
      :usn="funcParam.usn"
      :item="funcParam.row"
      :field-data="tree.data[0].children"
      :ds-sn="dsSn"
      @update="getParam"
      @restore="restore"
    />
    <PreviewNav
      v-if="previewNav.show"
      :show.sync="previewNav.show"
      :ds-sn="dsSn"
      :func-desc="functionDesc"
      @update="getRultes"
    />
    <YzSql
      v-if="yzSql.show"
      :show.sync="yzSql.show"
      :form-arr="yzSql.formArr"
      @updateSql="updateSql"
    />
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'codemirror/mode//javascript/javascript.js'
import { format } from 'sql-formatter'
import './js/setting.js'

export default {
  name: 'FunctionDesign',
  components: {
    codemirror,
    Database: () => import('./dialog/database'),
    Function: () => import('./dialog/function'),
    SqlParam: () => import('./dialog/sqlParam'),
    ZhixSql: () => import('./dialog/zhixSql'),
    FuncParam: () => import('./dialog/funcParam'),
    PreviewNav: () => import('./dialog/previewNav'),
    YzSql: () => import('./dialog/yzSql')
  },
  data() {
    return {
      paramData: [], // 函数参数
      returnDataType: '',
      tree: { // sql字段
        data: [],
        props: {
          label: 'field',
          children: 'children'
        },
        defaultCheck: [],
        paramList: [] // 具体返回值
      },
      copyTreeData: [],
      activeName: 'sql',
      sqlHeight: '', // 控制收缩
      width: 300,
      middleDragTop: this.width,
      oldData: {}, // 路由获取数据
      functionDesc: {},
      activeStep: 1,
      steps: [
        '链接原型数据库*yanzheng',
        '定义SQL语句*sql',
        '添加原始参数*yuanshics',
        '配置返回值*zhixing',
        '配置函数参数*kemuye',
        '检查函数*jianchahanshu',
        '预览函数导航*yulandaohang',
        '数据验证*shujuyanzheng'
      ],
      sql: '',
      cmOption: { // sql编辑器配置
        tabSize: 2, // tab
        styleActiveLine: true, // 高亮选中行
        lineNumbers: true, // 显示行号
        styleSelectedText: true,
        line: true,
        foldGutter: true, // 块槽
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true }, // 可以启用该选项来突出显示当前选中的内容的所有实例
        mode: 'text/x-mysql', // 模式, 可查看 codemirror/mode 中的所有模式
        hintOptions: { // 当匹配只有一项的时候是否自动补全
          completeSingle: false
        },
        keyMap: 'sublime', // 快捷键 可提供三种模式 sublime、emacs、vim
        matchBrackets: true,
        showCursorWhenSelecting: true,
        theme: 'base16-light', // 主题
        extraKeys: { Ctrl: 'autocomplete' }
      },
      addPa: { // 原始参数
        oldCanShuData: [],
        show: false,
        usn: '',
        data: {}
      },
      table: {
        isErr: false,
        data: [],
        isCheck: false, // 是否验证
        copySql: '', // 验证成功后记录sql
        errorMessge: '',
        columns: []
      },
      tips: {},
      slogan: '', // dialog title
      database: { // 数据库
        show: false
      },
      dsSn: '',
      sqlParam: { // sql字段
        show: false,
        data: {}
      },
      zhixSql: { // 执行
        show: false
      },
      funcParam: { // 函数参数
        show: false,
        usn: '',
        row: {}
      },
      verifySave: false, // 验证是否保存
      previewNav: {
        show: false
      },
      trueSort: true, // 判断输入的序号是否正确
      treeNode: {}, // sql字段node
      yzSql: {
        show: false,
        formArr: {}
      }
    }
  },
  computed: {
    getParamInfo() {
      return e => {
        const { returnType, field } = e
        // eslint-disable-next-line no-nested-ternary
        const type = returnType === 'string' ? '字符串' : returnType === 'num' ? '数字型' : '时间型'
        return `${field},${type}`
      }
    },
    getAfferentType() {
      // eslint-disable-next-line arrow-body-style
      return v => {
        // eslint-disable-next-line no-nested-ternary
        return v === 'fixed' ? '固定值' : (v === 'sql' ? 'sql选值' : '枚举选值')
      }
    },
    getNavigation() {
      // eslint-disable-next-line no-nested-ternary
      return d => (d === 'text' ? '普通输入框' : (d === 'number' ? '数字输入框' : (d === 'date' ? '日期输入框' : (d === 'time' ? '时间输入框' : d))))
    },
    btns() {
      return [
        { method: 'save', name: '保存', api: '/bbFunctionWorkController/updateById' },
        { method: 'inspect', name: '检查', api: '/bbFunctionWorkController/updateById' },
        { method: 'preview', name: '预览', api: '/bbFunctionWorkController/updateById' }
      ]
    }
  },
  beforeRouteEnter(to, from, next) {
    // const { params } = to
    if (to.params.param) {
      try {
        const { name } = JSON.parse(decodeURIComponent(to.params.param))
        to.meta.title = name || to.meta.title
        next()
      } catch (error) {
        next()
      }
      next()
    }
  },
  created() {
    const { param } = this.$route.params
    this.oldData = param && JSON.parse(decodeURIComponent(param))
    const { id } = this.oldData
    if (id) {
      this.$api.functionCenter.getFunctionDesc({ id }).then(s => {
        const {
          dsId, dataStr, oldCanShuData, returnData, returnDataStr, returnDataType, sqlParam
        } = s.data
        this.functionDesc = { ...s.data }
        this.dsSn = dsId
        this.sql = dataStr || ''
        this.table.copySql = dataStr || ''
        this.addPa.oldCanShuData = oldCanShuData ? JSON.parse(oldCanShuData) : []
        const check = returnData ? JSON.parse(returnData) : []
        this.tree.data = [{
          field: 'SQL字段',
          icon: 'baocun1',
          disabled: true,
          children: returnDataStr ? this.$tools.reduceArr(check.concat(JSON.parse(returnDataStr)), 'field') : []
        }]
        this.copyTreeData = returnDataStr ? JSON.parse(returnDataStr) : []
        // eslint-disable-next-line no-nested-ternary
        this.returnDataType = returnDataType === '2' ? '多值' : returnDataType === '1' ? '单值' : returnDataType
        this.tree.defaultCheck = check.map(e => e.field)
        this.table.isCheck = !this.tree.data.length
        this.tree.paramList = [...check]
        this.paramData = sqlParam ? JSON.parse(sqlParam) : []
      }).catch(e => this.$message.error(e.message))
    }
  },
  methods: {
    updateSql(obj) {
      let nweSql = this.sql
      nweSql = nweSql.replaceAll(/{{\s+/g, '{{')
      nweSql = nweSql.replaceAll(/\s+}}/g, '}}')
      Object.keys(obj).forEach(k => {
        const ok = k.trim()
        if (nweSql.indexOf(ok) > -1) {
          nweSql = nweSql.replaceAll(`{{${ok}}}`, obj[k])
        }
      })
      this.verifySql(nweSql)
    },
    checkChange(data, node) {
      if (this.checkStatus) this.$refs.tree.setChecked(data, true)
    },
    getRultes(item) { // 预览导航获取结果
      const formData = new FormData()
      formData.append('fdParam', item)
      this.$http.post('/bbFunctionWorkController/getFunctionData', formData).then(s => {
        this.table.columns = s.data ? [...s.data.bt] : []
        this.table.data = s.data ? [...s.data.data] : []
        this.table.isErr = false
        this.tips = {
          tip: '查询已成功执行', icon: 'el-icon-success', color: '#bcff9a', showNum: true, num: this.table.data.length
        }
      }).catch(e => {
        this.table.data = []
        this.table.errorMessge = e.message
        this.table.isErr = true
        this.tips = {
          icon: 'el-icon-error', color: '#ff9a9a', showNum: false, tip: '查询失败'
        }
      })
    },
    restore(val) { // 函数参数取消后刷新
      if (this.paramData.length && val.id) {
        this.$set(this.paramData[this.paramData.findIndex(l => l.id === val.id)], 'tableList', val.data)
      }
    },
    getParam(data) { // 函数参数修改后刷新
      const { id } = data
      const index = this.paramData.findIndex(d => d.id === id)
      if (index !== -1) {
        this.$set(this.paramData, index, data)
      } else this.paramData.push(data)
      this.paramData = this.paramData.sort((a, b) => a.orderBy - b.orderBy)
    },
    refshSqlParam(data) { // sql字段修改后刷新
      this.checkStatus = true
      const index = this.tree.data[0].children.findIndex(l => l.field === data.field)
      this.$set(this.tree.data[0].children, index, data)
      this.$refs.tree.setChecked(data, true)
      this.$nextTick(() => {
        this.checkStatus = false
      })
    },
    regSort(node) { // 判断sql排序
      const reg = /^[1-9]\d*$/
      if (reg.test(node)) this.trueSort = true
      else {
        this.trueSort = false
        this.$message.warning('请输入正确的序号（序号只能为数字）')
      }
    },
    handleCheckChange(node, info) {
      if (this.returnDataType === '单值') {
        this.$refs.tree.setCheckedKeys([])
        const arr = info.checkedKeys.includes(node.field) ? [node.field] : []
        this.$refs.tree.setCheckedKeys(arr)
        this.tree.paramList = info.checkedNodes.filter(l => l.field === node.field)
      } else {
        this.tree.paramList = [...info.checkedNodes]
        const arr = this.$refs.tree.getCheckedNodes()
        const index = arr.filter(l => l !== node && l.sort).map(e => e.sort).sort((a, b) => b - a)[0]
        this.$set(node, 'sort', index + 1 || 1)
      }
    },
    dsId(obj) { // 数据库
      const { dsId } = obj
      this.dsSn = dsId
    },
    refshData(arr) { // 原始参数
      this.addPa.oldCanShuData = [...arr]
    },
    collapseSQL(tag) { // 收缩sql盒子
      if (tag === 'top' && this.sqlHeight === '') {
        this.sqlHeight = 'big'
      } else if ((tag === 'bottom' && this.sqlHeight === 'big') || (tag === 'top' && this.sqlHeight === 'none')) {
        this.sqlHeight = ''
      } else if (tag === 'bottom' && this.sqlHeight === '') {
        this.sqlHeight = 'none'
      }
    },
    verifySql(sql) { // 验证sql
      const params = { dsSn: this.dsSn, sql }
      this.$api.functionCenter.verifyFunc(params).then(s => {
        this.table.isCheck = false
        this.table.copySql = this.sql
        this.table.errorMessge = ''
        this.table.isErr = false
        const arr = s.data || []
        this.copyTreeData = [...s.data]
        // eslint-disable-next-line no-shadow
        this.table.columns = arr.map(s => (s.chineseName ? s.chineseName : s.field))
        this.tree.data = [{
          field: 'SQL字段',
          icon: 'baocun1',
          disabled: true,
          children: arr.map(e => ({
            ...e,
            sort: ''
          }))
        }]
        this.tree.defaultCheck = []
        this.tips = {
          tip: '验证成功', icon: 'el-icon-success', color: '#bcff9a', showNum: false
        }
      }).catch(e => {
        this.$message.error(e.message)
        this.table.errorMessge = e.message
        this.table.isErr = true
        this.table.isCheck = true
        this.fieldList = []
        this.tips = {
          icon: 'el-icon-error', color: '#F56C6C', showNum: false, tip: '验证失败'
        }
      })
    },
    doAction(type, item) {
      const DEAL = {
        database: () => { // 选择数据库
          this.database.show = true
          this.slogan = '数据库'
        },
        yanz: () => { // 验证
          let newSql = this.sql
          const arr = []
          while (newSql.indexOf('#') > -1) {
            const index = newSql.indexOf('#')
            newSql = newSql.substring(index)
            if (newSql.indexOf('}}') > -1) {
              const index1 = newSql.indexOf('}}')
              let param = newSql.substring(0, index1 + 2)
              if (param.indexOf('{{') > -1) {
                const index2 = newSql.indexOf('{{')
                param = param.substring(index2 + 2)
              }
              newSql = newSql.replaceAll(param, '')
              let param1 = param
              if (param1.indexOf('}}') > -1) {
                const index3 = param1.indexOf('}}')
                param1 = param1.substring(0, index3)
              }
              if (param1.indexOf('{{') > -1) {
                const index4 = param1.indexOf('{{')
                param1 = param1.substring(index4 + 2)
              }
              arr.push(param1)
            } else {
              this.$message.warning('sql语句不正确')
              break
            }
          }
          if (arr.length) {
            this.yzSql.show = true
            this.yzSql.formArr = [...arr]
          } else this.verifySql(this.sql)
        },
        zhix: () => { // 执行
          const { id } = this.functionDesc
          const checkNodes = this.$refs.tree.getCheckedNodes()
          const returnData = checkNodes.sort((a, b) => a.sort - b.sort).map((i, k) => { i.sort = k + 1; return i })
          if (this.table.isCheck || (this.table.isCheck && this.table.copySql !== this.sql)) {
            this.$message.warning('sql语句还未进行验证')
          } else if (returnData.length === 0) {
            this.$message.warning('请先勾选sql字段')
          } else if (this.addPa.oldCanShuData.length !== 0) {
            const params = {
              id,
              dataStr: this.sql,
              oldCanShuData: JSON.stringify(this.addPa.oldCanShuData),
              returnData: JSON.stringify(returnData),
              returnDataStr: JSON.stringify(this.copyTreeData),
              sqlParam: JSON.stringify(this.paramData)
            }
            const formData = new FormData()
            Object.keys(params).forEach(k => {
              formData.append(k, params[k])
            })
            this.$http.post('/bbFunctionWorkController/updateById', formData).then(s => {
              this.zhixSql.show = true
              // this.previewNav.show = true
            }).catch(e => {
              this.$message.error(e.message)
            })
          } else this.execute()
        },
        addFunc: () => { // 原始参数新增
          this.addPa.show = true
          this.addPa.usn = ''
        },
        meih: () => { // 美化
          const value = format(this.sql).replace(/\{\s*\{/gi, '{{').replace(/\}\s*\}/gi, '}}')
          this.$refs.cmCode.codemirror.setValue(value)
        },
        edit: () => { // 原始参数修改
          this.addPa.show = true
          this.addPa.usn = item.id.toString()
        },
        del: () => { // 原始参数删除
          this.$confirm('当前操作将会删除选中数据，是否继续？', '删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.addPa.oldCanShuData = this.addPa.oldCanShuData.filter(l => l.id !== item.id)
          }).catch(e => e)
        },
        editSqlParams: () => { // 修改sql字段
          this.sqlParam.show = true
          this.sqlParam.data = item
        },
        addParam: () => { // 新增函数参数
          this.funcParam.show = true
          this.funcParam.usn = ''
          this.funcParam.row = {}
        },
        editParam: () => { // 修改函数参数
          this.funcParam.show = true
          this.funcParam.usn = item.id.toString()
          this.funcParam.row = item
        },
        delParam: () => { // 删除函数参数
          this.paramData = this.paramData.filter(l => l.id !== item.id)
        }
      }
      DEAL[type]()
    },
    execute(arr = []) { // 执行
      const param = JSON.stringify(arr)
      const json = { dsSn: this.dsSn, sql: this.sql, param }
      const checkNodes = this.$refs.tree.getCheckedNodes()
      const returnData = checkNodes.sort((a, b) => a.sort - b.sort).map((i, k) => { i.sort = k + 1; return i })
      this.$api.functionCenter.executeFunc(json).then(s => {
        this.table.data = s.data ? [...s.data] : []
        this.table.columns = returnData.map(l => l.field || l.chineseName)
        this.table.isErr = false
        this.tips = {
          tip: '查询已成功执行', icon: 'el-icon-success', color: '#bcff9a', showNum: true, num: this.table.data.length
        }
      }).catch(e => {
        this.table.data = []
        this.table.errorMessge = e.message
        this.table.isErr = true
        this.tips = {
          icon: 'el-icon-error', color: '#ff9a9a', showNum: false, tip: '查询失败'
        }
      })
    },
    btnsHandler(met) { // toolsBar点击
      const DEAL = {
        save: () => { // 保存
          const { id } = this.functionDesc
          if (this.sql !== this.table.copySql) this.$message.warning('请先验证sql语句')
          else if (this.tree.data.length === 0) {
            this.$message.warning('请先验证获取, 获取返回字段')
          } else if (!this.trueSort) {
            this.$message.warning('请输入正确的序号（序号只能为数字）')
          } else {
            const checkNodes = this.$refs.tree.getCheckedNodes()
            const returnData = checkNodes.sort((a, b) => a.sort - b.sort).map((i, k) => { i.sort = k + 1; return i })
            if (returnData.length === 0) this.$message.warning('请选择SQL字段')
            else {
              const params = {
                id,
                dataStr: this.sql,
                oldCanShuData: JSON.stringify(this.addPa.oldCanShuData),
                returnData: JSON.stringify(returnData),
                returnDataStr: JSON.stringify(this.copyTreeData),
                sqlParam: JSON.stringify(this.paramData)
              }
              const formData = new FormData()
              Object.keys(params).forEach(k => {
                formData.append(k, params[k])
              })
              this.$http.post('/bbFunctionWorkController/updateById', formData).then(s => {
                this.$message.success('保存成功')
              }).catch(e => {
                this.$message.error(e.message)
              })
            }
          }
        },
        inspect: () => { // 检查
          const { id } = this.functionDesc
          if (this.sql !== this.table.copySql) this.$message.warning('请先验证sql语句')
          else if (this.tree.data.length === 0) {
            this.$message.warning('请先验证获取, 获取返回字段')
          } else if (!this.trueSort) {
            this.$message.warning('请输入正确的序号（序号只能为数字）')
          } else {
            const checkNodes = this.$refs.tree.getCheckedNodes()
            const returnData = checkNodes.sort((a, b) => a.sort - b.sort).map((i, k) => { i.sort = k + 1; return i })
            if (returnData.length === 0) this.$message.warning('请选择SQL字段')
            else {
              const params = {
                id,
                dataStr: this.sql,
                oldCanShuData: JSON.stringify(this.addPa.oldCanShuData),
                returnData: JSON.stringify(returnData),
                returnDataStr: JSON.stringify(this.copyTreeData),
                sqlParam: JSON.stringify(this.paramData)
              }
              const formData = new FormData()
              Object.keys(params).forEach(k => {
                formData.append(k, params[k])
              })
              this.$http.post('/bbFunctionWorkController/updateById', formData).then(s => {
                this.$api.functionCenter.checkFunc({ id }).then(l => {
                  this.$message.success(l.data)
                }).catch(e => this.$message.error(e.message))
              }).catch(e => {
                this.$message.error(e.message)
              })
            }
          }
        },
        preview: () => { // 预览
          const { id } = this.functionDesc
          if (this.sql !== this.table.copySql) this.$message.warning('请先验证sql语句')
          else if (this.tree.data.length === 0) {
            this.$message.warning('请先验证获取, 获取返回字段')
          } else if (!this.trueSort) {
            this.$message.warning('请输入正确的序号（序号只能为数字）')
          } else {
            const checkNodes = this.$refs.tree.getCheckedNodes()
            const returnData = checkNodes.sort((a, b) => a.sort - b.sort).map((i, k) => { i.sort = k + 1; return i })
            if (returnData.length === 0) this.$message.warning('请选择SQL字段')
            else {
              const params = {
                id,
                dataStr: this.sql,
                oldCanShuData: JSON.stringify(this.addPa.oldCanShuData),
                returnData: JSON.stringify(returnData),
                returnDataStr: JSON.stringify(this.copyTreeData),
                sqlParam: JSON.stringify(this.paramData)
              }
              const formData = new FormData()
              Object.keys(params).forEach(k => {
                formData.append(k, params[k])
              })
              this.$http.post('/bbFunctionWorkController/updateById', formData).then(s => {
                this.previewNav.show = true
              }).catch(e => {
                this.$message.error(e.message)
              })
            }
          }
        },
        export: () => {}
      }
      DEAL[met]()
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
.left {
  &_list {
    ul {
      padding: 10px;
      li {
        margin-bottom: 10px;
        font-size: 13px;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }
    }
  }
}
.right {
  .section {
    margin-top: 10px;
    padding: 10px;
    height: calc(100% - 78px);
    &_step {
      .el-steps{
        margin-left: 5%;
        width: calc(100% - 160px);
        text-align: left;
        & /deep/ .el-step__title{
          font-size: 12px;
        }
        & /deep/ .el-step{
          flex: 1;
        }
        & /deep/ .el-step__icon-inner{
          font-size: 28px;
          font-weight: unset;
        }
      }
    }
    section {
      display: flex;
      margin-top: 10px;
      height: calc(100% - 66px);
      box-sizing: border-box;
      text-align: left;
      overflow-y: auto;
      .param-list {
        box-sizing: border-box;
        border-left: 1px solid #e2e2e2;
        overflow: auto;
        height: calc(100% - 32px);
        li{
          display: flex;
          position: relative;
          margin-bottom: 5px;
          padding: 5px 0 0 5px;
          & > i{
            position: absolute;
            width: 30px;
            font-size: 26px;
            color: #57aaff;
            & + div{
              width: calc(100% - 50px);
              margin-left: 30px;
            }
          }
          .btns{
            width: 50px;
            i{
              font-size: 14px;
              color: #666;
              margin-top: 10px;
              &:nth-of-type(1){
                margin-right: 5px;
              }
            }
          }
        }
      }
      .func-list{
        width: 100%;
        li{
          flex-wrap: wrap;
          div:nth-of-type(1){
            width: calc(100% - 100px);
          }
          .func-param-list{
            width: 100%;
            li{
              display: flex;
              justify-content: space-around;
              margin-bottom: 0;
              padding-top: 0;
              i.tree-icon{
                vertical-align: middle;
              }
              span{
                transform: scale(0.9);
                line-height: 20px;
                &:nth-of-type(1){
                  width: 60%;
                }
              }
            }
          }
        }
        .btns{
          width: 70px;
          display: flex;
          text-align: right;
          padding-right: 5px;
          box-sizing: border-box;
          .relation{
            color: #57aaff;
            margin: 8px 3px;
          }
        }
      }
      .cont-left {
        width: calc(100% - 310px);
        margin-right: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        .tips {
          padding: 5px 10px;
          position: relative;
          line-height: 25px;
          color: #666;
          .return-res{
            position: absolute;
            right: 0;
          }
        }
        .sql-cont {
          height: 100%;
          .sql-deta {
            height: calc(100% - 328px);
            overflow-x: auto;
            border-bottom: 1px solid #e2e2e2;
            display: flex;
            transition: height .3s linear;
            &.big{
              height: 0;
              transition: height .3s linear;
            }
            &.none{
              height: calc(100% - 74px);
              transition: height .3s linear;
            }
            .sql-code {
              width: calc(100% - 30%);
              border-right: 1px solid #e2e2e2;
              .sql-title {
                display: flex;
                position: relative;
                border: 1px solid #e2e2e2;
                &.big{
                  height: 0;
                }
                li {
                  cursor: pointer;
                  line-height: 30px;
                  margin-left: 15px;
                  i{
                    vertical-align: middle;
                    margin-right: 3px;
                  }
                }
              }
              .sql-codemirror {
                overflow: auto;
                height: calc(100% - 32px);
              }
              .vue-codemirror{
                & /deep/ .CodeMirror{
                  height: 100%;
                }
              }
            }
            .sql-primitive {
              width: calc(100% - 70%);
              .add-param {
                display: flex;
                justify-content: space-between;
                border-bottom: 1px solid #e2e2e2;
                padding-left: 10px;
                box-sizing: border-box;
                line-height: 30px;
                i {
                  margin: 8px 5px 0 0;
                  font-size: 16px;
                  color: #409eff;
                  cursor: pointer;
                }
              }
            }
          }
          .sql-res {
            position: relative;
            background: #fff;
            padding: 5px 10px;
            .colla-btns{
              position: absolute;
              right: 0;
              i{
                display: inline-block;
                padding: 0 5px;
              }
            }
          }
          .sql-result {
            height: 250px;
            transition: height .3s linear;
            &.big{
              height: calc(100% - 40px);
              transition: height .3s linear;
            }
            &.none{
              height: 0;
              transition: height .3s linear;
            }
            .table-error{
              height: 100%;
              border: 1px solid #e2e2e2;
              display: flex;
              justify-content: center;
              align-items: center;
              color: red;
            }
          }
        }
      }
      .cont-right {
        width: 300px;
        border: 1px solid #ddd;
        border-radius: 5px;
        .el-tabs {
          height: 100%;
          i.tree-icon{
            vertical-align: text-bottom;
            transform: scale(0.9);
            display: inline-block;
          }
          & /deep/ .el-tabs__header{
            position: initial;
            width: 100%;
          }
          & /deep/ .el-tabs__content{
            height: calc(100% - 30px);
          }
          & /deep/ .el-tab-pane {
            height: 100%;
          }
          .el-tree {
            height: calc(100% - 100px);
            overflow: auto;
            .custom-tree-node {
              position: relative;
              width: 100%;
              line-height: 30px;
              .tree-btn{
                position: absolute;
                right: 2px;
                i {
                  display: inline-block;
                  margin-right: 3px;
                }
                .data-num{
                  width: 20px;
                  margin-right: 3px;
                  & /deep/ .el-input__inner{
                    padding: 1px;
                    line-height: 20px;
                    height: 20px;
                  }
                }
              }
              .tree-data {
                display: inline-block;
                width: calc(100% - 40px);
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
          }
        }
        .tree-info{
          padding: 5px;
          height: 91px;
          overflow-y: auto;
          overflow-x: hidden;
          background: #fbfafa;
          & > p{
            line-height: 26px;
          }
          .tree-list{
            li{
              list-style: inside;
            }
          }
        }
      }
    }
  }
}
</style>
