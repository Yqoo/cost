<template>
  <div class="reportPage">
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
        <UtilTitle :info="{label: '参数录入', value: 'enteringCs', icon: 'canshuluru'}" />
        <UtilTitle :info="{label: '计算工作簿', value: 'countWork', icon: 'bianjigongzuobu-03'}" />
        <UtilTitle :info="{label: '审核', value: 'audit', icon: 'shenhegongshi'} " />
        <UtilTitle :info="{label: '导出Excel', value: 'exportExl', icon: 'daochuE'}" />
      </div>
      <div class="btns">
        <UtilTitle :info="{label: '导入数据', value: 'importData', icon: 'daorushuju'}" />
        <UtilTitle :info="{label: '刷新', value: 'refsh', icon: 'shuax'}" />
        <UtilTitle :info="{label: '分享', value: 'share', icon: 'fenxiang1'}" />
        <UtilTitle :info="{label: '上报', value: 'report', icon: 'shangbao'}" />
        <UtilTitle :info="{label: '现有连接', value: 'existingLinks', icon: 'xianyoulianjie'}" />
        <UtilTitle :info="{label: '连接', value: 'links', icon: 'lianjie'}" />
      </div>
    </div>
    <div class="main">
      <div class="left">
        <div class="navigation">
          1
        </div>
        <div class="data">
          <div class>
            <span>报表查询条件</span>
            <div class="">
              <Tree
                ref="tree"
                :search="false"
                :data="tree.data"
                :node-props="{
                  children: 'children',
                  label: 'label'
                }"
                @setTargetNode="setTargetNode"
              />
            </div>
            <div>
              <span>会计年</span>
              <el-select>
                <el-option />
              </el-select>
            </div>
            <div>
              <span>会计起始月</span>
              <el-select>
                <el-option />
              </el-select>
            </div>
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
            @blur="getFormula(funcText)"
            @focus="getCoordinate()"
          />
        </div>
        <div class="excel">
          <hot-table ref="hotTable" :settings="hotSettings" class="handsontable" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UtilTitle from '../reportCenter/compontent/utilTitle.vue'
import { HotTable } from '@handsontable/vue'
import Handsontable from 'handsontable'
import 'handsontable/dist/handsontable.full.css'
import $ from 'jquery'
import 'handsontable/languages/zh-CN'
import { initializeHF, initHFValues } from '../reportCenter/js/employees.hf'

export default {
  name: 'ReportPage',
  components: {
    UtilTitle,
    HotTable
  },
  data() {
    return {
      tree: {
        data: []
      },
      isUndo: false, // 撤销
      isRedo: false, // 恢复
      position: '',
      funcText: '',
      hotSettings: {
        language: 'zh-CN',
        data: Handsontable.helper.createEmptySpreadsheetData(20, 20),
        rowHeaders: true, // 行头
        colHeaders: true, // 列头
        // width: '100%',
        height: '100%',
        licenseKey: 'non-commercial-and-evaluation'
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    const { params } = to
    if (params.id) {
      try {
        to.meta.title = params.name
        next()
      } catch (error) {
        next()
      }
      next()
    }
  },
  methods: {
    setTargetNode(node) { // 树节点点击
      console.log(node)
    },
    getFormula() {},
    getCoordinate() {},
    headerHandler(type) {
      const DEAL = {
        open: () => {},
        save: () => {},
        pdf: () => {},
        print: () => {},
        chexiao: () => {},
        huifu: () => {},
        share: () => {}
      }
      DEAL[type]()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~handsontable/dist/handsontable.full.css';
.reportPage {
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
      border: 1px solid #ddd;
      width: 350px;
      display: flex;
      margin-right: 10px;
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
