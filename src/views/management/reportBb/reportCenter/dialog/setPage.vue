<template>
  <div class="setPage">
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :model="false"
      width="40%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => this.$emit('update:show', false)"
    >
      <div slot="title">
        页面设置
      </div>
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="页面" name="yemian">
          <el-radio-group v-model="direction" class="dir">
            <div>
              <i class="iconfont icon-zongxiang1" />
              <el-radio :label="'zong'">
                纵向
              </el-radio>
            </div>
            <div>
              <i class="iconfont icon-hengxiang1" />
              <el-radio :label="'heng'">
                横向
              </el-radio>
            </div>
          </el-radio-group>
          <div class="box">
            <span>缩放比例：</span>
            <el-input-number v-model="scaleNumber" :step="5" size="mini" />
            <span> % 正常比例</span>
          </div>
          <div class="box">
            <span>纸张大小：</span>
            <el-select v-model="pageSize" size="mini">
              <el-option v-for="item in sizes" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
        </el-tab-pane>
        <el-tab-pane label="页边距" name="yebianju">
          <div class="pos">
            <span class="left" />
            <div class="midd">
              <span>上：</span>
              <el-input-number
                v-model="pageMargin.top"
                :min="0"
                :step="0.5"
                size="mini"
                @change="(cur, old) => changeDis(cur, old, 'top')"
              />
            </div>
            <div>
              <span>页眉：</span>
              <el-input-number
                v-model="pageMargin.header"
                :min="0"
                :step="0.5"
                size="mini"
                @change="(cur, old) => changeDis(cur, old, 'header')"
              />
            </div>
          </div>
          <div class="pos">
            <div class="left">
              <span>左：</span>
              <el-input-number
                v-model="pageMargin.left"
                :min="0"
                :step="0.5"
                size="mini"
                @change="(cur, old) => changeDis(cur, old, 'left')"
              />
            </div>
            <div class="midd">
              <div class="dir-show">
                <p :style="line.top" />
                <div class="dir-table" :style="line.middle">
                  <table :class="tableDir">
                    <tr><td /><td /><td /></tr>
                    <tr><td /><td /><td /></tr>
                    <tr><td /><td /><td /></tr>
                  </table>
                </div>
                <p :style="line.bottom" />
              </div>
            </div>
            <div>
              <span>右：</span>
              <el-input-number
                v-model="pageMargin.right"
                :min="0"
                :step="0.5"
                size="mini"
                @change="(cur, old) => changeDis(cur, old, 'right')"
              />
            </div>
          </div>
          <div class="pos">
            <span class="left">单位：厘米</span>
            <div class="midd">
              <span>下：</span>
              <el-input-number
                v-model="pageMargin.bottom"
                :min="0"
                :step="0.5"
                size="mini"
                @change="(cur, old) => changeDis(cur, old, 'bottom')"
              />
            </div>
            <div>
              <span>页脚：</span>
              <el-input-number
                v-model="pageMargin.footer"
                :min="0"
                :step="0.5"
                size="mini" @change="(cur, old) => changeDis(cur, old, 'footer')"
              />
            </div>
          </div>
          <div class="center-way">
            <h2>居中方式</h2>
            <el-checkbox-group v-model="centerWays" @change="centerWaysStyle">
              <el-checkbox label="ver">
                垂直
              </el-checkbox>
              <el-checkbox label="hor">
                居中
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-tab-pane>
        <el-tab-pane label="页眉/页脚" name="yemeiyej">
          <div class="preview">
            <p v-if="header === ''" class="view">
              预览
            </p>
            <div v-else class="show">
              <span v-for="(e, i) in view['header']" :key="i" :style="e.style">{{ e.value }}</span>
            </div>
          </div>
          <div class="select">
            <span>页眉A：</span>
            <el-select v-model="header" size="mini" @change="val => changePreview(val, 'header')">
              <el-option v-for="e in showItems['header']" :key="e.value" :label="e.key" :value="e.value" />
            </el-select>
            <el-button size="mini" @click.native="setymyj('header')">
              自定义页眉
            </el-button>
          </div>
          <div class="preview">
            <p v-if="footer === ''" class="view">
              预览
            </p>
            <div v-else class="show footer-show">
              <span v-for="(e, i) in view['footer']" :key="i" :style="e.style">{{ e.value }}</span>
            </div>
          </div>
          <div class="select">
            <span>页脚F：</span>
            <el-select v-model="footer" size="mini" @change="val => changePreview(val, 'footer')">
              <el-option v-for="k in showItems['footer']" :key="k.value" :label="k.key" :value="k.value" />
            </el-select>
            <el-button size="mini" @click.native="setymyj('footer')">
              自定义页脚
            </el-button>
          </div>
          <p class="check">
            <el-checkbox v-model="oddEven">
              奇偶页不同
            </el-checkbox>
            <el-checkbox v-model="first">
              首页不同
            </el-checkbox>
          </p>
        </el-tab-pane>
        <el-tab-pane label="工作表" name="workSheet">
          <div class="line">
            <h5>打印标题</h5>
            <div class="main">
              <p>
                <span>
                  顶端标题行：
                </span>
                <el-input v-model="printTitle.top" size="mini">
                  <el-tooltip
                    slot="suffix"
                    class="item"
                    effect="light"
                    content="顶端标题行格式可定义为“$1:$1”"
                    placement="top-end"
                  >
                    <i class="el-input__icon el-icon-question" />
                  </el-tooltip>
                </el-input>
              </p>
              <p>
                <span>
                  左端标题行：
                </span>
                <el-input v-model="printTitle.left" size="mini">
                  <el-tooltip
                    slot="suffix"
                    class="item"
                    effect="light"
                    content="左端标题行格式可定义为“$A:$A”, 注意区分大小写"
                    placement="top-end"
                  >
                    <i class="el-input__icon el-icon-question" />
                  </el-tooltip>
                </el-input>
              </p>
            </div>
          </div>
          <div class="line">
            <h5>打印</h5>
            <div class="main">
              <el-checkbox-group v-model="checkList">
                <el-checkbox label="gridLine">
                  网格线
                </el-checkbox>
                <el-checkbox label="printColor">
                  单色打印
                </el-checkbox>
                <el-checkbox label="rowcOlHeaders">
                  行号列表
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="line">
            <h5>
              打印顺序
            </h5>
            <div class="main printOrder">
              <div class="radio">
                <el-radio v-model="radio" label="rowCol">
                  先行后列
                </el-radio><br>
                <el-radio v-model="radio" label="colRow" style="margin-top: 10px">
                  先列后行
                </el-radio>
              </div>
              <p class="image">
                <img
                  :src="radio === 'rowCol'
                    ? require('@/assets/images/print/rowCol.png')
                    : require('@/assets/images/print/colRow.png')"
                  alt=""
                >
              </p>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <p style="text-align: right; margin-top: 10px">
        <el-button size="mini" @click="preview">
          打印预览
        </el-button>
      </p>
      <div slot="footer">
        <el-button type="info" size="mini" @click="() => this.$emit('update:show', false)">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="save">
          确定
        </el-button>
      </div>
    </el-dialog>
    <SetYhYf
      v-if="setYHYF.show"
      :show.sync="setYHYF.show"
      :data.sync="setYHYF.data"
      @update="chengeStyle"
    />
  </div>
</template>

<script>
import SetYhYf from './setYHYF'

export default {
  name: 'SetPage',
  components: {
    SetYhYf
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    active: {
      type: String,
      default: ''
    },
    print: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      view: { // 预览数据
        header: {},
        footer: {},
        headerValue: {},
        footerValue: {}
      },
      activeName: this.active,
      pageMargin: { // 页边距
        top: 1.91,
        header: 0.76,
        left: 1.78,
        right: 1.78,
        bottom: 1.91,
        footer: 0.76
      },
      direction: 'zong', // 纸张方向
      scaleNumber: 100, // 缩放比例
      pageSize: 'A4_PAPERSIZE', // 纸张大小
      header: '', // 页眉
      footer: '', // 页脚
      oddEven: false, // 奇偶页不同
      first: false, // 首页不同
      centerWays: [], // 居中方式
      tableDir: 'nor',
      sizes: [
        { label: '信纸', value: 'LETTER_PAPERSIZE' },
        { label: '小号信纸', value: 'LETTER_SMALL_PAGESIZE' },
        { label: 'Tabloid', value: 'TABLOID_PAPERSIZE' },
        { label: 'Ledger', value: 'LEDGER_PAPERSIZE' },
        { label: '法律专用纸', value: 'LEGAL_PAPERSIZE' },
        { label: 'Statement', value: 'STATEMENT_PAPERSIZE' },
        { label: 'Excutive', value: 'EXECUTIVE_PAPERSIZE' },
        { label: 'A3', value: 'A3_PAPERSIZE' },
        { label: 'A4', value: 'A4_PAPERSIZE' },
        { label: 'A4(小号)', value: 'A4_SMALL_PAPERSIZE' },
        { label: 'A5', value: 'A5_PAPERSIZE' },
        { label: 'B4', value: 'B4_PAPERSIZE' },
        { label: 'B5', value: 'B5_PAPERSIZE' },
        { label: 'Folio', value: 'FOLIO8_PAPERSIZE' },
        { label: 'Quarto', value: 'QUARTO_PAPERSIZE' },
        { label: '10*14', value: 'TEN_BY_FOURTEEN_PAPERSIZE' },
        { label: '11*17', value: 'ELEVEN_BY_SEVENTEEN_PAPERSIZE' },
        { label: '便签', value: 'NOTE8_PAPERSIZE' },
        { label: '信封 #9', value: 'ENVELOPE_9_PAPERSIZE' },
        { label: '信封 #10', value: 'ENVELOPE_10_PAPERSIZE' },
        { label: '信封DL', value: 'ENVELOPE_DL_PAPERSIZE' },
        { label: '信封C5', value: 'ENVELOPE_C5_PAPERSIZE' },
        { label: '信封C3', value: 'ENVELOPE_C3_PAPERSIZE' },
        { label: '信封C4', value: 'ENVELOPE_C4_PAPERSIZE' },
        { label: '信封C6', value: 'ENVELOPE_C6_PAPERSIZE' },
        { label: '信封Monarch', value: 'ENVELOPE_MONARCH_PAPERSIZE' },
        { label: 'A4特大', value: 'A4_EXTRA_PAPERSIZE' },
        { label: 'A4横向', value: 'A4_TRANSVERSE_PAPERSIZE' },
        { label: 'A4加大', value: 'A4_PLUS_PAPERSIZE' },
        { label: '信纸旋转', value: 'LETTER_ROTATED_PAPERSIZE' },
        { label: 'A4旋转', value: 'A4_ROTATED_PAPERSIZE' }
      ],
      radio: 'rowCol', // 打印顺序
      checkList: [], // 工作表打印选择
      showItems: {
        footer: [
          { key: '无', value: '' },
          { key: '第 1 页', value: '第 &[页码] 页' },
          { key: '第 1 页，共 1 页', value: '第 &P 页 ， 共 &N 页' },
          { key: 'sheet1', value: '&[标签名]' }
        ],
        header: [
          { key: '无', value: '' },
          { key: '第 1 页', value: '第 &[页码] 页' },
          { key: '第 1 页，共 1 页', value: '第 &P 页 ， 共 &N 页' },
          { key: 'sheet1', value: '&[标签名]' }
        ]
      },
      setYHYF: { // 自定义页眉页脚
        show: false,
        data: {}
      },
      line: {
        top: {},
        middle: {},
        bottom: {}
      },
      printTitle: { // 打印标题
        top: '',
        left: ''
      }
    }
  },
  watch: {
    show: {
      immediate: true,
      handler: 'getInfo'
    }
  },
  methods: {
    preview() { // 打印预览
      const {
        flag, index1, index2, index3, index4
      } = this.verify()
      if (flag) {
        if (index1 && index2) this.printTitle.top = `${index1}:${index2}`
        if (index3 && index4) this.printTitle.left = `${index3}:${index4}`
        const params = this.printInfo()
        this.$emit('update', params)
        this.$emit('getPrintImg')
      }
    },
    verify() { // 验证打印标题
      let flag = false
      const { hot } = this.$parent
      const colHeader = hot.getColHeader()
      const rowHeader = hot.getRowHeader()
      const { top, left } = this.printTitle
      const arr1 = top.indexOf(':') > -1 ? top.split(':') : []
      const arr2 = left.indexOf(':') > -1 ? left.split(':') : []
      let startRow = ''
      let startCol = ''
      let endRow = ''
      let endCol = ''
      if (arr1 && arr1.length) {
        startRow = arr1[0].split('$')[1] * 1
        endRow = arr1[1].split('$')[1] * 1
      }
      if (arr2 && arr2.length) {
        // eslint-disable-next-line prefer-destructuring
        startCol = arr2[0].split('$')[1]
        // eslint-disable-next-line prefer-destructuring
        endCol = arr2[1].split('$')[1]
      }
      if (
        (top && top.indexOf(':') === -1)
        || (left && left.indexOf(':') === -1)
        || (arr1.length && arr1[0].split('$')[0])
        || (arr1.length && arr1[1].split('$')[0])
        || (arr2.length && arr2[0].split('$')[0])
        || (arr2.length && arr2[1].split('$')[0])
        || (isNaN(startRow) && !rowHeader.includes(startRow))
        || (isNaN(endRow) && !rowHeader.includes(endRow))
        || (startCol && !colHeader.includes(startCol))
        || (endCol && !colHeader.includes(endCol))
      ) {
        flag = false
        this.$alert('输入的为非法引用或名称', '提示', {
          confirmButtonText: '确定',
          callback: action => {
          }
        })
      } else flag = true
      let index1 = ''
      let index2 = ''
      let index3 = ''
      let index4 = ''
      if (endRow) {
        const one = rowHeader.findIndex(l => l === startRow)
        const two = rowHeader.findIndex(l => l === endRow)
        if (one > two) {
          // eslint-disable-next-line prefer-destructuring
          index1 = arr1[1]
          // eslint-disable-next-line prefer-destructuring
          index2 = arr1[0]
        }
      }
      if (endCol) {
        const one = colHeader.findIndex(l => l === startCol)
        const two = colHeader.findIndex(l => l === endCol)
        if (one > two) {
          // eslint-disable-next-line prefer-destructuring
          index3 = arr2[1]
          // eslint-disable-next-line prefer-destructuring
          index4 = arr2[0]
        }
      }
      return {
        flag, index1, index2, index3, index4
      }
    },
    chengeStyle(data) { // 自定义改变页眉页脚
      const { title, styles, styleValue } = data
      this.view[title] = styleValue
      this.view[`${title}Value`] = styles
      this[title] = `${styleValue.left.value}*${styleValue.middle.value}*${styleValue.right.value}`
      const val = this.showItems[title].some(l => l.value === styleValue.middle.value)
        ? this.showItems[title].filter(l => l.value === styleValue.middle.value)[0].key
        : styleValue.middle.value
      const obj = {
        key: `${styleValue.left.value}*${val}*${styleValue.right.value}`,
        value: `${styleValue.left.value}*${styleValue.middle.value}*${styleValue.right.value}`
      }
      this.showItems[title].length > 4
        ? this.$set(this.showItems, this.showItems[title].length - 1, obj)
        : this.showItems[title].push(obj)
    },
    getInfo(bool) {
      if (bool) {
        const { printHeader, printFooter, printStyle } = this.print
        Object.assign(this.view.headerValue, printHeader)
        Object.assign(this.view.footerValue, printFooter)
        Object.keys(printStyle).forEach(k => {
          this[k] = printStyle[k]
        })
        this.centerWays = this.tableDir === 'nor' ? [] : this.tableDir.split(' ')
      }
    },
    changePreview(val, type) { // 下拉框改变页眉页脚
      const arr = val.split('*')
      if (arr.length === 1) this.view[type] = { middle: { value: val } }
      else {
        this.view[type] = {
          left: { value: arr[0] },
          middle: { value: arr[1] },
          right: { value: arr[2] }
        }
      }
    },
    setymyj(type) { // 自定义设置页眉页脚
      this.setYHYF = {
        show: true,
        data: {
          title: type,
          styles: this.view[type]
        }
      }
    },
    changeDis(cur, old, type) {
      this.line = {
        top: {},
        middle: {},
        bottom: {}
      }
      const val = '1px solid #f97b04'
      // eslint-disable-next-line default-case
      switch (type) {
        case 'top':
          this.line.top = { 'border-bottom': val }
          break
        case 'header':
          this.line.top = { 'border-top': val }
          break
        case 'left':
          this.line.middle = { 'border-left': val }
          break
        case 'right':
          this.line.middle = { 'border-right': val }
          break
        case 'bottom':
          this.line.bottom = { 'border-top': val }
          break
        case 'footer':
          this.line.bottom = { 'border-bottom': val }
          break
      }
    },
    centerWaysStyle(val) { // 设置居中样式
      this.tableDir = val.length === 0 ? 'nor' : val.join(' ')
    },
    save() {
      const params = this.printInfo()
      this.$emit('update', params)
      this.$emit('update:show', false)
    },
    printInfo() { // 打印信息
      const params = {
        printHeader: this.view.headerValue,
        printFooter: this.view.footerValue,
        printStyle: {
          oddEven: this.oddEven, // 奇偶页不同
          first: this.first, // 首页不同
          pageMargin: this.pageMargin, // 页边距
          tableDir: this.tableDir, // 居中方式
          direction: this.direction, // 纸张方向
          scaleNumber: this.scaleNumber, // 缩放比列
          pageSize: this.pageSize, // 纸张大小
          header: this.header, // 页眉
          footer: this.footer, // 页脚
          view: { // 预览数据
            header: this.view.header,
            footer: this.view.footer
          },
          printTitle: this.printTitle, // 打印标题
          checkList: this.checkList, // 打印
          radio: this.radio // 打印顺序
        }
      }
      return params
    }
  }
}
</script>

<style lang="scss" scoped>
.setPage {
  & /deep/ .el-dialog__body {
    padding: 8px;
  }
  .el-tabs {
    /deep/ .el-tabs__header {
      position: inherit !important;
      width: 100% !important;
    }
    /deep/ .el-tabs__content{
      padding: 8px !important;
    }
    .el-radio-group {
      display: flex;
      padding: 10px 0;
      & > div{
        i.iconfont{
          font-size: 30px;
          vertical-align: middle;
        }
        &:nth-of-type(2){
          margin-left: 20px;
        }
      }
    }
    .box {
      margin-bottom: 15px;
    }
    .preview {
      position: relative;
      border: 1px solid #ddd;
      min-height: 50px;
      .show {
        display: flex;
        span {
          flex: 1;
          text-align: center;
        }
      }
      .view {
        color: #e2e2e2;
        text-align: center;
        line-height: 50px;
      }
      .footer-show {
        position: relative;
        top: 30px;
      }
    }
    .select {
      position: relative;
      padding: 8px 0;
      .el-button {
        position: absolute;
        right: 0;
      }
      .el-select {
        width: calc(100% - 140px);
      }
    }
    .check {
      margin: 10px 0;
    }
    .pos {
      display: flex;
      font-size: 12px;
      margin: 5px 0;
      .left {
        width: calc((100% - 210px) / 2);
        text-align: right;
      }
      .midd {
        width: 210px;
        text-align: center;
      }
      .dir-show {
        position: relative;
        border: 1px solid #f97b04;
        height: 160px;
        width: 120px;
        margin: 0 auto;
        & > p {
          position: absolute;
          border-top: 1px solid #d8d8d8;
          border-bottom: 1px solid #d8d8d8;
          height: 15px;
          width: 100%;
          &:nth-of-type(1) {
            top: 10px;
          }
          &:nth-of-type(2) {
            bottom: 10px;
          }
        }
        .dir-table {
          position: relative;
          width: 75%;
          height: 100%;
          border-left: 1px solid #d8d8d8;
          border-right: 1px solid #d8d8d8;
          margin: 0 auto;
          table {
            position: absolute;
            width: 80%;
            height: 50px;
            tr, td {
              border: 1px solid #d8d8d8;
            }
          }
          .nor {
            top: 27px;
          }
          .hor {
            top: 27px;
            left: 50%;
            transform: translateX(-50%);
          }
          .ver {
            top: 50%;
            transform: translateY(-50%);
          }
          .hor.ver {
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
          }
        }
      }
      .el-input-number {
        width: 70px;
        /deep/ .el-input-number__decrease, /deep/ .el-input-number__increase {
          width: 15px;
        }
        /deep/ .el-input {
          input {
            padding: 0 15px;
          }
        }
      }
    }
    .center-way {
      border-top: 1px solid #d8d8d8;
      position: relative;
      padding: 20px 0;
      margin-top: 10px;
      h2 {
        position: absolute;
        background-color: #fff;
        font-size: 12px;
        top: -9px;
        left: 0px;
        padding: 0 10px;
      }
    }
    .line {
      position: relative;
      border-top: 1px solid #ddd;
      padding: 10px;
      margin-top: 15px;
      h5 {
        position: absolute;
        background: #fff;
        top: -13px;
        left: 0px;
        font-size: 13px;
        padding: 3px;
      }
      .main {
        padding: 10px;
        p {
          display: flex;
          padding: 10px 0;
          align-items: center;
          .el-input {
            width: 80%;
          }
        }
      }
    }
    .printOrder {
      display: flex;
      position: relative;
      .radio {
        margin-right: 80px;
      }
      .image {
        padding: 0 !important;
        img {
          width: 80px;
        }
      }
    }
  }
}
</style>
