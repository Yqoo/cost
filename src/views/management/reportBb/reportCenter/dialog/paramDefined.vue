<template>
  <div>
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :model="false"
      width="45%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        参数定义
      </div>
      <el-table :data="table.data" style="width: 100%" size="mini" border>
        <el-table-column label="名称">
          <template slot-scope="scope">
            <el-input v-model="scope.row.name" size="mini" />
          </template>
        </el-table-column>
        <el-table-column label="变量">
          <template slot-scope="scope">
            <el-input v-model="scope.row.key" size="mini" />
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            <el-select v-model="scope.row.type" size="mini" @change="val => changeCheck(val, scope.row)">
              <el-option v-for="item in typeData" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="设置值">
          <template slot-scope="scope">
            <el-button
              v-show="!!scope.row.isCheck"
              type="text"
              size="small"
              icon="el-icon-edit"
              title="编辑"
              @click="tableRowHandler('tableEdit', scope)"
            />
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
              @click="tableRowHandler('tableAdd')"
            />
          </template>
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              icon="el-icon-delete"
              title="删除"
              @click="tableRowHandler('tableDel', scope)"
            />
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button type="info" size="mini" @click="() => this.$emit('update:show', false)">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="save">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-dialogDrag
      :visible.sync="setValue.show"
      :model="false"
      width="30%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => setValue.show = false"
    >
      <div slot="title">
        设置值
      </div>
      <el-table :data="setValue.data" size="mini" style="width: 100%" border>
        <el-table-column label="名称">
          <template slot-scope="scope">
            <el-input v-model="scope.row.label" size="mini" />
          </template>
        </el-table-column>
        <el-table-column label="变量">
          <template slot-scope="scope">
            <el-input v-model="scope.row.value" size="mini" />
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
              @click="valueTable('add')"
            />
          </template>
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              icon="el-icon-delete"
              title="删除"
              @click="valueTable('del', scope)"
            />
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button type="info" size="mini" @click="() => setValue.show = false">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="saveSetValue">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ParamDeFined',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      typeData: [
        { label: '字符串', value: 'str' },
        { label: '下拉框', value: 'drop' },
        { label: '单选框', value: 'radio' },
        { label: '复选框', value: 'checkbox' }
      ],
      table: {
        data: []
      },
      setValue: {
        show: false,
        data: [],
        setId: ''
      }
    }
  },
  methods: {
    changeCheck(val, row) { // 参数定义下拉框
      if (val !== 'str') {
        this.setValue.show = true
        this.setValue.setId = row.id
        this.setValue.data = [{ id: Math.random(), label: '', value: '' }]
      }
    },
    valueTable(type, scope) {
      const DEAL = {
        add: () => {
          this.setValue.data.push({
            id: Math.random(),
            label: '',
            value: ''
          })
        },
        del: () => {
          this.setValue.data.splice(scope.$index, 1)
        }
      }
      DEAL[type]()
    },
    tableRowHandler(type, scope) {
      const Deal = {
        tableEdit: () => {},
        tableAdd: () => {
          this.$set(this.table.data, this.table.data.length, {
            id: Math.random(),
            name: '',
            key: '',
            type: '',
            isCheck: false
          })
        },
        tableDel: () => {
          this.table.data.splice(scope.$index, 1)
        }
      }
      Deal[type]()
    },
    save() {
      this.$emit('update:show', false)
    },
    verifySetVlaueData() { // 验证setValueData
      const { data } = this.setValue
      const result = {
        flag: true,
        message: '验证成功'
      }
      if (!data.length) {
        result.flag = false
        result.message = '表格不能为空'
      } else {
        for (let i = 0, len = data.length; i < len; i++) {
          if (data[i].label === '' || data[i].value === '') {
            result.flag = false
            result.message = `${i + 1}行数据不能为空`
            break
          }
        }
      }
      return result
    },
    saveSetValue() {
      const result = this.verifySetVlaueData()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
