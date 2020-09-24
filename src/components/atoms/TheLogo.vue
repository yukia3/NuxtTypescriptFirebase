<template>
  <nuxt-link to="/">
    <img src="~/assets/images/logo.svg" alt="ＭＯ.ＭＥ" />
  </nuxt-link>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class TheLogo extends Vue {}
</script>

<style scoped>
img {
  width: auto;
  height: 52px;
}
</style>
