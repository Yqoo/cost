<template>
  <div class="GlComp">
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :modal="false"
      width="60%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="close"
    >
      <div slot="title">
        关联数据
      </div>
      <div class="SelectFile_main">
        <div class="SelectFile_top">
          <el-button size="mini" icon="el-icon-search" class="leftBtn" @click="choiceFile">
            选择档案
          </el-button>
          <ul class="box">
            <li
              v-for="(item, index) in operations"
              :key="index"
              @click="calc(item)"
            >
              {{ item }}
            </li>
            <li class="el-icon-back" style="width: 60px;padding-top: 7px;" @click="del" />
          </ul>
          <div class="rightBtn">
            <Treeselect
              v-model="schemeValue"
              :searchable="true"
              :multiple="false"
              :clearable="true"
              :options="schemeData"
              :normalizer="normalizer"
              placeholder="请选择其他数据"
              open-on-focus
              @select="selectOther"
            />
          </div>
        </div>
        <!-- <div class="exhibition">
          <el-input
            v-model="content"
            readonly
            type="textarea"
            :rows="12"
          />
        </div> -->
        <div class="exhibition1">
          <div v-for="(item,index) in arr" :key="index+item">
            <span v-if="item.value" class="cals" contenteditable="false" :style="item.bd">
              {{ item.value }}
            </span>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button type="info" size="mini" @click="close">
          关闭
        </el-button>
        <el-button type="primary" size="mini" @click="save">
          确认
        </el-button>
      </div>
    </el-dialog>
    <select-file
      :show.sync="sf.show"
      :xm-id="uid"
      :formula="sf.formula"
      @checkRow="checkRow"
    />
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'GlComp',
  components: {
    selectFile: () => import('../dialog/selectFile'),
    Treeselect
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => {}
    },
    treeData: {
      type: Array,
      default: () => []
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
      arr: [],
      schemeData: [],
      dossierData: [],
      obj: {},
      i: 0, // obj的键
      objIndex: 0, // obj的索引
      content: '',
      operations: ['+', '-', '*', '/', '(', ')'],
      dossier: '',
      dataFormula: '',
      dataFormulaArr: [],
      flag: false,
      sf: { // 选择档案数据
        show: false,
        formula: ''
      },
      schemeValue: null
    }
  },
  computed: {
    // arr() {
    //   let values = []
    //   values = Object.values(this.obj)
    //   return values
    // }
  },
  watch: {
    // eslint-disable-next-line func-names
    dossier(val) {
      if (!this.flag) {
        this.content = ''
        this.arr = []
      }
    },
    show: {
      immediate: true,
      handler: 'getDaTree'
    },
    row: {
      immediate: true,
      handler(val) {
        if (val && Object.values(val).length !== 0) {
          this.schemeValue = null
          this.dataFormulaArr = []
          // let i = 0
          // const newObj = {}
          // if (val.dataFormulaShow) {
          //   this.$set(newObj, i++, val.dataFormulaShow)
          // }
          // dataFormulaShow
          if (val.dataFormulaShow) {
            // if (val.dataFormulaShowQt !== '' || val.dataFormulaShowQt !== null) {
            const dataFormulaShowQt = JSON.parse(val.dataFormulaShowQt)
            for (let j = 0; j < dataFormulaShowQt.length; j++) {
              this.$set(this.obj, j, dataFormulaShowQt[j].value)
            }
            this.arr = dataFormulaShowQt
            // }
          } else {
            this.arr = []
            this.obj = {}
          }
          // this.obj = val.dataFormulaShowQt ? JSON.parse(val.dataFormulaShowQt) : newObj
          this.i = Object.keys(this.obj).length ? Object.keys(this.obj).length : 0
          this.flag = true
          this.dossier = val.xmDossierId
          this.content = val.dataFormulaShow
          this.dataFormulaArr = val.dataFormula.split(' ')
          // if (Object.values(this.obj).length) {
          //   this.arr = Object.values(this.obj)
          // }
          // if (val.xmDossierId) this.getDossierDataByDS(val.xmDossierId)
          this.$nextTick(() => {
            this.flag = false
          })
          this.linkOtherData(val.id)
        }
      }
    },
    treeData: {
      immediate: true,
      handler(val) {
        // console.log(val)
      }
    }
  },
  methods: {
    selectOther(node) { // 选择其他数据
      if (this.content !== '') {
        this.content = `${this.content} ${node.label}`
      } else {
        this.content = `${node.label}`
      }
      this.$set(this.obj, this.i++, `${node.label}`)
      this.$set(this.arr, this.arr.length, { value: `${node.label}`, bd: 'border:1px solid orange' })
      // this.arr = Object.values(this.obj)
      let item = ''
      item = `sys_${node.id}`
      this.dataFormulaArr.push(item)
    },
    normalizer(node) { // treeSelect组件数据重组
      if (node.children && !node.children.length) {
        delete node.children
      }
      if (node.children == null || node.children === 'null') {
        delete node.children
      }
    },
    linkOtherData(id) { // 获取其他数据下拉列表
      this.$api.reportxm.linkOtherData({
        xmId: this.uid,
        dossierDataId: id
      }).then(s => {
        this.schemeData = [...s.data]
      }).catch(e => {
        this.$message.error(e.message)
      })
    },
    checkRow(row, target) {
      let item = ''
      if (this.content !== '') {
        this.content = `${this.content} ${row.sn_} ${row.name_}`
      } else {
        this.content = `${row.sn_} ${row.name_}`
      }
      this.$set(this.obj, this.i++, `${row.sn_} ${row.name_}`)
      this.$set(this.arr, this.arr.length, { value: `${row.sn_} ${row.name_}`, bd: 'border:1px solid #000' })
      // this.arr = Object.values(this.obj)
      if (target.type && target.type !== 'kjkm') {
        item = `${target.type.substr(0, 1)}_${target.id}_${row.sn_}`
      } else {
        item = `${target.type.substr(0, 1)}_${target.id}_${row.id_}`
      }
      this.dataFormulaArr.push(item)
    },
    choiceFile() {
      this.sf.show = true
      this.sf.formula = true
    },
    close() {
      this.$emit('update:show', false)
      this.$emit('close')
    },
    // 判断公式是否合法
    validateFormula(string) {
      // 剔除空白符
      string = string.replace(/\s/g, '')
      // 错误情况，空字符串
      if (string === '') {
        return false
      }
      // eslint-disable-next-line no-useless-escape
      if (/^[\÷\+\-\*\/]/.test(string)) {
        // console.error(& amp; quot; 运算符开头 & amp; quot;);
        return false
      }
      // 错误情况，运算符结尾
      // eslint-disable-next-line no-useless-escape
      if (/[\÷\+\-\*\/]$/.test(string)) {
        // console.error(& amp; quot; 运算符结尾 & amp; quot;);
        return false
      }
      // 错误情况，(后面是运算符或者)
      // eslint-disable-next-line no-useless-escape
      if (/\([\÷\+\-\*\/]/.test(string)) {
        // console.error(& amp; quot; (后面是运算符或者) & amp; quot;);
        return false
      }
      // 错误情况，运算符连续
      // eslint-disable-next-line no-useless-escape
      if (/[\÷\+\-\*\/]{2,}/.test(string)) {
        return false
      }
      // 空括号
      if (/\(\)/.test(string)) {
        return false
      }
      // 错误情况，括号不配对
      const stack = []
      for (let i = 0, item; i < string.length; i++) {
        item = string.charAt(i)
        if (item === '(') {
          stack.push('(')
        } else if (item === ')') {
          if (stack.length > 0) {
            stack.pop()
          } else {
            return false
          }
        }
      }
      if (stack.length !== 0) {
        return false
      }
      // 错误情况，(后面是运算符
      // eslint-disable-next-line no-useless-escape
      if (/\([\÷\+\-\*\/]/.test(string)) {
        return false
      }
      // 错误情况，)前面是运算符
      // eslint-disable-next-line no-useless-escape
      if (/[\÷\+\-\*\/]\)/.test(string)) {
        return false
      }
      // 错误情况，(前面不是运算符
      // eslint-disable-next-line no-useless-escape
      // if (/[\÷\+\-\*\/]\(/.test(string)) {
      //   return false
      // }
      // 错误情况，)后面不是运算符
      // eslint-disable-next-line no-useless-escape
      if (/\)[\÷\+\-\*\/]/.test(string)) {
        return false
      }
      return true
    },
    save() {
      const params = { ...this.row }
      const objArr = Object.values(this.obj)
      let next = true
      for (let i = 0; i < objArr.length; i++) {
        if (!this.operations.includes(objArr[i])) {
          objArr[i] = 1
        }
        // 判断相邻两个是否都是值
        if (!this.operations.includes(objArr[i]) && objArr[i + 1] && !this.operations.includes(objArr[i + 1])) {
          next = false
        }
      }
      // if (params.dataFormulaShow !== this.content) {
      if ((this.validateFormula(objArr.join(' ')) || this.content === '') && next) {
        params.dataFormulaShow = this.content
        params.xmDossierId = this.dossier
        params.dataFormula = this.dataFormulaArr.join(' ')
        params.dataFormulaShowQt = JSON.stringify(this.arr)
        const url = params.id ? 'editDossierData' : 'addDossierData'
        this.$api.reportxm[url](params).then(s => {
          this.$emit('refreshTable')
          this.$emit('update:show', false)
        }).catch(e => this.$message.error(e.message))
      } else {
        this.$message.error('您输入的公式不正确！')
      }
      // } else {
      //   this.$emit('update:show', false)
      // }
    },
    calc(opr) { // 输入操作符
      let item = ''
      if (this.content !== '') {
        this.content = `${this.content} ${opr}`
      } else {
        this.content = `${opr}`
      }
      this.$set(this.obj, this.i++, opr)
      this.$set(this.arr, this.arr.length, { value: opr, bd: 'border:none' })
      item = `${opr}`
      this.dataFormulaArr.push(item)
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
    del() { // 退格操作
      this.objIndex = Object.keys(this.obj).length - 1
      if (Object.keys(this.obj).length) {
        Object.keys(this.obj).forEach(key => {
          if (key && +key === this.objIndex) {
            this.dataFormulaArr = this.dataFormulaArr.slice(0, this.dataFormulaArr.length - 1)
            this.arr = this.arr.slice(0, this.arr.length - 1)
            delete this.obj[key]
            this.i--
          }
        })
      }
      const values = Object.values(this.obj)
      this.content = values.join(' ')
    }
  }
}
</script>

<style lang="scss" scoped>
.SelectFile_top{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height:40px;
  margin-bottom: 10px;
  .leftBtn{
    width:20%;
    height:36px;
  }
  .box {
      display: flex;
      flex-flow: row wrap;
      // height:100%;
      li{
        box-sizing: border-box;
        padding: 3px 12px;
        text-align: center;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-right: 12px;
        cursor: pointer;
      }
      li:hover {
        background: #409eff;
        color: #fff;
      }
  }
  .rightBtn{
    width:20%;
    position: relative;
    top:2px;
    height:100%;
    .vue-treeselect{
      top:0;
      left:0;
    }
  }
}
.exhibition{
    width:100%;
    height:100%;
}
.exhibition1{
  display: flex;
  min-height:264px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  span{
    margin: 0 6px;
  }
  .cals{
    // border: 1px solid #000;
    padding: 6px;
  }
}
</style>
