<template>
  <div class="detailBox">
    <el-dialog
      v-dialogDrag
      :modal="false"
      width="68%"
      top="0"
      :visible.sync="show"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        查看详情
      </div>
      <div>
        <el-table
          ref="table"
          v-waiting="table.loading"
          height="498"
          :data="table.data"
          size="mini"
          style="width: 99%;"
          border
          :row-key="getRowKey"
          align="center"
        >
          <el-table-column type="selection" width="50" reserve-selection />
          <el-table-column
            type="index"
            label="序号"
            prop="table.index"
          />
          <el-table-column label="是否成功" prop="success" />
          <el-table-column :show-overflow-tooltip="true" label="节点名称" prop="nodeName" />
          <el-table-column :show-overflow-tooltip="true" label="开始时间" prop="executeStartTime" />
          <el-table-column :show-overflow-tooltip="true" label="结束时间" prop="executeEndTime" />
          <el-table-column :show-overflow-tooltip="true" label="耗时" prop="usedMilliseconds" />
          <el-table-column label="输入参数" prop="inputs" width="200">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.inputs"
                type="textarea"
                disabled
                :rows="5"
                style="width: 200px; font-size: 12px;"
              />
            </template>
          </el-table-column>
          <el-table-column label="输出参数" prop="outputs" width="200">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.outputs"
                type="textarea"
                disabled
                :rows="5"
                style="width: 200px; font-size: 12px;"
              />
            </template>
          </el-table-column>
          <el-table-column label="错误信息" prop="errorMsg" width="200">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.errorMsg"
                type="textarea"
                disabled
                :rows="5"
                style="width: 200px; font-size: 12px;"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer">
        <el-button
          type="info"
          size="mini"
          @click="() => $emit('update:show', false)"
        >
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="() => $emit('update:show', false)">
          确定
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
    }
  },
  data() {
    return {
      table: {
        id: '',
        loading: false,
        data: []
      }
    }
  },
  watch: {
    id: {
      immediate: true,
      handler(val) {
        if (val) {
          this.table.id = val
        }
      }
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    getRowKey(row) {
      return row.id
    },
    // 获取表格数据
    getInfo() {
      this.table.loading = true
      this.$api.kettle.getDetailInfo({
        id: this.table.id
      })
        .then(s => {
          const data = [...s.data.items]
          data.forEach(e => {
            e.success ? e.success = '是' : e.success = '否'
            if (!e.nodeName || e.nodeName === '') {
              e.nodeName = e.nodeId
            }
          })
          this.table.data = data
          this.table.data.forEach(item => {
            item.inputs = JSON.stringify(JSON.parse(item.inputs), null, 2)
            item.outputs = JSON.stringify(JSON.parse(item.outputs), null, 2)
            // item.errorMsg = JSON.stringify(JSON.parse(item.errorMsg), null, 2)
          })
          this.table.loading = false
        })
        .catch(e => {
          this.table.loading = false
          this.$message.error(e.message)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.detailBox{
  position: fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  z-index: 3000;
  .el-dialog__wrapper{
    position: absolute;
    top:0;
    left:0;
    display: flex;
    align-items: center;
    /deep/.el-dialog{
      margin-bottom: 0;
    }
  }
}
/deep/.el-textarea__inner{
  box-sizing: border-box;
}
</style>
