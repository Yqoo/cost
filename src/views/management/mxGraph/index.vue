<template>
  <div id="mxGraph" v-waiting="screenLoading">
    <LeftWorkbench ref="leftWorkbench" :width="width" title="算法设计">
      <el-collapse slot="tree" v-model="collapse.used">
        <el-collapse-item
          v-for="col in collapse.items"
          :key="col.name"
          :name="col.name"
        >
          <span slot="title" style="font-size: 13px; padding-left: 10px">
            {{ col.title }}
          </span>
          <ul class="leftUl">
            <li
              v-for="item in col.children"
              :key="item.name"
              @mousedown="setTargetImg(item)"
            >
              <img
                :src="'images/mxgraph/' + item.src + '.png'"
                :alt="item.name"
                class="dropImg"
                :data-type="item.sn"
              >
              <span>{{ item.name }}</span>
            </li>
          </ul>
        </el-collapse-item>
      </el-collapse>
    </LeftWorkbench>
    <MiddleDrag
      :margin-top="middleDragTop"
      @hook:mounted="getTop"
      @move="move"
    />
    <RightWorkbench :margin-left="width">
      <ToolsBar
        slot="toolsBar"
        class="btnColor"
        :items="btns"
        @btnsHandler="btnsHandler"
      />
      <div slot="table" class="mxGraph-box">
        <div id="mxgraph" />
      </div>
    </RightWorkbench>
    <variable-define
      v-if="variableDefine.show"
      :show.sync="variableDefine.show"
      :datas.sync="variableDefine.datas"
      @setNodeDatas="setNodeDatas"
    />
    <sql-comp
      v-if="sqlComp.show"
      :show.sync="sqlComp.show"
      :datas.sync="sqlComp.datas"
      :out-fields="sqlComp.outFields"
      :type="sqlComp.type"
      @setNodeDatas="setNodeDatas"
    />
    <columnJoin
      v-if="columnJoin.show"
      :show.sync="columnJoin.show"
      :sources.sync="columnJoin.sources"
      :datas.sync="columnJoin.datas"
      @setNodeDatas="setNodeDatas"
    />
    <rowJoin
      v-if="rowJoin.show"
      :show.sync="rowJoin.show"
      :datas.sync="rowJoin.datas"
      :sources.sync="rowJoin.sources"
      @setNodeDatas="setNodeDatas"
    />
    <existence
      v-if="existence.show"
      :show.sync="existence.show"
      :datas.sync="existence.datas"
      :sources.sync="existence.sources"
      @setNodeDatas="setNodeDatas"
    />
    <data-share
      v-if="dataShare.show"
      :show.sync="dataShare.show"
      :datas.sync="dataShare.datas"
      :sources.sync="dataShare.sources"
      @setNodeDatas="setNodeDatas"
    />
    <data-map-input
      v-if="dataMapInput.show"
      :show.sync="dataMapInput.show"
      :datas.sync="dataMapInput.datas"
      :variable-define="dataMapInput.vd"
      @setNodeDatas="setNodeDatas"
    />
    <constant-data
      v-if="constantData.show"
      :show.sync="constantData.show"
      :datas.sync="constantData.datas"
      @setNodeDatas="setNodeDatas"
    />
    <polymerize
      v-if="polymerize.show"
      :show.sync="polymerize.show"
      :datas.sync="polymerize.datas"
      :sources.sync="polymerize.sources"
      @setNodeDatas="setNodeDatas"
    />
  </div>
</template>

<script>

import mxgraph from '@/graph/index'
import { genGraph, destroyGraph, Graph } from '@/graph/Graph'

const {
  mxEvent,
  mxCell,
  mxGeometry,
  mxUtils,
  mxCodec,
  mxRubberband,
  mxClipboard // 工具类
} = mxgraph

Object.assign(mxEvent, {
  NORMAL_TYPE_CLICKED: 'NORMAL_TYPE_CLICKED'
})

// let graph = null

export default {
  name: 'MxGraph',
  components: {
    variableDefine: () => import('./components/variableDefine'),
    sqlComp: () => import('./components/sqlComp'),
    columnJoin: () => import('./components/columnJoin'),
    rowJoin: () => import('./components/rowJoin'),
    existence: () => import('./components/existence'),
    dataShare: () => import('./components/dataShare'),
    dataMapInput: () => import('./components/dataMapInput'),
    constantData: () => import('./components/constantData'),
    polymerize: () => import('./components/polymerize')
  },
  data() {
    return {
      graph: null,
      screenLoading: false,
      width: 300,
      middleDragTop: this.width,
      publicPath: process.env.BASE_URL,
      collapse: {
        used: ['basic', 'in', 'out', 'trans'],
        items: [
          {
            title: '基础',
            name: 'basic',
            children: [
              { name: '定义变量', src: 'dybl', sn: 'VariableDefine' }
            ]
          },
          {
            title: '输入',
            name: 'in',
            children: [
              { name: 'SQL输入', src: 'sqlsr', sn: 'SqlInput' },
              { name: '数据映射', src: 'sjys', sn: 'DataMapInput' },
              { name: '常量数据', src: 'clsj', sn: 'ConstantData' }
            ]
          },
          {
            title: '输出',
            name: 'out',
            children: [
              { name: 'SQL输出', src: 'sqlsc', sn: 'SqlOutput' },
              { name: 'SQL执行', src: 'sqlzx', sn: 'SqlExecute' }
            ]
          },
          {
            title: '转换',
            name: 'trans',
            children: [
              { name: '列融合', src: 'lrh', sn: 'ColumnJoin' },
              { name: '行融合', src: 'hrh', sn: 'RowJoin' },
              { name: '存在性分组', src: 'czxfz', sn: 'Existence' },
              { name: '数据分摊', src: 'sjft', sn: 'DataShare' },
              { name: '聚合', src: 'jh', sn: 'Polymerize' }
            ]
          }
        ]
      },
      targetImg: null,
      variableDefine: { // 定义变量
        show: false,
        datas: []
      },
      sqlComp: { // sql相关弹框
        show: false,
        datas: {},
        type: '',
        outFields: []
      },
      columnJoin: { // 列融合
        show: false,
        sources: []
      },
      rowJoin: { // 行融合
        show: false,
        sources: [],
        datas: {}
      },
      existence: { // 存在性分组
        show: false,
        sources: [],
        datas: {}
      },
      dataShare: { // 数据分摊
        show: false,
        sources: [],
        datas: {}
      },
      dataMapInput: { // 数据映射
        show: false,
        vd: {},
        datas: {}
      },
      constantData: { // 常量数据
        show: false,
        datas: {}
      },
      polymerize: { // 聚合
        show: false,
        datas: {}
      }
    }
  },
  computed: {
    id() {
      return this.$route.params && this.$route.params.id
    },
    btns() {
      return [
        {
          method: 'save',
          name: '保存'
        },
        {
          method: 'clear',
          name: '清空'
        }
      ]
    }
  },
  mounted() {
    this.initGraph()
  },
  methods: {
    setNodeDatas(obj) {
      const { type, data } = obj
      const cell = this.graph.getSelectionCell()
      const { edges } = cell
      const METHODS = {
        VariableDefine: () => {
          cell.data.in.options = data
        },
        SqlInput: () => {
          cell.data.in = { ...data }
          cell.data.out = data.fields
          cell.subscribe(cell.id)
        },
        SqlOutput: () => {
          cell.data = {
            out: [{
              dataSource: data.dataSource,
              sql: data.sql,
              fields: data.fields.map(f => f.field)
            }],
            original: this.$tools.deepClone(data)
          }
          cell.data.type = 'SqlOutput'
        },
        SqlExecute: () => {
          delete data.fields
          cell.data.in = { ...data }
        },
        ColumnJoin: () => {
          cell.data = this.$tools.deepClone(data)
          cell.data.type = 'ColumnJoin'
        },
        RowJoin: () => {
          cell.data = this.$tools.deepClone(data)
          cell.data.type = 'RowJoin'
        },
        Existence: () => {
          cell.data = this.$tools.deepClone(data)
          cell.data.type = 'Existence'
        },
        DataShare: () => {
          cell.data = this.$tools.deepClone(data)
          cell.data.type = 'DataShare'
        },
        DataMapInput: () => {
          cell.data = this.$tools.deepClone(data)
          cell.data.type = 'DataMapInput'
        },
        ConstantData: () => {
          cell.data = this.$tools.deepClone(data)
          cell.data.type = 'ConstantData'
        },
        Polymerize: () => {
          cell.data = this.$tools.deepClone(data)
          cell.data.type = 'Polymerize'
        }
      }
      this.graph.refresh()
      cell && METHODS[type]()
    },
    btnsHandler(type) {
      const METHODS = {
        save: () => {
          const xml = this.graph.exportModelXML()
          this.screenLoading = true
          this.$api.mxGraph.saveXML({
            id: this.id,
            xml
          }).then(s => {
            this.screenLoading = false
          }).catch(e => {
            this.screenLoading = false
            this.$message.error(e.message)
          })
        },
        clear: () => {
          this.graph.getModel().clear()
        }
      }
      METHODS[type]()
    },
    cellAddPropDatas(cell) {
      const { type } = cell.data
      const sources = this.getCellSource(cell)
      const METHODS = {
        VariableDefine: () => {
          this.variableDefine.show = true
          this.variableDefine.datas = cell.data.in.options
        },
        SqlInput: () => {
          this.sqlComp.type = 'SqlInput'
          this.sqlComp.show = true
          this.sqlComp.datas = cell.data.in
        },
        SqlOutput: () => {
          this.sqlComp.type = 'SqlOutput'
          this.sqlComp.datas = cell.data.original || {}
          this.sqlComp.outFields = []
          if (sources.length) {
            const fields = sources.map(s => s.data.out).flat(2)
            this.sqlComp.datas = cell.data.original || {}
            const obj = {}
            for (let i = 0, len = fields.length; i < len; i++) {
              if (!obj[fields[i].field]) {
                obj[fields[i].field] = true
                this.sqlComp.outFields.push(fields[i])
              }
            }
          }
          this.sqlComp.show = true
        },
        SqlExecute: () => {
          this.sqlComp.type = 'SqlExecute'
          this.sqlComp.datas = cell.data.in
          this.sqlComp.show = true
        },
        ColumnJoin: () => {
          this.columnJoin.sources = sources
          this.columnJoin.datas = cell.data.original || {}
          this.columnJoin.show = true
        },
        RowJoin: () => {
          this.rowJoin.sources = sources
          this.rowJoin.datas = cell.data.original || {}
          this.rowJoin.show = true
        },
        Existence: () => {
          this.existence.sources = sources
          this.existence.datas = cell.data.original || {}
          this.existence.show = true
        },
        DataShare: () => {
          this.dataShare.sources = sources
          this.dataShare.datas = cell.data.original || {}
          this.dataShare.show = true
        },
        DataMapInput: () => {
          const { cells } = this.graph.getModel()
          const vdCells = Object.values(cells).filter(c => c.data && c.data.type === 'VariableDefine')
          if (vdCells.length) {
            const obj = {}
            vdCells.forEach(vd => {
              vd.data.in.options && vd.data.in.options.forEach(op => {
                if (!obj[op.variable]) {
                  obj[op.variable] = op.value
                }
              })
            })
            this.dataMapInput.datas = cell.data.original || {}
            this.dataMapInput.vd = { ...obj }
            this.dataMapInput.show = true
          } else this.$message.warning('请先定义变量')
        },
        ConstantData: () => {
          this.constantData.datas = cell.data.original || {}
          this.constantData.show = true
        },
        Polymerize: () => {
          this.polymerize.sources = sources
          this.polymerize.datas = cell.data.original || {}
          this.polymerize.show = true
        }
      }
      METHODS[type]()
    },
    getCellSource(cell) {
      const sources = this.graph.model.getIncomingEdges(cell)
        .map(c => c.source)
        .filter(c => c.targetIds && c.targetIds.includes(cell.id)) // 获取当前数据来源
      const arr = []
      const obj = {}
      for (let k = 0, len = sources.length; k < len; k++) {
        if (!obj[sources[k].id]) {
          obj[sources[k].id] = true
          arr.push(sources[k])
        }
      }
      return arr
    },
    cellConnected(sender, evt) { // cell之间的连线事件
      const edge = evt.getProperty('edge')
      if (edge) {
        const { source, target } = edge
        const { cells } = this.graph.getModel()
        if (target && source) {
          // eslint-disable-next-line no-restricted-syntax
          for (const k in cells) {
            if (
              cells[k].edge && cells[k].source
                && cells[k].source.id === edge.source.id
                && cells[k].target && cells[k].target.id === edge.target.id
                && cells[k].id !== edge.id
            ) {
              this.graph.removeCells([edge])
              return
            }
          }
          if (!target.sourceIds) target.sourceIds = []
          target.sourceIds.push(source.id)
          target.sourceIds = [...new Set(target.sourceIds)]
          if (!source.targetIds) source.targetIds = []
          source.targetIds.push(target.id)
          source.targetIds = [...new Set(source.targetIds)]
        }
      }
    },
    removeCellSATId(cell) { // 移除source ID target ID
      const { source, target } = cell
      if (source && target) {
        source.targetIds && source.targetIds.splice(source.targetIds.indexOf(target.id), 1)
        target.sourceIds && target.sourceIds.splice(target.sourceIds.indexOf(source.id), 1)
        // target._restore()
      }
    },
    insertVertex(dom, target, x, y) {
      const src = dom.getAttribute('src')
      const name = dom.getAttribute('alt')
      // eslint-disable-next-line new-cap
      const nodeRootVertex = new mxCell(name || '双击输入', new mxGeometry(0, 0, 100, 155), `node;image=${src}`)
      nodeRootVertex.vertex = true
      // 自定义的业务数据放在 data 属性
      nodeRootVertex.data = {
        in: {},
        type: dom.getAttribute('data-type'),
        out: []
      }
      // 自定义方法
      nodeRootVertex.subscribe = id => this.cellSubscribe(id)
      /* const title = dom.getAttribute('alt')
      const titleVertex = graph.insertVertex(nodeRootVertex, null, title,
        0.1, 0.65, 80, 16,
        'constituent=1;whiteSpace=wrap;strokeColor=none;fillColor=none;fontColor=#e6a23c',
        true)
      titleVertex.setConnectable(false) */
      const cells = this.graph.importCells([nodeRootVertex], x, y, target)
      if (cells != null && cells.length > 0) {
        this.graph.setSelectionCells(cells)
      }
    },
    setTargetImg(item) {
      this.targetImg = { ...item }
    },
    confirmDropEle(sourceEles) {
      const { targetImg } = this
      return [...sourceEles].filter(ele => ele.dataset && ele.dataset.type === targetImg.sn)[0]
    },
    makeDraggable(sourceEles) {
      const dropValidate = evt => {
        const x = mxEvent.getClientX(evt)
        const y = mxEvent.getClientY(evt)
        const elt = document.elementFromPoint(x, y)
        // 如果鼠标落在graph容器
        if (mxUtils.isAncestorNode(this.graph.container, elt)) {
          return this.graph
        }
        // 鼠标落在其他地方
        return null
      }
      // drop成功后新建一个节点
      const dropSuccessCb = (_graph, evt, target, x, y) => {
        this.insertVertex(this.confirmDropEle(sourceEles), target, x, y)
      }
      Array.from(sourceEles).forEach(ele => {
        const dragElt = document.createElement('img')
        dragElt.setAttribute('src', ele.getAttribute('src'))
        dragElt.setAttribute('style', 'width:120px;height:120px;')
        mxUtils.makeDraggable(ele, dropValidate, dropSuccessCb, dragElt,
          null, null, null, true)
      })
    },
    initGraph() {
      this.graph = genGraph(document.getElementById('mxgraph'))
      this.graph.popupMenuHandler.factoryMethod = (menu, cell, evt) => {
        if (cell) {
          menu.addItem('删除', null, () => {
            const cells = this.graph.getSelectionCells()
            mxClipboard.removeCells(this.graph, cells)
            if (cell.edge) {
              this.removeCellSATId(cell)
              this.influenceHandler(cell.source, cell.target)
            } else if (Array.isArray(cell.edges)) {
              cell.edges.forEach(ed => {
                this.removeCellSATId(ed)
                ed.target && this.influenceHandler(ed.source, ed.target)
              })
            }
            cell.edge = false
          })
          cell.data && menu.addSeparator() // 右键菜单分割线
          cell.data && menu.addItem('编辑属性', null, () => this.cellAddPropDatas(cell))
        }
      }
      // eslint-disable-next-line new-cap
      const MxRubberband = new mxRubberband(this.graph)
      this.graph.addListener(mxEvent.CELL_CONNECTED, (sender, evt) => this.cellConnected(sender, evt))
      this.makeDraggable(document.getElementsByClassName('dropImg'))
      this.getXMLById(this.id)
    },
    getCellById(id) {
      return this.graph.getModel().getCell(id)
    },
    influenceHandler(source, target) {
      const cell = target
      const sources = this.getCellSource(cell)
      const METHODS = {
        VariableDefine: () => {},
        SqlInput: () => {
          // console.log(cell)
        },
        SqlOutput: () => {
          if (sources.length) {
            const fields = []
            sources.map(s => s.data.out).flat(2).forEach(f => {
              fields.push(f.field)
            })
            cell.data.out[0].fields = cell.data.out[0].fields.filter(o => fields.includes(o))
            cell.data.original.fields = cell.data.original.fields.filter(o => fields.includes(o.field))
            this.graph.refresh()
          } else {
            cell.data.out[0].fields = []
            cell.data.original.fields = []
          }
        },
        SqlExecute: () => {
          console.log()
        },
        ColumnJoin: () => {
          const ids = sources.map(s => s.id)
          const { out, original } = cell.data
          const items = ['main', 'other']
          if (original) {
            items.forEach(item => {
              if (!ids.includes(original[item])) { // 来源改变
                console.log(1)
                original[item] = ''
                original.comparison.forEach(com => {
                  com[item] = ''
                })
                cell.data.in[item].id = ''
                cell.data.in[item].keys = item === 'main' ? [] : {}
              } else {
                const targetNames = sources.filter(s => s.id === original[item])
                if (targetNames.length) {
                  const names = targetNames[0].data.out.map(n => n.field)
                  original.comparison.forEach(com => {
                    if (!names.includes(com[item])) {
                      com[item] = ''
                      if (item === 'main') {
                        cell.data.in.main.keys = cell.data.in.main.keys.filter(m => names.includes(m))
                      } else {
                        Object.keys(cell.data.in.other.keys).forEach(k => {
                          if (!names.includes(cell.data.in.other.keys[k])) {
                            cell.data.in.other.keys[k] = ''
                          }
                        })
                      }
                    }
                  })
                }
              }
            })
          }
        },
        RowJoin: () => {
          const ids = sources.map(s => s.id)
          const { out, original } = cell.data
          const items = ['main', 'other']
          items.forEach(item => {
            if (!ids.includes(original[item])) { // 来源改变
              original[item] = ''
              cell.data.in[item] && (cell.data.in[item].id = '')
              original.comparison && original.comparison.forEach(com => {
                com[item] = ''
              })
            } else {
              const targetNames = sources.filter(s => s.id === original[item])
              if (targetNames.length) {
                const names = targetNames[0].data.out.map(n => n.field)
                original.out.forEach(com => {
                  if (com[`${item}Type`] === 'carry') {
                    names.includes(com[`${item}Field`]) || (com[`${item}Field`] = '')
                  }
                })
                cell.data.out = original.out
              }
            }
          })
        },
        Existence: () => {
          const ids = sources.map(s => s.id)
          const { out, original } = cell.data
          const items = ['main', 'other']
          items.forEach(item => {
            if (!ids.includes(original[item])) { // 来源改变
              original[item] = ''
              cell.data.in[item] && (cell.data.in[item].id = '')
              original.comparison.forEach(com => {
                com[item] = ''
              })
              cell.data.in[item].id = ''
              cell.data.in[item].keys = item === 'main' ? [] : {}
            } else {
              const targetNames = sources.filter(s => s.id === original[item])
              if (targetNames.length) {
                const names = targetNames[0].data.out.map(n => n.field)
                original.comparison.forEach(com => {
                  names.includes(com[item]) || (com[item] = '')
                })
              }
            }
          })
          const o = sources.filter(s => s.id === original.main)[0]
          cell.data.out = o ? o.data.out : []
        },
        DataShare: () => {
          const ids = sources.map(s => s.id)
          const { out, original } = cell.data
          const items = ['main', 'other']
          items.forEach(item => {
            if (!ids.includes(original[item])) { // 来源改变
              original[item] = ''
              cell.data.in[item].id = ''
              if (item === 'main') {
                original.fields?.forEach((f, i) => {
                  f.shareKey = ''
                  cell.data.in.fields[i].shareKey = ''
                })
              } else {
                original.fields?.forEach((f, i) => {
                  f.paramKey = ''
                  f.valueKey = ''
                  cell.data.in.fields[i].paramKey = ''
                  cell.data.in.fields[i].valueKey = ''
                })
              }
              original.relations?.forEach((f, i) => {
                f[`${item}Field`] = ''
                cell.data.in.relations[i][`${item}Field`] = ''
              })
            } else {
              const targetNames = sources.filter(s => s.id === original[item])
              if (targetNames.length) {
                const names = targetNames[0].data.out.map(n => n.field)
                if (item === 'main') {
                  original.fields.forEach((f, i) => {
                    if (!names.includes(f.shareKey)) {
                      f.shareKey = ''
                      cell.data.in.fields[i].shareKey = ''
                    }
                  })
                } else {
                  original.fields.forEach((f, i) => {
                    const keys = ['paramKey', 'valueKey']
                    keys.forEach(key => {
                      if (!names.includes(f[key])) {
                        f[key] = ''
                        cell.data.in.fields[i][key] = ''
                      }
                    })
                  })
                  cell.data.out = cell.data.out.filter(o => names.includes(o.field))
                }
                original.relations.forEach((f, i) => {
                  if (!names.includes(f[`${item}Field`])) {
                    f[`${item}Field`] = ''
                    cell.data.in.relations[i][`${item}Field`] = ''
                  }
                })
              }
            }
          })
        },
        DataMapInput: () => {},
        ConstantData: () => {
          console.log('ConstantData')
        },
        Polymerize: () => {
          const outs = []
          sources.filter(s => s.data?.type !== 'SqlOutput').forEach(m => {
            outs.push(...m.data?.out?.map(o => o.field))
          })
          const { out, original } = cell.data
          out.forEach((item, index) => {
            if (item.action === 'carry' && !outs.includes(item.value)) {
              out.splice(index, 1)
              original.out.splice(index, 1)
            }
          })
        }
      }
      if (cell.data && cell.data.type) METHODS[cell.data.type]()
    },
    cellSubscribe(id) {
      if (id) {
        const cell = this.getCellById(id) // 在graph找到当前的cell
        const { targetIds } = cell // 通过当前cell的targetIds找到受影响的其它cells
        if (Array.isArray(targetIds)) { // 判断是否存在相关联的cells
          targetIds.map(tid => this.getCellById(tid))?.forEach(rela => { // 递归查找当前cell是否还有相关联的其它cells
            rela && this.cellSubscribe(rela.id)
            rela && this.influenceHandler(cell, rela)
          })
        }
      }
    },
    parseJSONCellData(codec) {
      codec.objects.forEach(cell => {
        if (cell && cell.data) {
          cell.data = JSON.parse(cell.data)
          cell.subscribe = id => this.cellSubscribe(id)
        }
      })
      this.screenLoading = false
    },
    getXMLById(id) {
      if (id) {
        this.screenLoading = true
        this.$api.kettle.searchById({ id }).then(s => {
          const doc = mxUtils.parseXml(s.data.flowXml)
          // eslint-disable-next-line new-cap
          const codec = new mxCodec(doc)
          codec.decode(doc.documentElement, this.graph.getModel())
          this.parseJSONCellData(codec)
        }).catch(e => {
          this.screenLoading = false
          this.$message.error(e.message)
        })
      }
    },
    getTop() {
      this.middleDragTop = this.$refs.leftWorkbench.$el.offsetHeight / 2
    },
    move(x) {
      if (x < 300) x = 300
      else if (x > 800) x = 800
      this.width = x
    }
  }
}
</script>

<style lang="scss" scoped>
  .mxGraph-box {
    height: calc(100% - 40px);
    width: 100%;
    box-sizing: border-box;
    #mxgraph {
      height: 100%;
      width: 100%;
      overflow: auto;
    }
  }
  .leftUl {
    display: flex;
    flex-flow: row wrap;
    li {
      margin: 5px;
      text-align: center;
      cursor: pointer;
      font-size: 12px;
      img {
        display: block;
        width: 40px;
        height: 40px;
        margin: 0 auto;
      }
    }
  }
  .btnColor {
    border-bottom: 1px solid #ddd;
  }
</style>
