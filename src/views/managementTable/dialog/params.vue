<template>
  <el-table
    ref="table"
    :data="tableData"
    size="mini"
    height="150px"
    style="width: 100%;"
  >
    <el-table-column label="字段" prop="name" />
    <el-table-column label="标题" prop="title">
      <template slot-scope="scope">
        <el-input v-model="scope.row.title" />
      </template>
    </el-table-column>
    <el-table-column label="类型" prop="type">
      <template slot-scope="scope">
        <el-select v-model="scope.row.type">
          <el-option label="字符串" value="string" />
          <el-option label="数字" value="number" />
          <el-option label="时间" value="date" />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="格式" prop="pattern">
      <template slot-scope="scope">
        <el-select
          v-if="scope.row.type === 'date'"
          v-model="scope.row.pattern"
          placeholder="请选择时间格式"
        >
          <el-option
            v-for="dt in dateType"
            :key="dt"
            :label="dt"
            :value="dt"
          />
        </el-select>
        <span v-else>
          {{ scope.row.pattern = '无' }}
        </span>
      </template>
    </el-table-column>
    <el-table-column label="默认值" prop="value">
      <template slot-scope="scope">
        <el-date-picker
          v-if="scope.row.type === 'date'"
          v-model="scope.row.value"
          type="datetime"
          placeholder="选择日期时间"
          :format="scope.row.pattern"
        />
        <el-input v-else v-model="scope.row.value" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dateType: [
        'yyyy', 'yyyyMM', 'yyyyMMdd', 'yyyy-MM', 'yyyy-MM-dd', 'yyyy-MM-dd HH', 'yyyy-MM-dd HH:mm',
        'yyyy-MM-dd HH:mm:ss', 'yyyy/MM', 'yyyy/MM/dd', 'yyyy/MM/dd HH', 'yyyy/MM/dd HH:mm', 'yyyy/MM/dd HH:mm:ss',
        'yyyy年', 'yyyy年MM月', 'yyyy年MM月dd日', 'yyyy年MM月dd日 HH时', 'yyyy年MM月dd日 HH时mm分', 'yyyy年MM月dd日 HH时mm分ss秒',
        'yyyy年MM月dd日 HH:mm:ss'
      ]
    }
  }
}
</script>
