<template>
  <h2 class="title is-4 has-text-centered has-text-info">
    <slot />
  </h2>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class HTitleTop extends Vue {}
</script>

<style></style>
