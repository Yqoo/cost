<template>
  <div class="reportMenu">
    <div class="header">
      <div class="header_left">
        <span class="header_left_file"><i class="iconfont icon-liebiao1" />文件</span>
        <span class="header_left_btns">
          <i class="iconfont icon-dakaifangshi" title="打开" @click="headerHandler('open')" />
          <i class="iconfont icon-cunchuwei" title="保存" @click="headerHandler('save')" />
          <i class="iconfont icon-PDF1" title="输出为PDF" @click="headerHandler('pdf')" />
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
      </div>
      <div class="header_right">
        <span>
          <i class="el-icon-share" title="分享" @click="headerHandler('share')" />
        </span>
      </div>
    </div>
    <div class="nav">
      <div class="btns right-line">
        <UtilTitle :info="{label: '参数录入', value: 'enteringCs', icon: 'canshuluru', style: 'color: #A8A8A6'}" />
        <UtilTitle :info="{label: '计算工作簿', value: 'countWork', icon: 'jisuangongzuobu-03', style: 'color: #A8A8A6'}" />
        <UtilTitle :info="{label: '审核', value: 'audit', icon: 'shenhegongshi', style: 'color: #A8A8A6'} " />
        <UtilTitle :info="{label: '导出Excel', value: 'exportExl', icon: 'daochuE'}" @start="doClick" />
      </div>
      <div class="btns">
        <UtilTitle :info="{label: '导入数据', value: 'importData', icon: 'daorushuju'}" @start="doClick" />
        <UtilTitle :info="{label: '刷新', value: 'refsh', icon: 'shuax', style: 'color: #A8A8A6'}" />
        <UtilTitle :info="{label: '分享', value: 'share', icon: 'fenxiang1', style: 'color: #A8A8A6'}" />
        <UtilTitle :info="{label: '上报', value: 'report', icon: 'shangbao', style: 'color: #A8A8A6'}" />
        <UtilTitle :info="{label: '现有连接', value: 'existingLinks', icon: 'xianyoulianjie', style: 'color: #A8A8A6'}" />
        <UtilTitle :info="{label: '连接', value: 'links', icon: 'lianjie', style: 'color: #A8A8A6'}" />
      </div>
    </div>
    <div class="main">
      <div class="left">
        <div v-if="isUndo" class="navigation">
          1
        </div>
        <div class="data">
          <div class="bb">
            <div style="display: flex; justify-content: space-between;">
              <span>报表查询条件</span>
              <span>当前账套：{{ ztName }}</span>
            </div>

            <div class="tree">
              <Tree
                ref="tree"
                class="treeNode"
                :search="false"
                :data="tree.data"
                :node-props="{
                  children: 'children',
                  label: 'ztmc'
                }"
                :current-node-key="tree.currentNode"
                :default-expanded-keys="tree.defaultExpandedKeys"
                @setTargetNode="setTargetNode"
              />
            </div>
          </div>
          <div class="kjn">
            <span>会计年</span>
            <el-select v-model="form.kjnd" style="width: calc(100% - 70px)" size="mini">
              <el-option
                v-for="item in kjYear"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
          <div class="kjy">
            <span>会计期间</span>
            <el-select v-model="form.kjqj" style="width: calc(100% - 70px)" size="mini">
              <el-option
                v-for="it in kjMonth"
                :key="it.id"
                :label="it.name"
                :value="it.id"
              />
            </el-select>
          </div>
          <div class="jz">
            <el-checkbox v-model="form.yjz">
              包含未记账
            </el-checkbox>
          </div>
          <div class="jz">
            <el-checkbox v-model="form.showZero">
              是否显示 0 值
            </el-checkbox>
          </div>
          <div class="footer" @click="search">
            <p>查询</p>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="func-tip">
          <div class="position">
            <el-input v-model="position" size="mini" suffix-icon="el-icon-location-information" :disabled="true" />
          </div>
          <i class="iconfont icon-hanshu" />
          <el-input
            v-model="funcText"
            style="width: 100%"
            size="mini"
            :title="funcText"
          />
        </div>
        <div v-waiting="loading" class="excel">
          <hot-table ref="hotTable" :settings="hotSettings" class="handsontable" />
        </div>
      </div>
    </div>
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
import UtilTitle from '../management/reportBb/reportCenter/compontent/utilTitle.vue'
import { HotTable } from '@handsontable/vue'
import Handsontable from 'handsontable'
import 'handsontable/dist/handsontable.full.css'
import $ from 'jquery'
import 'handsontable/languages/zh-CN'
import { initializeHF, initHFValues } from '../management/reportBb/reportCenter/js/employees.hf'
import { mapActions } from 'vuex'
import QS from 'qs'
import axios from 'axios'

export default {
  name: 'ReportMenu',
  components: {
    UtilTitle,
    HotTable
  },
  data() {
    return {
      site: [],
      upload: {
        show: false,
        action: '',
        params: {}
      },
      loading: false,
      form: {
        kjnd: '',
        kjqj: '',
        zth: '',
        yjz: true,
        showZero: false
      },
      cell: [],
      ztName: '',
      kjYear: [], // 会计年度
      kjMonth: [], // 会计起始月
      targetTabInfo: null,
      tree: {
        data: [],
        currentNode: '',
        defaultExpandedKeys: []
      },
      ziMu: [ // 字母
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
        'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
      ],
      isUndo: false, // 撤销
      isRedo: false, // 恢复
      position: '',
      funcText: '',
      qjFlag: true,
      model: false,
      print: {},
      hotSettings: {
        language: 'zh-CN',
        data: [],
        rowHeaders: true, // 行头
        colHeaders: true, // 列头
        // width: '100%',
        height: '100%',
        renderAllRows: true, // 渲染所有的行
        manualColumnResize: true, // 允许列拖动
        manualRowResize: true, // 允许行拖动
        mergeCells: true, // 允许合并单元格
        fixedRowsTop: 0, // 固定表格多少行不能滚动
        fixedColumnsLeft: 0, // 固定左侧多少列不能水平滚动
        fixedRowsBottom: 0, // 固定表格底部多少行不能滚动
        manualRowMove: true, // 当值为true时，行可拖拽至指定行
        manualColumnMove: true, // 当值为true时，列可拖拽移动到指定列
        wordWrap: true, // 自动换行
        AutoRowSize: true, // 自动行大小
        columnSorting: true, // 排序
        sortOrder: true,
        formulas: false,
        search: true, // 搜索
        autoWrapRow: true, // 最后一列中的或向右箭头将移至下一行的第一列
        autoWrapCol: true, // 最后一行中按或向下箭头将移至下一列的第一行
        customBorders: [], // 可自定义边框
        cell: [],
        rmFlag: false,
        editor: false,
        hiddenColumns: { columns: [], indicators: true }, // 允许隐藏列
        hiddenRows: { rows: [], indicators: true }, // 允许隐藏行
        licenseKey: 'non-commercial-and-evaluation',
        renderer: (instance, td, row, col, prop, value, cellProperties) => {
          Handsontable.renderers.TextRenderer.apply(HotTable, [instance, td, row, col, prop, value, cellProperties])
          if (cellProperties && cellProperties.style) this.renderStyle(td, cellProperties.style)
          $(td).text(value)
          return td
        },
        afterOnCellMouseDown: (event, coords, td) => {
          const { row, col } = coords
          const hot = this.$refs.hotTable.hotInstance
          this.position = `${this.ziMu[col === -1 ? 0 : col]}${row === -1 ? 1 : row + 1}`
          this.funcText = hot.getCellMeta(...hot.getSelected()[0]).formulaValue
            ? hot.getCellMeta(...hot.getSelected()[0]).formulaValue
            : ''
        }
      }
    }
  },
  watch: {
    // eslint-disable-next-line func-names
    'form.zth': function (val) {
      if (val) {
        this.getKjnd(val)
        this.form.kjnd = ''
        this.form.kjqj = ''
      }
    },
    // eslint-disable-next-line func-names
    'form.kjnd': function (val) {
      if (this.form.zth && val) {
        this.getKjqj(val)
        if (!this.qjFlag) {
          this.form.kjqj = ''
        }
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    if (to.params.param) {
      const p = JSON.parse(decodeURIComponent(to.params.param))
      to.meta.title = p.name
      next()
    }
    next()
  },
  beforeRouteUpdate(to, from, next) {
    if (to.params.param) {
      const p = JSON.parse(decodeURIComponent(to.params.param))
      to.meta.title = p.name
      next()
    }
    next()
  },
  created() {
    const startZT = JSON.parse(localStorage.getItem('startZT'))
    let ztsn = null
    let zth = null
    if (startZT) {
      ztsn = startZT.ztsn
      zth = startZT.zth
    }
    const { param } = this.$route.params
    const p = JSON.parse(decodeURIComponent(param))
    this.targetTabInfo = JSON.parse(JSON.stringify(p))
    this.$nextTick(() => {
      this.getData(this.targetTabInfo.id)
      this.getDefaultValue(ztsn)
    })
    this.form.zth = zth || this.form.zth
  },
  methods: {
    ...mapActions({
      getZT: 'user/getZT'
    }),
    uploadSuccess(val) {
      const hot = this.$refs.hotTable.hotInstance
      const { data } = val
      Object.assign(this.hotSettings, { ...val })
      hot.loadData(data)
    },
    doClick(type, item) {
      const DEAL = {
        importData: () => {
          const { baseURL } = this.$http.defaults
          this.upload.action = `${baseURL}/bbReportFormsController/importExcel`
          this.upload.show = true
          this.upload.params = {
            id: this.targetTabInfo.id
          }
        },
        exportExl: () => {
          const param = this.saveData()
          const { name } = this.targetTabInfo
          this.$tools.downloadWithToken('/bbReportFormsController/reportExcel', {
            type: 'xls',
            ...param
          }, `${name}.xls`, 'POST')
        }
      }
      DEAL[type]()
    },
    search() {
      const res = this.verification()
      if (res.flag) {
        const { id } = this.targetTabInfo
        const params = { ...this.form }
        params.yjz = params.yjz ? 'wjz' : 'yjz'
        const formData = new FormData()
        formData.append('bbId', id)
        formData.append('param', JSON.stringify(params))
        this.requistData(formData)
      } else this.$message.warning(res.message)
    },
    requistData(formData) {
      this.loading = true
      const hot = this.$refs.hotTable.hotInstance
      this.$http.post('/bbFunctionWorkController/getGsHs', formData).then(s => {
        const { data } = s
        this.hotSettings.data = data.data || []
        this.site = JSON.parse(JSON.stringify(data.wz))
        const mergeCells = []
        mergeCells.push(...this.site, ...this.hotSettings.mergeCells)
        this.hotSettings.mergeCells = JSON.parse(JSON.stringify(mergeCells))
        const arr = JSON.parse(JSON.stringify(this.hotSettings.data))
        const { hf, sheetId } = initializeHF()
        initHFValues(hf, sheetId, arr)
        hot.loadData(hf.getSheetValues(sheetId))
        this.hotSettings.cell = this.cell
        for (let i = 0; i < this.hotSettings.cell.length; i++) {
          const k = this.hotSettings.cell[i]
          Object.keys(k).forEach(l => {
            hot.setCellMeta(k.row, k.col, l, k[l])
          })
        }
        hot.render()
        this.loading = false
      }).catch(e => {
        this.$message.error(e.message)
        this.loading = false
      })
    },
    verification() {
      const res = {
        flag: true,
        message: '验证成功'
      }
      if (this.form.zth === '') {
        res.flag = false
        res.message = '请选择单位账套'
      } else res.flag = true
      if (this.form.kjnd === '') {
        res.flag = false
        res.message = '请选择会计年'
      } else res.flag = true
      if (this.form.kjqj === '') {
        res.flag = false
        res.message = '请选择会计期间'
      } else res.flag = true
      return res
    },
    getDefaultValue(ztsn) {
      this.$api.reportDesign.getDefaultValue({ ztsn }).then(s => {
        this.qjFlag = true
        this.form.kjnd = s.data.kjnd
        this.form.kjqj = s.data.kjqj
        const { id } = this.targetTabInfo
        const params = { ...this.form }
        params.yjz = params.yjz ? 'wjz' : 'yjz'
        const formData = new FormData()
        formData.append('bbId', id)
        formData.append('param', JSON.stringify(params))
        this.requistData(formData)
      }).catch(e => this.$message.error(e.message))
    },
    getKjnd(id) { // 获取会计年度
      this.$api.reportDesign.getKjnd({ zth: id }).then(s => {
        this.qjFlag = true
        this.kjYear = [...s.data]
      }).catch(e => this.$message.error(e.message))
      this.$nextTick(() => {
        this.qjFlag = false
      })
    },
    async getKjqj(id) { // 获取会计起始月
      await this.$api.reportDesign.getKjqj({ zth: this.form.zth, kjnd: id }).then(s => {
        this.kjMonth = [...s.data]
      }).catch(e => this.$message.error(e.message))
    },
    getData(id) {
      if (id) {
        const hot = this.$refs.hotTable.hotInstance
        // this.loading = true
        this.$api.reportDesign.getBbDesc({ id }).then(s => {
          const { data, printSet } = s.data
          const newData = JSON.parse(data)
          Object.assign(this.hotSettings, { ...newData })
          const { hf, sheetId } = initializeHF()
          const arr = JSON.parse(JSON.stringify(newData.data))
          this.cell = JSON.parse(JSON.stringify(newData.cell))
          hot.loadData(newData.data)
          initHFValues(hf, sheetId, arr)
          const newPrint = JSON.parse(printSet)
          this.print = newPrint.print
          hot.render()
          // this.loading = false
        }).catch(e => {
          this.$message.error(e.message)
          // this.loading = false
        })
      }
    },
    setTargetNode(node) { // 树节点点击
      if (node.id === '账套名称') this.$message.warning('此节点不可选')
      else this.form.zth = node.zth
    },
    saveData() { // 获取需要保存的数据
      const hot = this.$refs.hotTable.hotInstance
      const { id } = this.targetTabInfo
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
      const { print } = this
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
          print
        })
      }
      return param
    },
    headerHandler(type) {
      const DEAL = {
        open: () => {},
        save: () => {},
        pdf: () => {},
        print: () => {
          const param = this.saveData()
          const { baseURL } = this.$http.defaults
          const url = `${baseURL}/bbReportFormsController/reportExcel`
          this.jocker(url, { type: 'pdf', ...param })
        },
        chexiao: () => {},
        huifu: () => {},
        share: () => {}
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
.handsontable {
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
.reportMenu {
  width: 100%;
  .header {
    display: flex;
    justify-content: space-between;
    &_left {
      display: flex;
      font-size: 12px;
      box-sizing: border-box;
      i {
        vertical-align: middle;
      }
      &_file {
        color: #A8A8A6;
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
        i {
          color: #A8A8A6;
        }
      }
      &_btns {
        i {
          margin-right: 5px;
          color: #A8A8A6;
        }
        i:nth-child(4) {
          color: #000;
        }
      }
    }
  }
  .header, .nav {
    background: #fbfafa;
  }
  .header, .nav, .main {
    padding: 5px 10px;
    // border: 1px solid #ddd;
  }
  .nav {
    display: flex;
    .btns {
      display: flex;
    }
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
  }
  .main {
    display: flex;
    width: 100%;
    height: calc(100% - 105px);
    .left {
      // border: 1px solid #ddd;
      width: 350px;
      display: flex;
      margin-right: 10px;
      .navigation {
        border: 1px solid #ddd;
        background: #f0f0f0;
        width: 50px;
        margin-right: 5px;
      }
      .data {
        position: relative;
        border: 1px solid #ddd;
        padding: 5px;
        background: #f0f0f0;
        width: calc(100% - 5px);
        .bb {
          height: 300px;
          padding: 5px 0 10px 0;
          margin-bottom: 15px;
          // border: 1px solid;
          .tree {
            background: #fff;
            height: calc(100% - 15px);
            border: 1px solid #ddd;
            margin-top: 5px;
            .treeNode {
              ::-webkit-scrollbar {
                width: 9px;
                height: 10px;
              }
              ::-webkit-scrollbar-thumb {
                background-color: #DCDCDC !important;
              }
              ::-webkit-scrollbar-track {
                background-color: #F0F0F0 !important;
              }
              ::-webkit-scrollbar-thumb, ::-webkit-scrollbar-track {
                border-radius: 0px !important;
              }
            }
          }
        }
        .kjn {
          background: #fff;
          padding: 10px 5px;
          span {
            display: inline-block;
            width: 70px;
          }
        }
        .kjy {
          background: #fff;
          padding: 10px 5px;
          margin-bottom: 10px;
          span {
            display: inline-block;
            width: 70px;
          }
        }
        .jz {
          background: #fff;
          padding: 10px 5px;
        }
        .footer {
          width: calc(100% - 10px);
          height: 30px;
          line-height: 30px;
          text-align: center;
          position: absolute;
          bottom: 25px;
          background: #6897FF;
          cursor: pointer;
          p {
            color: #fff;
          }
        }
      }
    }
    .right {
      width: calc(100% - 387px);
      border: 1px solid #ddd;
      margin-right: 10px;
      .func-tip {
        display: flex;
        background: #f0f0f0;
        padding: 5px;
        /deep/ .el-input.is-disabled .el-input__inner {
          background-color: #fff;
        }
        .position {
          width: 100px;
          margin-right: 10px;
        }
        & +  i {
          margin-right: 5px;
        }
      }
      .excel {
        width: 100%;
        height: calc(100% - 40px);
      }
    }
  }
}
</style>
