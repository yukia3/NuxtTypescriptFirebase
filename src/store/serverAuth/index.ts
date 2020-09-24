export const state = () => ({
  uid: '',
})

export const mutations = {
  saveUID(state: any, uid: string) {
    state.uid = uid
  },
  clearUID(state: any) {
    state.uid = ''
  },
}
