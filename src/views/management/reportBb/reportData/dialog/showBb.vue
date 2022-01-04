<template>
  <div class="showBb">
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :model="false"
      width="80%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        {{ info.name }}
      </div>
      <div class="title">
        <div class="comment">
          <span>批注</span>
          <el-input v-model="comment" size="mini" :title="comment" readonly />
        </div>
        <div class="funcText">
          <i class="iconfont icon-hanshu" />
          <el-input
            v-model="funcText"
            size="mini"
            :title="funcText"
            readonly
          />
        </div>
      </div>
      <div class="excel">
        <hot-table ref="hotTable" :settings="hotSettings" class="handsontable" />
      </div>
      <div slot="footer">
        <el-button type="info" size="mini" @click="() => this.$emit('update:show', false)">
          关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { HotTable } from '@handsontable/vue'
import Handsontable from 'handsontable'
import 'handsontable/dist/handsontable.full.css'
import $ from 'jquery'
import 'handsontable/languages/zh-CN'
import { initializeHF, initHFValues } from '../../reportCenter/js/employees.hf'

export default {
  name: 'ShowBb',
  components: {
    HotTable
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      comment: '',
      funcText: '',
      showComment: false,
      hotSettings: {
        language: 'zh-CN',
        data: Handsontable.helper.createEmptySpreadsheetData(20, 10),
        rowHeaders: true, // 行头
        colHeaders: true, // 列头
        autoColumnSize: true,
        wordWrap: true, // 自动换行
        AutoRowSize: true, // 自动行大小
        formulas: false,
        renderAllRows: true,
        comments: true, // 启用批注
        width: '100%',
        height: 500,
        cell: [],
        colWidths: [], // 列宽 [100, 200]
        rowHeights: [],
        mergeCells: true,
        stretchH: 'all',
        rmFlag: false,
        fixedRowsTop: 0, // 固定表格多少行不能滚动
        fixedColumnsLeft: 0, // 固定左侧多少列不能水平滚动
        fixedRowsBottom: 0, // 固定表格底部多少行不能滚动
        hiddenColumns: { columns: [], indicators: true }, // 允许隐藏列
        hiddenRows: { rows: [], indicators: true }, // 允许隐藏行
        editor: false,
        licenseKey: 'non-commercial-and-evaluation',
        renderer: (instance, td, row, col, prop, value, cellProperties) => {
          Handsontable.renderers.TextRenderer.apply(HotTable, [instance, td, row, col, prop, value, cellProperties])
          if (cellProperties && cellProperties.style) {
            this.renderStyle(td, cellProperties.style)
          }
          $(td).text(value)
          return td
        },
        afterOnCellMouseDown: (event, coords, td) => {
          const { row, col } = coords
          const hot = this.$refs.hotTable.hotInstance
          const cell = hot.getCellMeta(row, col)
          this.comment = cell.comment ? cell.comment.value : ''
          this.funcText = cell.formulaValue ? cell.formulaValue : ''
        }
      }
    }
  },
  watch: {
    info: {
      immediate: true,
      handler: 'getInfo'
    }
  },
  methods: {
    getInfo(val) {
      if (Object.keys(val).length) {
        const { id } = val
        this.$api.reportDesign.getSjDesc({ id }).then(s => {
          const { data } = s.data
          const excelData = JSON.parse(data)
          const hot = this.$refs.hotTable.hotInstance
          Object.assign(this.hotSettings, { ...excelData })
          const { hf, sheetId } = initializeHF()
          const arr = JSON.parse(JSON.stringify(excelData.data))
          initHFValues(hf, sheetId, arr)
          hot.loadData(hf.getSheetValues(sheetId))
          hot.render()
        }).catch(e => this.$message.error(e.message))
      }
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~handsontable/dist/handsontable.full.css';
// .handsontable {
//   ::-webkit-scrollbar {
//     width: 15px !important;
//   }
//   ::-webkit-scrollbar-track, ::-webkit-scrollbar-thumb {
//     border-radius: 0 !important;
//   }
//   ::-webkit-scrollbar-thumb {
//     background-color: #DCDCDC !important;
//   }
//   ::-webkit-scrollbar-track {
//     background-color: #F0F0F0 !important;
//   }
//   ::-webkit-scrollbar {
//     height: 15px;
//   }
// }
.showBb {
  width: 100%;
  .excel {
    width: 100%;
    height: 500px;
  }
  .title {
    display: flex;
    .comment {
      display: flex;
      margin-bottom: 5px;
      margin-right: 5px;
      align-items: center;
      span {
        width: 28px;
      }
    }
    .funcText {
      display: flex;
      flex: 1;
    }
    .el-input {
      margin-left: 5px;
    }
  }
}
</style>
