<template>
  <div class="container ntf-block-container">
    <notification-error :active="isErrorMessageActive">
      {{ errorMessage }}
    </notification-error>
    <validation-observer ref="observer" slim>
      <form @submit.prevent="doLogin">
        <validation-provider
          v-slot="{ errors }"
          rules="required|email|max:256"
          name="メールアドレス"
          slim
        >
          <b-field :type="{ 'is-danger': !!errors[0] }" :message="errors[0]">
            <template slot="label"> メールアドレス </template>
            <b-input
              v-model="email"
              type="email"
              :has-counter="false"
              placeholder="example@mome.fan"
              maxlength="256"
              icon="envelope"
              :disabled="isProcessing()"
            />
          </b-field>
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          rules="required"
          name="パスワード"
          slim
        >
          <b-field :type="{ 'is-danger': !!errors[0] }" :message="errors[0]">
            <template slot="label"> パスワード </template>
            <b-input
              ref="password"
              v-model="password"
              type="password"
              placeholder="パスワード"
              icon="key"
              password-reveal
              :disabled="isProcessing()"
            />
          </b-field>
        </validation-provider>
        <b-field class="ntf-button-field">
          <base-button
            native-type="submit"
            size="is-medium"
            :disabled="isProcessing()"
          >
            ログイン
          </base-button>
        </b-field>
      </form>
    </validation-observer>
  </div>
</template>

<script lang="ts">
import { Component, mixins, Vue } from 'nuxt-property-decorator'
import * as Vuex from 'vuex'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import firebase from '~/plugins/firebase'
import ProcessingMixin from '~/mixins/ProcessingMixin'
import ErrorHandlerMixin from '~/mixins/ErrorHandlerMixin'
import BaseButton from '~/components/atoms/BaseButton.vue'
import RequireLabel from '~/components/atoms/RequireLabel.vue'
import NotificationError from '~/components/molecules/NotificationError.vue'
import { FSLoginLog } from '~/types/models/login_log'
import { User } from '~/types/models/user'
import { STATUS_USER_PRE_SIGNUP } from '~/constants/common'

const db = firebase.firestore()
const className = 'LoginForm'

@Component({
  components: {
    ValidationObserver,
    ValidationProvider,
    BaseButton,
    RequireLabel,
    NotificationError,
  },
})
export default class LoginForm extends mixins(
  ProcessingMixin,
  ErrorHandlerMixin
) {
  $store!: Vuex.ExStore

  email: string = ''
  password: string = ''
  isErrorMessageActive: boolean = false
  errorMessage: string = ''

  async doLogin() {
    const funcName = 'doLogin'

    this.startProcessing()
    const isValid = await (this.$refs.observer as Vue & {
      validate: () => boolean
    }).validate()
    if (isValid) {
      const authUser = await firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .catch(async (error) => {
          if (error.code !== undefined) {
            switch (error.code) {
              case 'auth/wrong-password':
              case 'auth/user-not-found':
              case 'auth/user-disabled':
              case 'auth/invalid-email':
              case 'auth/network-request-failed':
                this.errorMessage = 'ログインに失敗しました。'
                break
              default:
                this.errorMessage = ''
            }

            if (this.errorMessage) {
              this.isErrorMessageActive = true
              this.endProcessing()
              return true
            }
          }

          let message = 'Unknown error has occurred. : '
          message += error.code ? ` ${error.code} ` : ''
          message += error.message ? `${error.message}` : ''
          await this.redirectToError(503, className, funcName, 1, message)
          return true
        })

      if (typeof authUser === 'boolean') {
        return // end
      }

      if (!authUser || authUser.user === null) {
        // 503
        await this.redirectToError(
          503,
          className,
          funcName,
          2,
          'Firebase Error: Not found user in authUserData.'
        )
        return
      }

      const uid = authUser.user.uid

      this.$store.dispatch('auth/saveUID', uid)
      this.$store.dispatch('auth/login', uid).catch((error: any) => {
        let message = 'Unknown error has occurred. : '
        message += error.code ? ` ${error.code} ` : ''
        message += error.message ? `${error.message}` : ''
        this.redirectToError(503, className, funcName, 3, message)
      })

      const doc = await db
        .collection('users')
        .doc(this.$store.getters['auth/uid'])
        .get()
        .catch(async (error) => {
          let message = 'Unknown error has occurred. : '
          message += error.code ? ` ${error.code} ` : ''
          message += error.message ? `${error.message}` : ''
          await this.redirectToError(503, className, funcName, 4, message)
          return true
        })

      if (typeof doc === 'boolean') {
        return // end
      }

      if (!doc) {
        // 503
        await this.redirectToError(
          503,
          className,
          funcName,
          5,
          'Firebase Error: Not found user in Users Collection.'
        )
        return
      }

      const user = doc.data() as User
      if (user.status === STATUS_USER_PRE_SIGNUP) {
        this.$router.push('/signup/profile')
      } else {
        const source = this.$store.getters['transition/source']
        this.$store.dispatch('transition/clearSource')
        this.$router.push(source || '/')
      }

      const currentTime = firebase.firestore.FieldValue.serverTimestamp()
      const loginLog: FSLoginLog = {
        user_id: uid,
        user_agent: window.navigator.userAgent,
        created_at: currentTime,
      }

      db.collection('login_logs')
        .add(loginLog)
        .catch(async (error) => {
          let message = 'Login logs error. : '
          message += error.code ? ` ${error.code} ` : ''
          message += error.message ? `${error.message}` : ''
          const consoleMessage = await this.saveErrorLog(
            className,
            funcName,
            6,
            message
          )
          console.log(consoleMessage)
        })
    } else {
      this.endProcessing()
    }
  }
}
</script>
