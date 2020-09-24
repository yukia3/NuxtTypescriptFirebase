import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class ProcessingMixin extends Vue {
  processing: boolean = false

  startProcessing() {
    this.processing = true
  }

  endProcessing() {
    this.processing = false
  }

  isProcessing() {
    return this.processing
  }
}
