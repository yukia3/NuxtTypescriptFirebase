import { Component, Vue } from 'nuxt-property-decorator'
import * as Vuex from 'vuex'
import firebase from '~/plugins/firebase'
import {
  ErrorLog,
  blankErrorLog,
} from '~/services/nuxt-typescript-firebase/models/error_log'
import { NUM_SHARDS_ERROR_LOG } from '~/types/common'

const db = firebase.firestore()

@Component({})
export default class ErrorHandlerMixin extends Vue {
  $store!: Vuex.ExStore

  async redirectToError(
    displayStatusCode: number,
    className: string,
    functionName: string,
    lineNumber: number,
    message: string
  ) {
    const consoleMessage = await this.saveErrorLog(
      className,
      functionName,
      lineNumber,
      message
    )

    this.$nuxt.error({
      statusCode: displayStatusCode,
      message: consoleMessage,
    })
  }

  async saveErrorLog(
    className: string,
    functionName: string,
    lineNumber: number,
    message: string
  ) {
    const currentTime = firebase.firestore.FieldValue.serverTimestamp()
    const userId = this.$store.getters['auth/uid']
      ? this.$store.getters['auth/uid']
      : 'guest'
    const errorLog: ErrorLog = {
      ...blankErrorLog,
      className,
      functionName,
      lineNumber,
      message,
      user_agent: window.navigator.userAgent,
      createdAt: currentTime,
      updatedAt: currentTime,
    }

    await db
      .collection('error_logs')
      .doc(this.getUserIndex())
      .collection('log_shards')
      .add(errorLog)
      .catch((_error) => {
        return false
      })

    return `[${class_name}_${function_name} ${line_number}]${message}  and error has occured during writing error_logs.`
  }

  createErrorMessage() {
    if (this.$store.getters['auth/isAuthenticated']) {
    }
  }

  getUserIndex() {
    if (this.$store.getters['auth/isAuthenticated']) {
      const index =
        Math.floor(
          parseInt(this.$store.getters['auth/uid'].replace(/[A-Z]|[a-z]/g, ''))
        ) % NUM_SHARDS_ERROR_LOG
      return index.toString(10)
    } else {
      return (NUM_SHARDS_ERROR_LOG - 1).toString(10)
    }
  }
}
