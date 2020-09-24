<template>
  <b-notification
    :active="active"
    :closable="false"
    class="has-text-danger is-size-7"
  >
    <b-icon pack="fas" icon="exclamation-circle" size="is-small"> </b-icon>
    <slot />
  </b-notification>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({})
export default class NotificationError extends Vue {
  @Prop({ type: Boolean, required: true })
  active!: boolean
}
</script>
