<template>
  <router-view />
</template>

<script>
export default {
  name: 'Data',
  created() {
    // 解决三级路由无法缓存
    const route = this.$route.matched.find(item => item.name === this.$options.name)
    this.$store.dispatch('tagsView/addCachedView', route)
  }
}
</script>
