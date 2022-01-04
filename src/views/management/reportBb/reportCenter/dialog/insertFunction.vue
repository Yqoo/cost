<template>
  <div>
    <el-dialog
      v-dialogDrag
      title="插入函数"
      :visible.sync="show"
      :model="false"
      width="60%"
      append-to-body
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="leftBox">
            <Tree
              v-waiting="tree.loading"
              :data="tree.data"
              default-expand-all
              @setTargetNode="setTargetNode"
            />
          </div>
        </el-col>
        <el-col :span="16">
          <div class="rightBox">
            <div class="top">
              <el-button size="mini" :disabled="disabled" icon="el-icon-search" class="leftBtn" @click="referInput">
                参照输入
              </el-button>
              <span>请选择运算符：</span>
              <ul class="box">
                <li
                  v-for="(item, index) in operations"
                  :key="index"
                  @click="calc(item)"
                >
                  {{ item }}
                </li>
                <!-- <li class="el-icon-back" style="width: 60px;padding-top: 7px;" @click="del" /> -->
              </ul>
            </div>
            <div class="exhibition">
              <el-input
                v-model="content"
                type="textarea"
                :rows="8"
              />
              <div style="display:flex;justify-content:space-between;padding-top:10px">
                <el-button size="mini" @click="formulaCheck">
                  公式验证
                </el-button>
              </div>
            </div>
            <!-- <div class="desc">
              <p>
                <span>函数名称：</span>
                <span>{{ list.hsmc }}</span>
              </p>
              <p>
                <span>函数说明：</span>
                <span>{{ list.hssm }}</span>
              </p>
            </div> -->
          </div>
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button type="info" size="mini" @click="() => this.$emit('update:show', false)">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="save">
          确定
        </el-button>
      </div>
    </el-dialog>
    <ZhixSql
      v-if="zhixSql.show"
      :show.sync="zhixSql.show"
      :func-desc="tree.targetNode"
      :lrhs="false"
      @getParam="getParam"
    />
  </div>
</template>

<script>
export default {
  name: 'InsertFunction',
  components: {
    ZhixSql: () => import('../../../functionHS/functionDesign/dialog/zhixSql')
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    funcText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      disabled: true, // 是否启用参照输入按钮
      list: {}, // 表单数据
      tree: {
        loading: false,
        data: [],
        targetNode: {}
      },
      content: '', // 文本域
      operations: ['+', '-', '*', '/', '(', ')'], // 操作符
      zhixSql: { // 执行
        show: false
      },
      isCheck: false // 公式是否检测
    }
  },
  watch: {
    funcText: {
      immediate: true,
      handler(val) {
        this.content = val
      }
    }
  },
  created() {
    this.getfunctionTree()
  },
  methods: {
    // 判断公式是否合法
    validateFormula(string) {
      // 剔除空白符
      string = string.replace(/\s/g, '')
      // 错误情况，空字符串
      if (string === '') {
        return false
      }
      // eslint-disable-next-line no-useless-escape
      if (/^[\÷\+\-\*\/]/.test(string)) {
        // console.error(& amp; quot; 运算符开头 & amp; quot;);
        return false
      }
      // 错误情况，运算符结尾
      // eslint-disable-next-line no-useless-escape
      if (/[\÷\+\-\*\/]$/.test(string)) {
        // console.error(& amp; quot; 运算符结尾 & amp; quot;);
        return false
      }
      // 错误情况，(后面是运算符或者)
      // eslint-disable-next-line no-useless-escape
      if (/\([\÷\+\-\*\/]/.test(string)) {
        // console.error(& amp; quot; (后面是运算符或者) & amp; quot;);
        return false
      }
      // 错误情况，运算符连续
      // eslint-disable-next-line no-useless-escape
      if (/[\÷\+\-\*\/]{2,}/.test(string)) {
        return false
      }
      // 空括号
      if (/\(\)/.test(string)) {
        return false
      }
      // 错误情况，括号不配对
      const stack = []
      for (let i = 0, item; i < string.length; i++) {
        item = string.charAt(i)
        if (item === '(') {
          stack.push('(')
        } else if (item === ')') {
          if (stack.length > 0) {
            stack.pop()
          } else {
            return false
          }
        }
      }
      if (stack.length !== 0) {
        return false
      }
      // 错误情况，(后面是运算符
      // eslint-disable-next-line no-useless-escape
      if (/\([\÷\+\-\*\/]/.test(string)) {
        return false
      }
      // 错误情况，)前面是运算符
      // eslint-disable-next-line no-useless-escape
      if (/[\÷\+\-\*\/]\)/.test(string)) {
        return false
      }
      // 错误情况，(前面不是运算符
      // eslint-disable-next-line no-useless-escape
      if (/[\÷\+\-\*\/]\(/.test(string)) {
        return false
      }
      // 错误情况，)后面不是运算符
      // eslint-disable-next-line no-useless-escape
      if (/\)[\÷\+\-\*\/]/.test(string)) {
        return false
      }
      // eslint-disable-next-line no-useless-escape
      if (/\([\)\/]/.test(string)) {
        return false
      }
      return true
    },
    formulaCheck() { // 公式验证
      // eslint-disable-next-line no-useless-escape
      const reg = /[\+\-\*\/]/g
      const contentArr = this.content.replace(/\s/g, '').replaceAll(reg, ' $& ').split(' ')
      let next = true
      for (let i = 0; i < contentArr.length; i++) {
        if (!this.operations.includes(contentArr[i])) {
          if (contentArr[i] !== '') {
            contentArr[i] = 1
          }
        }
        if (!this.operations.includes(contentArr[i]) && (contentArr[i + 1] && !this.operations.includes(contentArr[i + 1]))) {
          next = false
        }
      }
      if ((this.validateFormula(contentArr.join(' ')) || this.content === '') && next) {
        this.$message.success('验证成功！')
        this.isCheck = true
      } else {
        this.$message.error('公式验证失败，请修改！')
        this.isCheck = false
      }
    },
    getParam(val) { // 获取参数
      if (this.content === '') {
        this.content = val
      } else {
        this.content = `${this.content} ${val}`
      }
    },
    getfunctionTree() { // 获取函数分类树
      this.tree.loading = true
      this.$api.functionCenter.getfunctionTree().then(s => {
        this.tree.data = [...s.data]
        this.tree.loading = false
      }).catch(e => {
        this.$message.error(e.message)
        this.tree.loading = false
      })
    },
    setTargetNode(node) { // 树节点点击
      if (node.sort === 1) {
        this.disabled = false
        this.tree.targetNode = { ...node }
      } else {
        this.disabled = true
      }
    },
    referInput() { // 参照输入
      const { targetNode } = this.tree
      if (targetNode.id) {
        this.zhixSql.show = true
      } else {
        this.$message.error('请选择左侧树函数')
      }
    },
    calc(opr) { // 点击操作符
      if (this.content === '') {
        this.content = opr
      } else {
        this.content = `${this.content} ${opr}`
      }
    },
    save() {
      this.isCheck = false
      this.formulaCheck()
      if (this.isCheck) {
        this.$emit('update:show', false)
        this.$emit('changeFuncText', this.content)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.leftBox,
.rightBox{
    border-radius: 5px;
    height: 528px;
    overflow: auto;
}
.leftBox{
    border: 1px solid #ddd;
}
.rightBox{
    .top{
        display: flex;
        height:40px;
        align-items: center;
        width:100%;
        .leftBtn{
            width:20%;
            height:36px;
            margin-right: 10px;
        }
        .box {
            display: inline-flex;
            align-items: center;
            height:100%;
            li{
                box-sizing: border-box;
                width:24px;
                height:24px;
                line-height: 24px;
                text-align: center;
                border: 1px solid #ddd;
                border-radius: 4px;
                margin-right: 12px;
                cursor: pointer;
            }
            li:hover {
                background: #409eff;
                color: #fff;
            }
        }
    }
    .exhibition{
        width:100%;
    }
}
</style>
