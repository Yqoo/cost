<template>
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
      引入职员
    </div>
    <el-form
      :model="form"
      size="mini"
      inline
      label-width="70px"
    >
      <el-form-item label="引入类型" prop="">
        <el-select v-model="form.imp" style="width: 120px">
          <el-option
            v-for="item in imps"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="密码类型" prop="">
        <el-select v-model="form.pwd" style="width: 120px;">
          <el-option value="0" label="初始密码" />
          <el-option value="1" label="身份证后六位" />
        </el-select>
      </el-form-item>
      <el-form-item label="初始密码" prop="">
        <el-input style="width: 180px;">
          <el-button slot="append" icon="el-icon-search" />
        </el-input>
      </el-form-item>
    </el-form>
    <el-table
      :data="table.data"
      size="mini"
      style="width: 100%"
      height="350"
    >
      <el-table-column type="index" label="序号" />
      <el-table-column label="职员代码" prop="" />
      <el-table-column label="职员姓名" prop="" />
      <el-table-column label="部门" prop="" />
      <el-table-column label="操作员" prop="" />
    </el-table>
    <Pagination
      class="pagination"
      :amount="table.total"
      :page-size="table.size"
      :current-page="table.page"
      @handleSizeChange="val => table.size = val"
      @handleCurrentChange="val => table.page = val"
    />
    <div slot="footer">
      <el-button type="info" size="mini" @click="() => $emit('update:show', false)">
        取消
      </el-button>
      <el-button type="primary" size="mini">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'Staff',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {},
      imps: [
        { name: '自定义引入', id: '0' },
        { name: '按名字引入', id: '1' },
        { name: '按代码引入', id: '2' }
      ],
      table: {
        loading: false,
        data: [],
        size: 200,
        page: 1,
        total: 0
      }
    }
  }
}
</script>

<style>

</style>
