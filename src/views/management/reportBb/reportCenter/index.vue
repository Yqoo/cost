<template>
  <div ref="excelPage" v-waiting="loading" class="excelPage">
    <div class="content-t">
      <!-- header -->
      <div class="header myTool">
        <div class="header_left">
          <span
            class="header_left_file"
            style="color: #A8A8A6"
          >
            <i class="iconfont icon-liebiao1" style="color: #A8A8A6" />文件
          </span>
          <span class="header_left_btns">
            <i class="iconfont icon-dakaifangshi" title="打开" style="color: #A8A8A6" @click="headerHandler('open')" />
            <i class="iconfont icon-cunchuwei" title="保存" @click="headerHandler('save')" />
            <i class="iconfont icon-PDF1" title="输出为PDF" style="color: #A8A8A6" @click="headerHandler('pdf')" />
            <i class="iconfont icon-dayin" title="打印" @click="headerHandler('print')" />
            <i
              title="撤销"
              :style="isUndo ? '' : { color:'#d4d4d4' }"
              class="iconfont icon-zhixiang-houtui"
              @click="headerHandler('chexiao')"
            />
            <i
              title="恢复"
              :style="isRedo ? '' : { color:'#d4d4d4' }"
              class="iconfont icon-zhixiang-qianjin"
              @click="headerHandler('huifu')"
            />
          </span>
          <ul class="header_left_lists">
            <li :class="utilTitle === 'start' ? 'active': ''" @click="utilTitle = 'start'">
              <span>开始</span>
            </li>
            <li :class="utilTitle === 'function' ? 'active': ''" @click="utilTitle = 'function'">
              <span>函数</span>
            </li>
            <li :class="utilTitle === 'safe' ? 'active': ''" @click="utilTitle = 'safe'">
              <span>审阅</span>
            </li>
            <li :class="utilTitle === 'page' ? 'active': ''" @click="utilTitle = 'page'">
              <span>页面</span>
            </li>
          </ul>
        </div>
        <div class="header_right">
          <span>
            <i class="el-icon-share" title="分享" />
            <i class="el-icon-question" title="帮助" />
            <i v-if="isShrink" class="el-icon-arrow-up" title="收起" @click="isShrink = false" />
            <i v-if="!isShrink" class="el-icon-arrow-down" title="展开" @click="isShrink = true" />
          </span>
        </div>
      </div>
      <!-- title -->
      <div v-if="isShrink ? 'hide': ''" ref="utilWrap" class="op myTool">
        <div v-if="utilTitle === 'start'" style="width: 100%">
          <StartPage
            ref="StartPage"
            :function="hotSettings.outsideClickDeselects"
            @exportXsl="exportXsl"
            @daoru="daoruExcel"
          />
        </div>
        <div v-if="utilTitle === 'function'">
          <FunctionPage ref="FunctionPage" :status="status" @getGsHs="getGsHs" @insertFunction="insertFunction" />
        </div>
        <div v-if="utilTitle === 'safe'">
          <SafePage ref="safePage" :bb-list="bbList" :is-protect="protect" @update="isProtection" />
        </div>
        <div v-if="utilTitle === 'page'">
          <Page ref="page" :print-set="print" @update="changePrint" />
        </div>
      </div>
    </div>
    <!-- excel表格 -->
    <div class="excelGrid" :class="isShrink ? 'isShrink' : 'shrink'">
      <div class="left" :class="showBbXm ? 'fewidth' : 'muchWidth'">
        <div class="func-tip myTool">
          <div class="position">
            <el-input v-model="position" size="mini" suffix-icon="el-icon-location-information" :disabled="true" />
          </div>
          <i class="iconfont icon-hanshu" />
          <el-input
            v-model="funcText"
            size="mini"
            :disabled="disabled"
            :title="funcText"
            @blur="getFormula(funcText)"
            @focus="getCoordinate()"
          />
        </div>
        <div ref="excel" :class="isShrink ? 'excel' : 'isExcel'">
          <vue-ruler-tool
            ref="rulerTool"
            :visible.sync="rulerVisible"
            :content-layout="contentPos"
            :v-model="presetLine"
            :is-scale-revise="true"
            :is-hot-key="false"
            :step-length="10"
          >
            <hot-table ref="hotTable" :settings="hotSettings" license-key="00000-00000-00000-00000" />
          </vue-ruler-tool>
        </div>
      </div>
      <div v-if="showBbXm" class="middle">
        <div class="bbxm">
          <p>报表项目</p>
          <div class="main">
            <el-select v-model="bbxm.bbxmValue" size="mini" style="width: 100%">
              <el-option value="" style="height: 250px; overflow-y:auto;padding:0px;">
                <Tree
                  :data="bbxmData"
                  :search="false"
                  in-box
                  @setTargetNode="setTargetNode"
                />
              </el-option>
            </el-select>
            <div class="getxlTree">
              <el-tree
                :data="getXmTree"
                :props="{
                  children: 'children',
                  label: 'label'
                }"
                accordion
                node-key="id"
              >
                <span slot-scope="{node}" :draggable="draggable" @dragstart="event => dragStart(node,event)">
                  <span>{{ node.label }}</span>
                </span>
              </el-tree>
            </div>
          </div>
        </div>
        <div class="bbcx">
          <p>报表查询条件</p>
          <div class="contact">
            <p>
              <i class="el-icon-s-operation" />
              <span>账套名称</span>
            </p>
          </div>
        </div>
      </div>
      <div class="right">
        <span class="line" />
        <p @click="showBbXm = !showBbXm">
          <i class="iconfont icon-jiantou" title="报表项目" />
        </p>
      </div>
    </div>
    <insert-function
      v-if="insertFun.show"
      :show.sync="insertFun.show"
      :func-text="insertFun.funcText"
      @changeFuncText="getFormula"
    />
    <Alter v-if="alter.show" :show.sync="alter.show" :info="alter.info" @updateAmount="updateAmount" />
    <Upload
      v-if="upload.show"
      :show.sync="upload.show"
      :action="upload.action"
      :format="['xls', 'xlsx']"
      :params="upload.params"
      @success="uploadSuccess"
    />
  </div>
</template>

<script>
import $ from 'jquery'
import StartPage from './compontent/startPage'
import FunctionPage from './compontent/functionPage'
import SafePage from './compontent/safePage'
import Page from './compontent/page'
import VueRulerTool from 'vue-ruler-tool'
import { HotTable } from '@handsontable/vue'
import 'handsontable/dist/handsontable.full.css'
import Handsontable from 'handsontable'
import { HyperFormula } from 'hyperformula'
import { initializeHF, initHFValues } from './js/employees.hf'
import 'handsontable/languages/zh-CN'
import Bscroll from 'better-scroll'
import UtilTitle from './compontent/utilTitle'
import insertFunction from './dialog/insertFunction'
import Alter from './dialog/alter'
import QS from 'qs'
import axios from 'axios'

export default {
  name: 'ReportCenter',
  components: {
    StartPage,
    FunctionPage,
    SafePage,
    Page,
    VueRulerTool,
    HotTable,
    UtilTitle,
    insertFunction,
    Alter
  },
  data() {
    return {
      site: [],
      oldmer: [],
      mergeCells: [],
      upload: {
        show: false,
        action: '',
        params: {}
      },
      isCreate5Gfn: null,
      status: false,
      addPageBreak: 'col', // 判断插入的是行 || 列
      loading: false,
      draggable: true, // 判断节点是否可以拖拽
      treeData: [],
      listMapLdgs: {}, // 判断节点公式
      dragNode: null, // 拖动节点
      showBbXm: false, // 是否展示报表项目
      insertFun: { // 插入函数
        show: false,
        funcText: ''
      },
      alter: {
        show: false,
        info: {}
      },
      disabled: true,
      isUndo: false, // 撤销
      isRedo: false, // 恢复
      bbxm: { // 报表项目
        bbxmValue: '',
        bbxmId: ''
      },
      getXmTree: [],
      coordinate: {}, // 坐标
      copyData: [], // 复制粘贴剪切内容
      copyCellStyle: {}, // 格式刷样式
      bbxmData: [], // 报表项目下拉数据
      bbList: {}, // 报表数据
      tag: 0,
      newData: [],
      model: null,
      utilTitle: 'start',
      protect: {}, // 判断工作表是否在保护状态
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
      }, // 打印数据
      isShrink: true, // 判断是否展开
      position: '', // 单元格位置
      funcText: '', // 函数
      rulerVisible: false, // 是否显示标尺
      contentPos: { left: -18, top: -18 }, // 标尺位置
      presetLine: [{ type: 'l', site: 50 }, { type: 'v', site: 200 }],
      ziMu: [ // 字母
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
        'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
      ],
      hotSettings: { // 定义结构，数据，以及属性等
        language: 'zh-CN', // 语言
        data: Handsontable.helper.createEmptySpreadsheetData(20, 10), // 创建测试数据
        realData: Handsontable.helper.createEmptySpreadsheetData(20, 10), // 用于存储cell 公式数据
        // width: '100%',
        // height: '100%',
        minCols: 1, // 最小行数
        colWidths: 122, // 列宽
        rowHeights: [], // 行高
        rowHeaders: true, // 行头
        colHeaders: true, // 列头
        renderAllRows: true, // 渲染所有的行
        manualColumnResize: true, // 允许列拖动
        manualRowResize: true, // 允许行拖动
        mergeCells: true, // 允许合并单元格
        contextMenu: {
          items: {
            row_above: {},
            row_below: {},
            insert_row: {
              name: '插入多行',
              callback: (key, selection, clickEvent) => { // Callback for specific option
                this.alter.show = true
                this.alter.info.type = 'insert_row'
                this.alter.info.class = 'myTool'
              },
              isCommand: true
            },
            col_left: {},
            col_right: {},
            insert_col: {
              name: '插入多列',
              callback: (key, selection, clickEvent) => { // Callback for specific option
                this.alter.show = true
                this.alter.info.type = 'insert_col'
                this.alter.info.class = 'myTool'
              }
            },
            remove_row: {},
            remove_col: {},
            undo: {},
            redo: {},
            make_read_only: {},
            alignment: {},
            commentsAddEdit: {},
            commentsRemove: {},
            commentsReadOnly: {},
            borders: {},
            mergeCells: {},
            hidden_columns_hide: {},
            hidden_columns_show: {},
            hidden_rows_hide: {},
            hidden_rows_show: {},
            cut: {},
            copy: {}
          }
        }, // 是否允许右键菜单
        // stretchH: 'all', // 延伸列的宽度 last：延伸最后一列，all：延伸所有列，none默认不延伸
        trimWhitespace: false, // 表格自动过滤空格
        fixedRowsTop: 0, // 固定表格多少行不能滚动
        fixedColumnsLeft: 0, // 固定左侧多少列不能水平滚动
        fixedRowsBottom: 0, // 固定表格底部多少行不能滚动
        manualRowMove: true, // 当值为true时，行可拖拽至指定行
        manualColumnMove: true, // 当值为true时，列可拖拽移动到指定列
        // autoColumnSize: true, // 当值为true且列宽未设置时，自适应列大小
        // autoColumnSize: { syncLimit: 23 },
        wordWrap: true, // 自动换行
        AutoRowSize: true, // 自动行大小
        rmFlag: false,
        // editor: this.model ? false : 'text', // 表格是否可编辑
        // multiColumnSorting: true,
        columnSorting: true, // 排序
        sortOrder: true,
        formulas: false,
        search: true, // 搜索
        autoWrapRow: true, // 最后一列中的或向右箭头将移至下一行的第一列
        autoWrapCol: true, // 最后一行中按或向下箭头将移至下一列的第一行
        customBorders: [], // 可自定义边框
        cell: [],
        readOnly: false,
        comments: true, // 启用批注
        // dropdownMenu: true, // 下拉菜单
        allowInsertColumn: true, // 允许下拉中插入新列
        allowRemoveColumn: true, // 允许下拉菜单移除新列
        hiddenColumns: { columns: [], indicators: true }, // 允许隐藏列
        hiddenRows: { rows: [], indicators: true }, // 允许隐藏行
        /**
         * 如果为true，则在网格外部单击鼠标将取消选择当前选择。可以是采用
            click事件目标并返回布尔值的函数 默认值为tru
         */
        outsideClickDeselects: event => {
          const vt = $(event)
          const pesl = ['.myTool']
          for (let i = 0, len = pesl.length; i < len; i++) {
            if (vt.parents(pesl[i])[0]) {
              return false
            }
          }
          return true
        },
        renderer: (instance, td, row, col, prop, value, cellProperties) => { // 自定义单元格属性
          /**
           * @param {
           * instance: 核心方法接口对象,
           * td是一个渲染的单元格,
           * value是单元格的值,
           * cellProperties是单元格的渲染方法对象，其中包含一个renderer属性，定义了该用那种渲染方式
           * }
           */
          // 自定义渲染
          Handsontable.renderers.TextRenderer.apply(HotTable, [instance, td, row, col, prop, value, cellProperties])
          if (cellProperties) this.pageBreak(td, cellProperties)
          if (cellProperties && cellProperties.style) this.renderStyle(td, cellProperties.style)
          const reg1 = /.*[\u4e00-\u9fa5]+.*$/ // 是否含有中文
          const reg2 = /[a-zA-Z]/ // 是否含有字母
          value = cellProperties.cellType && !reg1.test(value) && !reg2.test(value)
            ? this.getCellTypeValue(cellProperties.cellType, value, cellProperties.decimalNum)
            : value
          $(td).text(value)
          return td
        },
        afterOnCellMouseDown: (event, coords, td) => { // 单击单元格或行/列标题后触发。如果单击行/列标题，则坐标索引为负
          /**
           * col: 列 ，row： 行
           */
          const { col, row } = coords
          const hot = this.$refs.hotTable.hotInstance
          this.position = `${this.ziMu[col === -1 ? 0 : col]}${row === -1 ? 1 : row + 1}`
          // eslint-disable-next-line prefer-destructuring
          this.funcText = hot.getCellMeta(...hot.getSelected()[0]).formulaValue
            ? hot.getCellMeta(...hot.getSelected()[0]).formulaValue
            : ''
          const cell = hot.getCellMeta(row, col)
          console.log(cell)
          this.disabled = cell.readOnly
          const style = cell.style ? cell.style : {}
          const names = cell.className ? cell.className.split(' ') : []
          if (this.$refs.StartPage) {
            this.$refs.StartPage.fontStyle = {
              fontFamily: style['font-family'] ? style['font-family'] : 'SimSuncss',
              fontSize: style['font-size'] ? style['font-size'].substring(0, style['font-size'].indexOf('px')) : '12',
              isBold: !!(style['font-weight'] && style['font-weight'] === 'bold'),
              isItalic: !!(style['font-style'] && style['font-style'] === 'italic'),
              isUnderline: !!(style['text-decoration'] && style['text-decoration'] === 'underline'),
              bgColor: style.background ? style.background : '#ffffff',
              fontColor: style.color ? style.color : '#000000',
              autoEnter: !(style['word-break'] && style['word-break'] !== 'normal'),
              textIndex: style['text-indent'] ? style['text-indent'] : '0px',
              isJustify: !!(style['text-align'] && style['text-align'] !== ''),
              borderColor: '#000000',
              borderStyle: 'solid',
              borderWidth: 1
            }
            this.$refs.StartPage.cellFormat = cell.cellType ? cell.cellType : 'text'
            this.$refs.StartPage.fontLine.forEach(e => {
              e.isCheck = false
              if (names.includes(e.value)) {
                e.isCheck = true
              }
              if (this.$refs.StartPage.fontStyle.isJustify && e.value === 'fensandq') {
                e.isCheck = true
              }
            })
          }
        },
        afterRedo: action => { // 撤销
          this.reflushUndoRedo()
        },
        afterUndo: action => { // 撤回
          this.reflushUndoRedo()
        },
        afterChange: (changes, type) => { // 单元格值改变触发
          this.reflushUndoRedo()
        },
        afterCopy: (data, coords) => { // 复制
          this.copyData = data
        },
        afterCut: (data, coords) => { // 剪切
          this.copyData = data
        },
        afterSelectionEnd: (row1, col1, row2, col2) => { // 在选择一个或多个单元格后触发
          if (Object.keys(this.copyCellStyle).length) {
            const hot = this.$refs.hotTable.hotInstance
            // eslint-disable-next-line prefer-const
            let { className, style } = this.copyCellStyle
            const startRow = row1 < row2 ? row1 : row2
            const endRow = row1 > row2 ? row1 : row2
            const startCol = col1 < col2 ? col1 : col2
            const endCol = col1 > col2 ? col1 : col2
            for (let i = startRow; i <= endRow; i++) {
              for (let j = startCol; j <= endCol; j++) {
                const names = hot.getCellMeta(i, j).className
                className = names.indexOf('kuaijizy') > -1 ? `${className} kuaijizy` : className
                hot.setCellMetaObject(i, j, { className, style })
              }
            }
            hot.render()
            this.copyCellStyle = {}
          }
        },
        afterSetCellMeta: (row, col, key, value) => { // 单元格元数据更改后触发
          const cell = this.$refs.hotTable.hotInstance.getCellMeta(row, col)
          // eslint-disable-next-line default-case
          switch (key) {
            case 'className':
              value = value.trim()
              this.$set(cell, 'className', value)
              break
          }
          this.reflushUndoRedo()
        },
        afterCreateCol: (index, amount, source) => { // 插入列后
          this.addPageBreak = 'col'
          this.$nextTick(() => {
            this.addPage(index)
          })
        },
        afterCreateRow: (index, amount) => { // 插入行后
          this.addPageBreak = 'row'
          this.$nextTick(() => {
            this.addPage(index)
          })
        }
      }
    }
  },
  watch: {
    rulerVisible(val) {
      this.contentPos = val ? { top: 0, left: 0 } : { left: -18, top: -18 }
    },
    model: {
      handler(val) {
        const hot = this.$refs.hotTable.hotInstance
        if (!val) {
          this.hotSettings.mergeCells = [...this.oldmer]
          this.newData = JSON.parse(JSON.stringify(this.hotSettings.data))
          hot.loadData(this.hotSettings.data)
          this.hotSettings.cell = this.$refs.FunctionPage && this.$refs.FunctionPage.cell.length
            ? this.$refs.FunctionPage.cell
            : this.hotSettings.cell
          for (let i = 0; i < this.hotSettings.cell.length; i++) {
            const k = this.hotSettings.cell[i]
            Object.keys(k).forEach(l => {
              hot.setCellMeta(k.row, k.col, l, k[l])
            })
            if (this.site.length) {
              this.site.forEach(d => {
                if (k.row === d.row && k.col === d.col) {
                  hot.setCellMeta(d.row, d.col, 'className', 'htLeft')
                }
              })
            }
          }
        } else {
          const { data } = this.hotSettings
          const arr = JSON.parse(JSON.stringify(data))
          const { hf, sheetId } = initializeHF()
          initHFValues(hf, sheetId, arr)
          hot.loadData(hf.getSheetValues(sheetId))
          this.hotSettings.cell = this.$refs.FunctionPage && this.$refs.FunctionPage.cell.length
            ? this.$refs.FunctionPage.cell
            : this.hotSettings.cell
          for (let i = 0; i < this.hotSettings.cell.length; i++) {
            const k = this.hotSettings.cell[i]
            Object.keys(k).forEach(l => {
              hot.setCellMeta(k.row, k.col, l, k[l])
            })
            if (this.site.length && val) {
              this.site.forEach(d => {
                if (k.row === d.row && k.col === d.col) {
                  if (d.colspan > 1) {
                    hot.setCellMeta(d.row, +d.col + 1, 'className', 'htCenter htMiddle')
                  }
                  hot.setCellMeta(d.row, d.col, 'className', 'htCenter htMiddle')
                }
              })
            }
          }
        }
        hot.render()
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    // const { params } = to
    if (to.params.param) {
      try {
        const { name } = JSON.parse(decodeURIComponent(to.params.param))
        to.meta.title = name
        next()
      } catch (error) {
        next()
      }
      next()
    }
  },
  created() {
    const { param } = this.$route.params
    this.bbList = param && JSON.parse(decodeURIComponent(param))
    this.getData()
    this.getBbxmData()
  },
  mounted() {
    const hot = this.$refs.hotTable.hotInstance
    top.hot = hot
    if (!this.scroll) {
      this.$nextTick(() => {
        this.scroll = new Bscroll(this.$refs.utilWrap, {
          startX: 0,
          click: true,
          scrollX: true,
          scrollY: false,
          eventPassthrouth: 'horizontal',
          bindToWrapper: true
        })
      })
    } else this.scroll.refresh()
    $('.excelPage').on('drop', '.htCore td', event => {
      event.preventDefault()
      const data = this.dragNode ? this.dragNode.data : {}
      const col = event.target.cellIndex - 1
      const row = $(event.target).parent()[0].rowIndex - 1
      const newArr = []
      if (data?.children?.length) {
        if (data.pid !== '1') newArr.push(data)
        const arr = this.dragMethod(data.children)
        newArr.push(...arr)
        this.treeData = []
      } else if (Object.keys(data).length && data.pid !== '1') newArr.push(data)
      for (let i = 0, len = newArr.length; i < len; i++) {
        if (newArr[i].sort === 4) {
          const cell = hot.getCellMeta(row + i, col)
          if (cell.formulaValue) {
            const commentsPlugin = hot.getPlugin('comments')
            commentsPlugin.setCommentAtCell(row + i, col, newArr[i].id === 'wjz' ? '未记账' : '已记账')
          }
        } else {
          hot.setDataAtCell(row + i, col, newArr[i].label)
          hot.setCellMeta(row + i, col, 'drag', true)
          hot.setCellMeta(row + i, col, 'dragId', newArr[i].id)
          hot.setCellMeta(row + i, col, 'sort', newArr[i].sort)
        }
        if (newArr[i].icon) {
          if (newArr[i].sort === 3) {
            const cell = this.searchLeft(hot, row + i, col)
            if (cell.sort === 1) {
              const id = `${cell.dragId}_${newArr[i].id}`
              if (Object.keys(this.listMapLdgs).length) {
                Object.keys(this.listMapLdgs).forEach(key => {
                  if (id === key) hot.setCellMeta(row + i, col, 'formulaValue', this.listMapLdgs[key])
                })
              }
            }
          } else hot.setCellMeta(row + i, col, 'formulaValue', newArr[i].icon)
        }
        hot.render()
      }
    })
    $('.excelPage').on('dragover', '.htCore td', event => {
      event.preventDefault()
    })
  },
  /**
   * @methods: {
   * handsonTable 方法
   * hotTable.hotInstance：
   * getSelected() 起始行和起始列是活动单元格（开始选择的位置）的坐标
   * getCellMeta(row, col) 返回给定row和column坐标的单元格属性对象
   * getSelectedRange() 选定范围对象，如果没有选择，则未定义
   * emptySelectedCells() 清空单元格内容
   * setCellMetaObject(row，col， prop) 设置属性对象到指定的单元格
   * undo() 撤消对该表执行的最后一项操作
   * redo() 重做对表执行的先前操作（用于撤消撤消操作）
   * getCellsMeta（） 获取表中至少一次生成的所有单元格元设置（按单元格初始化的顺序）
   * getDataAtCell(row, column) 根据行列索引获取单元格的值
   * setCellMeta（行，列，键，值） 将由属性定义的key属性设置为与paramsrow和相对应的单元格的meta对象column
   * setDataAtCell（行，列，值，源）为单元格设置新值。要一次更改多个单元格
   * }
   */
  methods: {
    uploadSuccess(val) {
      const hot = this.$refs.hotTable.hotInstance
      const { data } = val
      Object.assign(this.hotSettings, { ...val })
      hot.loadData(data)
    },
    daoruExcel() { // 导入excel
      const { baseURL } = this.$http.defaults
      this.upload.action = `${baseURL}/bbReportFormsController/importExcel`
      this.upload.show = true
      this.upload.params = {
        id: this.bbList.id
      }
    },
    exportXsl() { // 导出Excel
      const param = this.saveData()
      const { name } = this.bbList
      this.$tools.downloadWithToken('/bbReportFormsController/reportExcel', {
        type: 'xls',
        ...param
      }, `${name}.xls`, 'POST')
    },
    updateAmount(obj) { // 添加行列
      const { amount, type } = obj
      const hot = this.$refs.hotTable.hotInstance
      const { arrR, arrC } = this.getSelected()
      const getArr = arr => {
        for (let i = arr.length - 1; i >= 0; i--) {
          hot.alter(type, arr[i], amount)
        }
      }
      type.indexOf('row') > -1 ? getArr(arrR) : getArr(arrC)
    },
    getSelected() { // 获取选择的单元格
      const hot = this.$refs.hotTable.hotInstance
      const selects = hot.getSelected()
      let arrR = []
      let arrC = []
      if (selects) {
        for (let i = 0; i < selects.length; i++) {
          let startR = Math.min(selects[i][0], selects[i][2])
          let startC = Math.min(selects[i][1], selects[i][3])
          const endR = Math.max(selects[i][0], selects[i][2])
          const endC = Math.max(selects[i][1], selects[i][3])
          while (startR <= endR) { arrR.push(startR++) }
          while (startC <= endC) { arrC.push(startC++) }
        }
        arrR = Array.from(new Set(arrR))
        arrC = Array.from(new Set(arrC))
      }
      return { arrR, arrC }
    },
    isProtection(obj) { // 判断工作表是否在保护状态
      this.protect = { ...obj }
    },
    addPage(index) { // 添加行 || 列 时，补充分页符
      const hot = this.$refs.hotTable.hotInstance
      const colcells = hot.getCellsMeta().filter(l => l && l.topPageBreak)
      const rowCells = hot.getCellsMeta().filter(l => l && l.leftPageBreak)
      this.addPageBreak === 'col'
        ? colcells.forEach(l => {
          hot.setCellMeta(l.row, index, 'topPageBreak', true)
        })
        : rowCells.forEach(l => {
          hot.setCellMeta(index, l.col, 'leftPageBreak', true)
        })
      hot.render()
    },
    pageBreak(dom, cell) { // 渲染分页符
      const { leftPageBreak, topPageBreak } = cell
      if (leftPageBreak) {
        $(dom).css({ 'border-left': '1px solid' })
      } else if (leftPageBreak === false) $(dom).css({ 'border-left': '0px solid' })
      if (topPageBreak) {
        $(dom).css({ 'border-top': '1px solid' })
      } else if (topPageBreak === false) $(dom).css({ 'border-top': '0px solid' })
    },
    searchLeft(hot, row, col) { // 拖拽判断数据
      while (col-- >= 0) {
        const cell = hot.getCellMeta(row, col)
        if (cell.sort === 1) {
          return cell
        }
      }
      return null
    },
    dragMethod(arr) { // 拖拽遍历数据
      arr.forEach(i => {
        this.treeData.push(i)
        if (i?.children?.length) {
          this.dragMethod(i.children)
        }
      })
      return this.treeData
    },
    dragStart(node, event) { // 拖拽获取数据
      const { data } = node
      if (data && data.id.length > 2) {
        this.draggable = true
        this.dragNode = node
      } else this.dragNode = null
    },
    getBbxmData() { // 获取报表项目下拉数据
      const localData = JSON.parse(localStorage.getItem('startZT'))
      const { ztsn } = localData
      this.$api.reportDesign.getBbxmData({ ztsn }).then(s => {
        this.bbxmData = [...s.data]
      }).catch(e => this.$message.error(e.message))
    },
    setTargetNode(node) { // 报表项目下拉框
      if (node.disabled === true) {
        this.bbxm.bbxmValue = node.label
        this.bbxm.bbxmId = node.id
        if (this.bbxm.bbxmId) {
          this.$api.reportDesign.getXmTree({ id: this.bbxm.bbxmId }).then(s => {
            this.getXmTree = [...s.data]
          }).catch(e => this.$message.error(e.message))
          this.$api.reportDesign.listMapLdgs({ xmId: this.bbxm.bbxmId }).then(res => {
            this.listMapLdgs = { ...res.data }
          }).catch(e => this.$message.error(e.message))
        }
      } else this.$message.warning('该节点不可选择')
    },
    insertFunction() { // 插入函数
      this.getCoordinate()
      this.insertFun.show = true
    },
    changePrint(data) { // 获取打印数据
      this.print = { ...data }
    },
    getGsHs(value) { // 获取解析公式后的数据
      const { val, mergeCells } = value
      this.oldmer = [...mergeCells]
      const hot = this.$refs.hotTable.hotInstance
      // top.window.hot = hot
      const { id } = this.bbList
      const formData = new FormData()
      this.mergeCells = []
      formData.append('bbId', id)
      formData.append('param', JSON.stringify(val))
      this.loading = true
      this.$http.post('/bbFunctionWorkController/getGsHs', formData).then(s => {
        const { data } = s
        this.hotSettings.data = data.data || []
        this.site = JSON.parse(JSON.stringify(data.wz))
        this.mergeCells.push(...data.wz, ...this.$refs.FunctionPage.mergeCell)
        this.hotSettings.mergeCells = JSON.parse(JSON.stringify(this.mergeCells))
        this.model = true
        this.loading = false
        this.status = true
      }).catch(e => {
        this.loading = false
        // this.$message.error(e.message)
      })
    },
    getData() { // 获取初始数据
      const { id } = this.bbList
      if (id) {
        this.$api.reportDesign.getBbDesc({ id }).then(s => {
          const { data, printSet } = s.data
          if (data && Object.keys(data).length) {
            const newData = JSON.parse(data)
            const arr = JSON.parse(JSON.stringify(newData.data))
            this.newData = arr
            Object.assign(this.hotSettings, { ...newData })
            this.$refs.hotTable.hotInstance.loadData(newData.data)
            this.$refs.hotTable.hotInstance.selectCell(1, 1, 1, 1)
            const { hf, sheetId } = initializeHF()
            initHFValues(hf, sheetId, newData.data)
          }
          if (printSet && Object.keys(printSet).length) {
            const print = JSON.parse(printSet)
            // this.print = JSON.parse(JSON.stringify(print.print))
            if (print.protect && Object.keys(print.protect).length) {
              this.protect = JSON.parse(JSON.stringify(print.protect))
            }
          }
        }).catch(e => this.$message.error(e.message))
      }
    },
    getCoordinate() { // 输入公式时获取坐标
      const hot = this.$refs.hotTable.hotInstance
      const select = hot.getSelected()
      if (select) {
        select.forEach(([row1, col1, row2, col2]) => {
          const startRow = row1 < row2 ? row1 : row2
          const endRow = row1 > row2 ? row1 : row2
          const startCol = col1 < col2 ? col1 : col2
          const endCol = col1 > col2 ? col1 : col2
          Object.assign(this.coordinate, {
            x1: startRow,
            x2: endRow,
            y1: startCol,
            y2: endCol
          })
          for (let i = startRow; i <= endRow; i++) {
            for (let j = startCol; j <= endCol; j++) {
              const cell = hot.getCellMeta(i, j)
              if (cell.formulaValue) {
                this.insertFun.funcText = cell.formulaValue
              } else {
                this.insertFun.funcText = ''
              }
            }
          }
        })
      }
    },
    getFormula(val) { // 验证公式
      this.funcText = val
      const hot = this.$refs.hotTable.hotInstance
      const {
        x1, x2, y1, y2
      } = this.coordinate
      if (val) {
        const formData = new FormData()
        formData.append('gs', val)
        this.$http.post('/bbFunctionWorkController/checkGsHs', formData).then(s => {
          for (let i = x1; i <= x2; i++) {
            for (let j = y1; j <= y2; j++) {
              hot.setCellMeta(i, j, 'formulaValue', val)
              hot.setDataAtCell(i, j, '公式单元')
            }
          }
        }).catch(e => this.$message.error(e.message))
      } else {
        for (let i = x1; i <= x2; i++) {
          for (let j = y1; j <= y2; j++) {
            const cell = hot.getCellMeta(i, j)
            cell.formulaValue && delete cell.formulaValue
            hot.setDataAtCell(i, j, '')
          }
        }
      }
      hot.render()
    },
    reflushUndoRedo() { // 判断是否可以撤销
      if (!this.$refs.hotTable || !this.$refs.hotTable.hotInstance.isUndoAvailable) return
      this.$nextTick(() => {
        this.isUndo = this.$refs.hotTable.hotInstance.isUndoAvailable()
        this.isRedo = this.$refs.hotTable.hotInstance.isRedoAvailable()
      })
    },
    getCellTypeValue(type, value, num) { // 文本框渲染
      let data = ''
      // eslint-disable-next-line default-case
      switch (type) {
        case 'text': // 文本
          data = value
          break
        case 'numeric': // 数值
          data = this.numPrice(value)
          break
        case 'formatPrice': // 千分位
          data = `${this.formatPrice(value)}.00`
          break
        case 'huobi': // 货币
          data = value === '' ? value : `¥${this.formatPrice(value)}`
          break
        case 'kuaijizy': // 会计专用
          data = value === '' ? value : `¥  ${this.formatPrice(value)}`
          break
        case 'sDate': // 短日期
          data = this.$tools.timestamp(new Date(value * 24 * 60 * 60 * 1000))
          break
        case 'lDate': // 常日期
          data = this.$tools.timestamp(new Date(value * 24 * 3600 * 1000), 'YYYY年MM月DD日')
          break
        case 'time': // 时间
          data = this.$tools.timestamp(new Date(value * 24 * 60 * 60 * 1000), 'hh:ii:ss')
          break
        case 'baifenb': // 百分比
          data = `${this.formatPrice((value * 100).toFixed(2))}%`
          break
        case 'fenshu': { // 分数
          const n = value.split('.')
          if (!n[1]) {
            // eslint-disable-next-line prefer-destructuring
            data = n[0]
          } else {
            data = n[0] === '0'
              ? this.decimalsToFractional(n[1] * 1, n)
              : `${n[0]} ${this.decimalsToFractional(n[1] * 1, n)}`
          }
          break
        }
        case 'kexuejs': // 科学计数
          data = this.toNonExponential(value)
          break
      }
      return data
    },
    decimalsToFractional(integer, decimals) { // 分数
      let num1 = 0 // 分子
      let num2 = 0 // 分母
      num1 = integer
      const len = decimals[1].length
      // eslint-disable-next-line no-restricted-properties
      num2 = Math.pow(10, len)
      if (num1 % 2 === 0 && num2 % 2 === 0) {
        (function execute2() {
          num1 /= 2
          num2 /= 2
          if (num1 % 2 === 0 && num2 % 2 === 0) { // 除完还能除就继续
            execute2()
          }
        }())
      }
      if (num1 % 5 === 0 && num2 % 5 === 0) {
        (function execute5() {
          num1 /= 5
          num2 /= 5
          if (num1 % 5 === 0 && num2 % 5 === 0) { // 除完还能除就继续
            execute5()
          }
        }())
      }
      return `${num1}/${num2}`
    },
    toNonExponential(num) { // 科学计数法
      const n = num * 1
      const newNum = n.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
      return newNum[0]
    },
    // eslint-disable-next-line consistent-return
    numPrice(val, spacer = ',') { // 设置数值
      const typeofVal = typeof val
      if (typeofVal !== 'string' && typeofVal !== 'number') return val
      // eslint-disable-next-line no-return-assign
      if (val * 1 < 1) return val = 1
      if (val.indexOf('.') > -1 && val * 1 > 1) return val
      if (val * 1 > 1 && val.indexOf('.') === -1) return `${val}.00`
    },
    formatPrice(val, spacer = ',') { // 千分号
      const typeofVal = typeof val
      if (typeofVal !== 'string' && typeofVal !== 'number') return val
      const v = `${val}`
      return v.replace(/\B(?=(\d{3})+\b)/g, spacer)
    },
    renderStyle(dom, style, clean) { // 渲染样式
      if (!dom) return
      if (typeof style === 'string') {
        dom.style = style
      } else if (clean) {
        Object.keys(dom.style).forEach(k => {
          delete dom.style[k]
        })
        dom.style = style
      } else {
        const st = style
        Object.keys(st).forEach(s => {
          this.$set(dom.style, s, st[s])
        })
      }
    },
    changeStyle(type, value) { // 改变cell中的style
      const select = this.$refs.hotTable.hotInstance.getSelected()
      const hArr = ['htLeft', 'htCenter', 'htRight', 'htJustify', 'fensandq']
      const vArr = ['htTop', 'htMiddle', 'htBottom']
      if (select) {
        select.forEach(([row1, col1, row2, col2]) => {
          const startRow = row1 < row2 ? row1 : row2
          const endRow = row1 > row2 ? row1 : row2
          const startCol = col1 < col2 ? col1 : col2
          const endCol = col1 > col2 ? col1 : col2
          for (let i = startRow; i <= endRow; i++) {
            for (let j = startCol; j <= endCol; j++) {
              let tmpValue = value
              const cell = this.$refs.hotTable.hotInstance.getCellMeta(i, j)
              if (type === 'className') {
                const names = cell.className
                if (names) {
                  const tmpArr = hArr.includes(value) ? hArr : vArr
                  const nameArr = names.split(' ').filter(e => e && e.trim())
                  tmpValue = `${nameArr.filter(l => !tmpArr.includes(l)).join(' ')} ${tmpValue}`
                }
                this.$refs.hotTable.hotInstance.setCellMeta(i, j, 'className', tmpValue)
              } else if (type === 'clear') {
                cell.className && delete cell.className
                cell.style && delete cell.style
                cell.cellType && delete cell.cellType
              } else {
                this.$set(cell, 'style', cell.style || {})
                this.$set(cell.style, type, value)
              }
            }
          }
        })
        this.$refs.hotTable.hotInstance.render()
      }
    },
    clearBorder() { // 清除边框
      const select = this.$refs.hotTable.hotInstance.getSelected()
      if (select) {
        select.forEach(([row1, col1, row2, col2]) => {
          const startRow = row1 < row2 ? row1 : row2
          const endRow = row1 > row2 ? row1 : row2
          const startCol = col1 < col2 ? col1 : col2
          const endCol = col1 > col2 ? col1 : col2
          for (let i = startRow; i <= endRow; i++) {
            for (let j = startCol; j <= endCol; j++) {
              const { style } = this.$refs.hotTable.hotInstance.getCellMeta(i, j)
              if (style) {
                Object.keys(style).forEach(k => {
                  k.indexOf('border-') > -1 && delete style[k]
                })
              }
            }
          }
        })
        this.$refs.hotTable.hotInstance.render()
      }
    },
    addBorder(border) { // 设置边框
      const hot = this.$refs.hotTable.hotInstance
      const selectRang = hot.getSelectedRange()
      const {
        left, right, top, bottom
      } = border
      for (let i = 0, len = selectRang.length; i < len; i++) {
        const { from, to } = selectRang[i]
        top && this.setBorder([[from.row, from.col, from.row, to.col]], { top }, [from.row, from.col])
        bottom && this.setBorder([[to.row, from.col, to.row, to.col]], { bottom }, [from.row, from.col])
        right && this.setBorder([[from.row, to.col, to.row, to.col]], { right }, [from.row, from.col])
        left && this.setBorder([[from.row, from.col, to.row, from.col]], { left }, [from.row, from.col])
      }
    },
    setBorder(rang, style, limit) { // 设置边框
      const hot = this.$refs.hotTable.hotInstance
      const dr = Object.keys(style)[0]
      const simpleStyle = this.toSimpleStyle(style)
      const flag = dr === 'bottom' || dr === 'right'
      const customBordersPlugin = hot.getPlugin('customBorders')
      rang.forEach(([fromRow, fromCol, toRow, toCol]) => {
        for (let i = fromRow; i <= toRow; i++) {
          for (let j = fromCol; j <= toCol; j++) {
            const pos = flag ? this.getVisiableCell(limit, i, j) : { i, j }
            const oldStyle = hot.getCellMeta(pos.i, pos.j).style || {}
            // const selfStyle = JSON.parse(JSON.stringify(simpleStyle))
            // if (!Object.prototype.hasOwnProperty.call(oldStyle, `border-${dr}-width`)) {
            //   selfStyle[`border-${dr}-width`] = `${this.$refs.StartPage.fontStyle.borderWidth}px`
            // }
            // if (!Object.prototype.hasOwnProperty.call(oldStyle, `border-${dr}-color`)) {
            //   selfStyle[`border-${dr}-color`] = this.$refs.StartPage.fontStyle.borderColor
            // }
            // if (!Object.prototype.hasOwnProperty.call(oldStyle, `border-${dr}-style`)) {
            //   selfStyle[`border-${dr}-style`] = this.$refs.StartPage.fontStyle.borderStyle
            // }
            const selfStyle = {}
            selfStyle[`border-${dr}-width`] = `${this.$refs.StartPage.fontStyle.borderWidth}px`
            selfStyle[`border-${dr}-color`] = this.$refs.StartPage.fontStyle.borderColor
            selfStyle[`border-${dr}-style`] = this.$refs.StartPage.fontStyle.borderStyle
            hot.setCellMeta(pos.i, pos.j, 'style', { ...oldStyle, ...selfStyle })
          }
        }
      })
      hot.render()
    },
    getVisiableCell([fromRow, fromCol], i, j) {
      const old = { i, j }
      const hot = this.$refs.hotTable.hotInstance
      while (i >= 0 && i >= fromRow) {
        if (!hot.getCellMeta(i, j).hidden) return { i, j }
        i--
      }
      i = fromRow
      while (j >= 0 && j >= fromCol) {
        if (!hot.getCellMeta(i, j).hidden) return { i, j }
        j--
      }
      j = fromCol
      return old
    },
    setAllBorder({ width = 1, color = '#000000' }) { // 所有边框
      const hot = this.$refs.hotTable.hotInstance
      const selects = hot.getSelected()
      const style = { width, color }
      // console.log(selects)
      if (selects) {
        selects.forEach(([row1, col1, row2, col2]) => {
          const startRow = row1 < row2 ? row1 : row2
          const endRow = row1 > row2 ? row1 : row2
          const startCol = col1 < col2 ? col1 : col2
          const endCol = col1 > col2 ? col1 : col2
          for (let i = startRow; i <= endRow; i++) {
            this.setBorder([[i, startCol, i, endCol]], { top: style }, [startRow, startCol])
            // console.log(endRow)
            if (i === endRow) this.setBorder([[i, startCol, i, endCol]], { bottom: style }, [startRow, startCol])
          }
          for (let j = startCol; j <= endCol; j++) {
            this.setBorder([[startRow, j, endRow, j]], { left: style }, [startRow, startCol])
            if (j === endCol) this.setBorder([[startRow, j, endRow, j]], { right: style }, [startRow, startCol])
          }
        })
      }
    },
    toSimpleStyle(style) { // 添加边框
      const res = {}
      const dr = Object.keys(style)[0]
      const { width, color } = style[dr]
      color && (res[`border-${dr}-color`] = color)
      if (Object.prototype.hasOwnProperty.call(style[dr], 'width')) {
        res[`border-${dr}-width`] = width
      }
      if (Object.prototype.hasOwnProperty.call(style[dr], 'style') && this.$refs.StartPage) {
        res[`border-${dr}-style`] = this.$refs.StartPage.fontStyle.borderStyle
      }
      return res
    },
    saveData() { // 获取需要保存的数据
      const hot = this.$refs.hotTable.hotInstance
      const { id } = this.bbList
      const { realData } = this.hotSettings
      const { data } = this.hotSettings
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
        if (keys) {
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
      const { fixedRowsTop, fixedColumnsLeft, fixedRowsBottom } = this.hotSettings
      const { print, protect } = this
      const param = {
        id,
        data: JSON.stringify({
          colWidths,
          rowHeights,
          cell,
          mergeCells,
          hiddenColumns,
          hiddenRows,
          data,
          realData,
          fixedRowsTop,
          fixedColumnsLeft,
          fixedRowsBottom
        }),
        printSet: JSON.stringify({
          print,
          protect
        })
      }
      return param
    },
    headerHandler(type) { // 文件行事件
      const hot = this.$refs.hotTable.hotInstance
      const { id } = this.bbList
      const DEAL = {
        open: () => {},
        save: () => {
          if (this.$refs.FunctionPage && this.$refs.FunctionPage.status) {
            this.$message.warning('当前在计算模式，不能使用此保存按钮')
          } else {
            const param = this.saveData()
            if (id) {
              this.$api.reportDesign.saveData(param).then(s => {
                this.$message.success('保存成功')
              }).catch(e => this.$message.error(e.message))
            }
          }
        },
        pdf: () => {},
        print: () => {
          const param = this.saveData()
          const { baseURL } = this.$http.defaults
          const url = `${baseURL}/bbReportFormsController/reportExcel`
          this.jocker(url, { type: 'pdf', ...param })
        },
        chexiao: () => hot.undo(),
        huifu: () => hot.redo()
      }
      DEAL[type]()
    },
    jocker(url, data) { // 打印...
      const auth = this.$tools.getCookie()
      if (auth) {
        const params = {
          method: 'POST',
          url,
          data: QS.stringify(data),
          responseType: 'blob', // 服务器返回的数据类型
          headers: {
            Authorization: auth,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
        axios(params).then(res => {
          const content = res.data
          const blob = new Blob([content], { type: 'application/pdf' }) // 创建一个类文件对象：Blob对象表示一个不可变的、原始数据的类文件对象
          const href = window.URL.createObjectURL(blob) // URL.createObjectURL(object)表示生成一个File对象或Blob对象
          const nw = window.open(href)
          nw.onload = () => {
            nw.print()
            window.URL.revokeObjectURL(href)
          }
        }).catch(e => {
          this.$message.error('打印失败！')
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~handsontable/dist/handsontable.full.css';
.handsontable {
  width: 100%;
  & /deep/ td {
    position: relative;
    font-size: 12px;
    &.fensandq {
      text-align: justify;
      text-align-last: justify;
    }
    // &.kuaijizy {
    //   padding: 0 0 0 10%;
    // }
    // &.kuaijizy::before {
    //   content: '¥';
    //   position: absolute;
    //   left: 5%;
    // }
  }
  ::-webkit-scrollbar {
    width: 15px !important;
  }
  ::-webkit-scrollbar-track, ::-webkit-scrollbar-thumb {
    border-radius: 0 !important;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #DCDCDC !important;
  }
  ::-webkit-scrollbar-track {
    background-color: #F0F0F0 !important;
  }
  ::-webkit-scrollbar {
    height: 15px;
  }
}
.excelPage {
  padding: 10px;
  height: 100%;
  .content-t {
    width: 100%;
    min-width: 1200px;
    overflow: auto;
    background: #fbfafa;
    .header {
      display: flex;
      padding: 10px 0;
      height: 24px;
      justify-content: space-between;
      &_left {
        display: flex;
        font-size: 12px;
        box-sizing: border-box;
        i {
          vertical-align: middle;
        }
        &_file {
          &::after {
            position: relative;
            top: 3px;
            content: '';
            display: inline-block;
            width: 1px;
            height: 14px;
            background: #c7c7c7;
            margin: 0 5px;
          }
        }
        &_btns {
          i {
            margin-right: 5px;
            color: #000;
          }
        }
        &_lists {
          display: flex;
          margin-left: 10px;
          li {
            margin-right: 5px;
            line-height: 24px;
          }
          span {
            display: inline-block;
            padding: 3px 10px;
            line-height: normal;
            border-radius: 15px;
            cursor: pointer;
          }
          [class~=active] span{
            background: #5ab500;
            color: #fff;
          }
        }
      }
      &_right {
        span {
          i {
            margin-right: 5px;
            font-size: 15px;
            color: #8C8A8C;
          }
        }
      }
    }
    .op {
      padding: 5px;
      height: auto;
      overflow: hidden;
      &.hide{
        height: 0;
        padding: 0;
      }
      & > div {
        display: flex;
      }
    }
  }
  .shrink {
    height: calc(100vh - 210px);
  }
  .isShrink {
    height: calc(100% - 120px);
  }
  .excelGrid {
    // max-height: calc(100% - 125px);
    width: 100%;
    display: flex;
    // border: 1px solid;
    .fewidth {
      width: calc(100% - 310px - 50px);
      overflow: auto;
    }
    .muchWidth {
      width: calc(100% - 50px);
    }
    .left {
      height: 100%;
      margin-right: 10px;
      border: 1px solid #ddd;
      .func-tip {
        display: flex;
        background: #f0f0f0;
        padding: 5px;
        & /deep/ .el-input.is-disabled .el-input__inner {
          background-color: #fff;
        }
        .position {
          width: 100px;
          margin-right: 10px;
          & + i{
            margin-right: 5px;
          }
        }
      }
      .excel {
        // border: 1px solid;
        width: 100%;
        height: calc(100vh - 320px);
      }
      .isExcel {
        height: calc(100vh - 248px);
      }
      /deep/ .vue-ruler-wrapper {
        width: 100% !important;
        height: 100% !important;
        // overflow-x: auto !important;
        &::-webkit-scrollbar-thumb, &::-webkit-scrollbar-track {
          border-radius: 0;
        }
        &::-webkit-scrollbar-thumb {
          background-color: #DCDCDC;
        }
        &::-webkit-scrollbar-track {
          background-color: #F0F0F0;
        }
        &::-webkit-scrollbar {
          height:15px;
        }
      }
      & /deep/ #hot-display-license-info{
        display: none;
      }
    }
    .middle {
      width: 300px;
      // border: 1px solid;
      margin-right: 10px;
      .bbxm {
        height: calc(100% - 30% - 15px);
        p {
          padding: 3px;
        }
        .main {
          height: calc(100% - 18px);
          .getxlTree {
            margin-top: 10px;
            height: calc(100% - 38px);
            border: 1px solid #ddd;
          }
        }
      }
      .bbcx {
        margin-top: 10px;
        height: 30%;
        p {
          padding: 3px;
        }
        .contact {
          height: calc(100% - 42px);
          border: 1px solid #ddd;
          padding: 10px;
          & > p {
            i {
              margin-right: 10px;
            }
          }
        }
      }
    }
    .right {
      width: 40px;
      border: 1px solid #ddd;
      .line {
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        width: 25px;
        height: 3px;
        display: inline-block;
        margin-left: 7.5px;
      }
      p {
        padding: 10px;
        i {
          font-size: 20px;
        }
      }
    }
  }
}
</style>
