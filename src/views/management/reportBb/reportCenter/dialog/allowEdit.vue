<template>
  <div class="allowEdit">
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :model="false"
      width="30%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        允许用户编辑区域
      </div>
      <div class="main">
        <div class="area">
          <div class="header">
            <p>标题</p>
            <p>引用单元格</p>
          </div>
          <ul class="context">
            <li v-for="k in areaList" :key="k.id" :class="{backColor: k.choose}" @click="areaClick(k)">
              <p>{{ k.title }}</p>
              <p>{{ k.area }}</p>
            </li>
          </ul>
        </div>
        <div class="btns">
          <el-button v-for="item in btns" :key="item.type" size="mini" @click.native="doClick(item.type, item)">
            {{ item.label }}
          </el-button>
        </div>
      </div>
      <div slot="footer">
        <el-button size="mini" type="info" @click="() => this.$emit('update:show', false)">
          取消
        </el-button>
        <el-button size="mini" type="primary" @click="save">
          确定
        </el-button>
      </div>
    </el-dialog>
    <TableArea
      v-if="addArea.show"
      :show.sync="addArea.show"
      :info="addArea.nodeItem"
      @refsh="refsh"
    />
  </div>
</template>

<script>
import TableArea from './tableArea'

export default {
  name: 'AllowEdit',
  components: {
    TableArea
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      btns: [
        { type: 'add', label: '新建' },
        { type: 'edit', label: '修改' },
        { type: 'del', label: '删除' }
      ],
      areaList: this.list,
      addArea: {
        show: false,
        nodeItem: {}
      },
      value: '',
      hot: null
    }
  },
  watch: {
    show: {
      immediate: true,
      handler: 'getSelect'
    }
  },
  created() {
    this.hot = this.$parent.h
  },
  methods: {
    getSelect(val) { // 获取选定单元格
      if (val) {
        const hot = this.$parent.h
        const select = hot.getSelected()
        const colHeaderList = hot.getColHeader()
        const rowHeaderList = hot.getRowHeader()
        if (select && select[0].length) {
          const stratRow = select[0][0]
          const startCol = select[0][1]
          const endRow = select[0][2]
          const endCol = select[0][3]
          if (stratRow === endRow) {
            this.value = `$${colHeaderList[startCol]}$${rowHeaderList[stratRow]}`
          } else {
            this.value = `$${colHeaderList[startCol]}$${rowHeaderList[stratRow]} : $${colHeaderList[endCol]}$${rowHeaderList[endRow]}`
          }
        }
      }
    },
    refsh(obj) {
      const index = this.areaList.findIndex(l => l.id === obj.id)
      if (index !== -1) {
        this.$set(this.areaList, index, obj)
      } else this.areaList.push(obj)
    },
    save() {
      this.$emit('editRefsh', this.areaList)
      this.$emit('update:show', false)
    },
    areaClick(item) {
      this.addArea.nodeItem = item
      this.areaList.forEach(k => {
        if (k.id === item.id) item.choose = true
        else k.choose = false
      })
    },
    doClick(type, val) {
      console.log(type, val)
      const DEAl = {
        add: () => {
          this.addArea.show = true
          this.addArea.nodeItem = {}
        },
        edit: () => {
          this.addArea.show = true
        },
        del: () => {
          this.areaList = this.areaList.filter(k => !k.choose)
        }
      }
      DEAl[type]()
    }
  }
}
</script>

<style lang="scss" scoped>
.allowEdit {
  /deep/ .el-dialog__body {
    min-height: 120px !important;
  }
  .main {
    display: flex;
    width: 100%;
    .area {
      width: 85%;
      border: 1px solid #ddd;
      margin-right: 10px;
      .header {
        display: flex;
        p {
          flex: 1;
          text-align: center;
          padding: 5px;
          font-size: 12px;
          border-bottom: 1px solid #ddd;
        }
        p:nth-of-type(1) {
          border-right: 1px solid #ddd;
        }
      }
      .context {
        height: 260px;
        overflow: auto;
        li {
          display: flex;
          p {
            flex: 1;
            padding: 3px;
            font-size: 12px;
            &:nth-child(1) {
              margin-right: 1px;
            }
          }
        }
        .backColor {
          background: #E8EBEF;
        }
      }
    }
    .btns {
      width: calc(100% -85% -10px);
      text-align: center;
      .el-button {
        display: block;
        margin: 10px auto;
      }
    }
  }
  .cell {
    margin-top: 10px;
  }
}
</style>
