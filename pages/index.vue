<template>
  <div>
    <div v-if="isAuthenticated">
      <p class="title is-s is-spaced">{{ $store.getters.getUserName }}さん</p>
      <button class="button is-primary is-rounded" @click="logout">
        ログアウト
      </button>
    </div>
    <div v-else class="container">
      <button class="button is-primary is-rounded" @click="login">
        ログイン
      </button>
    </div>
    <table class="table is-narrow">
      <thead>
        <tr>
          <th>title</th>
          <th>price</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="favorite in $store.getters.getFavorites"
          :key="favorite.title"
        >
          <td>{{ favorite.title }}</td>
          <td>{{ favorite.price }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  created() {
    this.$store.dispatch('fetchFavorites')
  },
  methods: {
    login() {
      console.log('login')
      this.$store.dispatch('login')
    },
    logout() {
      console.log('logout')
      this.$store.dispatch('logout')
    },
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
