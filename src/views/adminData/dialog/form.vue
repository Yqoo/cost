<template>
  <el-dialog
    v-dialogDrag
    :modal="false"
    width="40%"
    :visible.sync="show"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="() => $emit('update:show', false)"
  >
    <div slot="title">
      {{ JSON.stringify(info) === '{}' ? '新增' : '编辑' }}
    </div>
    <el-form
      ref="form"
      v-waiting="loading"
      :model="form"
      :rules="rules"
      size="mini"
      label-width="100px"
    >
      <el-form-item
        v-for="(item, index) in formitem"
        :key="index"
        :label="item.label"
        :prop="item.prop"
        :rules="item.rules"
      >
        <el-input
          v-if="['Varchar', 'Int', 'Float', 'Money'].includes(item.type)"
          v-model="form[item.prop]"
        />
        <el-radio-group v-if="item.type === 'Bit'" v-model="form[item.prop]">
          <el-radio :label="true">
            是
          </el-radio>
          <el-radio :label="false">
            否
          </el-radio>
        </el-radio-group>
        <el-input v-if="item.type === 'Text'" v-model="form[item.prop]" type="textarea" :rows="4" />
        <el-date-picker
          v-if="item.type === 'date'"
          v-model="form[item.prop]"
          type="datetime"
          placeholder="选择日期"
          :format="item.value"
          :value-format="item.value"
        />
        <el-popover
          placement="bottom-start"
          width="400"
          trigger="click"
        >
          <Tree
            :ref="item.prop"
            :data="tdObj[item.prop]"
            height="200px"
            :check-box="item.value && item.value.multiple"

            :default-checked-keys="defaultCheckedKeys[item.prop] || []"
            @check-change="checkChange"
            @setTargetNode="node => setSDId(node, item.value)"
          />
          <el-input
            v-if="item.type === 'systemDossier'"
            slot="reference"
            v-model="sdSelect[item.prop].name"
            style="width: 100%"
            clearable
            @clear="clearSystemDossier(item.prop)"
            @focus="targetProp = item.prop"
          />
        </el-popover>
      </el-form-item>
      <el-form-item v-if="hasParent" label="上级" prop="pidName">
        <el-select v-model="parentTree.name" style="width: 100%" clearable @clear="clearParent">
          <el-option value="" style="height: 250px; overflow-y: auto; padding: 0px">
            <Tree
              :data="parentTree.data"
              :search="false"
              in-box
              @setTargetNode="setPid"
            />
          </el-option>
        </el-select>
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
</template>

<script>
import axios from 'axios'
import ldDetailVue from '../../management/reportBb/reportXmDa/dialog/ldDetail.vue'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    formItems: {
      type: Array,
      default: () => []
    },
    from: {
      type: String,
      default: ''
    },
    daid: {
      type: String,
      default: ''
    },
    ztsn: {
      type: String,
      default: ''
    },
    info: {
      type: Object,
      default: () => {}
    },
    hasParent: {
      type: Boolean,
      default: false
    },
    scheme: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const checkInt = (rules, value, callback) => {
      if (value === '') {
        callback(new Error('请输入整数'))
      } else if (/^\d+$/.test(value)) {
        callback()
      } else {
        callback(new Error('请输入整数'))
      }
    }
    const checkFloat = (rules, value, callback) => {
      if (value === '') {
        callback(new Error('请输入小数'))
      } else if (/^(-)?(([0-9])|([1-9]([0-9]+)))(.[0-9]{1,2})$/.test(value)) {
        callback()
      } else {
        callback(new Error('小数点后面保留两位'))
      }
    }
    return {
      loading: false,
      form: {},
      rules: {
        Int: [{ required: true, validator: checkInt, trigger: 'blur' }],
        Text: [{ required: true, message: '必填', trigger: 'blur' }],
        Varchar: [{ required: true, message: '必填', trigger: 'blur' }],
        Float: [{ required: true, validator: checkFloat, trigger: 'blur' }],
        Money: [{ required: true, message: '请输入金额', trigger: 'blur' }],
        date: [{ required: true, message: '请选择日期', trigger: 'blur' }],
        systemDossier: [{ required: true, message: '请设置档案', trigger: 'blur' }]
      },
      tdObj: {},
      sdSelect: {}, // 系统档案下拉
      targetProp: '', // 系统档案下拉当前聚焦的prop
      treeLoading: false,
      parentTree: {
        data: [],
        name: '',
        list: [] // 树平铺数据,
      },
      update: {
        id: '', // 编辑行的id
        sn: '', // 编辑sn所代表的字段
        pid_: '' // 如果存在上级树 需使用期id
      },
      list: {}, // 树平铺数据,
      hasDone: false, // 判断是否已成功给表单所有字段赋值
      tds: {},
      defaultCheckedKeys: {}
    }
  },
  computed: {
    formitem() {
      const { formItems, rules, info } = this
      const status = JSON.stringify(info) === '{}'
      const arr = formItems.map(item => {
        this.$set(this.form, item.prop, '')
        if (item.isSnField) this.update.sn = item.prop // 编辑时需确定sn具体代表的字段是什么
        if (item.type === 'systemDossier') this.setAxiosList(item)
        return {
          label: item.label,
          prop: item.prop,
          required: item.required,
          type: item.type,
          rules: item.required ? rules[item.type] : [],
          value: item.value
        }
      })
      this.getTDs()
      return arr
    },
    doneAndParentTree() {
      const { hasDone } = this
      const { list } = this.parentTree
      return { hasDone, list }
    }
  },
  watch: {
    doneAndParentTree(obj) {
      if (obj.hasDone && obj.list.length) {
        for (let i = 0, len = obj.list.length; i < len; i++) {
          if (obj.list[i].id === this.update.pid_) {
            this.parentTree.name = obj.list[i].label
            break
          }
        }
      }
    },
    hasParent: {
      immediate: true,
      handler: 'getParentTree'
    }
  },
  methods: {
    checkChange() {
      const { targetProp } = this
      const nodes = this.$refs[targetProp][0]?.getCheckedNodes()
      if (nodes) {
        const sns = nodes.map(n => n.sn)
        const names = nodes.map(n => n.label)
        this.form[targetProp] = sns.join(',')
        this.sdSelect[targetProp].name = names.join(',')
      }
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const params = { ...this.form }
          if (JSON.stringify(this.info) !== '{}') params.id_ = this.update.id
          if (this.hasParent) params.pid_ = this.update.pid_
          let url = 'saveSJ'
          let p = {
            daId: this.daid,
            ztsn: this.ztsn,
            data: JSON.stringify(params)
          }
          if (this.scheme && this.scheme.api) {
            p = {
              fzhsSn: this.scheme.fzhsSn,
              faSn: this.scheme.faSn,
              ztsn: this.ztsn,
              data: JSON.stringify(params)
            }
            url = this.scheme.api
          }
          this.$api.record[url](this.from, p).then(s => {
            this.$message.success('保存成功！')
            this.close(s.data)
            this.loading = false
          }).catch(e => {
            this.loading = false
            this.$message.error(e.message)
          })
        }
      })
    },
    setAxiosList(item) {
      this.$set(this.sdSelect, item.prop, {
        prop: item.prop,
        name: ''
      })
      const a = this.$api.record.getSJTree(this.from, {
        sn: item.value.sn,
        ztsn: this.ztsn,
        nameField: item.value?.useField?.name,
        snField: item.value?.useField?.sn
      })
      this.$set(this.tds, item.prop, a)
    },
    updateGetInfo(info) {
      this.loading = true
      let url = 'getSJinfo'
      let data = {
        id: info.id_,
        daId: this.daid,
        ztsn: this.ztsn
      }
      if (this.scheme && this.scheme.api) {
        url = this.scheme.getInfo
        data = {
          id: info.id_,
          fzhsSn: this.scheme.fzhsSn,
          ztsn: this.ztsn
        }
      }
      this.$api.record[url](this.from, data).then(s => {
        Object.keys(this.form).forEach(key => {
          this.form[key] = s.data[key] || ''
        })
        this.update.id = s.data.id_ // 编辑时所需要的id
        this.update.pid_ = s.data.pid_
        this.setSelectName()
        this.hasDone = true
        this.loading = false
      }).catch(e => {
        this.loading = false
        this.$message.error(e.message)
      })
    },
    setSelectName() {
      Object.keys(this.sdSelect).forEach(key => {
        const list = this.list[key]
        const sns = this.form[key].split(',') || []
        this.$set(this.defaultCheckedKeys, key, sns)
        let str = ''
        for (let i = 0, len = list?.length; i < len; i++) {
          if (this.form[key].includes(list[i].sn)) {
            str += `${list[i].label},`
          }
        }
        this.sdSelect[key].name = str.slice(0, -1)
      })
    },
    clearSystemDossier(prop) {
      this.form[prop] = ''
      this.sdSelect[prop].name = ''
    },
    clearParent() {
      this.update.pid_ = ''
      this.parentTree.name = ''
    },
    close(id) {
      this.$emit('refreshTable', [id])
      this.$emit('update:show', false)
    },
    getParentTree(bool) {
      if (bool) {
        this.$api.record.getSJTree(this.from, {
          sn: this.daid,
          ztsn: this.ztsn,
          id: this.info.id_
        }).then(s => {
          const { list, tree } = s.data
          this.parentTree.data = [tree]
          this.parentTree.list = list
        }).catch(e => {
          this.$message.error(e.message)
        })
      }
    },
    setPid(node) {
      if (node.disable || node.id === 'root') this.$message.warning('当前节点无法选择！')
      else {
        this.update.pid_ = node.id
        this.parentTree.name = node.label
      }
    },
    setSDId(node, value) {
      const { multiple } = value
      if (!multiple) {
        if (node.disabled) this.$message.warning('当前节点无法选择！')
        else {
          const { targetProp } = this
          if (targetProp) {
            this.form[targetProp] = node.sn
            this.sdSelect[targetProp].name = node.label
          }
        }
      }
    },
    getTDs() {
      axios.all(Object.values(this.tds)).then(axios.spread((...a) => {
        Object.keys(this.tds).forEach((key, i) => {
          const { list, tree } = a[i].data
          this.$set(this.tdObj, key, [tree])
          this.$set(this.list, key, list)
        })
        const status = JSON.stringify(this.info) === '{}'
        if (!status) this.updateGetInfo(this.info)
      }))
    }
  }
}
</script>

<style>

</style>
