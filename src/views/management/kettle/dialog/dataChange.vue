<template>
  <div>
    <el-dialog
      v-dialogDrag
      :modal="false"
      width="50%"
      :visible.sync="show"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        {{ id ? "编辑" : "新增" }}数据算法
      </div>
      <el-form
        ref="form"
        v-waiting="loading"
        :model="form"
        :rules="rules"
        size="mini"
        label-width="120px"
        status-icon
      >
        <el-form-item label="分类" prop="categorySn">
          <el-select
            v-model="form.categoryName"
            placeholder="请选择分类"
          >
            <el-option value="" style="height: 250px; overflow-y:auto;padding:0px;">
              <Tree
                :data="treeData"
                :search="false"
                in-box
                @setTargetNode="setTargetNode"
              />
            </el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="编码" prop="sn">
              <el-input v-model="form.sn" clearable placeholder="请输入编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" clearable placeholder="请输入名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="自动执行" prop="autoExecute">
          <el-switch v-model="form.autoExecute" active-text="是" inactive-text="否" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.autoExecute" label="时机" prop="executeCron">
              <!-- <el-input v-model="form.executeCron" clearable placeholder="请输入编码" @focus="cronFocus" /> -->
              <el-popover v-model="cronPopover">
                <VueCron v-model="form.executeCron" @change="changeCron" @close="cronPopover=false" />
                <el-input slot="reference" v-model="form.executeCron" placeholder="请输入定时策略" readonly @click="cronPopover=true" />
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.autoExecute" label="时间模式" prop="executeTimeProxyModel">
              <el-select
                v-model="form.executeTimeProxyModel"
                placeholder="请选择时间模式"
              >
                <el-option
                  v-for="op in TimeMode"
                  :key="op.id"
                  :label="op.label"
                  :value="op.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item v-if="isTime" label="指定时间" prop="executeTime" class="category_sn zdTime">
          <el-date-picker
            v-model="form.executeTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间"
          />
        </el-form-item>
        <el-form-item label="执行变量" prop="executeVariables">
          <el-table
            ref="table"
            border
            :data="tableData"
            size="mini"
            style="width: 100%;border: 1px solid #ddd; border-radius: 4px;margin-top: 10px;"
            height="246"
          >
            <el-table-column label="名称" prop="name" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.name" size="mini" />
              </template>
            </el-table-column>
            <el-table-column label="值" prop="value" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.value" size="mini" />
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot="header">
                <span style="padding-right:10px;">操作</span>
                <el-button
                  type="text"
                  size="small"
                  icon="el-icon-circle-plus"
                  title="添加"
                  @click="addRow"
                />
              </template>
              <template slot-scope="scope">
                <el-button type="text" size="mini" icon="el-icon-delete" @click="tableRowHandler('del', scope)" />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          type="info"
          size="mini"
          @click="() => $emit('update:show', false)"
        >
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="save">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    },
    sn: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      cronPopover: false,
      tableData: [],
      loading: false,
      form: {
        id: '',
        categorySn: '',
        categoryName: '',
        sn: '',
        name: '',
        executeCron: '0 0 0 L * ? *', // 时机
        executeTimeProxyModel: 'NOW', // 时间模式
        autoExecute: false,
        executeTime: '', // 指定时间
        executeVariables: ''// 执行变量
      },
      rules: {
        categorySn: [
          { required: true, message: '请选择所属大类', trigger: 'change' }
        ],
        name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
        sn: [{ required: true, message: '请填写编码', trigger: 'blur' }],
        executeCron: [{ required: true, message: '请填写时机', trigger: 'blur' }],
        autoExecute: [{ required: true, trigger: 'change' }]
      },
      TimeMode: [
        { id: 'NOW', label: '真实执行时间' },
        { id: 'FIXED', label: '固定值' }
      ],
      treeData: [],
      isTime: false
    }
  },
  computed: {
  },
  watch: {
    id: {
      immediate: true,
      handler: 'getInfo'
    },
    sn: {
      immediate: true,
      handler(val) {
        if (val !== 'root') {
          this.form.categorySn = val
        }
      }
    },
    cronValue(val) {
      this.setCron(val)
    }
  },
  created() {
    this.getTree()
  },
  updated() {
    this.form.executeTimeProxyModel === 'NOW' ? this.isTime = false : this.isTime = this.form.autoExecute
  },

  methods: {
    changeCron(val) {
      this.form.executeCron = val
    },
    // 获取分类
    getTree() {
      this.$api.kettle
        .getSJZHTree({ rootName: '' })
        .then(s => {
          this.treeData = Array.isArray(s.data) ? [...s.data] : [s.data]
        })
        .catch(e => e)
    },
    setTargetNode(node) {
      // console.log(node)
      this.form.categorySn = node.id
      this.form.categoryName = node.label
    },
    // 保存数据算法
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = { ...this.form }
          params.executeVariables = JSON.stringify(this.tableData.filter(item => item.name))
          if (!params.executeTime) {
            delete params.executeTime
          }
          this.loading = true
          this.$api.kettle
            .saveKettle(params)
            .then(s => {
              this.$emit('success', params.categorySn)
              this.$emit('update:show', false)
              this.loading = false
            })
            .catch(e => {
              this.loading = false
              this.$message.error(e.message)
            })
        }
      })
    },
    // 修改数据回显
    getInfo(val) {
      const { status } = this
      if (val) {
        this.$api.kettle
          .searchById({ id: val })
          .then(s => {
            this.tableData = JSON.parse(s.data.executeVariables)
            this.form = s.data
          })
          .catch(e => this.$message.error(e.message))
      }
    },
    addRow() { // table操作栏添加行
      this.$set(this.tableData, this.tableData.length, { value: '', name: '' })
    },
    tableRowHandler(type, scope) {
      const METHODS = {
        del: () => {
          this.tableData.splice(scope.$index, 1)
        }
      }
      METHODS[type]()
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.bottom{
  position: relative;
  box-sizing: border-box;
  text-align: right !important;
  padding-right: 16px !important;
  padding-bottom: 6px;
  .value{
    position: absolute;
    left:10px;
  }
}
</style>
