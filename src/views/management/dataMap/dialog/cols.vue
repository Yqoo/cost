<template>
  <div>
    <el-table
      ref="table"
      :data="tableData"
      size="mini"
      style="width: 100%"
      height="450"
      border
    >
      <el-table-column label="操作" width="120" fixed="left">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="8">
              <el-button
                v-show="scope.$index !== 0"
                size="mini"
                type="text"
                icon="el-icon-arrow-up"
                title="上移"
                @click="toolsHandler('up', scope)"
              />
            </el-col>
            <el-col :span="8">
              <el-button
                v-show="scope.$index !== tableData.length - 1"
                type="text"
                size="mini"
                icon="el-icon-arrow-down"
                title="下移"
                @click="toolsHandler('down', scope)"
              />
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="字段" prop="name">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title">
        <template slot-scope="scope">
          <el-input v-model="scope.row.title" />
        </template>
      </el-table-column>
      <el-table-column label="显示宽度" prop="width">
        <template slot-scope="scope">
          <el-input v-model="scope.row.width" />
        </template>
      </el-table-column>
      <el-table-column label="编码字段" prop="isSnField" align="center" width="70">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.isSnField" @change="changeStatus(scope.$index, 'isSnField')" />
        </template>
      </el-table-column>
      <el-table-column label="名称字段" prop="isNameField" align="center" width="70">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.isNameField" @change="changeStatus(scope.$index, 'isNameField')" />
        </template>
      </el-table-column>
      <el-table-column label="是否显示" prop="isShow" width="150">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.isShow" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    leftTable: { // 数据
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tableData: [],
      colsIndex: null, // 选择时所在的行数
      info: null // 编辑系统值定义回显所需数据
    }
  },
  watch: {
    leftTable: {
      immediate: true,
      handler(val) {
        if (val.length) {
          const tmp = JSON.parse(val[0])
          this.tableData = tmp.filter(e => e.name !== 'allow_update_delete_' && e.name !== 'allow_add_').map(e => ({
            isNameField: e.isNameField,
            isSnField: e.isSnField,
            name: e.name,
            title: e.title,
            width: e.width || 120,
            isShow: e.isShow === undefined ? true : e.isShow
          }))
        }
      }
    }
  },
  methods: {
    toolsHandler(type, scope) {
      const { $index } = scope
      const METHODS = {
        up: () => {
          if ($index !== 0) {
            // eslint-disable-next-line prefer-destructuring
            this.tableData[$index] = this.tableData.splice($index - 1, 1, this.tableData[$index])[0]
          }
        },
        down: () => {
          if ($index !== this.tableData.length - 1) {
            // eslint-disable-next-line prefer-destructuring
            this.tableData[$index] = this.tableData.splice($index + 1, 1, this.tableData[$index])[0]
          }
        }
      }
      METHODS[type]()
    },
    changeStatus(index, type) {
      for (let i = 0; i < this.tableData.length; i++) {
        if (i === index) {
          if (this.tableData[i][type]) this.tableData[i].required = true
          // eslint-disable-next-line no-continue
          continue
        } else this.tableData[i][type] = false
      }
    }
  }
}
</script>

<style>

</style>
