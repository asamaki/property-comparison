import firebase from '~/plugins/firebase'
const db = firebase.firestore()
const favoriteRef = db.collection('favorites')

export const state = () => ({
  userUid: '',
  userName: '',
  favorites: [],
})

export const mutations = {
  setUserUid(state, userUid) {
    state.userUid = userUid
  },
  setUserName(state, userName) {
    state.userName = userName
  },
  addFavorite(state, favorite) {
    state.favorites.push(favorite)
  },
  clearFavorites(state) {
    console.log('clearFavorites')

    state.favorites = []
  },
}

export const actions = {
  login({ commit }) {
    console.log('login action')
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        const user = result.user
        console.log('success : ' + user.uid + ' : ' + user.displayName)
        commit('setUserUid', user.uid)
        commit('setUserName', user.displayName)
      })
      .catch(function (error) {
        const errorCode = error.code
        console.log('error : ' + errorCode)
      })
  },
  logout({ commit }) {
    console.log('logout action')
    firebase
      .auth()
      .signOut()
      .then(() => {
        commit('setUserUid', null)
        commit('setUserName', null)
        commit('clearFavorites')
      })
      .catch((error) => {
        alert(error)
      })
  },
  fetchFavorites({ commit }) {
    favoriteRef
      .get()
      .then((res) => {
        commit('clearFavorites')
        res.forEach((doc) => {
          console.log('success : ' + `${doc.id} => ${doc.data()}`)
          commit('addFavorite', doc.data())
        })
      })
      .catch((error) => {
        console.log('error : ' + error)
      })
  },
  addFavorite({ commit }, favorite) {
    console.log('addFavorite')
    favoriteRef
      .add(favorite)
      .then((ref) => {
        console.log('Added document with ID: ', ref.id)
        commit('addFavorite', favorite)
      })
      .catch((err) => {
        throw new Error('ERROR HAPPENED.' + err)
      })
  },
}

export const getters = {
  getUserUid(state) {
    return state.userUid
  },
  getUserName(state) {
    return state.userName
  },
  getFavorites(state) {
    return state.favorites
  },
  isAuthenticated(state) {
    return !!state.userUid
  },
}
