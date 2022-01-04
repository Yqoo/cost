<template>
  <div class="findPage">
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :model="false"
      width="40%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        {{ title === 'first' ? '查找' : (title === 'second' ? '替换' : '定位') }}
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="查找" name="first">
          <div class="inp-box">
            <span>查找内容： </span>
            <el-input v-model="search.value" size="mini" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="替换" name="second">
          <div class="inp-box">
            <span>查找内容： </span>
            <el-input v-model="search.value" size="mini" />
          </div>
          <div class="inp-box">
            <span>替换为： </span>
            <el-input v-model="search.replace" size="mini" />
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane label="定位" name="third">
        </el-tab-pane> -->
      </el-tabs>
      <div class="btns">
        <el-button v-show="activeName === 'second'" size="mini" @click.native="replaceData('all')">
          全部替换
        </el-button>
        <el-button v-show="activeName === 'second'" size="mini" @click.native="replaceData('single')">
          替换
        </el-button>
        <el-button size="mini" @click.native="searchValue">
          查找
        </el-button>
        <el-button size="mini" @click="() => this.$emit('update:show', false)">
          关闭
        </el-button>
      </div>
      <div>
        <el-table
          v-if="table.data.length"
          ref="table"
          :data="table.data"
          :border="true"
          height="200px"
          highlight-current-row
          size="mini"
          @current-change="getCheckRow"
        >
          <el-table-column type="index" />
          <el-table-column label="单元格">
            <template slot-scope="scope">
              <span>${{ showValue(scope.row.col) }}${{ scope.row.row + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="值" prop="data" />
        </el-table>
      </div>
      <div v-if="table.data.length" slot="footer" style="text-align: left">
        <span> {{ table.data.length }}个单元格被找到</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'FindPage',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'first'
    }
  },
  data() {
    return {
      activeName: this.title,
      table: {
        data: []
      },
      search: {
        value: '', // 搜索值
        replace: '' // 替换值
      },
      ziMu: [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
        'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
      ],
      checkRow: {} // 选中的值
    }
  },
  methods: {
    showValue(col) {
      return this.ziMu[col]
    },
    searchValue() { // 获取搜索值
      const hot = this.$parent.h
      const search = hot.getPlugin('search')
      const result = search.query(this.search.value)
      this.table.data = [...result]
      hot.render()
    },
    getCheckRow(val) { // 获取table选中的值
      this.checkRow = { ...val }
    },
    replaceData(type) { // 替换值
      if (type === 'single' && Object.keys(this.checkRow).length === 0) {
        this.$message.warning('请选择要替换的值')
      } else {
        const hot = this.$parent.h
        const { row, col } = this.checkRow
        const cells = hot.getCellsMeta().filter(l => l.className.indexOf('htSearchResult') > -1)
        const cellArr = type === 'all' ? cells : cells.filter(e => e.row === row && e.col === col)
        for (let i = 0, len = cellArr.length; i < len; i++) {
          hot.setDataAtCell(cellArr[i].row, cellArr[i].col, this.search.replace)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.findPage {
  .inp-box {
    display: flex;
    padding: 10px;
    span {
      width: 80px;
      line-height: 25px;
    }
  }
  .btns {
    text-align: right;
    padding: 10px;
  }
}
</style>
