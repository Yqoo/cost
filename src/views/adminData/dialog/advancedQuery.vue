<template>
  <el-dialog
    v-dialogDrag
    :modal="false"
    width="500px"
    :visible.sync="show"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="() => $emit('update:show', false)"
  >
    <div slot="title">
      高级查询
    </div>
    <query-form
      ref="queryForm"
      :from="from"
      :cols="cols"
      :ztsn="ztsn"
      name="advancedQuery"
    />
    <div slot="footer">
      <el-button type="info" size="mini" @click="() => $emit('update:show', false)">
        关闭
      </el-button>
      <el-button type="primary" size="mini" @click="search">
        搜索
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import queryForm from './queryForm.vue'

export default {
  components: {
    queryForm
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    cols: {
      type: Array,
      default: () => []
    },
    ztsn: {
      type: String,
      default: ''
    },
    from: {
      type: String,
      default: ''
    }
  },
  methods: {
    search() {
      const result = this.$refs.queryForm.generateParams()
      this.$emit('refresh', result)
      this.$emit('update:show', false)
    }
  }
}
</script>
