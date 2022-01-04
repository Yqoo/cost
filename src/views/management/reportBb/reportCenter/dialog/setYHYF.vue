<template>
  <div class="setYhYf">
    <el-dialog
      v-dialogDrag
      :modal="false"
      width="40%"
      custom-class="set-head"
      :visible.sync="show"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => this.$emit('update:show', false)"
    >
      <div slot="title">
        {{ title }}
      </div>
      <section>
        <h2>{{ title }}</h2>
        <div class="tips">
          <p>
            如果要设置文本格式，请将插入点移至编辑框内，然后按“字体”按钮。
          </p>
          <p>
            如果要加入页码、日期、时间、文件名、工作表名，请将插入点移至编辑框内，然后选择相应按钮。
          </p>
        </div>
        <div class="btns">
          <el-button
            v-for="k in btns" :key="k.type"
            :title="k.title" size="mini"
            plain
            type="success"
            @click.native="doClick(k.type)"
          >
            <i :class="'iconfont icon-' + k.icon" />
          </el-button>
        </div>
        <ul class="infos">
          <li v-for="e in inputs" :key="e.value">
            <span> {{ e.key }}: </span>
            <textarea
              v-model="values[e.value].value"
              :style="values[e.value].style"
              :class="e.name"
              @focus="getFocus(e.value)"
            />
          </li>
        </ul>
      </section>
      <div slot="footer">
        <el-button type="info" size="mini" @click="() => $emit('update:show', false)">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="save">
          确定
        </el-button>
      </div>
    </el-dialog>
    <SetStyle
      v-if="setStyle.show"
      :show.sync="setStyle.show"
      :input-styles="setStyle.styles"
      @setFont="setFont"
    />
  </div>
</template>

<script>
import SetStyle from './setStyle'

export default {
  name: 'SetYhYf',
  components: {
    SetStyle
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      title: '',
      btns: [
        { icon: 'jurassic_font', title: '字体', type: 'ziti' },
        { icon: 'yemashezhi', title: '页码', type: 'yema' },
        { icon: 'order', title: '总页数', type: 'zongyes' },
        { icon: 'changriqi', title: '日期', type: 'riqi' },
        { icon: 'shijian', title: '时间', type: 'shijian' }
      ],
      inputs: [
        { key: '左', value: 'left', name: '' },
        { key: '中', value: 'middle', name: '' },
        { key: '右', value: 'right', name: '' }
      ],
      values: {
        left: { value: '', style: {} },
        middle: { value: '', style: {} },
        right: { value: '', style: {} }
      },
      setStyle: { // 设置字体
        show: false
      },
      focusInp: '' // 获取焦点
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        if (Object.keys(val).length) {
          const { title, styles } = val
          this.title = title === 'header' ? '页眉' : '页脚'
          Object.assign(this.values, styles)
        }
      }
    }
  },
  methods: {
    getFocus(val) { // 获取焦点
      this.focusInp = val
      this.inputs.forEach(e => {
        this.$set(e, 'name', e.value === val ? 'focus-input' : '')
      })
    },
    doClick(type) { // 按钮
      if (this.focusInp) {
        if (type === 'ziti') {
          this.setStyle = {
            show: true,
            styles: this.values[this.focusInp].style
          }
        } else {
          const text = this.btns.filter(l => l.type === type)[0].title
          this.values[this.focusInp].value = `${this.values[this.focusInp].value}&[${text}]`
        }
      }
    },
    setFont(styles) {
      this.values[this.focusInp].style = { ...styles }
    },
    getValue() { // 替换文本框值
      const params = JSON.parse(JSON.stringify(this.values))
      const date = new Date()
      const time = this.$tools.timestamp(date, 'HH:II:SS')
      const newDate = this.$tools.timestamp(date)
      Object.keys(params).forEach(k => {
        let v = params[k].value
        v = v.replace(/&\[页码\]/g, 1).replace(/&\[总页数\]/g, 1).replace(/&\[日期\]/g, newDate).replace(/&\[时间\]/g, time)
        params[k].value = v
      })
      return params
    },
    save() {
      const params = this.getValue()
      this.$emit('update', {
        title: this.data.title,
        styles: this.values,
        styleValue: params
      })
      this.$emit('update:show', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.setYhYf {
  section {
    position: relative;
    border: 1px solid #ddd;
    margin-top: 18px;
    padding: 5px;
    font-size: 12px;
    h2 {
      position: absolute;
      top: -23px;
      left: -1px;
      border: 1px solid #dddddd;
      background: #ffffff;
      border-bottom: none;
      padding: 2px 10px;
    }
    .tips {
      p{
        text-indent: 18px;
      }
    }
    .btns {
      padding: 5px;
      .el-button {
        padding: 3px 10px;
        font-size: 16px;
      }
    }
    .infos {
      display: flex;
      li {
        flex: 1;
        padding: 5px;
      }
      textarea {
        border: 1px solid #e2e2e2;
        height: 60px;
        width: 90%;
        border-radius: 4px;
        padding: 5px;
        &.focus-input {
          border-color: #409eff;
        }
      }
    }
  }
}
</style>
