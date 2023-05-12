export const state = () => ({
  errorCode: null,
})

export const mutations = {
  setError(state, data) {
    state.errorCode = data
  },
}

export const actions = {
  setError({ commit }, data) {
    commit('setError', data)
  },
}
