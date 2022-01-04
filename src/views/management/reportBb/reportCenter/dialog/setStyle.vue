<template>
  <div class="setStyle">
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :model="false"
      width="30%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => this.$emit('update:show', false)"
    >
      <div slot="title">
        字体
      </div>
      <section>
        <div class="font-style">
          <div class="flex">
            <span>字体：</span>
            <el-input v-model="fontStyle.family" size="mini" />
            <ul>
              <li v-for="e in ztData" :key="e.value" @click="changeFontStyle(e, 'family')">
                {{ e.label }}
              </li>
            </ul>
          </div>
          <div class="flex">
            <span>字形：</span>
            <el-input v-model="fontStyle.bolder" size="mini" />
            <ul>
              <li v-for="item in ztBolder" :key="item.label" @click="changeFontStyle(item, 'bolder')">
                {{ item.label }}
              </li>
            </ul>
          </div>
          <div class="flex">
            <span>大小：</span>
            <el-input v-model="fontStyle.size" size="mini" />
            <ul>
              <li v-for="it in ztSize" :key="it" @click="changeFontStyle(it, 'size')">
                {{ it }}
              </li>
            </ul>
          </div>
        </div>
        <ul class="font-set">
          <li>
            <p>下划线：</p>
            <el-select v-model="fontStyle.decoration" size="mini">
              <el-option label="无" value="none" />
              <el-option label="有" value="underline" />
            </el-select>
          </li>
          <li>
            <p>颜色：</p>
            <el-color-picker v-model="fontStyle.color" size="mini" />
          </li>
        </ul>
        <div class="preview">
          <h2>预览</h2>
          <span :style="styles">文字样式</span>
        </div>
      </section>
      <div slot="footer">
        <el-button size="mini" type="info" @click="() => this.$emit('update:show', false)">
          取消
        </el-button>
        <el-button size="mini" type="primary" @click="save">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SetStyle',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    inputStyles: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      fontStyle: {
        color: '#666666',
        decoration: 'none',
        family: '宋体',
        bolder: '常规',
        size: 12
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
      ],
      ztBolder: [ // 字形
        { value: { 'font-weight': 'normal' }, label: '常规' },
        { value: { 'font-style': 'italic' }, label: '倾斜' },
        { value: { 'font-weight': 'bolder' }, label: '加粗' },
        { value: { 'font-weight': 'bolder', 'font-style': 'italic' }, label: '加粗倾斜' }
      ],
      ztSize: [6, 8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72] // 字体大小
    }
  },
  computed: {
    styles() {
      const {
        color, decoration, family, bolder, size
      } = this.fontStyle
      return {
        'font-family': this.ztData.filter(e => e.label === family)[0].value,
        color,
        'text-decoration': decoration,
        'font-size': `${size}px`,
        ...this.ztBolder.filter(l => l.label === bolder)[0].value
      }
    }
  },
  watch: {
    inputStyles: {
      immediate: true,
      handler(val) {
        if (val && Object.keys(val).length) {
          console.log(val)
          const borderValue = {}
          let bolder = ''
          Object.keys(val).forEach(key => {
            if (key === 'font-weight' || key === 'font-style') {
              borderValue[key] = val[key]
            }
          })
          if (Object.keys(borderValue).length === 2) {
            bolder = '加粗加斜'
          } else {
            bolder = this.ztBolder.filter(l => Object.values(l.value)[0] === Object.values(borderValue)[0])[0].label
          }
          Object.assign(this.fontStyle, {
            color: val.color,
            decoration: val['text-decoration'],
            family: this.ztData.filter(l => l.value === val['font-family'])[0].label,
            bolder,
            size: val['font-size'].split('p')[0]
          })
        }
      }
    }
  },
  methods: {
    changeFontStyle(e, type) {
      const val = type === 'size' ? e : e.label
      this.fontStyle[type] = val
    },
    save() {
      this.$emit('setFont', this.styles)
      this.$emit('update:show', false)
    }
  }

}
</script>

<style lang="scss" scoped>
.setStyle {
  section {
    .font-style {
      display: flex;
      .flex {
        padding-right: 5px;
        font-size: 12px;
        &:nth-of-type(1) {
          width: 40%;
        }
        &:nth-of-type(2){
          width: 35%;
        }
        &:nth-of-type(3){
          width: 25%;
          padding-right: 0;
        }
        .el-input + ul {
          height: 150px;
          overflow: auto;
          border: 1px solid #ddd;
          li {
            padding: 2px 0 2px 10px;
            &:hover {
              padding: 2px;
              background: #eee;
            }
          }
        }
      }
    }
    .font-set {
      display: flex;
      margin: 6px 0;
      font-size: 12px;
      p {
        margin: 3px 0;
      }
      li {
        flex: 1;
      }
    }
    .preview {
      position: relative;
      border: 1px solid #ddd;
      height: 60px;
      padding: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      h2 {
        position: absolute;
        top: -12px;
        left: 5px;
        background: #fff;
        font-size: 12px;
        padding: 2px 8px;
      }
    }
  }
}
</style>
