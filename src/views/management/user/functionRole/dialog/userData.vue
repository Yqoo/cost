<template>
  <div class="userData">
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :modal="false"
      width="50%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        <span>角色用户信息</span>
      </div>
      <el-table
        ref="table"
        v-waiting="table.loading"
        :data="table.data"
        size="mini"
        height="300"
        style="width: 100%; border: 1px solid #ddd; border-radius: 4px;margin-top: 10px;"
      >
        <el-table-column prop="sn" label="编码" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="unit_name" label="所属单位" />
      </el-table>
      <div slot="footer">
        <el-button type="info" size="mini" @click="() => $emit('update:show', false)">
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
  name: 'UserData',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    sn: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      table: {
        loading: false,
        data: []
      }
    }
  },
  watch: {
    sn: {
      immediate: true,
      handler: 'getInfo'
    }
  },
  methods: {
    save() {
      this.$emit('update:show', false)
    },
    getInfo(sn) {
      if (sn) {
        this.table.loading = true
        this.$api.role.getRoleUser(sn).then(s => {
          this.table.data = [...s.data]
          this.table.loading = false
        }).catch(e => {
          this.$message.error(e.message)
          this.table.loading = false
        })
      }
    },
    getRowKey(row) {
      return row.id
    }
  }
}
</script>

<style lang="scss" scoped>
.userData {
  height: 100%;
}
.left {
  margin-top: 10px;
  height: 500px;
}
.right {
  padding: 10px;
  height: 480px;
}
</style>
