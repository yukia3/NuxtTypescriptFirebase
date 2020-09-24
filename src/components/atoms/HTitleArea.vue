<template>
  <h2 class="title is-5 has-text-centered">
    <slot />
  </h2>
</template>

<script>
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class HTitleArea extends Vue {}
</script>

<style></style>
