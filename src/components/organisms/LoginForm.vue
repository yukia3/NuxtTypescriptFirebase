<template>
  <div class="container crs-block-container">
    <notification-error :active="state.isErrorMessageActive">
      {{ state.errorMessage }}
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
              v-model="state.email"
              type="email"
              :has-counter="false"
              placeholder="example@mome.fan"
              maxlength="256"
              icon="envelope"
              :disabled="state.processing"
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
              v-model="state.password"
              type="password"
              placeholder="パスワード"
              icon="key"
              password-reveal
              :disabled="state.processing"
            />
          </b-field>
        </validation-provider>
        <b-field class="crs-button-field">
          <base-button
            native-type="submit"
            size="is-medium"
            :disabled="state.processing"
          >
            ログイン
          </base-button>
        </b-field>
      </form>
    </validation-observer>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  inject,
  useContext,
  ref,
  onMounted,
} from '@nuxtjs/composition-api'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import firebase from '~/plugins/firebase'
import BaseButton from '~/components/atoms/BaseButton.vue'
import RequireLabel from '~/components/atoms/RequireLabel.vue'
import NotificationError from '~/components/molecules/NotificationError.vue'
import ErrorLog from '~/composables/ErrorLog'
import { AuthStore } from '~/store/index'
import TransitionSourceKey from '~/store/transitionSource/key'
import { TransitionSourceStore } from '~/store/transitionSource'
import { USER_STATUSES } from '~/services/nuxt-typescript-firebase/invariables'
import { User } from '~/services/nuxt-typescript-firebase/models/user'
import {
  LoginLog,
  blankLoginLog,
} from '~/services/nuxt-typescript-firebase/models/login_log'

const db = firebase.firestore()
const className = 'LoginForm'

export default defineComponent({
  name: 'LoginForm',
  components: {
    ValidationObserver,
    ValidationProvider,
    BaseButton,
    RequireLabel,
    NotificationError,
  },
  setup() {
    // State
    const state = reactive<{
      email: string
      password: string
      isErrorMessageActive: boolean
      errorMessage: string
      processing: boolean
    }>({
      email: '',
      password: '',
      isErrorMessageActive: false,
      errorMessage: '',
      processing: false,
    })

    // Stores
    const { sourceState, clearSource } = inject(
      TransitionSourceKey
    ) as TransitionSourceStore

    // Context
    const { redirect, error } = useContext()
    const observer = ref<InstanceType<typeof ValidationObserver>>()

    // Logics
    const mounted = onMounted(() => {
      if (!observer.value) return
      console.log(observer.value)
    })
    const doLogin = async () => {
      const funcName = 'doLogin'

      state.processing = true
      const isValid = await observer.value!.validate()
      if (isValid) {
        const authUser = await firebase
          .auth()
          .signInWithEmailAndPassword(state.email, state.password)
          .catch((error) => {
            if (error.code !== undefined) {
              switch (error.code) {
                case 'auth/wrong-password':
                case 'auth/user-not-found':
                case 'auth/user-disabled':
                case 'auth/invalid-email':
                case 'auth/network-request-failed':
                  state.errorMessage = 'ログインに失敗しました。'
                  break
                default:
                  state.errorMessage = ''
              }

              if (state.errorMessage) {
                state.isErrorMessageActive = true
                state.processing = false
                return true
              }
            }

            let message = 'Unknown error has occurred. : '
            message += error.code ? ` ${error.code} ` : ''
            message += error.message ? `${error.message}` : ''
            error({
              statusCode: 503,
              message: ErrorLog(className, funcName, 1, message),
            })
            return true
          })

        if (typeof authUser === 'boolean') {
          return // end
        }

        if (!authUser || authUser.user === null) {
          // 503
          const message = 'Firebase Error: Not found user in authUserData.'
          error({
            statusCode: 503,
            message: ErrorLog(className, funcName, 2, message),
          })
          return
        }

        const uid = authUser.user.uid

        AuthStore.login(uid).catch((error: any) => {
          let message = 'Unknown error has occurred. : '
          message += error.code ? ` ${error.code} ` : ''
          message += error.message ? `${error.message}` : ''
          error({
            statusCode: 503,
            message: ErrorLog(className, funcName, 3, message),
          })
        })

        const doc = await db
          .collection('users')
          .doc(uid)
          .get()
          .catch((error) => {
            let message = 'Unknown error has occurred. : '
            message += error.code ? ` ${error.code} ` : ''
            message += error.message ? `${error.message}` : ''
            error({
              statusCode: 503,
              message: ErrorLog(className, funcName, 4, message),
            })
            return true
          })

        if (typeof doc === 'boolean') {
          return // end
        }

        if (!doc) {
          // 503
          const message = 'Firebase Error: Not found user in Users Collection.'
          error({
            statusCode: 503,
            message: ErrorLog(className, funcName, 5, message),
          })
          return
        }

        const user = doc.data() as User
        if (user.status === USER_STATUSES.PRE_SIGNUP) {
          redirect('/signup/profile')
        } else {
          const source = sourceState.source
          clearSource()
          redirect(source || '/')
        }

        const loginLog: LoginLog = { ...blankLoginLog }
        loginLog.userId = uid
        loginLog.userAgent = window.navigator.userAgent

        const currentTime = firebase.firestore.FieldValue.serverTimestamp()
        db.collection('login_logs')
          .add({
            ...loginLog,
            createdAt: currentTime,
            updatedAt: currentTime,
          })
          .catch((error) => {
            let message = 'Login logs error. : '
            message += error.code ? ` ${error.code} ` : ''
            message += error.message ? `${error.message}` : ''
            console.log(message)
          })
      } else {
        state.processing = false
      }
    }

    return {
      state,
      mounted,
      doLogin,
    }
  },
})
</script>
