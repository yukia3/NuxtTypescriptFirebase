<template>
  <img :src="src" class="image" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({})
export default class BaseImage extends Vue {
  @Prop({
    type: String,
    required: true
  })
  src!: String
}
</script>

<style scoped>
.image {
  overflow: hidden;
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style>
