import { Component, Vue } from 'nuxt-property-decorator'
import * as Vuex from 'vuex'
import firebase from '~/plugins/firebase'

@Component({})
export default class MomeVue extends Vue {
  $store!: Vuex.ExStore

  mounted() {
    // Set Auth Observer
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        this.$store.dispatch('auth/saveUID', user.uid)
      } else {
        this.$store.dispatch('auth/saveUID', '')
      }
    })

    window.scrollTo(0, 0)
  }

  getUserIndex(numShard: number) {
    const index =
      Math.floor(
        parseInt(this.$store.getters['auth/uid'].replace(/[A-Z]|[a-z]/g, ''))
      ) % numShard
    return index.toString(10)
  }
}
