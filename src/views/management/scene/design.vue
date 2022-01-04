<template>
  <div v-waiting="screenLoading">
    <div v-if="query.model === 'edit'" id="mx-btns">
      <ul class="mx-images">
        <li v-for="img in images" :key="img.type" @mousedown="setTargetImg(img)">
          <img
            class="dropImg"
            :src="'images/mxgraph/' + img.type + '.png'"
            :data-type="img.type"
            :alt="img.type"
          >
          <p> {{ img.name }} </p>
        </li>
      </ul>
      <el-button
        style="margin-top: 13px;"
        type="primary" size="mini"
        @click="save"
      >
        保存
      </el-button>
      <el-button
        style="margin-top: 13px;"
        type="info"
        size="mini"
        @click="clear"
      >
        清空
      </el-button>
    </div>
    <div id="mxGraph" />
    <el-dialog
      v-dialogDrag
      :modal="false"
      :visible.sync="box.show"
      :close-on-click-modal="false"
      width="600px"
    >
      <div slot="title">
        查看（点击跳转）
      </div>
      <el-tag
        v-for="tag in box.tags"
        :key="tag.name"
        :closable="query.model === 'edit' ? true : false"
        style="margin-left: 5px;"
        size="medium"
        @click="tagsView(tag)"
      >
        <span style="cursor: pointer">
          {{ tag.name }}
        </span>
      </el-tag>
      <div slot="footer">
        <el-button type="primayr" size="mini" @click="box.show = false">
          关闭
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-if="treeBox.show"
      v-dialogDrag
      :modal="false"
      width="400px"
      :visible.sync="treeBox.show"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div slot="title">
        关联{{ treeBox.type === 'menu' ? '表单' : '场景' }}
      </div>
      <Tree
        ref="tree"
        search
        :data="treeData"
        node-key="id"
        :node-props="{
          children: 'children',
          label: 'name',
        }"
        :default-checked-keys="checkNodes"
        height="400px"
        check-box
      />
      <div slot="footer">
        <el-button type="info" size="mini" @click="treeBox.show = false">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="getCheckedNodes">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable new-cap */
/* eslint-disable no-new */

import mxgraph from '@/graph/index'
import { genGraph, destroyGraph, Graph } from '@/graph/Graph'
import clonedeep from 'lodash.clonedeep'

const {
  mxEvent,
  mxCell,
  mxGeometry,
  mxUtils,
  mxCodec,
  mxRubberband,
  mxEventObject,
  mxConstants,
  mxClipboard // 工具类
} = mxgraph

Object.assign(mxEvent, {
  NORMAL_TYPE_CLICKED: 'NORMAL_TYPE_CLICKED'
})
export default {
  name: 'SceneDesign',
  data() {
    return {
      screenLoading: false,
      graph: null,
      images: [
        { type: 'FORM', name: '功能表单' },
        { type: 'SCENE', name: '选择场景' },
        { type: 'GATEWAY', name: '条件判断' },
        { type: 'DESCRIBE', name: '注释' },
        { type: 'CLASSIFY', name: '分类' }
      ],
      fnLists: {
        FORM: '功能表单',
        SCENE: '选择场景',
        GATEWAY: '条件判断',
        DESCRIBE: '注释',
        CLASSIFY: '分类'
      },
      targetImg: null,
      src: 'images/mxgraph/FORM.png',
      model: 'edit',
      query: {
        id: '',
        name: '',
        model: 'edit'
      },
      box: {
        show: false,
        tags: [],
        cell: null
      },
      treeBox: {
        folder: [],
        menu: [],
        show: false,
        checks: [],
        type: 'folder'
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    if (to.params.id) {
      try {
        to.meta.title = `${to.params.name}`
        next()
      } catch (error) {
        next()
      }
    }
    next()
  },
  beforeRouteUpdate(to, from, next) {
    if (to.params.id) {
      try {
        to.meta.title = `${to.params.name}`
        next()
      } catch (error) {
        next()
      }
    }
    next()
  },
  computed: {
    checkNodes() {
      const { checks } = this.treeBox
      return checks.map(c => c.id)
    },
    treeData() {
      const { type } = this.treeBox
      return this.treeBox[type]
    }
  },
  created() {
    this.query = this.$route.params || {}
    this.getTree(this.query.id)
  },
  mounted() {
    this.initMxGraph()
  },
  methods: {
    getCheckedNodes() {
      const nodes = this.$refs.tree.getCheckedNodes()
      this.treeBox.checks.length = 0
      nodes.forEach((node, index) => {
        this.$set(this.treeBox.checks, index, node)
      })
      this.treeBox.show = false
    },
    setTargetImg(item) {
      this.targetImg = { ...item }
    },
    confirmDropEle(sourceEles) {
      const { targetImg } = this
      return [...sourceEles].filter(ele => ele.dataset && ele.dataset.type === targetImg.type)[0]
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
        const dom = this.confirmDropEle(sourceEles)
        const type = dom ? dom.getAttribute('alt') : 'FORM'
        this.insertVertex(x, y, type, dom, target)
      }
      Array.from(sourceEles).forEach(ele => {
        const dragElt = document.createElement('img')
        dragElt.setAttribute('src', ele.getAttribute('src'))
        mxUtils.makeDraggable(ele, dropValidate, dropSuccessCb, dragElt,
          null, null, null, true)
      })
    },
    save() {
      this.screenLoading = true
      const flowXml = this.getExportModel()
      this.$api.mxGraph.saveSceneXML({
        id: this.query.id,
        flowXml
      }).then(s => {
        this.$message.success('保存成功！')
        this.screenLoading = false
      }).catch(e => {
        this.screenLoading = false
        this.$message.error(e.message)
      })
    },
    getExportModel() {
      const model = clonedeep(this.graph.getModel())
      Object.values(model.cells).forEach(cell => {
        if (cell.vertex && cell.data) {
          cell.data = JSON.stringify(cell.data)
        }
      })
      const enc = new mxCodec()
      const node = enc.encode(model)
      return mxUtils.getPrettyXml(node)
    },
    clear() {
      this.$confirm('是否确认清空? ').then(() => {
        this.graph && this.graph.getModel().clear()
      }).catch(e => {})
    },
    editCell(cell) {
      const { data, cellType } = cell
      this.treeBox.type = cellType === 'FORM' ? 'menu' : 'folder'
      this.treeBox.checks = data
      this.treeBox.show = true
    },
    tagsView(tag) {
      const {
        type, sceneId, sceneName, path
      } = tag
      const route = type === 'folder' ? `/sceneDesign/${sceneId}/${sceneName}/view` : path
      this.$router.push({ path: route })
    },
    insertVertex(x, y, type, dom, target) {
      const src = dom ? dom.getAttribute('src') : this.src
      const parent = this.graph.getDefaultParent()
      this.graph.getModel().beginUpdate()
      try {
        const nodeRootVertex = new mxCell('双击输入', new mxGeometry(0, 0, 180, 40))
        nodeRootVertex.vertex = true
        nodeRootVertex.data = []
        nodeRootVertex.cellType = type
        const normalTypeVertex = this.graph.insertVertex(nodeRootVertex, null, '',
          0, 0.02, 35, 39,
          `iconChoose;constituent=1;whiteSpace=wrap;strokeColor=none;node;image=${src};cursor=pointer`,
          true, 'left')
        normalTypeVertex.setConnectable(false)
        const cells = this.graph.importCells([nodeRootVertex], x, y, parent)
        if (cells != null && cells.length > 0) {
          this.graph.setSelectionCells(cells)
        }
      } finally {
        this.graph.getModel().endUpdate()
      }
    },
    cellConnected(sender, evt) { // cell之间的连线事件
      const edge = evt.getProperty('edge')
      if (edge) {
        const { source, target } = edge
        edge.data = {}
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
        }
      }
    },
    initMxGraph() {
      const container = document.getElementById('mxGraph')
      mxEvent.disableContextMenu(container)
      Object.assign(mxEvent, {
        ICON_CHOOSE_CKICKED: 'ICON_CHOOSE_CKICKED'
      })
      const nodeStyle = { // 自定义左侧图片样式
        [mxConstants.STYLE_IMAGE_WIDTH]: '28',
        [mxConstants.STYLE_IMAGE_HEIGHT]: '30',
        [mxConstants.STYLE_SPACING_TOP]: '0',
        [mxConstants.STYLE_SPACING]: '0'
      }
      this.graph = genGraph(container, nodeStyle)
      this.graph.setConnectable(true)
      this.listenGraphEvent()
      this.graph.popupMenuHandler.factoryMethod = (menu, cell, evt) => {
        if (this.query.model === 'edit') {
          if (cell) {
            menu.addItem('删除', null, () => {
              const cells = this.graph.getSelectionCells()
              mxClipboard.removeCells(this.graph, cells)
              cell.edge = false
            })
            const hasEdit = ['FORM', 'SCENE']
            if (!cell.edge && hasEdit.includes(cell.cellType)) {
              menu.addItem('编辑', null, () => this.editCell(cell))
            }
          } else {
            Object.keys(this.fnLists).forEach(key => {
              menu.addItem(this.fnLists[key], null, () => {
                const x = mxEvent.getClientX(evt)
                const y = mxEvent.getClientY(evt)
                this.src = `images/mxgraph/${key || 'FORM'}.png`
                this.insertVertex(x, y, key)
              })
            })
          }
        }
      }
      if (this.query.model === 'edit') {
        new mxRubberband(this.graph)
      } else {
        this.graph.setEnabled(false)
        this.graph.addListener(mxEvent.DOUBLE_CLICK, (sender, evt) => this.cellViews(sender, evt))
      }
      this.graph.addListener(mxEvent.CELL_CONNECTED, (sender, evt) => this.cellConnected(sender, evt))
      this.makeDraggable(document.getElementsByClassName('dropImg'))
      this.getXML(this.query.id)
    },
    cellViews(sender, evt) {
      const { cell } = evt.properties
      if (cell.data.length > 1) {
        this.box.tags = [...cell.data]
        this.box.show = true
      } else if (cell.data.length === 1) {
        const f = cell.data[0]
        const path = f.type === 'folder' ? `/sceneDesign/${f.sceneId}/${f.sceneName}/view` : f.path
        this.$router.push({ path })
      }
    },
    listenGraphEvent() {
      this.graph.addListener(mxEvent.CLICK, (sender, evt) => {
        const { cell } = evt.properties
        if (!cell) {
          return
        }
        const clickNormalType = cell.style && cell.style.includes('iconChoose')
        if (clickNormalType) {
          // 使用 mxGraph 事件中心，触发自定义事件
          // eslint-disable-next-line no-undef
          this.graph.fireEvent(new mxEventObject(mxEvent.ICON_CHOOSE_CKICKED, 'cell', cell))
        }
      })
    },
    parseJSONCellData(codec) {
      codec.objects.forEach(cell => {
        if (cell && cell.data) {
          cell.data = typeof (cell.data) === 'string' ? JSON.parse(cell.data) : cell.data
        }
      })
      this.screenLoading = false
    },
    getTree(id) {
      this.$api.mxGraph.getFilterTree({ id: '' }).then(s => {
        const { folder, menu } = s.data
        this.treeBox.folder = folder
        this.treeBox.menu = menu?.filter(m => m.alias !== 'Workbench')
      })
    },
    getXML(id) {
      this.screenLoading = true
      this.$api.mxGraph.getSceneXML({ id }).then(s => {
        const doc = mxUtils.parseXml(s.data.flowXml)
        const codec = new mxCodec(doc)
        codec.decode(doc.documentElement, this.graph.getModel())
        this.parseJSONCellData(codec)
      }).catch(e => {
        this.screenLoading = false
        this.$message.error(e.message)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  #mx-btns {
    height: 56px;
    text-align: right;
    padding-right: 20px;
    border-bottom: 1px solid #ddd;
    font-size: 12px;
  }
  #mxGraph {
    width: 100%;
    height: calc(100% - 57px);
    overflow: auto;
  }
  .mx-images {
    float: left;
    font-size: 12px;
    display: flex;
    list-style: none;
    padding-left: 0px;
    margin-bottom: 0px;
  }
  .mx-images li {
    margin: 3px 0px 0px 10px;
    text-align: center;
    cursor: pointer;
  }
</style>
