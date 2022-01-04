/**
  可上传文件夹的上传组件
 */
<template>
  <el-dialog
    v-dialogDrag
    :modal="false"
    width="500px"
    :visible.sync="show"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="() => $emit('update:show', false)"
  >
    <div slot="title">
      文件上传
    </div>
    <div id="dropz" class="dropzone" />
  </el-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    params: { // 上传文件所需参数
      type: Object,
      default: () => {}
    },
    acceptedFiles: { // 上传文件类型 '.PNG,.JPEG'
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dropzone: {
        exa: null
      }
    }
  },
  watch: {
    show: {
      immediate: true,
      handler: 'init'
    }
  },
  methods: {
    init(bool) {
      if (bool) {
        this.$nextTick(() => {
          this.dropzone.exa || this.initDropzone()
        })
        this.$once('hook:beforeDestory', () => {
          this.dropzone.exa.destory()
          this.dropzone.exa = null
        })
      }
    },
    initDropzone() {
      const { baseURL } = this.$http.defaults
      const that = this
      const token = this.$tools.getCookie()
      window.Dropzone.autoDiscover = false
      const dictInvalidFileType = `文件类型只能是${that.acceptedFiles}`
      this.dropzone.exa = new window.Dropzone('#dropz', {
        url: `${baseURL}/voucher/uploadFile`, // 文件提交地址
        method: 'post',
        withCredentials: true,
        headers: {
          Authorization: token
        },
        paramName: 'file',
        maxFilesize: 500, // 文件大小，单位：MB
        acceptedFiles: that.acceptedFiles, // 上传的类型
        addRemoveLinks: true, // 默认false。如果设为true，则会给文件添加一个删除链接
        autoProcessQueue: true,
        dictDefaultMessage: '拖拽或点击文件/文件夹进行上传',
        dictMaxFilesExceeded: '您最多只能上传{{maxFiles}}个文件！',
        dictResponseError: '文件上传失败!',
        dictInvalidFileType,
        dictFallbackMessage: '浏览器不受支持',
        dictFileTooBig: '文件过大({{filesize}}MB). 上传文件最大支持: {{maxFilesize}}MB.',
        dictRemoveLinks: '删除',
        dictCancelUpload: '取消',
        dictRemoveFile: '移除',
        init() {
          this.on('sending', (file, xhr, formData) => {
            Object.keys(that.params).forEach(key => {
              formData.append(key, that.params[key])
            })
          })
          this.on('queuecomplete', () => {
            that.$message.success('所有文件上传成功！')
            that.$emit('update:show', false)
            that.$emit('refresh')
            this.removeAllFiles(true)
          })
        }
      })
    }
  }
}
</script>

<style>

</style>
