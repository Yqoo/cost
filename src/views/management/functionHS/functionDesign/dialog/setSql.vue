<template>
  <div>
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :model="false"
      width="60%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        设置sql
      </div>
      <section>
        <div class="left">
          <div class="sql" :class="tableH">
            <ul class="sql_top">
              <li @click="sqlHandel('yanz')">
                <i class="el-icon-finished" style="color:#0089ff" />验证
              </li>
              <li @click="sqlHandel('zhix')">
                <i class="el-icon-document-checked" style="color:#fd4c09" />执行
              </li>
              <li @click="sqlHandel('meih')">
                <i class="el-icon-magic-stick" style="color:#78cc09" />美化
              </li>
              <li>
                <el-checkbox v-model="isOneData">
                  单值
                </el-checkbox>
              </li>
            </ul>
            <codemirror ref="codemirror" v-model="sql" :options="option" class="code-mirror" />
          </div>
          <p class="sql_kzq">
            <span>SQL结果</span>
            <span>
              <i v-show="tableH!=='big'" class="el-icon-arrow-up" title="展开" @click="collapseTable('z')" />
              <i v-show="tableH!==''" class="el-icon-arrow-down" title="收缩" @click="collapseTable('s')" />
            </span>
          </p>
          <div class="sql_results" :class="tableH">
            <el-table
              v-if="!table.isErr"
              border
              :data="table.data"
              height="100%"
              style="width: 100%"
              size="mini"
            >
              <el-table-column v-if="table.data.length!==0" label="序号" type="index" width="50" />
              <el-table-column v-for="e in table.columns" :key="e" :label="e" :prop="e" :show-overflow-tooltip="true" />
            </el-table>
            <div v-if="table.isErr" class="table-error">
              <span>{{ table.errorMessage }}</span>
            </div>
          </div>
        </div>
        <div class="right">
          <p class="title">
            <span>SQL字段</span>
            <span v-show="fieldList.length!==0">
              <i class="el-icon-setting" title="设置字段" @click="setParamDialog" />
            </span>
          </p>
          <el-tree
            ref="sql-tree"
            :data="fieldList"
            node-key="field"
            :props="treeProps"
            default-expand-all
            show-checkbox
            :highlight-current="true"
            :check-strictly="true"
            :default-checked-keys="defaultKey"
            @check="handleCheckChange"
          >
            <span slot-scope="{ node,data }" class="custom-tree-node">
              <i v-show="node.level!==1" class="el-icon-tickets" />
              <span class="tree-data" :title="data.field+data.type">{{ data.field }}{{ data.type }}</span>
            </span>
          </el-tree>
        </div>
      </section>
      <div slot="footer">
        <el-button type="info" size="mini" @click="() => this.$emit('update:show', false)">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="save">
          确定
        </el-button>
      </div>
    </el-dialog>
    <SetParam
      v-if="setParam.show"
      :show.sync="setParam.show"
      :list="fieldList[0].children"
      :param="setParam.param"
      @update="update"
    />
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'codemirror/mode//javascript/javascript.js'
import { format } from 'sql-formatter'
import '../js/setting.js'

export default {
  name: 'SetSql',
  components: {
    codemirror,
    format,
    SetParam: () => import('./setParam')
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => {}
    },
    dsSn: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableH: 'normal', // 控制盒子显示
      isOneData: true, // 是否单值
      sql: '',
      option: {
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
      table: {
        isErr: false,
        data: [],
        columns: [],
        errorMessage: '',
        isCheck: false,
        copySql: ''
      },
      fieldList: [], // sql字段
      treeProps: {
        label: 'field',
        children: 'children'
      },
      defaultKey: [],
      setParam: {
        show: false,
        param: {}
      }
    }
  },
  watch: {
    row: {
      immediate: true,
      handler(val) {
        if (
          Object.keys(val).length
          && Object.prototype.toString.call(val.children) === '[object Object]'
          && Object.keys(val.children).length
        ) {
          const {
            sql, params, isOneData, checkNode
          } = val.children
          this.sql = sql
          this.table.copySql = sql
          this.isOneData = isOneData
          this.setParam.param = params
          this.sqlHandel('yanz')
        }
      }
    }
  },
  methods: {
    update(obj) {
      this.setParam.param = { ...obj }
    },
    handleCheckChange(data, node) {
      this.$refs['sql-tree'].setCheckedKeys([])
      const arr = node.checkedKeys.includes(data.field) ? [data.field] : []
      this.$refs['sql-tree'].setCheckedKeys(arr)
    },
    setParamDialog() {
      this.setParam.show = true
    },
    sqlHandel(type) {
      const DEAL = {
        yanz: () => { // 验证
          if (this.dsSn) {
            const json = { sql: this.sql, dsSn: this.dsSn }
            this.$api.functionCenter.verifySqlBox(json).then(s => {
              this.table.isErr = false
              this.table.isCheck = true
              this.table.copySql = this.sql
              const arr = [...s.data] || []
              // eslint-disable-next-line no-shadow
              this.table.columns = arr.map(s => (s.chineseName ? s.chineseName : s.field))
              this.fieldList = [
                {
                  field: 'SQL字段', icon: 'baocun1', disabled: true, children: arr.map(e => { e.sort = ''; return e })
                }
              ]
              if (
                Object.keys(this.row.children).length
                && Object.prototype.toString.call(this.row.children) === '[object Object]'
              ) {
                this.defaultKey = [this.row.children.checkNode.field]
              }
            }).catch(e => {
              // this.$message.error(e.message)
              this.table.isErr = true
              this.table.isCheck = false
              this.table.errorMessage = e.message
              this.fieldList = []
            })
          }
        },
        // eslint-disable-next-line consistent-return
        zhix: () => { // 执行
          if (!this.table.isCheck || (this.table.isCheck && this.table.copySql !== this.sql)) {
            this.$message.warning('sql语句还未进行验证！')
            return false
          }
          const param = { dsSn: this.dsSn, sql: this.sql, param: '' }
          this.$api.functionCenter.executeFunc(param).then(s => {
            this.table.data = [...s.data]
            this.table.isErr = false
          }).catch(e => {
            this.table.data = []
            this.table.errorMessage = e.message
            this.table.isErr = true
          })
        },
        meih: () => {
          const value = format(this.sql).replace(/\{\s*\{/gi, '{{').replace(/\}\s*\}/gi, '}}')
          this.$refs.codemirror.codemirror.setValue(value)
        }
      }
      DEAL[type]()
    },
    collapseTable(type) {
      this.tableH = type === 'z' ? 'big' : ''
    },
    save() {
      const checkNode = this.$refs['sql-tree'].getCheckedNodes()
      if (this.sql === '') this.$message.warning('请输入sql语句')
      else if (this.sql !== this.table.copySql) this.$message.warning('请先验证sql语句')
      else if (!this.table.isCheck) this.$message.warning('sql语句还未验证')
      else if (checkNode.length === 0) this.$message.warning('请勾选SQL字段')
      else {
        const json = {
          id: this.row.id,
          children: {
            isOneData: this.isOneData,
            sql: this.sql,
            checkNode: checkNode[0],
            params: this.setParam.param
          }
        }
        this.$emit('update', json)
        this.$emit('update:show', false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
section {
  width: 100%;
  display: flex;
  .left {
    width: 60%;
    margin-right: 10px;
    .sql {
      border: 1px solid #ddd;
      border-radius: 5px;
      height: auto;
      overflow: hidden;
      transition: height .3s linear;
      &.big{
        height: 0;
        transition: height .3s linear;
      }
      &_top {
        display: flex;
        li {
          margin-left: 10px;
          cursor: pointer;
          i {
            margin-right: 3px;
          }
        }
      }
      &_kzq {
        position: relative;
        span:nth-of-type(2) {
          position: absolute;
          right: 0;
          i{
            margin-left: 10px;
          }
        }
      }
      &_results {
        border: 1px solid #e2e2e2;
        height: 150px;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: height .3s linear;
        &.big{
          height: 424px;
          transition: height .3s linear;
        }
        .table-error{
          color: #ff0f0f;
        }
      }
    }
  }
  .right {
    width: calc(100% - 60% - 10px);
    border: 1px solid #ddd;
    border-radius: 5px;
    .title {
      display: flex;
      justify-content: space-between;
      padding: 3px 5px;
      border-bottom: 1px solid #ddd;
    }
  }
}
</style>
