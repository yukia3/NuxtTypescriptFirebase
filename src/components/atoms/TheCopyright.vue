<template>
  <div class="copyright is-size-7">
    <p>©mome-public All rights reserved.</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class TheLogo extends Vue {}
</script>

<style scoped>
.copyright {
  padding: 0.75rem 1.5rem;
  background-color: #d7e0e0;
}
</style>
