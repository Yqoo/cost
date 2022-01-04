<template>
  <div>
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :model="false"
      width="25%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => this.$emit('update:show',false)"
    >
      <div slot="title">
        {{ info.id ? '编辑' : '添加' }}新区域
      </div>
      <el-form ref="form" :model="form" size="mini" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="引用单元格">
          <el-input v-model="form.area" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" type="info" @click="() => this.$emit('update:show',false)">
          取消
        </el-button>
        <el-button size="mini" type="primary" @click="sure">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TableArea',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {
        id: Math.random(),
        title: '',
        area: '',
        choose: false
      }
    }
  },
  watch: {
    show: {
      immediate: true,
      handler: 'getSelect'
    },
    info: {
      immediate: true,
      handler: 'getInfo'
    }
  },
  methods: {
    getSelect(bool) { // 获取选中数据
      if (bool) {
        if (this.$parent.value) {
          this.form.area = this.$parent.value
        }
      }
    },
    getInfo(obj) { // 回显
      if (obj?.id) {
        Object.keys(obj).forEach(key => {
          this.form[key] = obj[key]
        })
      }
    },
    sure() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = { ...this.form }
          const { flag, area1, area2 } = this.verify(params)
          if (area1 && area2) {
            params.area = `${area1} : ${area2}`
          }
          if (flag) {
            if (
              (!this.info.id && this.$parent.areaList.some(l => l.title === params.title))
              || (this.info.id && this.$parent.areaList.some(l => l.title === params.title && l.id !== params.id))
            ) {
              this.$alert(`标题为 "${params.title}" 的区域已存在，请为该区域输入新标题`, '提示', {
                confirmButtonText: '确定',
                callback: action => {}
              })
            } else {
              this.$emit('refsh', params)
              this.$emit('update:show', false)
            }
          }
        }
      })
    },
    verify(obj) { // 验证区域是否合格
      let flag = true
      const { title, area } = obj
      const reg1 = /.*[\u4e00-\u9fa5]+.*$/
      const reg2 = /[a-zA-Z]/
      const { hot } = this.$parent
      const colHeaderList = hot.getColHeader()
      const rowHeaderList = hot.getRowHeader()
      const arr = area.indexOf(':') > -1 ? area.split(':') : [area]
      let startColVal = ''
      let startRowVal = ''
      let endColVal = ''
      let endRowVal = ''
      if (arr.length && arr.length > 1) {
        // eslint-disable-next-line prefer-destructuring
        endColVal = arr[1].trim().split('$')[1]
        // eslint-disable-next-line prefer-destructuring
        endRowVal = arr[1].trim().split('$')[2] * 1
      }
      if (arr.length && arr.length <= 2) {
        // eslint-disable-next-line prefer-destructuring
        startColVal = arr[0].trim().split('$')[1]
        // eslint-disable-next-line prefer-destructuring
        startRowVal = arr[0].trim().split('$')[2] * 1
      }
      const n = (area.split('$')).length - 1
      if (!title || !(reg1.test(title.trim().charAt(0)) || reg2.test(title.trim().charAt(0)))) {
        this.$alert(`标题 "${title}" 含有非法字符，区域标题只能包含字母，文字，数字，并且必须已文字或字母开头`, '提示', {
          confirmButtonText: '确定',
          callback: action => {}
        })
        flag = false
      } else if (
        !area
        || arr[0].trim().charAt(0) !== '$'
        || (arr[1] && arr[1].trim().charAt(0) !== '$')
        || (arr.length === 1 && n !== 2)
        || (arr.length === 2 && n !== 4)
        || !colHeaderList.includes(startColVal)
        || !rowHeaderList.includes(startRowVal)
        || (endColVal && !colHeaderList.includes(endColVal))
        || (endRowVal && !rowHeaderList.includes(endRowVal))
      ) {
        this.$alert('输入的引用无效，要输入引用，可以单击单元格或拖动鼠标选定区域', '提示', {
          confirmButtonText: '确定',
          callback: action => {}
        })
        flag = false
      } else flag = true
      let area1 = ''
      let area2 = ''
      if (endColVal && endRowVal) {
        const startColIndex = colHeaderList.findIndex(l => l === startColVal)
        const endColIndex = colHeaderList.findIndex(l => l === endColVal)
        const startRowIndex = rowHeaderList.findIndex(l => l === startRowVal)
        const endRowIndex = rowHeaderList.findIndex(l => l === endRowVal)
        if (endColIndex < startColIndex || (endColIndex === startColIndex && endRowIndex < startRowIndex)) {
          // eslint-disable-next-line prefer-destructuring
          area1 = arr[1]
          // eslint-disable-next-line prefer-destructuring
          area2 = arr[0]
        }
      }
      return { flag, area1, area2 }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
