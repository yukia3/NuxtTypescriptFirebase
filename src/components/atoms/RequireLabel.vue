<template>
  <span class="has-text-danger is-size-7"> 必須 </span>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class RequireLabel extends Vue {}
</script>

<style scoped>
span {
  margin-left: 0.25rem;
  vertical-align: 0.125rem;
}
</style>
