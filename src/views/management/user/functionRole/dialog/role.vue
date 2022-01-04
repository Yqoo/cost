<template>
  <div>
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :modal="false"
      width="30%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        <!-- <i class="el-icon-circle-plus" /> -->
        <span>{{ updateId ? '编辑' : '新增' }}功能角色</span>
      </div>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="mini"
        label-width="110px"
      >
        <el-form-item label="角色编码" prop="sn">
          <el-input v-model="form.sn" :disabled="disabled" />
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="角色负责人" prop="head_name">
          <el-input v-model="form.head_name">
            <i slot="suffix" class="el-icon-more" @click="handleIconClick" />
          </el-input>
        </el-form-item>
        <el-form-item label="角色说明" prop="desc_">
          <el-input v-model="form.desc_" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" size="mini" @click="() => $emit('update:show', false)">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="save">
          确定
        </el-button>
      </div>
    </el-dialog>
    <RolePrincipal
      v-if="rolePrincipal.show"
      :show.sync="rolePrincipal.show"
      :sn="form.head_sn"
      :select="select"
      @select="getSelect"
    />
  </div>
</template>

<script>
export default {
  name: 'Role',
  components: {
    RolePrincipal: () => import('./rolePrincipal')
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    updateId: {
      type: String || Object,
      default: null
    }
  },
  data() {
    return {
      disabled: false,
      select: [],
      form: {
        id: '',
        sn: '',
        name: '',
        desc_: '',
        head_name: '',
        head_sn: ''
      },
      rules: {
        sn: [
          { required: true, message: '请输入角色编码', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      rolePrincipal: { // 角色负责人弹窗
        show: false
      }
    }
  },
  watch: {
    updateId: {
      immediate: true,
      handler: 'getBySn'
    },
    show(val) {
      if (!val) {
        Object.assign(this.form, {
          id: '',
          sn: '',
          name: '',
          desc_: '',
          head_name: '',
          head_sn: ''
        })
      }
    }
  },
  methods: {
    getBySn(sn) { // 通过编码获取角色详情
      if (sn) {
        this.$api.role.getBySn(sn).then(res => {
          const { data } = res
          Object.keys(this.form).forEach(key => {
            this.form[key] = data[key]
          })
        })
      }
    },
    save() { // 弹窗确认按钮
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = { ...this.form }
          const headSN = this.select.map(s => s.sn)
          params.head_sn = headSN.join(',')
          delete params.head_name
          const url = this.updateId ? 'updateRole' : 'addRole'
          if (url === 'addRole') {
            delete params.id
          }
          this.$api.role[url](params).then(res => {
            this.$emit('update:show', false)
            this.$message.success('保存成功')
            this.select = []
            this.$emit('refreshTree', [res.data])
          }).catch(e => this.$message.error(e.message))
        }
      })
    },
    handleIconClick() { // 角色负责人弹窗
      this.rolePrincipal.show = true
    },
    getSelect(val) { // 获取角色负责人
      this.select = [...val]
      const select = this.select.map(s => s.name)
      this.form.head_name = select.join(',')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
