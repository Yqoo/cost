<template>
  <el-form
    :model="form"
    size="mini"
    label-width="80px"
    :inline="inline"
  >
    <el-form-item
      v-for="(item, index) in formItems"
      :key="index"
      :label="item.title"
      :prop="item.name"
    >
      <el-input
        v-if="['Varchar', 'Text'].includes(item.type)"
        v-model="form[item.name]"
        clearable
      />
      <el-radio-group v-if="item.type === 'Bit'" v-model="form[item.name]" clearable>
        <el-radio :label="true">
          是
        </el-radio>
        <el-radio :label="false">
          否
        </el-radio>
      </el-radio-group>
      <el-row v-if="['Int', 'Float', 'Money'].includes(item.type)">
        <el-col :span="11">
          <el-input v-model="form[item.name][0]" clearable />
        </el-col>
        <el-col :span="2" style="text-align: center;">
          -
        </el-col>
        <el-col :span="11">
          <el-input v-model="form[item.name][1]" clearable />
        </el-col>
      </el-row>
      <el-row v-if="item.type === 'date'">
        <el-col :span="11">
          <el-date-picker
            v-model="form[item.name][0]"
            type="datetime"
            placeholder="选择开始时间"
            :format="item.value"
            :value-format="item.value"
            style="width: 150px"
            @change="() => confirmTime('start', item.name)"
          />
        </el-col>
        <el-col :span="2" style="text-align: center;">
          -
        </el-col>
        <el-col :span="11">
          <el-date-picker
            v-model="form[item.name][1]"
            type="datetime"
            placeholder="选择结束时间"
            :format="item.value"
            :value-format="item.value"
            style="width: 150px"
            @change="() => confirmTime('end', item.name)"
          />
        </el-col>
      </el-row>
      <el-popover
        placement="bottom-start"
        width="400"
        trigger="click"
      >
        <Tree
          :data="tree[item.name] || []"
          height="200px"
          @setTargetNode="setTargetNode"
        />
        <el-input
          v-if="item.type === 'systemDossier'"
          slot="reference"
          v-model="form[item.name]"
          style="width: 100%"
          clearable
          @clear="clearID(item.name)"
          @focus="getTree(item)"
        />
      </el-popover>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
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
    },
    inline: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: 'queryColumn'
    }
  },
  data() {
    return {
      form: {},
      tree: {},
      idsObj: {}, // 用已存储下拉树实际该保存的id
      targetDSName: ''
    }
  },
  computed: {
    formItems() {
      const { cols, name } = this
      const arr = cols.filter(c => c[name])
      arr.forEach(a => {
        if (['int', 'float', 'money', 'date'].includes(a.type?.toLowerCase())) {
          this.$set(this.form, a.name, [])
        } else this.$set(this.form, a.name, '')
      })
      return arr
    }
  },
  methods: {
    confirmTime(type, name) {
      const [f, s] = this.form[name]
      if (type === 'end' ? f : s && new Date(f).getTime() > new Date(s).getTime()) {
        this.$message.warning('结束时间不能小于开始时间！')
        this.$set(this.form, name, [f, f])
      }
    },
    generateParams() {
      const params = { ...this.form }
      Object.assign(params, this.idsObj)
      const arr = []
      Object.keys(params).forEach(key => {
        const item = Array.isArray(params[key]) ? {
          start: params[key][0] || '',
          end: params[key][1] || ''
        } : {
          value: params[key]
        }
        arr.push({
          name: key,
          type: this.getTypeByName(key),
          ...item
        })
      })
      return arr
    },
    getTypeByName(name) {
      return this.cols.filter(c => c.name === name)[0]?.type
    },
    clearID(name) {
      this.$set(this.idsObj, name, '')
    },
    setTargetNode(node) {
      if (node.disable) this.$message.warning('当前节点无法选择！')
      else {
        this.form[this.targetDSName] = node.label
        this.idsObj[this.targetDSName] = node.sn
      }
    },
    getTree(item) {
      this.targetDSName = item.name
      if (!this.tree[item.name]) {
        console.log(item)
        this.$api.record.getSJTree(this.from, {
          sn: item.value.sn,
          ztsn: this.ztsn,
          nameField: item.value?.useField?.name,
          snField: item.value?.useField?.sn,
          hiddenSn: item.value?.onlyShowName || false
        }).then(s => {
          this.$set(this.tree, item.name, [s.data.tree])
        })
      }
    }
  }
}
</script>

<style>

</style>
