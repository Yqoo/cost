<template>
  <component :is="type" v-bind="linkProps(to)" @click="xx">
    <slot />
  </component>
</template>

<script>

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  computed: {
    type() {
      if (this.isExternal) {
        return 'a'
      }
      return 'router-link'
    }
  },
  methods: {
    xx() {
      console.log('x')
    },
    linkProps(to) {
      /* if (this.isExternal) {
        return {
          href: to,
          target: '_blank',
          rel: 'noopener'
        }
      } */
      return {
        to
      }
    }
  }
}
</script>
