<template>
  <el-dialog
    v-dialogDrag
    :visible.sync="show"
    :modal="false"
    width="35%"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="close"
  >
    <div slot="title">
      关联数据
    </div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="mini"
      label-width="60px"
      label-position="top"
    >
      <el-form-item label="档案" prop="">
        <el-select
          v-model="form.dossier"
          placeholder="请选择档案"
          size="mini"
          style="width:100%"
          @change="getDossierDataByDS"
        >
          <el-option
            v-for="item in dossierData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="关联档案" prop="" style="min-height: 150px;">
        <div style="position: relative;">
          <div style="margin-right: 100px;">
            <el-input
              v-model="form.content"
              readonly
              type="textarea"
              :rows="7"
            />
          </div>
          <div style="position:absolute;
            top: 0px; right: 0px;
            width: 90px;
            margin-left: 10px;
            height: 100%;"
          >
            <el-dropdown trigger="click" @command="command">
              <el-button type="default" size="mini" style="width: 87px; margin-bottom: 3px;">
                方案
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="!schemeData.length" disabled>
                  请先选择档案
                </el-dropdown-item>
                <el-dropdown-item
                  v-for="item in schemeData"
                  v-else
                  :key="item.id"
                  :command="item.name"
                  v-text="item.name"
                />
              </el-dropdown-menu>
            </el-dropdown>
            <ul class="box">
              <li
                v-for="(item, index) in operations"
                :key="index"
                @click="calc(item)"
              >
                {{ item }}
              </li>
              <li class="el-icon-back" style="width: 87px; height: 28px" @click="del" />
            </ul>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="info" size="mini" @click="close">
        关闭
      </el-button>
      <el-button type="primary" size="mini" @click="save">
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => {}
    },
    uid: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      schemeData: [],
      dossierData: [],
      operations: ['+', '-', '*', '/', '{', '}'],
      form: {
        dossier: '',
        content: '',
        dataFormula: ''
      },
      rules: {},
      obj: {},
      i: 0, // obj的键
      objIndex: 0, // obj的索引
      flag: false
    }
  },
  watch: {
    // eslint-disable-next-line func-names
    'form.dossier': function (val) {
      if (!this.flag) this.form.content = ''
    },
    show: {
      immediate: true,
      handler: 'getDaTree'
    },
    row: {
      immediate: true,
      handler(val) {
        if (Object.keys(val).length) {
          let i = 0
          const newObj = {}
          this.$set(newObj, i++, val.dataFormulaShow)
          this.obj = val.dataFormulaShowQt ? JSON.parse(val.dataFormulaShowQt) : newObj
          this.i = Object.keys(this.obj).length ? Object.keys(this.obj).length : 0
          this.flag = true
          this.form.dossier = val.xmDossierId
          this.form.content = val.dataFormulaShow
          if (val.xmDossierId) this.getDossierDataByDS(val.xmDossierId)
          this.$nextTick(() => {
            this.flag = false
          })
        }
      }
    }
  },
  methods: {
    close() {
      this.$emit('update:show', false)
      this.$emit('close')
    },
    save() {
      const values = Object.values(this.obj)
      const newValues = [...values]
      for (let i = 0, len = newValues.length; i < len; i++) {
        for (let j = 0, lengt = this.schemeData.length; j < lengt; j++) {
          if (this.schemeData[j].name === newValues[i]) {
            newValues[i] = this.schemeData[j].id
          }
        }
      }
      this.form.dataFormula = newValues.join(' ')
      const params = { ...this.row }
      params.dataFormulaShow = this.form.content
      params.xmDossierId = this.form.dossier
      params.dataFormula = this.form.dataFormula
      params.dataFormulaShowQt = JSON.stringify(this.obj)
      const url = params.id ? 'editDossierData' : 'addDossierData'
      this.$api.reportxm[url](params).then(s => {
        this.$emit('refreshTable')
        this.$emit('update:show', false)
      }).catch(e => this.$message.error(e.message))
    },
    getDossierDataByDS(val) { // 获取公式源数据
      this.$api.reportxm.getDossierDataByDS({ xmDossierId: val }).then(s => {
        this.schemeData = [...s.data]
      }).catch(e => this.$message.error(e.message))
    },
    getDaTree(val) { // 获取档案关联数据
      if (val && this.uid) {
        this.$api.reportxm.getDtree({ xmId: this.uid }).then(s => {
          this.dossierData = s.data
        }).catch(e => {
          this.$message.error(e.message)
        })
      }
    },
    calc(opr) {
      this.form.content = `${this.form.content} ${opr}`
      this.$set(this.obj, this.i++, opr)
    },
    command(value) {
      this.form.content = `${this.form.content} ${value}`
      this.$set(this.obj, this.i++, value)
    },
    del() { // 退格操作
      this.objIndex = Object.keys(this.obj).length - 1
      if (Object.keys(this.obj).length) {
        Object.keys(this.obj).forEach(key => {
          if (key && +key === this.objIndex) {
            delete this.obj[key]
            this.i--
          }
        })
      }
      const values = Object.values(this.obj)
      this.form.content = values.join(' ')
    }
  }
}
</script>

<style lang="scss" scoped>
  .box {
    display: flex;
    flex-flow: row wrap;
    height: calc(100% - 30px);
    li{
      box-sizing: border-box;
      width: 30%;
      text-align: center;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin: 1px;
      line-height: 30px;
      cursor: pointer;
    }
    li:hover {
      background: #409eff;
      color: #fff;
    }
  }
</style>
