<template>
  <div class="setBorder">
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :model="false"
      width="32%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        框线设置
      </div>
      <div class="box">
        <div class="left">
          <span class="title">线条</span>
          <ul>
            <li v-for="e in lineArr" :key="e.value" :title="e.label" @click="changeStyle(e)">
              <span
                :style="e.value !== 'none' ? { borderTop: `${e.width}px ${e.value}`} : {}"
              >
                {{ e.value === 'none' ? e.label: '' }}
              </span>
            </li>
          </ul>
          <div class="lineWidth">
            <span>线宽: </span>
            <el-slider v-model="borderWidth" :min="1" :max="20" />
          </div>
          <div class="lineWidth">
            <span>颜色：</span>
            <el-color-picker
              v-model="borderColor"
              popper-class="myTool"
              size="mini"
            />
          </div>
          <div class="lineStyle">
            <p
              :style="{ border: borderStyle === 'none' ? 'none' : `${borderStyle} ${borderWidth}px ${borderColor}` }"
            />
          </div>
        </div>
        <div class="right">
          <span class="title">边框</span>
          <ul class="dir clearfix">
            <li v-for="item in borderDir" :key="item.value" :title="item.label" @click="changeBoderDir(item.value)">
              <i :class="`iconfont icon-${item.icon}`" />
            </li>
          </ul>
          <ul class="dirStyle clearfix">
            <li v-for="(k, e) in dirData" :key="e">
              <span :style="k.style">文本</span>
            </li>
          </ul>
        </div>
      </div>
      <div slot="footer">
        <el-button type="info" size="mini" @click="() => $emit('update:show', false)">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="save">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SetBorder',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      borderWidth: 1,
      borderColor: '#000',
      borderStyle: 'solid',
      lineArr: [
        { label: '无', value: 'none' },
        { label: '虚线边框', value: 'dotted', width: 1 },
        { label: '虚线边框', value: 'dashed', width: 1 },
        { label: '实线边框', value: 'solid', width: 1 },
        { label: '双边框', value: 'double', width: 3 },
        { label: '凹槽边框', value: 'groove', width: 3 },
        { label: '垄状边框', value: 'ridge', width: 3 },
        { label: '嵌入边框', value: 'inset', width: 3 },
        { label: '外凸边框', value: 'outset', width: 3 }
      ],
      dirData: [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 1, col: 0 },
        { row: 1, col: 1 }
      ],
      borderDir: [
        { label: '无边框', icon: 'wukuangxian', value: 'wu' },
        { label: '所有框线', icon: 'suoyoukuangxian', value: 'suoy' },
        { label: '外侧框线', icon: 'waicekuangxian', value: 'waic' },
        { label: '上框线', icon: 'shangkuangxian', value: 'shang' },
        { label: '下框线', icon: 'xiakuangxian', value: 'xia' },
        { label: '左框线', icon: 'zuokuangxian', value: 'zuo' },
        { label: '右框线', icon: 'youkuangxian', value: 'you' },
        { label: '上下框线', icon: 'jurassic_border-scxc', value: 'shangx' }
      ],
      tag: 'wu'
    }
  },
  methods: {
    changeStyle(e) {
      const { value, width } = e
      this.borderWidth = width
      this.borderStyle = value
    },
    changeBoderDir(value) { // 切换文本框线
      const getStyle = (style, dir) => {
        style[`border-${dir}`] = `${this.borderWidth}px ${this.borderStyle} ${this.borderColor}`
      }
      this.tag = value
      this.clearBorder()
      // eslint-disable-next-line default-case
      switch (value) {
        case 'suoy': // 所有框线
          this.dirData.forEach((i, j) => {
            i.style = i.style || {}
            getStyle(i.style, 'top')
            getStyle(i.style, 'left')
            if (j === 1 || j === 3) getStyle(i.style, 'right')
            if (j === 2 || j === 3) getStyle(i.style, 'bottom')
          })
          break
        case 'waic': // 外侧框线
          this.dirData.forEach((i, j) => {
            i.style = i.style || {}
            if (j === 0 || j === 1) getStyle(i.style, 'top')
            if (j === 2 || j === 3) getStyle(i.style, 'bottom')
            if (j === 0 || j === 2) getStyle(i.style, 'left')
            if (j === 1 || j === 3) getStyle(i.style, 'right')
          })
          break
        case 'shang': // 上框线
          this.dirData.forEach((i, j) => {
            i.style = i.style || {}
            if (j === 0 || j === 1) getStyle(i.style, 'top')
          })
          break
        case 'xia': // 下框线
          this.dirData.forEach((i, j) => {
            i.style = i.style || {}
            if (j === 2 || j === 3) getStyle(i.style, 'bottom')
          })
          break
        case 'zuo': // 左框线
          this.dirData.forEach((i, j) => {
            i.style = i.style || {}
            if (j === 0 || j === 2) getStyle(i.style, 'left')
          })
          break
        case 'you': // 右框线
          this.dirData.forEach((i, j) => {
            i.style = i.style || {}
            if (j === 1 || j === 3) getStyle(i.style, 'right')
          })
          break
        case 'shangx': // 上下框线
          this.dirData.forEach((i, j) => {
            i.style = i.style || {}
            if (j === 0 || j === 1) getStyle(i.style, 'top')
            if (j === 2 || j === 3) getStyle(i.style, 'bottom')
          })
          break
      }
      this.dirData = this.dirData.splice(0)
    },
    clearBorder() { // 清除文本框线
      for (let i = 0; i < this.dirData.length; i++) {
        if (this.dirData[i].style) delete this.dirData[i].style
      }
    },
    save() {
      this.$emit('change', {
        w: this.borderWidth,
        c: this.borderColor,
        s: this.borderStyle,
        tag: this.tag
      })
      this.$emit('update:show', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.setBorder {
  .box {
    display: flex;
    width: 100%;
    .left, .right {
      position: relative;
      border-top: 1px solid #ddd;
      .title {
        position: absolute;
        background: #fff;
        top: -13px;
        padding: 4px 8px 0 8px;
      }
    }
    .left {
      width: calc(100% - 70%);
      height: auto;
      margin-right: 10px;
      box-sizing: border-box;
      border-right: 1px solid #ddd;
      ul {
        padding-top: 10px;
        li {
          text-align: center;
          line-height: 20px;
          cursor: pointer;
          &:hover {
            background: rgba(0,0,0,.05);
          }
          span {
            display: inline-block;
            width: 70%;
          }
        }
      }
      .lineWidth {
        display: flex;
        span {
          line-height: 28px;
          margin-right: 5px;
        }
        .el-slider {
          width: 115px;
          position: relative;
          top: -4px;
          left: 10px
        }
      }
      .lineStyle {
        margin: 5px 10px;
        border: 1px solid #ddd;
        height: 50px;
        overflow: hidden;
        p {
          padding: 15px;
          width: 70%;
          margin: 8px auto;
        }
      }
    }
    .right {
      width: calc(100% - 30% - 10px);
      .dir {
        padding: 10px 0 10px 10px;
        li {
          float: left;
          margin-right: 30px;
          i {
            font-size: 30px;
          }
        }
      }
      .dirStyle {
        border: 1px solid #ddd;
        width: 80%;
        box-sizing: border-box;
        padding: 12px;
        li {
          float: left;
          width: 50%;
          line-height: 60px;
          text-align: center;
          box-sizing: border-box;
          span {
            display: inline-block;
            width: 100%;
            box-sizing: border-box;
          }
        }
      }
    }
  }
}
</style>
