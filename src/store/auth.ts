import {
  Module,
  VuexModule,
  Mutation,
  Action,
  config,
} from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import firebase from '~/plugins/firebase'

config.rawError = true

@Module({
  name: 'auth',
  stateFactory: true,
  namespaced: true,
})
export default class Auth extends VuexModule {
  private uid: String = ''

  public get getUID() {
    return this.uid
  }

  public get isAuthenticated() {
    return !!this.uid
  }

  @Mutation
  private saveUID(uid: String) {
    this.uid = uid
  }

  @Action({ commit: 'saveUID' })
  public async login(uid: String) {
    const currentUser = firebase.auth().currentUser
    if (currentUser == null) {
      return
    }
    await $axios.post('/api/login', {
      uid,
    })

    return uid
  }

  @Action({ commit: 'saveUID' })
  public async logout() {
    await firebase.auth().signOut()
    await $axios.post('/api/logout')
    return ''
  }

  @Action({ commit: 'saveUID' })
  updateUID(uid: String) {
    return uid
  }
}
