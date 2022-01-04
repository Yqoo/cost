<template>
  <div class="page">
    <div class="margin right-line">
      <UtilTitle :info="{ label: '页边距', value: 'yebianju', icon: 'yebianju'}" @start="doClick" />
      <UtilTitle :info="{ label: '纸张方向', children:getChild('zhizhangfx'), icon: 'zhizhangfx'}" @start="doClick" />
      <UtilTitle :info="{ label: '纸张大小', value: 'yemian', icon: 'zhizhangdx'}" @start="doClick" />
      <!-- <UtilTitle :info="{ label: '打印区域', children:getChild('dayingqy'), icon: 'dayinquyu'}" @start="doClick" /> -->
    </div>
    <div class="pageBreak right-line">
      <!-- <div class="op-item">
        <el-switch v-model="printView" active-color="#13ce66" size="mini" />
        <div><span>分页预览</span></div>
      </div> -->
      <div class="two-item myTool">
        <el-checkbox v-model="isPageBreak" @change="showPageBreak">
          显示分页符
        </el-checkbox>
        <el-dropdown trigger="click" class="myTool" @command="handleCommand">
          <span class="el-dropdown-link">
            <i class="iconfont icon-charufenyefu" />
            <span>插入分页符</span>
            <i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown" class="myTool">
            <el-dropdown-item command="insertionFyf">
              <i class="iconfont icon-charufenyefu" />
              <span>插入分页符</span>
            </el-dropdown-item>
            <el-dropdown-item command="delFyf">
              <i class="iconfont icon-shanchufenyefu" />
              <span>删除分页符</span>
            </el-dropdown-item>
            <el-dropdown-item command="resetFyf">
              <i class="iconfont icon-zhongzhisuoyoufenyefu" />
              <span>重置所有分页符</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <UtilTitle class="icon" :info="{ label: '打印缩放', value: 'yemian', icon: 'dayinsuofang'}" @start="doClick" />
    </div>
    <div class="print">
      <div class="two-item">
        <p @click="doClick('workSheet')">
          <i class="iconfont icon-dayinbiaotihuobt" />
          <span>打印标题或表头</span>
        </p>
        <p @click="doClick('yemeiyej')">
          <i class="iconfont icon-dayinyemeihyj" />
          <span>打印页眉或页脚</span>
        </p>
      </div>
      <div class="two-item">
        <p>
          <el-checkbox v-model="gridlines" @change="isShowGridlines">
            显示网格线
          </el-checkbox>
        </p>
        <p>
          <el-checkbox v-model="rowcolHeader" @change="isShowrowcolHeader">
            显示行号列标
          </el-checkbox>
        </p>
      </div>
      <UtilTitle :info="{ label: '打印预览', value: 'dayinyl', icon: 'dayinyulan'}" @start="doClick" />
    </div>
    <SetPage
      v-if="setPage.show"
      :show.sync="setPage.show"
      :active="setPage.active"
      :print="print"
      @update="changePrint"
      @getPrintImg="doClick('dayinyl')"
    />
  </div>
</template>

<script>
import UtilTitle from './utilTitle'
import SetPage from '../dialog/setPage'
import $ from 'jquery'

export default {
  name: 'Page',
  components: {
    UtilTitle,
    SetPage
  },
  props: {
    printSet: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      gridlines: true, // 是否显示网格线
      rowcolHeader: true, // 是否显示行号列标
      printView: false, // 分页预览
      isPageBreak: true, // 是否显示分页符
      setPage: {
        show: false,
        active: ''
      },
      print: {
        printHeader: {},
        printFooter: {},
        printStyle: {
          direction: 'heng', // 纸张方向
          scaleNumber: 100, // 缩放比例
          pageSize: 'A4_PAPERSIZE', // 纸张大小
          oddEven: false, // 奇偶页不同
          first: false // 首页不同
        }
      },
      hot: null
    }
  },
  computed: {
    getChild() {
      // eslint-disable-next-line func-names
      return function (type) {
        const childs = {
          zhizhangfx: [
            { label: '横向', icon: 'hengxiang', value: 'heng' },
            { label: '纵向', icon: 'zongxiang', value: 'zong' }
          ],
          dayingqy: [
            { label: '设置打印区域', value: 'shezhidyqy', icon: 'shezhidayinquyu' },
            { label: '取消打印区域', value: 'quxiaodyqy', icon: 'quxiaodayinquyu' }
          ]
        }
        return childs[type]
      }
    }
  },
  watch: {
    printSet: {
      immediate: true,
      handler(val) {
        if (Object.keys(val).length) {
          const { printFooter, printHeader, printStyle } = val
          Object.assign(this.print, {
            printFooter,
            printHeader,
            printStyle
          })
        }
      }
    }
  },
  created() {
    this.hot = this.$parent.$refs.hotTable.hotInstance
  },
  methods: {
    isShowGridlines(val) { // 是否显示网格线
      val ? this.hot.render() : $('.htCore td').css({ border: '0px' })
      if (!val) this.isPageBreak = false
    },
    isShowrowcolHeader(val) { // 是否显示行号列标
      this.$parent.hotSettings.rowHeaders = this.$parent.hotSettings.colHeaders = val
    },
    showPageBreak(val) { // 是否展示分页符
      const cells = this.hot.getCellsMeta().filter(
        l => Object.prototype.hasOwnProperty.call(l, 'leftPageBreak')
        || Object.prototype.hasOwnProperty.call(l, 'topPageBreak')
      )
      cells.forEach(i => {
        if (Object.prototype.hasOwnProperty.call(i, 'leftPageBreak')) {
          this.hot.setCellMeta(i.row, i.col, 'leftPageBreak', !!val)
        }
        if (Object.prototype.hasOwnProperty.call(i, 'topPageBreak')) {
          this.hot.setCellMeta(i.row, i.col, 'topPageBreak', !!val)
        }
      })
      this.hot.render()
    },
    changePrint(data) { // 获取打印信息
      Object.assign(this.print, { ...data })
      this.$emit('update', this.print)
    },
    handleCommand(command) { // 插入分页符
      const Deal = {
        insertionFyf: () => { // 插入分页符
          const selectRang = this.hot.getSelectedRange()
          const rowHeader = this.hot.getRowHeader()
          const colHeader = this.hot.getColHeader()
          if (selectRang && selectRang[0]) {
            const { from, to } = selectRang[0]
            for (let i = 0; i <= rowHeader.length - 1; i++) {
              if (from.col !== 0) this.hot.setCellMeta(i, from.col, 'leftPageBreak', !!this.isPageBreak)
            }
            for (let j = 0; j <= colHeader.length - 1; j++) {
              if (from.row !== 0) this.hot.setCellMeta(from.row, j, 'topPageBreak', !!this.isPageBreak)
            }
            this.hot.render()
          }
        },
        delFyf: () => { // 删除分页符
          const select = this.hot.getSelected()
          const rowHeader = this.hot.getRowHeader()
          const colHeader = this.hot.getColHeader()
          if (select) {
            for (let i = 0; i <= rowHeader.length - 1; i++) {
              const cell = this.hot.getCellMeta(i, select[0][1])
              cell.leftPageBreak && delete cell.leftPageBreak
            }
            for (let j = 0; j <= colHeader.length - 1; j++) {
              const cell = this.hot.getCellMeta(select[0][0], j)
              cell.topPageBreak && delete cell.topPageBreak
            }
            this.hot.render()
          }
        },
        resetFyf: () => { // 重置分页符
          const cells = this.hot.getCellsMeta().filter(l => l.leftPageBreak || l.topPageBreak)
          cells.forEach(i => {
            i.leftPageBreak && delete i.leftPageBreak
            i.topPageBreak && delete i.topPageBreak
          })
          this.hot.render()
        }
      }
      Deal[command]()
    },
    doClick(type, val) {
      const hot = this.$parent.$refs.hotTable.hotInstance
      console.log(type, val, hot)
      const setPageArr = ['yebianju', 'yemian', 'yemeiyej']
      const directionArr = ['heng', 'zong']
      let newType = type
      if (setPageArr.includes(type)) { newType = 'setPage' }
      if (directionArr.includes(type)) newType = 'setDirection'
      const Deal = {
        setPage: () => { // 页面设置
          this.setPage = {
            show: true,
            active: type
          }
        },
        setDirection: () => { // 纸张方向
          this.setPage = {
            show: true,
            active: 'yemian'
          }
          this.print.printStyle.direction = type
        },
        workSheet: () => { // 打印标题或表头
          this.setPage = {
            show: true,
            active: 'workSheet'
          }
        },
        dayinyl: () => { // 打印预览
          const { id, name } = this.$parent.bbList
          if (id) {
            const param = this.getInfo(this.print)
            this.$tools.downloadWithToken('/bbReportFormsController/reportExcel', {
              type: 'pdf',
              ...param
            }, `${name}.pdf`, 'POST')
          }
        },
        shezhidyqy: () => { // 设置打印区域
          const selectRange = hot.getSelectedRange()
          console.log(selectRange)
        },
        quxiaodyqy: () => { // 取消打印区域
          console.log('quxiaodyqy')
        }
      }
      Deal[newType]()
    },
    getInfo(print) { // 获取打印信息
      const hot = this.$parent.$refs.hotTable.hotInstance
      const { id } = this.$parent.bbList
      const { data } = this.$parent.hotSettings
      let cell = []
      const colWidths = []
      const rowHeights = []
      let mergeCells = []
      for (let i = 0, len = data[0].length; i < len; i++) {
        colWidths.push(hot.getColWidth(i))
      }
      for (let j = 0, lenth = data.length; j < lenth; j++) {
        rowHeights.push(hot.getRowHeight(j))
      }
      cell = hot.getCellsMeta().map(l => {
        const tmp = {}
        const keys = l && Object.keys(l)
        if (keys && keys.length) {
          for (let i = 0, len = keys.length; i < len; i++) {
            if (keys[i] === 'instance') {
            // eslint-disable-next-line no-continue
              continue
            }
            tmp[keys[i]] = l[keys[i]]
          }
        }
        return tmp
      })
      mergeCells = hot.getPlugin('MergeCells').mergedCellsCollection.mergedCells
      const hiddenColumns = { columns: hot.getPlugin('hiddenColumns').getHiddenColumns(), indicators: true }
      const hiddenRows = { rows: hot.getPlugin('hiddenRows').getHiddenRows(), indicators: true }
      const arr = JSON.parse(JSON.stringify(data)).reverse()
      const index = arr.findIndex(l => l.some(k => k))
      arr.splice(0, index)
      arr.reverse()
      const colCell = []
      const colHeader = hot.getColHeader().reverse()
      for (let i = 0, len = colHeader.length; i < len; i++) {
        colCell.unshift(hot.getDataAtCol(i))
      }
      const colIndex = colCell.findIndex(l => l.some(k => k))
      colCell.splice(0, colIndex)
      colCell.reverse()
      const newArr = arr.map(l => {
        l.length = colCell.length
        return l
      })
      const param = {
        id,
        data: JSON.stringify({
          colWidths, rowHeights, cell, mergeCells, hiddenColumns, hiddenRows, data
        }),
        printSet: JSON.stringify({ print })
      }
      return param
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  padding: 0 5px;
  width: 100%;
  .right-line {
    position: relative;
    padding-right: 5px;
    &::after {
      position: absolute;
      top: 0;
      right: 0;
      content: '';
      display: inline-block;
      width: 1px;
      height: 100%;
      background: #e0e0e0;
    }
  }
  .margin {
    // min-width: 16%;
    display: flex;
  }
  .pageBreak {
    display: flex;
    // min-width: 16%;
    .iconfont {
      margin-right: 5px;
      font-size: 12px;
    }
    .el-dropdown {
      margin-left: 10px;
      span {
        margin-left: 5px;
      }
      .el-dropdown-item {
        span {
          margin-left: 5px;
        }
      }
    }
    .op-item {
      padding: 0 0 0 5px;
      font-size: 12px;
      text-align: center;
      min-width: 50px;
      & > i {
        font-size: 26px;
        color: #7a7979;
      }
      & > div {
        position: relative;
        top: -2px;
      }
      .el-switch {
        height: 38px;
      }
    }
    .two-item {
      max-width: 120px;
      text-align: center;
      line-height: 28px;
    }
    .op-item, .two-item, .icon {
      flex-grow: 1
    }
  }
  .print {
    display: flex;
    .two-item {
      font-size: 12px;
      padding: 0 5px;
      & > p {
        flex-grow: 1;
        position: relative;
        line-height: 28px;
        cursor: context-menu;
      }
      i {
        vertical-align: middle;
        margin-right: 3px;
      }
    }
  }
}
</style>
