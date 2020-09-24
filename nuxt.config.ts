import { NuxtConfig } from '@nuxt/types'
import format from 'date-fns/format'

// Using .env file in nuxt.config.js
// See https://github.com/nuxt-community/dotenv-module#using-env-file-in-nuxtconfigjs
const dotenvPath = 'src/config/'
const dotenvFileName = `.env.${process.env.NODE_ENV}`
require('dotenv').config({
  path: dotenvPath,
  filename: dotenvFileName,
})

const config: NuxtConfig = {
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /*
   ** Change srcDir
   */
  srcDir: 'src/',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Global CSS
   */
  css: ['~/assets/css/main.scss', '~/assets/css/nuxt-typescript-firebase.scss'],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  // plugins: [],
  plugins: ['~plugins/vee-validate'],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxt/typescript-build',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    '@nuxtjs/composition-api',
    // Doc: https://github.com/nuxt-community/dotenv-module
    [
      '@nuxtjs/dotenv',
      {
        path: dotenvPath,
        filename: dotenvFileName,
      },
    ],
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://buefy.github.io/#/documentation
    [
      'nuxt-buefy',
      {
        css: false,
        defaultIconPack: 'fas',
        defaultDateFormatter: (date: Date) => format(date, 'YYYY年M月D日'),
        defaultDayNames: ['日', '月', '火', '水', '木', '金', '土'],
        defaultMonthNames: [
          '1月',
          '2月',
          '3月',
          '4月',
          '5月',
          '6月',
          '7月',
          '8月',
          '9月',
          '10月',
          '11月',
          '12月',
        ],
        defaultUseHtml5Validation: false,
      },
    ],
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    // https://baianat.github.io/vee-validate/examples/nuxt.html
    transpile: ['vee-validate/dist/rules'],
  },
  serverMiddleware: ['~/api/auth'],
  pwa: {
    workbox: {
      offline: false,
      importScripts: [
        'https://www.gstatic.com/firebasejs/7.2.1/firebase-app.js',
        'https://www.gstatic.com/firebasejs/7.2.1/firebase-auth.js',
      ],
      workboxExtensions: ['~/sw/firebase'],
      dev: true,
    },
  },
}

export default config
