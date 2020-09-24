<template>
  <h1 class="title is-4 has-text-centered has-text-info title-page">
    <slot />
  </h1>
</template>

<script>
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class HTitlePage extends Vue {}
</script>

<style lang="scss" scoped>
.title-page {
  margin-top: 3rem;
  margin-bottom: 0 !important;
}
</style>
