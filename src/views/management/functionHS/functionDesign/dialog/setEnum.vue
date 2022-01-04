<template>
  <div>
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :model="false"
      width="35%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        设置枚举
      </div>
      <el-table ref="tableData" :data="tableData" height="300" border style="width:100%" size="mini">
        <el-table-column label="显示值" prop="showData">
          <template slot-scope="scope">
            <el-input v-model="scope.row.showData" size="mini" />
          </template>
        </el-table-column>
        <el-table-column label="返回值" prop="returnData">
          <template slot-scope="scope">
            <el-input v-model="scope.row.returnData" size="mini" />
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
              @click="tableRowHandler('add')"
            />
          </template>
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              icon="el-icon-delete"
              title="删除"
              @click="tableRowHandler('del', scope)"
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
  </div>
</template>

<script>
export default {
  name: 'SetEnum',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableData: []
    }
  },
  watch: {
    row: {
      immediate: true,
      handler(val) {
        if (Object.keys(val).length) {
          if (val.children.length && Object.prototype.toString.call(val.children) === '[object Array]') {
            this.tableData = [...val.children]
          }
        }
      }
    }
  },
  methods: {
    save() {
      const results = this.verifyArr()
      if (results.flag) {
        this.$emit('update', { id: this.row.id, children: this.tableData })
        this.$emit('update:show', false)
      } else this.$message.warning(results.message)
    },
    tableRowHandler(type, scope) {
      const DEAL = {
        add: () => {
          this.$set(this.tableData, this.tableData.length, {
            id: Math.random(),
            showData: '',
            returnData: ''
          })
        },
        del: () => {
          this.tableData.splice(scope.$index, 1)
        }
      }
      DEAL[type]()
    },
    verifyArr() {
      const results = {
        message: '验证成功',
        flag: true
      }
      const obj = {}
      for (let i = 0, len = this.tableData.length; i < len; i++) {
        if (this.tableData[i].showData === '' || this.tableData[i].returnData === '') {
          results.flag = false
          results.message = `第${i + 1}行数据填写不完整`
          break
        }
        if (obj[this.tableData[i].returnData]) {
          results.flag = false
          results.message = `第${i + 1}行返回值重复`
          break
        } else obj[this.tableData[i].returnData] = true
      }
      return results
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
