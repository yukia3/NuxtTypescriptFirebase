<template>
  <b-button
    v-if="!irregular"
    :class="[
      'has-text-weight-semibold',
      'base-button',
      { 'is-fullwidth': !narrowed },
    ]"
    v-bind="$attrs"
    :type="type"
    :native-type="nativeType"
    v-on="$listeners"
  >
    <slot />
  </b-button>
  <b-button
    v-else
    :class="[
      'has-text-grey-dark',
      'base-button',
      { 'is-fullwidth': !narrowed },
    ]"
    v-bind="$attrs"
    :native-type="nativeType"
    v-on="$listeners"
  >
    <slot />
  </b-button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({
  inheritAttrs: false,
})
export default class BaseButton extends Vue {
  @Prop({ type: Boolean, default: false })
  irregular!: boolean

  @Prop({ type: [String, Object], default: 'is-primary' })
  type!: string

  @Prop({ type: String, default: 'button' })
  nativeType!: string

  @Prop({ type: Boolean, default: false })
  narrowed!: boolean
}
</script>

<style lang="scss" scoped>
.base-button {
  margin: 0 auto;
  max-width: 480px;
  &.is-medium {
    font-size: 1rem;
    height: 3rem;
  }
  &.is-large {
    font-size: 1rem;
    height: 3.5rem;
  }
}
</style>
