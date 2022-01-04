<template>
  <el-pagination
    :current-page="currentPage"
    :page-sizes="pageSizes"
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper "
    small
    :total="amount"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    amount: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 200
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSizes: {
      type: Array,
      default: () => [200, 300, 400, 500, 600]
    }
  },
  data() {
    return {
    }
  },
  watch: {
    currentPage(newVal) {
      this.currentPage = newVal
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val)
    },
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val)
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-pagination {
    /deep/ .el-pagination__total,
    /deep/ .btn-prev,
    /deep/ .el-pager,
    /deep/ .btn-next,
    /deep/ .el-pagination__jump {
      padding-top: 4px;
    }
  }
</style>
