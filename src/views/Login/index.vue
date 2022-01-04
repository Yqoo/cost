<template>
  <div class="login">
    <header>
      <div style="margin-right:16px;">
        <span style="font-size:34px;font-weight:bold;">挚友</span>
        <span style="font-size:17px;font-weight:bold;line-height:33px;">ZhiYou</span>
      </div>
      <div>
        <span style="font-size:28px;letter-spacing:2px;">N1+Cloud&nbsp;2020</span>
        <span style="font-size:18px;letter-spacing:7px">新一代成本核算平台</span>
      </div>
    </header>
    <div class="main">
      <div v-waiting="loading" class="main-form ">
        <!-- <i class="iconfont icon-baozhangqixianchang"></i> -->
        <ul>
          <li
            :class="{ wordColor: !show, wordColorClick: show }"
            @click="accountLogin"
          >
            账号登录
          </li>
          <li
            :class="{ wordColor: show, wordColorClick: !show }"
            @click="phoneLogin"
          >
            手机登录
          </li>
        </ul>

        <!-- 账号登录 -->
        <el-form ref="form" :model="form" :rules="rules" size="mini" class="el-form">
          <el-form-item v-if="show" prop="username">
            <el-input
              v-model="form.username"
              placeholder="请输入账号"
              class="username"
            >
              <i slot="prefix" class="el-input__icon el-icon-user icon " />
              >
            </el-input>
          </el-form-item>

          <el-form-item v-if="show" prop="password">
            <el-input
              v-model="form.password"
              :type="showPwd ? 'text' : 'password'"
              placeholder="请输入密码"
              @keyup.native.enter="onSubmit"
            >
              <i slot="prefix" class="el-input__icon el-icon-lock icon" />
              >
              <i
                slot="suffix"
                class="el-icon-view"
                style="cursor:pointer"
                @click="showPwd = !showPwd"
              />
            </el-input>
          </el-form-item>

          <!-- 手机登录 -->
          <el-form-item v-if="!show" prop="phone">
            <el-input
              v-model="form.phone"
              placeholder="请输入手机号"
              class="username"
            >
              <i
                slot="prefix"
                class="el-input__icon el-icon-mobile-phone icon "
              />
              >
            </el-input>
          </el-form-item>

          <el-form-item v-if="!show" prop="code">
            <el-input
              v-model="form.code"
              class="password"
              placeholder="请输入验证码"
              @keyup.native.enter="onSubmit"
            >
              <i
                slot="prefix"
                class="el-input__icon el-icon-chat-dot-square icon"
              />
              <el-button
                v-if="send"
                slot="append"
                style="color:#409EFF"
                @click="getCode"
              >
                {{ desc }}
              </el-button>
              <el-button v-else slot="append" type="primary" size="mini">
                {{
                  desc
                }}
              </el-button>
              >
            </el-input>
          </el-form-item>

          <!-- 确认按钮 -->
          <el-button
            type="primary"
            size="mini"
            class="submit"
            @click="onSubmit('form')"
          >
            登录
          </el-button>
          <div class="remember">
            <p class="check">
              <el-checkbox v-model="checked" size="mini">
                记住账号
              </el-checkbox>
            </p>
            <p v-show="show">
              <el-button type="text" size="mini" @click="open">
                忘记密码？
              </el-button>
            </p>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {
  setToken, setNameAndPhone, removeNameAndPhone, getNameAndPhone, setRemember, getRemember
} from '@/utils/auth'

export default {
  data() {
    const validateUPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('输入框不能为空'))
      }
      return callback()
    }
    const validateNPass = (rule, value, callback) => {
      if (!/^1(3|4|5|6|7|8)\d{9}$/.test(value)) {
        return callback(new Error('请输入正确的电话号码'))
      }
      return callback()
    }
    const validatePPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('输入框不能为空'))
      }
      return callback()
    }
    return {
      form: {
        username: getNameAndPhone().account || 'admin',
        password: '123456',
        phone: getNameAndPhone().phone || '',
        code: ''
      },
      desc: '获取验证码',
      dialogTableVisible: false,
      dialogFormVisible: false,
      loading: false,
      checked: getRemember(),
      show: true,
      send: true,
      rules: {
        username: [
          {
            required: true,
            message: '请输入正确的账号',
            trigger: 'change',
            validator: validateUPass
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'change',
            validator: validatePPass
          }
        ],
        phone: [
          {
            required: true,
            message: '请输入正确的手机号',
            trigger: 'change',
            validator: validateNPass
          }
        ],
        code: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'change'
          }
        ]
      },
      showPwd: false
    }
  },
  watch: {
    checked(bool) {
      setRemember(bool)
    }
  },
  methods: {
    // 登录按钮
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const params = this.show ? {
            username: this.form.username,
            password: this.form.password
          } : {
            username: this.form.phone,
            code: this.form.code,
            type: 'ph'
          }
          this.$store.dispatch('user/login', params).then(res => {
            const MODULE_APIS = this.distModuleAPIS(res)
            localStorage.setItem('MODULE_APIS', JSON.stringify(MODULE_APIS))
            this.loading = false
            this.$message.success('登录成功！')
            this.$router.push({ path: '/' })
          }).catch(e => {
            this.loading = false
            this.$message({
              type: 'warning',
              message: e.message
            })
          })
          this.checked ? setNameAndPhone({
            account: this.form.username,
            phone: this.form.phone
          }) : removeNameAndPhone()
        }
      })
    },

    // 账号登录
    accountLogin() {
      this.show = true
    },
    // 手机登录
    phoneLogin() {
      this.show = false
    },
    // 忘记密码
    open() {
      this.$alert('请使用手机验证登录', '请使用手机验证登录', {
        confirmButtonText: '确定'
      })
    },
    // 手机验证码
    getCode() {
      const reg = /^1\d{10}$/
      if (reg.test(this.form.phone)) {
        this.$api.user.phoneCode(this.form.phone).then(res => {
          this.send = false
          let t = 60
          this.desc = `${t}s后重新获取`
          const timer = setInterval(() => {
            if (t === 1) {
              this.send = true
              this.desc = '获取验证码'
              clearInterval(timer)
              return
            }
            t--
            this.desc = `${t}s后重新获取`
          }, 1000)
          this.$once('hook:beforeDestroy', () => clearInterval(timer))
          this.$message.success(res.data)
        }).catch(e => {
          this.$message.error(e.message)
        })
      } else {
        this.$message.error('请输入正确的手机号')
      }
    },
    distModuleAPIS(array, res = {}) {
      if (array.length === 0) return {}
      array.forEach(arr => {
        res[arr.name] = arr.apis || []
        if (arr.children.length) {
          this.distModuleAPIS(arr.children, res)
        }
      })
      return res
    }
  }
}
</script>

<style lang="scss" scoped>
li {
  list-style: none;
}
.login {
  height: 100%;
}

header {
  width: 100%;
  height: 100px;
  padding-left: 80px;
  line-height: 100px;
  background: #f6f9fb;
  display: flex;
  align-items: center;
  img {
    height: 85px;
    margin-top: 10px;
  }
  div{
    display: flex;
    flex-direction: column;
    color:#409EFF;
    letter-spacing: 3px;
    span{
      line-height: 30px;
    }
  }
}
.remember {
  display: flex;
  .check {
    flex-grow: 1;
    color: #6996ff;
  }
}
.main {
  width: 100%;
  height: calc(100% - 100px);
  background-color: #f6f9fb;
  background: url("~@/assets/images/login/background.png") no-repeat;
  background-position: center center;
  background-attachment: fixed;
  background-size: auto 100%;
  position: relative;
  .main-form {
    -moz-box-shadow: 7px 7px 7px #cacdd6;
    -webkit-box-shadow: 7px 7px 7px #cacdd6;
    box-shadow: 7px 7px 7px #cacdd6;
    background-color: #fff;
    position: absolute;
    bottom: 35vh;
    right: 30vh;
    ul {
      display: flex;
      justify-content: space-around;
      border-bottom: 1px solid #dfe5e8;
      padding: 20px 0px;
      .wordColor {
        color: #b6b5b5;
      }
      .wordColorClick {
        color: #6996ff;
      }
      li {
        cursor: pointer;
      }
    }
    .el-form {
      padding: 50px 26px 30px;;
      .submit,
      .username,
      .password {
        width: 400px;
      }
      .submit {
        margin: 15px 0px;
        background-color: #6996ff;
      }
    }
  }
}
.icon {
  color: #6996ff;
}
</style>
