<template>
  <div>
    <el-input
      v-for="(value, key, index) in bmgzBoxs"
      ref="input"
      :key="key"
      v-model="bmgzBoxs[key]"
      class="inputBox"
      type="number"
      :disabled="index <= usedBmgz - 1 ? true : false"
      :readonly="!show"
      @input="inputValue(bmgzBoxs[index],key)"
    >
      <i
        v-if="show && index > usedBmgz - 1"
        slot="suffix"
        class="el-icon-close closeIcon"
        @click="removeBox(key)"
      />
    </el-input>
    <el-button
      v-if="show"
      type="text"
      size="mini"
      icon="el-icon-circle-plus"
      @click="addBox"
    />
    <el-button
      v-if="show && post"
      type="text"
      size="mini"
      icon="el-icon-circle-check"
      @click="saveBmgz"
    />
  </div>
</template>

<script>

import qs from 'qs'

export default {
  name: 'Bmfa',
  props: {
    usedBmgz: {
      type: String,
      default: '0'
    },
    bmgzBoxs: {
      type: Object,
      default: () => {}
    },
    ztsn: { // 账套号
      type: String,
      default: ''
    },
    post: { // 是否需要提交保存
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      autofocus: false
    }
  },
  watch: {
    ztsn: {
      immediate: true,
      handler: 'isNeedGetBmgz'
    }
  },
  methods: {
    inputValue(val, key) {
      if (!val) {
        if (key > 0) {
          this.removeBox(key)
          this.$refs.input[key - 1].focus()
        }
      }
      if (val.length === 2) {
        // eslint-disable-next-line prefer-destructuring
        this.bmgzBoxs[key] = this.bmgzBoxs[key].split('').splice(0, 1)[0]
        const nextValue = val.split('').splice(1, 1)[0]
        // const lastKey = Object.keys(this.bmgzBoxs)[Object.keys(this.bmgzBoxs).length - 1]
        this.$set(this.bmgzBoxs, key === undefined ? 0 : +key + 1, nextValue)
        this.$refs.input[key].blur()
        this.$nextTick(() => {
          this.$refs.input[+key + 1].focus()
        })
      }
    },
    saveBmgz() {
      const bmgz = Object.values(this.bmgzBoxs).filter(item => item !== '')
      if (bmgz.length) {
        this.$http.post('/kuaiJiKeMu/updateBmgz', qs.stringify({
          ztsn: this.ztsn,
          bmgz: bmgz.join('-')
        })).then(s => {
          this.$message.success('编码规则保存成功！')
        }).catch(e => this.$message.error(e.message))
      } else this.$message.warning('编码规则至少一位！')
    },
    isNeedGetBmgz(ztsn) {
      if (ztsn) {
        this.$http.get(`/kuaiJiKeMu/kmbmgz?ztsn=${ztsn}`).then(s => {
          const { bmgz, usedBmgz } = s.data
          bmgz && bmgz.split('-').forEach((item, index) => {
            this.$set(this.bmgzBoxs, index, item)
          })
          this.$emit('update:usedBmgz', usedBmgz)
        }).catch(e => this.$message.error(e.message))
      }
    },
    removeBox(key) {
      this.$delete(this.bmgzBoxs, key)
    },
    addBox() {
      const lastKey = Object.keys(this.bmgzBoxs)[Object.keys(this.bmgzBoxs).length - 1]
      this.$set(this.bmgzBoxs, lastKey === undefined ? 0 : +lastKey + 1, '')
    }
  }
}
</script>

<style lang='scss' scoped>
.inputBox {
    width: 60px;
    margin-right: 5px;
    /deep/ .el-input__inner {
      height: 28px;
      line-height: 28px;
      font-size: 12px;
    }
  }
  .closeIcon {
    color: #008df7;
    position: absolute;
    top: 9px;
    right: 1px;
  }
  .closeIcon:hover {
    color: #0170c1;
    cursor: pointer;
  }
</style>
