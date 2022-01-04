<template>
  <el-dialog
    v-dialogDrag
    :visible.sync="show"
    :modal="false"
    width="800px"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="() => $emit('update:show', false)"
  >
    <div slot="title">
      详情
    </div>
    <h4 class="title">
      {{ title }}
    </h4>
    <el-row v-waiting="loading">
      <el-col :span="10">
        <el-table
          :data="datas.main || []"
          style="width: 100%"
          height="300px"
        >
          <el-table-column label="主数据" align="center">
            <el-table-column
              v-for="row in datas.mainColumns || []"
              :key="row.name"
              :label="row.name"
              :prop="row.name"
            />
          </el-table-column>
        </el-table>
        <div class="btn">
          <el-button type="primary" size="mini" @click="btnsHandler('doCompare')">
            数据比对
          </el-button>
        </div>
      </el-col>
      <el-col :span="2">
        <br>
      </el-col>
      <el-col :span="10">
        <el-table
          :data="datas.target || []"
          style="width: 100%"
          height="300px"
        >
          <el-table-column label="目标数据" align="center">
            <el-table-column
              v-for="row in datas.targetColumns || []"
              :key="row.name"
              :label="row.name"
              :prop="row.name"
            />
          </el-table-column>
        </el-table>
        <div class="btn">
          <el-button type="warning" size="mini" @click="btnsHandler('doCorrect')">
            数据修正
          </el-button>
        </div>
      </el-col>
    </el-row>
    <div slot="footer">
      <el-button type="prrimary" size="mini" @click="() => $emit('update:show', false)">
        关闭
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '数据比对'
    },
    sn: {
      type: String,
      default: ''
    },
    datas: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    btnsHandler(type) {
      this.loading = true
      this.$api.dataComparison.dataCompareAndCorrect({
        sn: this.sn
      }, `/dataCompare/${type}`).then(s => {
        if (type === 'doCompare') {
          this.$message({
            message: s.data,
            type: 'success',
            duration: 0,
            showClose: true
          })
        } else this.$message.success('数据修正成功！')
        this.loading = false
      }).catch(e => {
        this.loading = false
        this.$message.error(e.message)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .title {
    text-align: center;
    font-size: 15px;
    font-weight: bold;
    line-height: 30px;
  }
  .btn {
    text-align: center;
    margin: 10px 0px;
  }
</style>
