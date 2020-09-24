<template>
  <nuxt-link :to="to" class="link">
    <slot />
  </nuxt-link>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({})
export default class BaseLink extends Vue {
  @Prop({
    type: String,
    required: true,
  })
  to!: string
}
</script>

<style scoped>
.link {
  text-decoration: underline;
}
</style>
