<template>
  <div>
    <transition name="fade">
      <p :class="['text-static', 'is-inline-block', { empty: isLoading }]">
        <slot />
      </p>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({})
export default class BaseTextStatic extends Vue {
  @Prop({ type: Boolean, default: false })
  isLoading!: boolean
}
</script>

<style lang="scss" scoped>
.text-static {
  opacity: 1;
  transition: opacity 0.1s ease;
  white-space: normal;
  word-break: break-word;
  &.empty {
    opacity: 0;
  }
}
</style>
