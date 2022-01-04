<template>
  <div id="editor" />
</template>

<script>
import E from 'wangeditor'

export default {
  name: 'Editor',
  data() {
    return {
      editor: null
    }
  },
  mounted() {
    this.editor = new E(document.getElementById('editor'))
    this.editor.create()
  },
  methods: {
    save() {
      return this.editor.txt.html()
    },
    setContent(html) {
      this.editor.txt.html(html)
    }
  }
}
</script>

<style>

</style>
