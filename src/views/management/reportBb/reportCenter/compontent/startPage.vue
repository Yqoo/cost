<template>
  <div>
    <div class="startPage">
      <div v-if="tag === '0'" class="model">
        <!-- 粘贴复制 -->
        <div class="fileOp right-line">
          <UtilTitle :info="{label: '粘贴', value: 'zhantie', icon: 'niantie1'}" class="icon" @start="doClick" />
          <div class="two-item">
            <p class="top" @click="doClick('cut')">
              <i class="iconfont icon-jiandao" /><span>剪切</span>
            </p>
            <p class="down" @click="doClick('copy')">
              <i class="iconfont icon-fuzhi11" /><span>复制</span>
            </p>
          </div>
          <UtilTitle
            :info="{label: '格式刷', value: 'geshishua', icon: 'qingchu'}"
            class="qingchu icon"
            @start="doClick"
          />
        </div>
        <!-- 设置字体 -->
        <div class="font right-line">
          <div class="select">
            <el-select v-model="fontStyle.fontFamily" size="mini" popper-class="myTool" @change="doClick('shezhizt')">
              <el-option
                v-for="item in ztData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select
              v-model="fontStyle.fontSize"
              popper-class="myTool"
              size="mini"
              class="font-size"
              @change="doClick('zitidx')"
            >
              <el-option
                v-for="e in ztSizeData"
                :key="e + Math.random()"
                :label="e"
                :value="e"
              />
            </el-select>
            <i
              class="iconfont icon-ziyuan1"
              title="增大字号"
              style="margin-left: 15px;"
              @click="doClick('suofangzt', 'b')"
            />
            <i class="iconfont icon-jianxiaozihao" title="减小字号" @click="doClick('suofangzt', 's')" />
          </div>
          <div class="btns">
            <i
              :class="fontStyle.isBold ? 'check' : ''"
              class="iconfont icon-jiacu" title="加粗"
              @click="doClick('cuti')"
            />
            <i
              :class="fontStyle.isItalic ? 'check' : ''"
              class="iconfont icon-qingxie"
              title="倾斜"
              @click="doClick('xieti')"
            />
            <i
              :class="fontStyle.isUnderline ? 'check' : ''"
              class="iconfont icon-xiahuaxian"
              title="下划线"
              @click="doClick('xiahuaxian')"
            />
            <UtilTitle
              :info="{ value: 'wu', icon: 'suoyoukuangxian', title: '所有框线', children: getChild('qitaBiankuang') }"
              class="icon"
              @start="doClick"
            />
            <div class="color bg">
              <i class="iconfont icon-tianchongyanse" title="填充颜色" />
              <el-color-picker v-model="fontStyle.bgColor" popper-class="myTool" @change="doClick('bgColor')" />
            </div>
            <div class="color">
              <i class="iconfont icon-zitiyanse" title="字体颜色" />
              <el-color-picker v-model="fontStyle.fontColor" popper-class="myTool" @change="doClick('ztColor')" />
            </div>
            <UtilTitle
              :info="{ value: 'quanbu', icon: 'xiangpica', title: '清除', children: getChild('qingchu') }"
              class="icon"
              @start="doClick"
            />
            <!-- <i class="el-icon-arrow-up right-btn" /> -->
          </div>
        </div>
        <div class="format right-line">
          <ul class="format-line">
            <li v-for="i in fontLine" :key="i.value">
              <i
                :class="i.isCheck && i.g ? `check icon-${i.icon}` : `icon-${i.icon}`"
                class="iconfont"
                :title="i.title"
                @click="setFontLine(i.value, i.g)"
              />
            </li>
          </ul>
          <UtilTitle :info="{ value: 'hebingjz', icon: 'hebingbiaoge', label: '合并' }" class="icon" @start="doClick" />
          <UtilTitle :info="{ value: 'zidonghh', icon: 'zidonghh', label: '自动换行' }" class="icon" @start="doClick" />
          <UtilTitle :info="{ value: 'xianshibc', icon: 'biaochi', label: '显示标尺' }" class="icon" @start="doClick" />
        </div>
        <!-- 单元格格式 -->
        <div class="cell-format right-line">
          <el-select
            v-model="cellFormat"
            popper-class="myTool"
            size="mini"
            class="cell-select"
            @change="doClick('cellGeshi')"
          >
            <el-option
              v-for="it in cFormats"
              :key="it.value"
              :label="it.label"
              :value="it.value"
            >
              <i :class="'iconfont icon-' + it.icon" />
              <span>{{ it.label }}</span>
            </el-option>
          </el-select>
          <div class="format-list">
            <UtilTitle :info="{ icon: 'huobi1', children: getChild('huobi')}" class="icon" @start="doClick" />
            <i class="iconfont icon-baifenhao" title="百分比" @click="doClick('baifenb')" />
            <i class="iconfont icon-qianji" title="千位分隔样式" @click="doClick('formatPrice')" />
            <i class="iconfont icon-xiaoshudianqian" title="增加小数位数" @click="doClick('zengjiaxsw')" />
            <i class="iconfont icon-xiaoshudianhou" title="减小小数位数" @click="doClick('jianshaoxsw')" />
          </div>
          <!-- <i class="el-icon-arrow-up right-btn" /> -->
        </div>
        <div class="other">
          <UtilTitle :info="{ label: '导入Excel', icon: 'daoruexcel-03', value: 'daoru'}" class="icon" @start="doClick" />
          <UtilTitle :info="{ label: '导出Excel', icon: 'daochuE', value: 'daochu'}" class="icon" @start="doClick" />
          <UtilTitle
            :info="{ label: '求和', icon: 'qiuhe', children: getChild('zidongqh')}"
            class="icon"
            @start="doClick"
          />
          <UtilTitle :info="{ label:'单元格',icon:'biaoge1',children:getChild('geshi')}" class="icon" @start="doClick" />
          <UtilTitle
            :info="{ label:'行和列',icon:'biaoge2',children:getChild('hanghel'),value:'hanghel'}"
            class="icon"
            @start="doClick"
          />
          <UtilTitle
            :info="{ label:'冻结',icon:'dongjie',children:getChild('dongjie'),value:'dongjie'}"
            class="icon"
            @start="doClick"
          />
          <UtilTitle
            :info="{ label:'查找',icon:'sousuo1',children:getChild('chazhao'),value:'chazhao'}"
            class="icon"
            @start="doClick"
          />
        </div>
      </div>
      <div v-if="tag === '1'" class="export">
        <util-title :info="{ label:'参数录入', icon:'canshuluru' }" />
        <util-title :info="{label:'计算工作簿',icon:'jisuangzb1',value:'jisuangzb'}" @mt="doAction" />
        <util-title :info="{label:'审核',icon:'shenhe',children:getChild('shenhe')}" />
        <util-title :info="{label:'导出Excel',icon:'daochuE'}" />
        <util-title :info="{label:'拆分表格',icon:'chaifenbiaoge',children:getChild('chaifenbg')}" />
        <util-title :info="{label:'合并表格',icon:'hebingbiaoge',children:getChild('hebingbg')}" />
        <util-title :info="{label:'导入数据',icon:'daorushuju', value: 'daoru'}" />
        <util-title :info="{label:'刷新',icon:'shuax', value: 'shuax'}" />
        <util-title :info="{label:'分享',icon:'fenxiang1', value: 'fenxiang'}" />
        <util-title :info="{label:'上报',icon:'shangbao', value: 'shangbao'}" />
        <util-title :info="{label:'现有连接',icon:'xianyoulianjie', value: 'xylianjie'}" />
        <util-title :info="{label:'连接',icon:'lianjie', value: 'lianjie'}" />
      </div>
    </div>
    <SetBorder v-if="setBorder.show" :show.sync="setBorder.show" @change="changeBorderStyle" />
    <FindPage v-if="findPage.show" :show.sync="findPage.show" :title="findPage.title" />
    <Alter v-if="alter.show" :show.sync="alter.show" :info="alter.info" @updateAmount="updateAmount" />
  </div>
</template>

<script>
import UtilTitle from './utilTitle'
import SetBorder from '../dialog/setBorder'
import $ from 'jquery'
import FindPage from '../dialog/find'
import Alter from '../dialog/alter'

export default {
  name: 'StartPage',
  components: {
    UtilTitle,
    SetBorder,
    FindPage,
    Alter
  },
  props: {
    tag: {
      type: String || Number,
      default: '0'
    },
    function: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      h: null,
      alter: {
        info: {
          type: ''
        },
        show: false
      },
      ztData: [ // 字体格式
        { value: 'SimSuncss', label: '宋体' },
        { value: 'FangSong', label: '仿宋' },
        { value: 'KaiTi', label: '楷体' },
        { value: 'SimHei', label: '黑体' },
        { value: 'LiSu', label: '隶书' },
        { value: 'YouYuan', label: '幼圆' },
        { value: 'Microsoft YaHei', label: '微软雅黑' },
        { value: 'STLiti', label: '华文隶书' },
        { value: 'STCaiyun', label: '华文彩云' },
        { value: 'STFangsong', label: '华文仿宋' },
        { value: 'STXingkai', label: '华文行楷' },
        { value: 'STHupo', label: '华文琥珀' },
        { value: 'STKaiti', label: '华文楷体' },
        { value: 'STSong', label: '华文宋体' },
        { value: 'STXihei', label: '华文细黑' },
        { value: 'STXinwei', label: '华文新魏' },
        { value: 'STZhongsong', label: '华文中宋' },
        { value: 'FZDaHei-B02S', label: '方正大黑简体' },
        { value: 'FZShuTi-S05S', label: '方正舒体简体' },
        { value: 'FZYaoTi-M06S', label: '方正姚体简体' }
        // {value: 'cursive',label: 'cursive'}
      ],
      ztSizeData: ['12', '14', '15', '16', '18', '20', '24', '30', '36'], // 字体大小
      fontLine: [ // 单元格内容位置
        {
          icon: 'shangjuzhong', title: '顶端对齐', value: 'htTop', isCheck: false, g: 1
        },
        {
          icon: 'juzhongduiqi1', title: '垂直居中', value: 'htMiddle', isCheck: false, g: 1
        },
        {
          icon: 'xiajuzhong', title: '底端对齐', value: 'htBottom', isCheck: false, g: 1
        },
        {
          icon: 'wenbenkaozuo', title: '减少缩进量', value: 'jianshaosjl', isCheck: false
        },
        {
          icon: 'wenbenkaoyou', title: '增加缩进量', value: 'zengjiasjl', isCheck: false
        },
        {
          icon: 'zuoduiqi', title: '左对齐', value: 'htLeft', isCheck: false, g: 2
        },
        {
          icon: 'juzhongduiqi', title: '水平居中', value: 'htCenter', isCheck: false, g: 2
        },
        {
          icon: 'youduiqi', title: '右对齐', value: 'htRight', isCheck: false, g: 2
        },
        {
          icon: 'liangduanduiqi', title: '两端对齐', value: 'htJustify', isCheck: false, g: 2
        },
        {
          icon: 'zuoyouliangduanduiqi', title: '分散对齐', value: 'fensandq', isCheck: false, g: 2
        }
      ],
      fontStyle: {
        fontFamily: 'SimSuncss', // 字体格式
        fontSize: '12', // 字体大小
        isBold: false, // 是否加粗
        isItalic: false, // 是否斜体
        isUnderline: false, // 是否加下划线
        bgColor: '#ffffff', // 填充颜色
        fontColor: '#000000', // 字体颜色
        autoEnter: true, // 是否自动换行
        textIndex: '0px', // 内容缩进量
        isJustify: false, // 是否分散对齐
        borderColor: '#000000', // 边框颜色
        borderStyle: 'solid', // 边框样式
        borderWidth: 0.5 // 边框宽度
      },
      cellFormat: 'text', // 单元格格式
      cFormats: [ // 单元格格式
        { icon: 'wenben1', label: '文本', value: 'text' },
        { icon: 'shuzi2', label: '数值', value: 'numeric' },
        { icon: 'qianji', label: '千分位', value: 'formatPrice' },
        { icon: 'huobi', label: '货币', value: 'huobi' },
        { icon: 'huijihesuan', label: '会计专用', value: 'kuaijizy' },
        { icon: 'duanriqi', label: '短日期', value: 'sDate' },
        { icon: 'duanriqi', label: '长日期', value: 'lDate' },
        { icon: 'shijian', label: '时间', value: 'time' },
        { icon: 'baifenhao', label: '百分比', value: 'baifenb' },
        { icon: 'fenshu', label: '分数', value: 'fenshu' },
        { icon: 'changguiwutedinggeshi', label: '科学计数', value: 'kexuejs' }
      ],
      rulerVisible: false, // 是否显示标尺
      setBorder: { // 其他框线设置
        show: false
      },
      findPage: { // 查找替换
        show: false,
        title: 'first'
      }
    }
  },
  computed: {
    getChild() {
      // eslint-disable-next-line func-names
      return function (type) {
        const childrens = {
          qitaBiankuang: [
            { label: '无边框', icon: 'wukuangxian', value: 'wu' },
            { label: '所有框线', icon: 'suoyoukuangxian', value: 'suoy' },
            { label: '外侧框线', icon: 'waicekuangxian', value: 'waic' },
            { label: '上框线', icon: 'shangkuangxian', value: 'shang' },
            { label: '下框线', icon: 'xiakuangxian', value: 'xia' },
            { label: '左框线', icon: 'zuokuangxian', value: 'zuo' },
            { label: '右框线', icon: 'youkuangxian', value: 'you' },
            { label: '上下框线', icon: 'jurassic_border-scxc', value: 'shangx' },
            { label: '其他边框', icon: 'jurassic_border-cudi', value: 'qitabk' }
          ],
          qingchu: [
            { label: '全部', icon: 'quanbu', value: 'quanbu' },
            { label: '格式', icon: 'geshi', value: 'geshi' },
            { label: '内容', icon: 'neirong', value: 'neirong' }
          ],
          huobi: [
            { label: '货币', icon: 'huobi1', value: 'huobi' },
            { label: '会计专用', icon: 'huijihesuan', value: 'kuaijizy' }
          ],
          zidongqh: [
            { label: '求和', icon: 'qiuhe', value: 'sum' },
            { label: '平均值', icon: 'pingjunzhi', value: 'average' },
            { label: '计数', icon: 'jishu', value: 'count' },
            { label: '最大值', icon: 'zuidazhi', value: 'max' },
            { label: '最小值', icon: 'zuixiaozhi', value: 'min' }
          ],
          geshi: [ // icon需更换
            { label: '文本转换成数值', icon: 'wenbenzhuanhuanweishuzhi_1', value: 'numeric' },
            // { label: '文本转换成超链接', icon: 'wenbenzhuanhuanweichaolianjie_1', value: 'wenbenzclj' },
            { label: '锁定单元格', icon: 'suodingdanyuange_1', value: 'suodingdyg' },
            { label: '取消锁定单元格', icon: 'quxiaosuodingdanyuange', value: 'unlock' }
          ],
          hanghel: [
            { label: '行高', icon: '-zitihanggao', value: 'hanggao' },
            { label: '列宽', icon: 'zuijialiekuan', value: 'liekuan' },
            {
              label: '插入行列',
              icon: 'zuijialiekuan',
              value: 'charudyg',
              children: [
                { label: '插入行', icon: 'charuhang', value: 'charuh' },
                { label: '插入列', icon: 'charulie', value: 'charul' }
              ]
            },
            {
              label: '删除行列',
              icon: 'delete-cell',
              value: 'shanchudyg',
              children: [
                { label: '删除行', icon: 'shanchuhang', value: 'shanchuh' },
                { label: '删除列', icon: 'shanchulie', value: 'shanchul' }]
            },
            {
              label: '隐藏与取消隐藏',
              icon: 'yincangyuquxiaoyincang',
              value: 'yincqux',
              children: [
                { label: '隐藏行', value: 'yingcangh' },
                { label: '隐藏列', value: 'yingcangl' },
                { label: '取消隐藏行', value: 'quxiaoych' },
                { label: '取消隐藏列', value: 'quxiaoycl' }
              ]
            }
          ],
          dongjie: [
            { label: '冻结首行', icon: 'dongjiesh', value: 'dongjiesh' },
            { label: '冻结首列', icon: 'dongjiesl', value: 'dongjiesl' },
            { label: '取消冻结窗格', icon: 'quxiaodongjiechuangge', value: 'cancelDJ' }
          ],
          chazhao: [
            { label: '查找', icon: 'sousuo1', value: 'chazhao' },
            { label: '替换', icon: 'chazhaotihuan', value: 'tihuan' }
            // { label: '定位', icon: 'Location', value: 'dingwei' }
          ],
          shenhe: [],
          chaifenbg: [
            { label: '按照工作表内容拆分', icon: '', value: 'cfGzb' },
            { label: '工作簿按工作表拆分', icon: '', value: 'cfGzp' },
            { label: '一个文档拆分成多个文档', icon: '', value: 'cfWd' }
          ],
          hebingbg: [
            { label: '按行合并多个工作表内容', icon: '', value: 'hbGongzuob' },
            { label: '按行合并同名工作表内容', icon: '', value: 'hbNameb' },
            { label: '按相同列内容匹配数据', icon: '', value: 'hbRowData' },
            { label: '多个工作簿合成一个', icon: '', value: 'hbGzb' }
          ]
        }
        return childrens[type]
      }
    }
  },
  methods: {
    updateAmount(obj) {
      const { amount, type } = obj
      const hot = this.$parent.$refs.hotTable.hotInstance
      const { arrR, arrC } = this.getSelected()
      const getArr = arr => {
        for (let i = arr.length - 1; i >= 0; i--) {
          hot.alter(type, arr[i], amount)
        }
      }
      type.indexOf('row') > -1 ? getArr(arrR) : getArr(arrC)
    },
    changeBorderStyle(data) { // 框线改变
      const {
        w, c, s, tag
      } = data
      this.fontStyle.borderColor = c
      this.fontStyle.borderStyle = s
      this.fontStyle.borderWidth = w
      this.doClick(tag)
    },
    clearFunc(hot) { // 清楚内容时清除公式
      const selects = hot.getSelected()
      if (selects) {
        selects.forEach(([row1, col1, row2, col2]) => {
          const startRow = row1 < row2 ? row1 : row2
          const endRow = row1 > row2 ? row1 : row2
          const startCol = col1 < col2 ? col1 : col2
          const endCol = col1 > col2 ? col1 : col2
          for (let i = startRow; i <= endRow; i++) {
            for (let j = startCol; j <= endCol; j++) {
              const cell = hot.getCellMeta(i, j)
              cell.formulaValue && delete cell.formulaValue
              hot.setDataAtCell(i, j, '')
            }
          }
          hot.render()
        })
      }
    },
    doClick(type, item) {
      const hot = this.$parent.$refs.hotTable.hotInstance
      this.h = hot
      let newType = type
      console.log(newType, item)
      /**
       * @name: {
       * borderArr: 框线设置， cellGeishiData： 文本设置， decimalArr： 增加 && 减少缩进量
       * hanglieArr： 行和列， isHideArr： 隐藏 && 取消隐藏 行列, freezeArr: 冻结窗格
       * findArr: 查找 && 替换 && 定位， sumArr： 自动求和
       * }
       */
      const borderArr = ['wu', 'suoy', 'waic', 'shang', 'xia', 'zuo', 'you', 'shangx']
      const cellGeishiData = [
        'text', 'numeric', 'huobi', 'kuaijizy', 'sDate', 'lDate', 'time', 'baifenb', 'fenshu', 'kexuejs', 'formatPrice'
      ]
      const decimalArr = ['zengjiaxsw', 'jianshaoxsw']
      const hanglieArr = ['hanghel', 'hanggao', 'liekuan']
      const setAnddelHLArr = ['charuh', 'charul', 'shanchuh', 'shanchul']
      const isHideArr = ['yingcangh', 'yingcangl', 'quxiaoych', 'quxiaoycl']
      const freezeArr = ['dongjiesh', 'dongjiesl', 'cancelDJ']
      const findArr = ['chazhao', 'tihuan', 'dingwei']
      const sumArr = ['sum', 'average', 'count', 'max', 'min']
      if (borderArr.includes(type)) newType = 'changeBorder'
      if (cellGeishiData.includes(type)) {
        newType = 'cellGeshi'
        this.cellFormat = type
      }
      if (decimalArr.includes(type)) { newType = 'decimal' }
      if (hanglieArr.includes(type)) { newType = 'changeHL' }
      if (setAnddelHLArr.includes(type)) { newType = 'dealHL' }
      if (isHideArr.includes(type)) { newType = 'isHide' }
      if (freezeArr.includes(type)) { newType = 'freeze' }
      if (findArr.includes(type)) { newType = 'find' }
      if (sumArr.includes(type)) { newType = 'setSum' }
      const Deal = {
        cut: () => { // 剪切
          hot.getPlugin('CopyPaste').cut()
        },
        copy: () => { // 复制
          hot.getPlugin('CopyPaste').copy()
        },
        zhantie: () => { // 粘贴
          if (this.$parent.copyData && this.$parent.copyData.length) {
            const copyData = JSON.parse(JSON.stringify(this.$parent.copyData))
            if (copyData && copyData.length && copyData[0].length) {
              const zt = hot.getPlugin('CopyPaste')
              try {
                zt.paste(copyData)
              } catch (E) {
                this.$message.warning('复制内容超出粘贴范围')
              }
            }
          }
        },
        geshishua: () => { // 格式刷
          const select = hot.getSelected()
          if (select) {
            this.$parent.copyCellStyle = hot.getCellMeta(select[0][0], select[0][1])
          }
        },
        xianshibc: () => { // 显示标尺
          this.rulerVisible = !this.rulerVisible
          this.$parent.rulerVisible = this.rulerVisible
        },
        shezhizt: () => { // 字体类型
          this.$parent.changeStyle('font-family', this.fontStyle.fontFamily)
        },
        zitidx: () => { // 字体大小
          this.$parent.changeStyle('font-size', `${this.fontStyle.fontSize}px`)
        },
        suofangzt: () => { // 放大 && 缩小 字体
          const size = item === 'b' ? ++this.fontStyle.fontSize : --this.fontStyle.fontSize
          this.fontStyle.fontSize = this.fontStyle.fontSize === -1 ? 0 : this.fontStyle.fontSize
          this.$parent.changeStyle('font-size', `${size}px`)
        },
        cuti: () => { // 字体变粗
          this.fontStyle.isBold = !this.fontStyle.isBold
          const value = this.fontStyle.isBold ? 'bold' : 'normal'
          this.$parent.changeStyle('font-weight', value)
        },
        xieti: () => { // 斜体
          this.fontStyle.isItalic = !this.fontStyle.isItalic
          const value = this.fontStyle.isItalic ? 'italic' : 'normal'
          this.$parent.changeStyle('font-style', value)
        },
        xiahuaxian: () => { // 下划线
          this.fontStyle.isUnderline = !this.fontStyle.isUnderline
          const value = this.fontStyle.isUnderline ? 'underline' : 'none'
          this.$parent.changeStyle('text-decoration', value)
        },
        bgColor: () => { // 背景色
          this.$parent.changeStyle('background', this.fontStyle.bgColor)
        },
        ztColor: () => { // 字体颜色
          this.$parent.changeStyle('color', this.fontStyle.fontColor)
        },
        quanbu: () => { // 全部清除
          hot.emptySelectedCells()
          this.$parent.changeStyle('clear')
          this.$parent.clearBorder()
          this.clearFunc(hot)
        },
        geshi: () => { // 格式清除
          this.$parent.clearBorder()
          this.$parent.changeStyle('clear')
        },
        neirong: () => { // 内容清除
          hot.emptySelectedCells()
          this.clearFunc(hot)
        },
        changeBorder: () => { // 改变框线
          let left = {}; let right = {}; let top = {}; let
            bottom = {}
          const c = this.fontStyle.borderColor
          const w = this.fontStyle.borderWidth
          // eslint-disable-next-line default-case
          switch (type) {
            case 'wu': // 无边框
              this.$parent.clearBorder()
              break
            case 'suoy': // 所有边框
              // left = right = top = bottom = { color: c, width: w }
              this.$parent.setAllBorder({ color: c, width: w })
              break
            case 'waic': // 外侧边框
              left = right = top = bottom = { color: c, width: w }
              this.$parent.addBorder({
                top, right, bottom, left
              })
              break
            case 'shang': // 上框线
              top = { color: c, width: w }
              this.$parent.addBorder({ top })
              break
            case 'xia': // 下框线
              bottom = { color: c, width: w }
              this.$parent.addBorder({ bottom })
              break
            case 'zuo': // 左框线
              left = { color: c, width: w }
              this.$parent.addBorder({ left })
              break
            case 'you': // 右框线
              right = { color: c, width: w }
              this.$parent.addBorder({ right })
              break
            case 'shangx': // 上下框线
              top = bottom = { color: c, width: w }
              this.$parent.addBorder({ top, bottom })
              break
          }
        },
        qitabk: () => { // 其他边框
          this.setBorder.show = true
        },
        hebingjz: () => { // 合并单元格
          const hb = hot.getPlugin('mergeCells')
          const select = hot.getSelectedRange()
          if (select) {
            for (let i = 0, len = select.length; i < len; i++) {
              const { from, to } = select[i]
              const data = hot.getData(from.row, from.col, to.row, to.col)
              let value = ''
              data.forEach(l => {
                value += l.join(' ')
              })
              hb.toggleMerge(select[i])
              const mergeCells = hot.getPlugin('MergeCells').mergedCellsCollection.mergedCells
              // hot.setDataAtCell(mergeCells[mergeCells.length - 1].row, mergeCells[mergeCells.length - 1].col, value)
            }
            hot.render()
          }
        },
        zidonghh: () => { // 自动换行
          this.fontStyle.autoEnter = !this.fontStyle.autoEnter
          const value = this.fontStyle.autoEnter ? 'normal' : 'keep-all'
          this.$parent.changeStyle('word-break', value)
        },
        cellGeshi: () => { // 设置文本框
          const selects = hot.getSelected()
          const hotCells = hot.getCellsMeta()
          const cellTypes = [
            'text', 'numeric', 'huobi', 'kuaijizy', 'sDate', 'lDate',
            'time', 'baifenb', 'fenshu', 'kexuejs', 'formatPrice'
          ]
          if (selects) {
            selects.forEach(([row1, col1, row2, col2]) => {
              const startRow = row1 < row2 ? row1 : row2
              const endRow = row1 > row2 ? row1 : row2
              const startCol = col1 < col2 ? col1 : col2
              const endCol = col1 > col2 ? col1 : col2
              for (let i = startRow; i <= endRow; i++) {
                for (let j = startCol; j <= endCol; j++) {
                  let names = hot.getCellMeta(i, j).className
                  let namesValue = ''
                  const nameArr = names.split(',').filter(e => cellTypes.includes(e))
                  if (nameArr.length !== 0) {
                    names = names.split(',').filter(l => l !== nameArr[0]).join(' ')
                    namesValue = `${names} ${this.cellFormat}`
                  } else namesValue = this.cellFormat
                  hot.setCellMetaObject(i, j, { cellType: this.cellFormat, className: namesValue })
                }
              }
              hot.render()
            })
          }
        },
        decimal: () => { // 增加 && 减少小数位
          const select = hot.getSelected()
          if (select) {
            select.forEach(([row1, col1, row2, col2]) => {
              const startRow = row1 < row2 ? row1 : row2
              const endRow = row1 > row2 ? row1 : row2
              const startCol = col1 < col2 ? col1 : col2
              const endCol = col1 > col2 ? col1 : col2
              for (let i = startRow; i <= endRow; i++) {
                for (let j = startCol; j <= endCol; j++) {
                  let len = 0
                  let deci = ''
                  let data = hot.getDataAtCell(i, j)
                  const deciNum = hot.getCellMeta(i, j).decimalNum
                  const reg1 = /.*[\u4e00-\u9fa5]+.*$/ // 是否含有中文
                  const reg2 = /[a-zA-Z]/ // 是否含有字母
                  if (len !== null && !reg1.test(data) && !reg2.test(data) && data) {
                    this.cellFormat = 'numeric'
                    if (deciNum !== undefined) {
                      len = deciNum
                    } else {
                      // eslint-disable-next-line prefer-destructuring
                      deci = data.split('.')[1]
                      len = deci ? deci.length : 0
                    }
                    len = type === 'zengjiaxsw' ? ++len : --len
                    if (len === -1) len = 0
                    hot.setCellMetaObject(i, j, { decimalNum: len })
                    data = (data * 1).toFixed(len)
                    hot.setDataAtCell(i, j, data)
                  }
                }
              }
              hot.render()
            })
          }
        },
        changeHL: () => { // 改变行高 && 列宽
          // 有点小bug,colWidths,rowHeights为空时，不能按索引添加值
          const h = this.$createElement
          let title = ''
          let meg = []
          const hang = h('p', { style: 'font-size:14px;margin-bottom:15px;' }, [
            h('span', null, '行高： '),
            h('input', {
              class: 'rowH',
              style: 'border:1px solid #c5c5c5;line-height:25px;padding:0 5px;border-radius:5px;margin-right:10px'
            }),
            h('span', null, '像素')
          ])
          const lie = h('p', { style: 'font-size:14px;margin-bottom:15px;' }, [
            h('span', null, '列宽： '),
            h('input', {
              class: 'colW',
              style: 'border:1px solid #c5c5c5;line-height:25px;padding:0 5px;border-radius:5px;margin-right:10px'
            }),
            h('span', null, '像素')
          ])
          // eslint-disable-next-line default-case
          switch (type) {
            case 'hanghel':
              title = '行高和列宽'
              meg = [hang, lie]
              break
            case 'hanggao':
              title = '行高和列宽'
              meg = [hang]
              break
            case 'liekuan':
              title = '行高和列宽'
              meg = [lie]
              break
          }
          this.$msgbox({
            title,
            customClass: 'myTool',
            message: h('div', null, meg),
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                const { arrR, arrC } = this.getSelected()
                if (type !== 'hanggao' && arrC.length) {
                  for (let i = 0; i < arrC.length; i++) {
                    this.$parent.hotSettings.colWidths.splice(arrC[i], 1, $('.colW')[0].value * 1)
                  }
                }
                if (type !== 'liekuan' && arrR.length) {
                  for (let i = 0; i < arrR.length; i++) {
                    this.$parent.hotSettings.rowHeights.splice(arrR[i], 1, $('.rowH')[0].value * 1)
                  }
                }
                done()
                $('.colW')[0].value = ''
                $('.rowH')[0].value = ''
              } else {
                done()
                $('.colW')[0].value = ''
                $('.rowH')[0].value = ''
              }
            }
          }).then(action => {}).catch(() => {})
        },
        dealHL: () => { // 插入 && 删除 行列
          // eslint-disable-next-line no-nested-ternary
          const action = type === 'charuh' ? 'insert_row' : (type === 'charul' ? 'insert_col' : (type === 'shanchuh' ? 'remove_row' : 'remove_col'))
          this.alter.show = true
          this.alter.info.type = action
          this.alter.info.class = 'myTool'
        },
        isHide: () => { // 隐藏 && 取消隐藏 行列
          const { arrR, arrC } = this.getSelected()
          let tag = ''
          let key = ''
          let val = []
          // eslint-disable-next-line default-case
          switch (type) {
            case 'yingcangh': // 隐藏行
              tag = 'hiddenRows'
              key = 'hideRows'
              val = arrR
              break
            case 'yingcangl': // 隐藏列
              tag = 'hiddenColumns'
              key = 'hideColumns'
              val = arrC
              break
            case 'quxiaoych': // 取消隐藏行
              tag = 'hiddenRows'
              key = 'showRows'
              break
            case 'quxiaoycl': // 取消隐藏列
              tag = 'hiddenColumns'
              key = 'showColumns'
              break
          }
          const plugin = hot.getPlugin(tag)
          const k = tag.indexOf('Rows') > -1 ? 'rowHeights' : 'colWidths'
          const hidColumns = hot.getPlugin('hiddenColumns').getHiddenColumns()
          const hidnRows = hot.getPlugin('hiddenRows').getHiddenRows()
          this.$parent.hotSettings.hiddenColumns.columns = hidColumns
          this.$parent.hotSettings.hiddenRows.rows = hidnRows
          if (type === 'quxiaoych' || type === 'quxiaoycl') {
            val = type === 'quxiaoych' ? hidnRows : hidColumns
            let wsh = []
            const v = type === 'quxiaoych' ? 23 : 100
            wsh = type === 'quxiaoych'
              ? this.$parent.hotSettings[k].map((e, i) => (hidnRows.includes(i) ? v : e))
              : wsh = this.$parent.hotSettings[k].map((e, i) => (hidColumns.includes(i) ? v : e))
            for (let i = 0; i < val.length; i++) {
              this.$parent.hotSettings[k] = wsh
            }
          }
          this.$nextTick(() => {
            if (val.length) {
              plugin[key](val)
              hot.render()
            }
          })
        },
        suodingdyg: () => { // 锁定单元格
          const selects = hot.getSelected()
          if (selects) {
            selects.forEach(([row1, col1, row2, col2]) => {
              const startRow = row1 < row2 ? row1 : row2
              const endRow = row1 > row2 ? row1 : row2
              const startCol = col1 < col2 ? col1 : col2
              const endCol = col1 > col2 ? col1 : col2
              for (let i = startRow; i <= endRow; i++) {
                for (let j = startCol; j <= endCol; j++) {
                  // const cell = hot.getCellMeta(i, j)
                  // const bool = cell.readOnly ? cell.readOnly : false
                  hot.setCellMeta(i, j, 'readOnly', true)
                }
              }
            })
          }
        },
        unlock: () => { // 取消锁定单元格
          const selects = hot.getSelected()
          if (selects) {
            selects.forEach(([row1, col1, row2, col2]) => {
              const startRow = row1 < row2 ? row1 : row2
              const endRow = row1 > row2 ? row1 : row2
              const startCol = col1 < col2 ? col1 : col2
              const endCol = col1 > col2 ? col1 : col2
              for (let i = startRow; i <= endRow; i++) {
                for (let j = startCol; j <= endCol; j++) {
                  const cell = hot.getCellMeta(i, j)
                  cell.readOnly && delete cell.readOnly
                }
              }
            })
            hot.render()
          }
        },
        freeze: () => { // 取消 && 冻结 首行/首列
          // eslint-disable-next-line default-case
          switch (type) {
            case 'dongjiesh':
              this.$parent.hotSettings.fixedRowsTop = 1
              break
            case 'dongjiesl':
              this.$parent.hotSettings.fixedColumnsLeft = 1
              break
            case 'cancelDJ':
              this.$parent.hotSettings.fixedRowsTop = 0
              this.$parent.hotSettings.fixedColumnsLeft = 0
              this.$parent.hotSettings.fixedRowsBottom = 0
              break
          }
        },
        dongjie: () => { // 冻结
          const h = this.$createElement
          this.$msgbox({
            title: '冻结窗格',
            customClass: 'myTool',
            message: h('div', null, [
              h('p', { style: 'font-size:12px;margin-bottom:15px;' }, [
                h('span', null, '顶部冻结行数： '),
                h('input',
                  {
                    class: 'dingH',
                    style: 'border:1px solid #c5c5c5;line-height:25px;padding:0 5px;border-radius:5px;'
                  })
              ]),
              h('p', { style: 'font-size:12px;;margin-bottom:15px;' }, [
                h('span', null, '底部冻结行数： '),
                h('input',
                  {
                    class: 'diH',
                    style: 'border:1px solid #c5c5c5;line-height:25px;padding:0 5px;border-radius:5px;'
                  })
              ]),
              h('p', { style: 'font-size:12px;;margin-bottom:15px;' }, [
                h('span', null, '左侧冻结列数： '),
                h('input',
                  {
                    class: 'leftH',
                    style: 'border:1px solid #c5c5c5;line-height:25px;padding:0 5px;border-radius:5px;'
                  })
              ])
            ]),
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                this.$parent.hotSettings.fixedRowsTop = $('.dingH')[0].value * 1
                this.$parent.hotSettings.fixedRowsBottom = $('.diH')[0].value * 1
                this.$parent.hotSettings.fixedColumnsLeft = $('.leftH')[0].value * 1
                done()
                $('.dingH')[0].value = ''
                $('.diH')[0].value = ''
                $('.leftH')[0].value = ''
              } else {
                done()
                $('.dingH')[0].value = ''
                $('.leftH')[0].value = ''
                $('.diH')[0].value = ''
              }
            }
          }).then(action => {}).catch(() => {})
        },
        find: () => { // 查找 && 替换 && 定位
          // eslint-disable-next-line default-case
          switch (type) {
            case 'chazhao':
              this.findPage = {
                show: true,
                title: 'first'
              }
              break
            case 'tihuan':
              this.findPage = {
                show: true,
                title: 'second'
              }
              break
            case 'dingwei':
              this.findPage = {
                show: true,
                title: 'third'
              }
              break
          }
        },
        setSum: () => { // 自动求和
          const selects = hot.getSelected()
          if (selects) {
            const text = `=${type}( )`
            hot.setDataAtCell(selects[0][0], selects[0][1], text)
          }
        },
        daochu: () => {
          this.$emit('exportXsl')
        },
        daoru: () => {
          this.$emit('daoru')
        }
      }
      Deal[newType]()
    },
    getSelected() { // 获取选择的单元格
      const hot = this.$parent.$refs.hotTable.hotInstance
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
    setFontLine(val, g = 0) { // 设置单元格对齐方式
      // g 代表对齐方式 ； !g 代表 增加 && 缩进量
      if (g) {
        this.fontLine.forEach(l => {
          if (l.g === g) {
            l.isCheck = false
            if (l.value === val) {
              l.isCheck = true
              this.$parent.changeStyle('className', val)
            }
          }
        })
      } else {
        let num = this.fontStyle.textIndex.substring(0, this.fontStyle.textIndex.indexOf('p')) * 1
        val === 'zengjiasjl' ? ++num : --num
        this.fontStyle.textIndex = `${num}px`
        this.$parent.changeStyle('text-indent', `${num}px`)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.startPage {
  height: 74px;
  overflow: auto;
  .model {
    width: 100%;
    min-width: 1200px;
    display: flex;
    i.check::before {
      background: #dedede;
    }
    .right-btn{
      font-size: 16px;
      position: absolute;
      right: 0;
      bottom: -7px;
      transform: rotate(135deg) scale(0.8);
      color: #cacaca;
      cursor: pointer;
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
    .fileOp {
      // width: 10%;
      // min-width: 170px;
      display: flex;
      overflow: auto;
      padding-right: 5px;
      .two-item {
        padding: 5px;
        & > p{
          position: relative;
          line-height: 26px;
          cursor: context-menu;
        }
        i {
          vertical-align: middle;
          margin-right: 3px;
        }
      }
      .icon, .two-item {
        flex-grow: 1;
      }
    }
    .font {
      // width: calc(100% - 80%);
      // min-width: 334px;
      position: relative;
      padding: 0 5px;
      /deep/ .el-input__inner {
        height: 24px;
        line-height: 24px;
        padding: 0 15px 0 5px;
        border-radius: 5px 0 0 5px;
        width: 100px;
      }
      .font-size /deep/ .el-input__inner {
        border-left: none;
        border-radius: 0 5px 5px 0;
        width: 80px;
      }
      /deep/ .el-input__suffix {
        right: 0;
        transform: scale(0.8);
      }
      i.iconfont {
        font-size: 18px;
        margin-right: 10px;
      }
      .btns {
        display: flex;
        position: relative;
        margin-top: 4px;
        .color {
          position: relative;
          margin-right: 6px;
        }
        .el-color-picker {
          height: auto;
          /deep/ .el-color-picker__trigger {
            position: absolute;
            height: 4px;
            width: 18px;
            padding: 0;
            border: none;
            border-radius: 0;
            bottom: -2px;
            left: -23px;
          }
          /deep/ .el-color-picker__icon, /deep/ .el-color-picker__empty {
            left: 75%;
            top: -8px;
            color: #afafaf;
            transform: scale(0.8);
          }
          /deep/ .el-color-picker__empty{
            left: 93%;
          }
        }
        i, div, .icon {
          flex-grow: 1;
        }
      }
    }
    .format {
      // width: calc(100% - 79.5%);
      // min-width: 330px;
      display: flex;
      padding: 0 5px;
      i {
        color: #7a7979;
      }
      .format-line {
        display: flex;
        width: 110px;
        flex-flow: wrap;
        li {
          width: 20px;
          i {
            padding: 3px;
          }
          i:hover {
            background: rgba(0,0,0,.05);
          }
          i.iconfont {
            color: #000;
          }
          &:nth-of-type(1),&:nth-of-type(2),&:nth-of-type(3){
            i{
              font-size: 12px;
              transform: scale(0.75);
              line-height: 25px;
            }
          }
        }
      }
      // .icon {
      //   margin: 0 5px;
      // }
    }
    .cell-format {
      // width: calc(100% - 90%);
      padding: 0 10px;
      .cell-select /deep/ .el-input__inner{
        height: 24px;
        line-height: 24px;
        padding: 0 15px 0 5px;
      }
      .cell-select /deep/ .el-input__suffix{
        right: 0;
        transform: scale(0.8);
      }
      .format-list {
        width: 100%;
        display: flex;
        margin-top: 6px;
        i {
          font-size: 18px;
        }
        & > i {
          margin-left: 3px;
        }
        i, .icon {
          flex-grow: 1;
        }
      }
    }
    .other {
      display: flex;
      padding: 0 5px;
      .icon {
        flex-grow: 1;
        // margin-left: 10px;
      }
    }
  }
  .export {
    display: flex;
  }
}
</style>
