<template>
  <div>
    <el-dialog
      v-dialogDrag
      :modal="false"
      width="600px"
      :visible.sync="show"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        个人信息
      </div>
      <el-form
        :model="form"
        size="mini"
        label-width="80px"
      >
        <div style="text-align: center;">
          <img style="display: inline-block; width:60xp; height: 60px;" :src="baseURL">
        </div>
        <div style="text-align: center;">
          <el-button type="text" size="mini" icon="el-icon-edit-outline" @click="showUpload">
            修改头像
          </el-button>
        </div>
        <el-form-item label="用户名称" prop="name">
          <el-input v-model="form.name" readonly />
        </el-form-item>
        <el-form-item label="账户名" prop="username">
          <el-input v-model="form.username" readonly />
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="form.pwd">
            <el-button
              slot="append"
              icon="el-icon-edit-outline"
              @click="updatePwd.show = true"
            />
          </el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-input v-model="form.roles" readonly />
        </el-form-item>
        <el-form-item label="所属单位" prop="unit_name">
          <el-input v-model="form.unit_name" readonly />
        </el-form-item>
        <el-form-item label="部门" prop="dept_name">
          <el-input v-model="form.dept_name" readonly />
        </el-form-item>
        <el-form-item label="手机号" prop="tel">
          <el-input v-model="form.tel">
            <el-button
              slot="append"
              icon="el-icon-edit-outline"
              @click="phone.show = true"
            />
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" size="mini" @click="() => $emit('update:show', false)">
          关闭
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-dialogDrag
      :modal="false"
      width="400px"
      :visible.sync="avatarDialog.show"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div slot="title">
        修改头像(点击头像即可重新上传修改)
      </div>
      <el-upload
        class="avatar-uploader"
        action="#"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :http-request="upload"
        style="margin: 50px auto; text-align: center;"
      >
        <img v-if="avatarDialog.url" :src="avatarDialog.url" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon" />
      </el-upload>
      <div slot="footer">
        <el-button type="info" size="mini" @click="avatarDialog.show = false">
          关闭
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-dialogDrag
      :modal="false"
      width="400px"
      :visible.sync="updatePwd.show"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      @close="beforeClosePwd"
    >
      <div slot="title">
        修改密码
      </div>
      <el-form
        ref="pwdForm"
        :model="updatePwd.form"
        :rules="updatePwd.rules"
        size="mini"
        label-width="70px"
      >
        <el-form-item label="旧密码" prop="oldPwd">
          <el-input v-model="updatePwd.form.oldPwd" :type="updatePwd.type_oldPwd">
            <i
              slot="suffix"
              class="el-input__icon el-icon-view"
              style="cursor: pointer;"
              @click="changeViewType('oldPwd')"
            />
          </el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input v-model="updatePwd.form.newPwd" :type="updatePwd.type_newPwd">
            <i
              slot="suffix"
              class="el-input__icon el-icon-view"
              style="cursor: pointer;"
              @click="changeViewType('newPwd')"
            />
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="repeat">
          <el-input v-model="updatePwd.form.repeat" :type="updatePwd.type_repeat">
            <i
              slot="suffix"
              class="el-input__icon el-icon-view"
              style="cursor: pointer;"
              @click="changeViewType('repeat')"
            />
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" size="mini" @click="updatePwd.show = false">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="confirmUpdatePwd">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-if="phone.show"
      v-dialogDrag
      :modal="false"
      width="400px"
      :visible.sync="phone.show"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      @close="phoneClose"
    >
      <div slot="title">
        手机号码
      </div>
      <div>
        <div v-if="phone.type === 'bind' && !phone.needUnbind" style="text-align: center; margin-top: 40px;">
          <p style="padding: 5px 0px;">
            当前绑定手机号
          </p>
          <p style="padding: 5px 0px;">
            {{ form.tel }}
          </p>
          <el-button type="text" size="mini" @click="phone.needUnbind = true">
            解绑手机
          </el-button>
        </div>
        <el-form
          v-else
          ref="phoneForm"
          :model="phone.form"
          :rules="phone.rules"
          size="mini"
          label-width="60px"
        >
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="phone.form.tel"
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
          <el-form-item label="验证码" prop="code">
            <el-input
              v-model="phone.form.code"
              class="password"
              placeholder="请输入验证码"
            >
              <i
                slot="prefix"
                class="el-input__icon el-icon-chat-dot-square icon"
              />
              <el-button
                v-if="phone.send"
                slot="append"
                style="color:#409EFF"
                @click="getCode"
              >
                {{ phone.desc }}
              </el-button>
              <el-button v-else slot="append" type="primary" size="mini">
                {{
                  phone.desc
                }}
              </el-button>
              >
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button type="info" size="mini" @click="phone.show = false">
          取消
        </el-button>
        <el-button v-if="phone.type === 'unbind'" type="primary" size="mini" @click="bindTel">
          绑定
        </el-button>
        <el-button v-if="phone.type === 'bind' && phone.needUnbind" type="primary" size="mini" @click="unBindTel">
          解绑
        </el-button>
        <!-- <el-button v-if="phone.type === 'bind' && !phone.needUnbind" type="primary" size="mini">
          确定
        </el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      defalut: false
    }
  },
  data() {
    const checkNewPwd = (rule, value, callback) => {
      if (value === '') callback(new Error('请填写旧密码！'))
      else if (this.updatePwd.form.repeat !== '') {
        this.$refs.pwdForm.validateField('repeat')
        callback()
      }
    }
    const confirmPwd = (rule, value, callback) => {
      if (value === '') callback(new Error('请再次输入密码！'))
      else if (value !== this.updatePwd.form.newPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      form: {
        name: '',
        username: '',
        pwd: '******',
        roles: '',
        unit_name: '',
        dept_name: '',
        tel: ''
      },
      baseURL: '',
      avatarDialog: {
        show: false,
        url: ''
      },
      updatePwd: {
        show: false,
        form: {
          oldPwd: '',
          newPwd: '',
          repeat: ''
        },
        rules: {
          oldPwd: [{ required: true, message: '请填写旧密码！', trigger: 'blur' }],
          newPwd: [{ required: true, validator: checkNewPwd, trigger: ['change', 'blur'] }],
          repeat: [{ required: true, validator: confirmPwd, trigger: ['change', 'blur'] }]
        },
        type_repeat: 'password',
        type_newPwd: 'password',
        type_oldPwd: 'password'
      },
      phone: {
        show: false,
        form: {
          tel: '',
          code: ''
        },
        rules: {},
        send: true,
        desc: '获取验证码',
        type: 'bind',
        needUnbind: false
      }
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    phoneClose() {
      clearInterval(this.timer)
      this.phone.send = true
      this.phone.desc = '获取验证码'
    },
    unBindTel() {
      this.$api.user.unBindTel({
        code: this.phone.form.code
      }).then(s => {
        this.$message.success('手机解绑成功！')
        this.form.tel = ''
        this.phone.needUnbind = false
        this.phone.type = 'unbind'
        this.phone.show = false
      }).catch(e => this.$message.error(e.message))
    },
    bindTel() {
      this.$api.user.bindTel({
        code: this.phone.form.code,
        tel: this.phone.form.tel
      }).then(s => {
        this.$message.success('手机绑定成功！')
        this.form.tel = this.phone.form.tel
        this.phone.type = 'bind'
      }).catch(e => this.$message.error(e.message))
    },
    getCode() {
      const reg = /^1\d{10}$/
      if (reg.test(this.phone.form.tel)) {
        this.phone.send = false
        let t = 60
        this.desc = `${t}s后重新获取`
        this.timer = setInterval(() => {
          if (t === 1) {
            this.phone.send = true
            this.phone.desc = '获取验证码'
            clearInterval(this.timer)
            return
          }
          t--
          this.phone.desc = `${t}s后重新获取`
        }, 1000)
        this.$once('hook:beforeDestroy', () => clearInterval(this.timer))
        this.bindOrUnbind()
      } else {
        this.$message.error('请输入正确的手机号')
      }
    },
    bindOrUnbind() {
      this.$api.user.telCode({
        type: this.phone.type === 'unbind' ? 'bind' : 'unbind',
        tel: this.phone.type === 'unbind' ? this.phone.form.tel : ''
      }).then(res => {
        this.$message.success(res.data)
      }).catch(e => this.$message.error(e.message))
    },
    confirmUpdatePwd() {
      this.$refs.pwdForm.validate(valid => {
        if (valid) {
          const params = { ...this.updatePwd.form }
          this.$api.user.updatePwd(params).then(s => {
            this.$message.success('修改成功！')
            this.updatePwd.show = false
          }).catch(e => this.$message.error(e.message))
        }
      })
    },
    beforeClosePwd() {
      this.updatePwd.form = {
        oldPwd: '',
        newPwd: '',
        repeat: ''
      }
      this.updatePwd.type_repeat = 'password'
      this.updatePwd.type_newPwd = 'password'
      this.updatePwd.type_oldPwd = 'password'
    },
    changeViewType(field) {
      this.updatePwd[`type_${field}`] = this.updatePwd[`type_${field}`] === 'password' ? 'text' : 'password'
    },
    upload(params) {
      const formdata = new FormData()
      formdata.append('file', params.file)
      this.$http.post('/user/updatePhoto', formdata, {
        onUploadProgress: event => {
          params.file.percent = (event.loaded / event.total) * 100
          params.onProgress(params.file)
        }
      }).then(res => {
        params.onSuccess()
      }).catch(e => params.onError())
    },
    handleAvatarSuccess(res, file) {
      this.avatarDialog.url = URL.createObjectURL(file.raw)
      this.baseURL = this.avatarDialog.url
      this.$store.dispatch('user/refreshAvatar', this.avatarDialog.url)
    },
    beforeAvatarUpload(file) {
      const { name } = file
      const type = name.slice(name.lastIndexOf('.') + 1)
      let result = true
      if (!['png', 'gif', 'jpeg', 'jpg'].includes(type.toLowerCase())) {
        result = false
        this.$message.warning('请上传图片！')
      }
      return result
    },
    showUpload() {
      this.avatarDialog.url = this.baseURL
      this.avatarDialog.show = true
    },
    getUserInfo() {
      this.$http.get('/user/personalInfo').then(s => {
        Object.assign(this.form, s.data)
        this.phone.type = s.data.tel ? 'bind' : 'unbind'
        // eslint-disable-next-line max-len
        this.baseURL = `${this.$http.defaults.baseURL}/user/getPhoto?id=${localStorage.getItem('userId')}&time=${new Date().getTime()}`
      }).catch(e => this.$message.error(e.message))
    }
  }
}
</script>

<style lang='scss' scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin: 50px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
