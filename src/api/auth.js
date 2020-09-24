const admin = require('firebase-admin')

// The Firebase Admin SDK is used here to verify the ID token.
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: process.env.DATABASEURL,
  })
}

function getIdToken(req) {
  // Parse the injected ID token from the request header.
  const authorizationHeader = req.headers.authorization || ''
  const components = authorizationHeader.split(' ')
  return components.length > 1 ? components[1] : ''
}

export default async function (req, _res, next) {
  // /_nuxt/以下ファイルで実行しない
  if (req.url.includes('_nuxt')) {
    return next()
  }

  const idToken = getIdToken(req)

  if (idToken) {
    try {
      const decodedClaims = await admin.auth().verifyIdToken(idToken)

      // 最新のUserData取得
      const userData = await admin.auth().getUser(decodedClaims.uid)
      if (userData) {
        const data = userData.toJSON()
        delete data.passwordHash
        delete data.passwordSalt
        delete data.tokensValidAfterTime
        req.authUser = data
      }
    } catch (e) {
      delete req.authUser
    }
  }

  next()
}
