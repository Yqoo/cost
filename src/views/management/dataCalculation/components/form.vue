<template>
  <el-dialog
    v-dialogDrag
    :visible.sync="show"
    :modal="false"
    width="600px"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="() => $emit('update:show', false)"
  >
    <div slot="title">
      {{ id ? '编辑' : '新增' }}
    </div>
    <el-form
      ref="form"
      v-waiting="loading"
      :model="form"
      :rules="rules"
      size="mini"
      label-width="90px"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="编码" prop="sn">
        <el-input v-model="form.sn" />
      </el-form-item>
      <el-form-item label="转换组配置" prop="config">
        <Table
          ref="table"
          :data="configs.data"
          :multiple="true"
          :search="false"
          :columns="columns"
          :height="300"
          class="sortTable"
          @select="select"
        />
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button type="info" size="mini" @click="() => $emit('update:show', false)">
        关闭
      </el-button>
      <el-button type="primary" size="mini" @click="save">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import Sortable from 'sortablejs'

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
      loading: false,
      form: {
        name: '',
        sn: '',
        config: []
      },
      rules: {
        name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
        sn: [{ required: true, message: '请填写编码', trigger: 'blur' }],
        config: [{ required: true, message: '请选择配置', trigger: 'blur' }]
      },
      configs: {
        data: [],
        selections: []
      }
    }
  },
  computed: {
    columns() {
      return [
        { label: '名称', prop: 'name' }
      ]
    }
  },
  watch: {
    show: {
      immediate: true,
      handler: 'getList'
    }
  },
  methods: {
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const sorts = this.getSort()
          this.$api.dataComparison.saveCalc({
            ...this.form,
            config: sorts.join(','),
            id: this.id || null
          }, this.id ? '/dataCalculation/update' : '/dataCalculation/add').then(s => {
            this.$message.success('保存成功！')
            this.$emit('update:show', false)
            this.$emit('refresh')
          }).catch(e => this.$message.error(e.message))
        }
      })
    },
    getSort() {
      const { config } = this.form
      const { data } = this.configs
      const newArr = []
      data.forEach(item => {
        config.includes(item.id) && newArr.push(item.id)
      })
      return newArr
    },
    select(selections) {
      this.configs.selections = selections
      this.form.config = selections.map(s => s.id)
    },
    rowDrop() {
      const tbody = document.querySelector('.sortTable .el-table__body-wrapper tbody')
      this.sortObj = Sortable.create(tbody, {
        onEnd: evt => {
          const { data } = this.configs
          const { oldIndex, newIndex } = evt
          const temp = data.splice(oldIndex, 1)
          data.splice(newIndex, 0, ...temp)
        }
      })
    },
    sortTable(config) {
      const arr = []
      const before = this.$tools.deepClone(this.configs.data)
      config.split(',').forEach(item => {
        for (let i = 0, len = before.length; i < len; i++) {
          if (before[i].id === item) {
            arr.push(before[i])
            this.$refs.table.toggleRowSelection(before[i], true)
            before.splice(i, 1)
            break
          }
        }
      })
      this.configs.data = [...arr, ...before]
    },
    getInfo(id) {
      this.loading = true
      this.$api.dataComparison.getCalcInfo({
        id
      }).then(s => {
        Object.keys(this.form).forEach(key => {
          this.form[key] = key === 'config' ? s.data[key].split(',') : s.data[key]
        })
        this.sortTable(s.data.config)
        this.loading = false
      }).catch(e => {
        this.loading = false
        this.$message.error(e.message)
      })
    },
    getList(bool) {
      if (bool) {
        this.$api.dataComparison.getCalcList().then(s => {
          this.configs.data = s.data
          this.id && this.getInfo(this.id)
          this.rowDrop()
        }).catch(e => this.$message.error(e.message))
      }
    }
  }
}
</script>

<style>

</style>
