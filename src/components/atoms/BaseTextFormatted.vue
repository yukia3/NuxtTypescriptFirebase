<template>
  <div v-auto-link class="content text-formatted">
    <p>{{ text }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({})
export default class BaseTextFormatted extends Vue {
  @Prop({ type: String, default: '' })
  text!: string
}
</script>

<style scoped>
.text-formatted {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
