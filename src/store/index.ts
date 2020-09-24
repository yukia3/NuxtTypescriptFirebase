export const actions = {
  async nuxtServerInit({ dispatch }: any, { req }: any) {
    const user = req.authUser || null

    if (user) {
      await dispatch('serverAuth/saveUID', user.uid)
    }
  },
}
