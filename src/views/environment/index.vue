<template>
  <el-dialog
    v-dialogDrag
    :visible.sync="show"
    :modal="false"
    width="50%"
    :show-close="startZT === '无' ? false : true"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="() => $emit('update:show', false)"
  >
    <div slot="title">
      设置工作环境
    </div>
    <Search
      style="width: 300px"
      :content.sync="content"
      placeholder="请输入单位账套的编码或名称"
      @search="val => content = val"
    />
    <el-table
      ref="table"
      v-waiting="table.loading"
      :data="list"
      size="mini"
      style="width: 100%"
      height="400px"
      highlight-current-row
      @row-click="setTargetZT"
    >
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :label="column.label"
        :prop="column.prop"
      />
    </el-table>
    <div slot="footer">
      <span class="tip">
        当前账套：{{ startZT }}
      </span>
      <el-button v-if="startZT !== '无'" type="info" size="mini" @click="close">
        取消
      </el-button>
      <el-button type="primary" size="mini" @click="save">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Environment',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      table: {
        loading: false,
        data: [],
        target: {}
      },
      content: ''
    }
  },
  computed: {
    startZT() {
      const { targetAcset } = this
      const localAcset = JSON.parse(localStorage.getItem('startZT'))
      let str = ''
      if (targetAcset) {
        str = targetAcset.zth ? `${targetAcset.zth}-${targetAcset.ztmc}` : '无'
      } else {
        str = localAcset ? `${localAcset.zth}-${localAcset.ztmc}` : '无'
      }
      return str
    },
    ...mapGetters(['targetAcset']),
    list() {
      const { content } = this
      return this.table.data.filter(d => Object.values(d).some(o => o && o.includes(content.trim())))
    },
    columns() {
      return [
        { label: '单位编码', prop: 'unit_sn' },
        { label: '单位名称', prop: 'unit_name' },
        { label: '账套代码', prop: 'zth' },
        { label: '账套名称', prop: 'ztmc' },
        { label: '启用日期', prop: 'start_qyrq' },
        { label: '账套主管', prop: 'ztzg' },
        { label: '账套属性', prop: 'ztsx' }
      ]
    }
  },
  created() {
    this.getZT().then(s => {
      this.table.data = s
    })
  },
  mounted() {
    const Flag = !this.targetAcset && !localStorage.getItem('startZT')
    if (Flag) this.$emit('update:show', true)
  },
  methods: {
    ...mapActions({
      getZT: 'user/getZT',
      setZT: 'user/setTargetZT'
    }),
    save() {
      if (this.table.target.id) {
        this.setZT(this.table.target).then(s => {
          this.$message.success('设置工作环境成功!')
          this.$emit('update:show', false)
          location.reload()
        }).catch(e => this.$message.error(e.message))
      } else {
        this.$notify.warning({
          title: '警告',
          message: '请先选择要切换的账套！'
        })
      }
    },
    setTargetZT(row) {
      this.table.target = row
    },
    close() {
      this.$emit('update:show', false)
    }
  }
}
</script>

<style lang='scss' scoped>
.top {
  display: flex;
  flex: 1;
  justify-content: space-around;
}
.tip {
  float: left;
  margin-top: 7px;
  color: #4390de;
  font-size: 12px;
}
</style>
