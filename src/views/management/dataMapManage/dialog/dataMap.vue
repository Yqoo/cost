<template>
  <div>
    <el-dialog
      v-dialogDrag
      :modal="false"
      width="39%"
      :visible.sync="show"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        修改映射方案
      </div>
      <div class="formBox">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          size="mini"
          label-width="80px"
        >
          <el-form-item label="目标" prop="minorElementsName">
            <el-select
              v-model="form.minorElementsName"
              :multiple="multiple"
              style="width: 88%"
              @focus="getDataTree"
              @remove-tag="removeTag"
            >
              <el-option value="" style="height: 250px; overflow-y: auto; padding: 0px">
                <Tree
                  :data="cys"
                  :search="false"
                  in-box
                  @setTargetNode="setCys"
                />
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button
          type="info"
          size="mini"
          @click="() => $emit('update:show', false)"
        >
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="save">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    versionId: {
      type: String,
      default: ''
    },
    updateInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      cys: [],
      form: {
        mainElementsSn: '',
        minorElements: [], // 目标
        minorElementsName: [] // 回显
      },
      multiple: true,
      minorObj: {},
      update: {},
      rules: {
        minorElementsName: [{ required: 'true', message: '请选择目标', trigger: 'change' }]
      }
    }
  },
  watch: {
    updateInfo: {
      immediate: true,
      handler: 'getInfo'
    }
  },
  created() {
    this.getDataTree()
  },
  methods: {
    removeTag(tag) { // 多选框移除
      const deleteId = this.minorObj[tag]
      this.form.minorElements = this.form.minorElements.filter(ele => ele !== deleteId)
      delete this.minorObj[tag]
    },
    setCys(node) { // 目标
      const { disabled, id, label } = node
      if (disabled === true || this.form.mainElementsSn === id) {
        this.$message.warning('该节点不可选择')
      } else if (!this.minorObj[label]) {
        if (this.update.reverse) {
          this.minorObj[label] = id
          this.form.minorElementsName.push(label)
          this.form.minorElements.push(id)
        } else {
          this.minorObj = { [label]: id }
          this.form.minorElementsName = [label]
          this.form.minorElements = [id]
        }
      }
    },
    // 获取数据选择树
    getDataTree() {
      const params = { ...this.update }
      delete params.reverse
      delete params.sourceValue
      delete params.targetValue
      this.update.reverse ? params.type = 'SOURCE' : params.type = 'TARGET'
      this.$api.dataMapManage
        .getDataTree(params)
        .then(s => {
          this.cys = s.data
        })
        .catch(e => {
          this.$message.error(e.message)
        })
    },
    // 数据回显
    getInfo(val) {
      if (val) {
        this.update = val
        this.$api.dataMapManage
          .editDataMap(val)
          .then(s => {
            if (s.data) {
              this.minorObj = {}
              Object.keys(s.data).forEach(e => {
                this.form.minorElementsName.push(`${e} ${s.data[e]}`)
                this.form.minorElements.push(e)
                this.minorObj[`${e} ${s.data[e]}`] = e
              })
            }
          })
          .catch(e => {
            this.$message.error(e.message)
          })
      }
    },
    save() {
      const p = {
        versionId: this.update.versionId,
        targetValue: this.update.sourceValue,
        sourceValue: JSON.stringify(this.form.minorElements),
        reverse: this.update.reverse
      }
      if (this.update.reverse) {
        p.sourceValue = JSON.stringify(this.form.minorElements)
        p.targetValue = this.update.sourceValue
      } else {
        p.sourceValue = JSON.stringify([this.update.sourceValue])
        p.targetValue = [this.form.minorElements[0]].join()
      }
      this.$api.dataMapManage
        .saveDataTree(p)
        .then(s => {
          this.$emit('success')
          this.$emit('update:show', false)
        })
        .catch(e => {
          this.$emit('update:show', false)
          this.$message.error(e.message)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.formBox{
  height:220px;
  display:flex;
  justify-content: center;
  align-items: center;
  .el-form{
    width:100%;
  }
}
</style>
