<template>
  <div class="safePage">
    <UtilTitle
      :info="{ label: '设置批注', icon: 'baobiaoicon-02', value: 'setComment'}"
      class="icon"
      @start="doClick"
    />
    <UtilTitle
      :info="{ label: '删除批注', icon: 'baobiaoicon-03', value: 'delComment'}"
      class="icon"
      @start="doClick"
    />
    <UtilTitle
      :info="{ label: '参数定义', icon: 'canshudingyi', value: 'canshudingyi'}"
      class="icon"
      @start="doClick"
    />
    <UtilTitle
      :info="{ label: '锁定单元格', value: 'suodingdyg', icon: 'suodingdyg', title: '在保护工作表模式下，锁定的单元格数据不被更改'}"
      @start="doClick"
    />
    <UtilTitle
      :info="{
        label: protect ? '撤销工作表保护' : '保护工作表',
        value: 'baohugzb',
        icon: 'baohugzb',
        title: '通过密码对锁定的单元格进行保护，防止数据被更改'
      }"
      @start="doClick"
    />
    <UtilTitle :info="{ label: '允许用户编辑区域', value: 'allowEdit', icon: 'yunxuyonghubjqy'}" @start="doClick" />
    <!-- <div class="two-item">
      <p @click="doClick('protectWorkB')">
        <i class="iconfont icon-baohubinggxgzb" />
        <span v-if="!protectWorkB">保护并共享工作簿</span>
        <span v-else>撤销保护并共享工作簿</span>
      </p>
      <p @click="doClick('allowEdit')">
        <i class="iconfont icon-yunxuyonghubjqy" />
        <span>允许用户编辑区域</span>
      </p>
    </div> -->
    <!-- <UtilTitle :info="{ label: '修订', children:getChild('xiuding'), icon: 'xiuding'}" @start="doClick" /> -->
    <!-- <UtilTitle :info="{ label: '文档权限', value: 'wendangqx', icon: 'wendangqx'}" @start="doClick" /> -->
    <!-- <UtilTitle :info="{ label: '文档修复', value: 'wendangxiufu', icon: 'wendangxiufu'}" />
    <UtilTitle :info="{ label: '数据恢复', value: 'shujuhuifu', icon: 'shujuhuifu'}" />
    <UtilTitle :info="{ label: '历史版本', value: 'lishibanben', icon: 'lishibanben'}" /> -->
    <!-- <ProtectWork
      v-if="protectWork.show"
      :show.sync="protectWork.show"
      :protect-work-b="protectWorkB"
      :sure-pswd="protectWork.psd"
      @saveWorkB="saveWorkB"
      @cancel="cancel"
    /> -->
    <!-- <Revise v-if="revise.show" :show.sync="revise.show" :status="revise.status" @showRevise="showRevise" /> -->
    <!-- <WordPower v-if="wordPower.show" :show.sync="wordPower.show" :bb-list="bbList" /> -->
    <ProtectSheet
      v-if="protectSheet.show"
      :show.sync="protectSheet.show"
      :protect="protect"
      :psd="protectSheet.psd"
      @setPsd="setPsd"
      @repeal="repeal"
    />
    <AllowEdit
      v-if="allowEdit.show"
      :show.sync="allowEdit.show"
      :list="allowEdit.list"
      @editRefsh="editRefsh"
    />
    <SetComment v-if="setComment.show" :show.sync="setComment.show" @getComment="getComment" />
    <ParamDeFined v-if="paramDefined.show" :show.sync="paramDefined.show" />
  </div>
</template>

<script>
import UtilTitle from './utilTitle'
import ProtectSheet from '../dialog/protectSheet'
import AllowEdit from '../dialog/allowEdit'
// import ProtectWork from '../dialog/protectWork'
// import Revise from '../dialog/revise'
// import WordPower from '../dialog/wordPower'
import SetComment from '../dialog/setComment'
import ParamDeFined from '../dialog/paramDefined'

export default {
  name: 'SafePage',
  components: {
    UtilTitle,
    ProtectSheet,
    ParamDeFined,
    AllowEdit,
    // ProtectWork,
    // Revise,
    // WordPower,
    SetComment
  },
  props: {
    bbList: {
      type: Object,
      default: () => {}
    },
    isProtect: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      h: null,
      protect: false,
      // protectWorkB: false,
      protectSheet: { // 保护工作表
        show: false,
        psd: '',
        checkList: []
      },
      allowEdit: { // 允许用户编辑区域
        show: false,
        list: []
      },
      // protectWork: { // 保护工作簿
      //   show: false,
      //   psd: ''
      // },
      // revise: { // 修订
      //   show: false,
      //   status: false
      // },
      // wordPower: { // 文档权限
      //   show: false
      // },
      setComment: { // 设置批注
        show: false
      },
      paramDefined: { // 参数定义
        show: false
      }
    }
  },
  computed: {
    getChild() {
      // eslint-disable-next-line func-names
      return function (type) {
        const childs = {
          xiuding: [
            { label: '突出显示修订', icon: 'tuchuxianshixiuding', value: 'xiuding' }
          ]
        }
        return childs[type]
      }
    }
  },
  watch: {
    isProtect: {
      immediate: true,
      handler(val) {
        if (Object.keys(val).length) {
          const { psd, protect, allowEdit } = val
          this.protect = protect
          this.protectSheet.psd = psd
          this.allowEdit.list = [...allowEdit]
        }
      }
    }
  },
  methods: {
    getComment(obj) { // 设置批注
      const hot = this.$parent.$refs.hotTable.hotInstance
      const { comment } = obj
      const select = hot.getSelected()
      if (select && comment) {
        select.forEach(([row1, col1, row2, col2]) => {
          const startRow = row1 < row2 ? row1 : row2
          const endRow = row1 > row2 ? row1 : row2
          const startCol = col1 < col2 ? col1 : col2
          const endCol = col1 > col2 ? col1 : col2
          for (let i = startRow; i <= endRow; i++) {
            for (let j = startCol; j <= endCol; j++) {
              const commentsPlugin = hot.getPlugin('comments')
              const cell = hot.getCellMeta(i, j)
              if (!cell.readOnly) commentsPlugin.setCommentAtCell(i, j, comment)
              // const val = cell && cell.value ? `${cell.value},  [单元格批注为]： ${comment}` : comment
            }
          }
        })
      }
    },
    // showRevise(val) { // 突出显示修订
    //   this.revise.status = val
    //   const hot = this.$parent.$refs.hotTable.hotInstance
    //   if (!val) {
    //     const arr = hot.getCellsMeta().filter(l => l.comment && l.comment.revise)
    //     const commentsPlugin = hot.getPlugin('comments')
    //     if (arr && arr.lenth !== 0) {
    //       for (let i = 0, len = arr.length; i < len; i++) {
    //         commentsPlugin.removeCommentAtCell(arr[i].row, arr[i].col)
    //       }
    //     }
    //   }
    // },
    // cancel() { // 取消工作簿保护
    //   const h = this.$createElement
    //   this.$msgbox({
    //     title: '提示',
    //     message: h('p', null, [
    //       h('span', { style: 'display: block' }, '这项操作将取消本工作簿的共享 '),
    //       h('span', { style: 'display: block; margin-bottom: 10px' }, '是否取消工作簿的共享? '),
    //       h('span', { style: 'color: teal; display: inline-block' }, '· 要使工作簿仅供个人使用,请单击 "确定"'),
    //       h('span', { style: 'color: teal; display: inline-block' }, '· 要取消此项操作，返回共享模式,请单击 "取消"')
    //     ]),
    //     showCancelButton: true,
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     beforeClose: (action, instance, done) => {
    //       if (action === 'confirm') {
    //         this.protectWorkB = false
    //         this.protectWork.psd = ''
    //         done()
    //       } else {
    //         done()
    //       }
    //     }
    //   }).then(action => {}).catch(() => {})
    // },
    // saveWorkB(psd) { // 保护工作簿
    //   this.$confirm('此操作将导致保存文档, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     this.$parent.headerHandler('save')
    //     this.protectWorkB = true
    //     this.protectWork.psd = psd
    //   }).catch(() => {})
    // },
    editRefsh(arr) { // 是否设置编辑区域
      this.allowEdit.list = [...arr]
    },
    setPsd(obj) { // 设置工作表示否可编辑
      const hot = this.$parent.$refs.hotTable.hotInstance
      const { psd, checkList } = obj
      this.protect = true
      this.protectSheet.psd = psd
      if (!(checkList.length === 1 && checkList[0] === 'checkCell')) {
        for (let i = 0, len = this.allowEdit.list.length; i < len; i++) {
          const { area } = this.allowEdit.list[i]
          const arr = area.indexOf(':') > -1 ? area.split(':') : [area]
          let startCol = ''
          let startRow = ''
          let endCol = ''
          let endRow = ''
          const colHeaderList = hot.getColHeader()
          const rowHeaderList = hot.getRowHeader()
          if (arr && arr.length) {
            startCol = colHeaderList.findIndex(l => l === arr[0].trim().split('$')[1])
            startRow = rowHeaderList.findIndex(l => l === arr[0].trim().split('$')[2] * 1)
          }
          if (arr.length === 2) {
            endCol = colHeaderList.findIndex(l => l === arr[1].trim().split('$')[1])
            endRow = rowHeaderList.findIndex(l => l === arr[1].trim().split('$')[2] * 1)
          }
          endCol = endCol || startCol
          endRow = endRow || startRow
          const row1 = startRow < endRow ? startRow : endRow
          const row2 = startRow > endRow ? startRow : endRow
          const col1 = startCol < endCol ? startCol : endCol
          const col2 = startCol > endCol ? startCol : endCol
          for (let k = row1; k <= row2; k++) {
            for (let j = col1; j <= col2; j++) {
              hot.setCellMeta(k, j, 'readOnly', false)
            }
          }
        }
      }
      if (checkList.length === 1 && checkList[0] === 'checkCell') {
        this.$parent.hotSettings.readOnly = true
        const cells = hot.getCellsMeta().filter(l => l.comment)
        cells.forEach(l => {
          l.comment.readOnly = true
        })
      } else if (checkList.length === 1 && checkList[0] === 'edit') {
        if (this.allowEdit.list && this.allowEdit.list.length) {
          // eslint-disable-next-line no-prototype-builtins
          const cells = hot.getCellsMeta().filter(l => !l.hasOwnProperty('readOnly'))
          for (let i = 0, len = cells.length; i < len; i++) {
            hot.setCellMeta(cells[i].row, cells[i].col, 'readOnly', true)
          }
        }
      } else if (checkList.length === 2) {
        if (this.allowEdit.list && this.allowEdit.list.length) {
          // eslint-disable-next-line no-prototype-builtins
          const cell = hot.getCellsMeta().filter(l => !l.hasOwnProperty('readOnly'))
          for (let i = 0, len = cell.length; i < len; i++) {
            hot.setCellMeta(cell[i].row, cell[i].col, 'readOnly', true)
          }
        } else {
          this.$parent.hotSettings.readOnly = true
          const cells = hot.getCellsMeta().filter(l => l.comment)
          cells.forEach(l => {
            l.comment.readOnly = true
          })
        }
      }
      this.$emit('update', {
        protect: this.protect,
        psd,
        allowEdit: this.allowEdit.list
      })
      hot.render()
    },
    repeal() { // 取消编辑工作薄
      const hot = this.$parent.$refs.hotTable.hotInstance
      this.protect = false
      this.protectSheet.psd = ''
      this.$parent.hotSettings.readOnly = false
      const cells = hot.getCellsMeta()
      for (let i = 0, len = cells.length; i < len; i++) {
        // eslint-disable-next-line no-prototype-builtins
        cells[i].hasOwnProperty('readOnly') && delete cells[i].readOnly
        cells[i].comment && delete cells[i].comment.readOnly
      }
      this.$emit('update', {
        protect: this.protect,
        psd: this.protectSheet.psd,
        allowEdit: this.allowEdit.list
      })
    },
    doClick(type, data) {
      const hot = this.$parent.$refs.hotTable.hotInstance
      this.h = hot
      console.log(type, data)
      const DEAL = {
        baohugzb: () => { // 保护工作表
          if (this.protect && !this.protectSheet.psd) {
            this.repeal()
          } else this.protectSheet.show = true
        },
        allowEdit: () => { // 允许用户编辑区域
          if (!this.protect) this.allowEdit.show = true
        },
        suodingdyg: () => { // 锁定单元格
          if (!this.protect) {
            const select = hot.getSelected()
            if (select) {
              select.forEach(([row1, col1, row2, col2]) => {
                const startRow = row1 < row2 ? row1 : row2
                const endRow = row1 > row2 ? row1 : row2
                const startCol = col1 < col2 ? col1 : col2
                const endCol = col1 > col2 ? col1 : col2
                for (let i = startRow; i <= endRow; i++) {
                  for (let j = startCol; j <= endCol; j++) {
                    hot.setCellMeta(i, j, 'readOnly', false)
                  }
                }
              })
            }
          }
        },
        // protectWorkB: () => { // 保护并共享工作簿
        //   if (!this.protectWorkB) {
        //     this.protectWork.show = true
        //     this.protectWork.psd = ''
        //   } else if (this.protectWorkB && this.protectWork.psd) this.protectWork.show = true
        //   else if (this.protectWorkB && !this.protectWork.psd) this.protectWorkB = false
        // },
        // xiuding: () => { // 修订
        //   this.revise.show = true
        // },
        // wendangqx: () => { // 文档权限
        //   this.wordPower.show = true
        // },
        setComment: () => { // 设置批注
          this.setComment.show = true
        },
        delComment: () => { // 删除批注
          const select = hot.getSelected()
          if (select) {
            const commentsPlugin = hot.getPlugin('comments')
            commentsPlugin.removeCommentAtCell(select[0][0], select[0][1])
          }
        },
        canshudingyi: () => { // 参数定义
          this.paramDefined.show = true
        }
      }
      DEAL[type]()
    }
  }
}
</script>

<style lang="scss" scoped>
.safePage {
  display: flex;
  padding: 0 5px;
  .two-item {
    font-size: 12px;
    padding: 0 5px;
    & > p{
      flex-grow: 1;
      position: relative;
      line-height: 28px;
      cursor: context-menu;
      // align-items: center;
    }
    i{
      vertical-align: middle;
      margin-right: 3px;
    }
  }
}
</style>
