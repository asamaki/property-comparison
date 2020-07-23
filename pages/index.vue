<template>
  <div>
    <div v-if="isAuthenticated">
      <p class="title is-1 is-spaced">user: {{ $store.getters.getUserName }}</p>
      <button class="button is-primary is-rounded" @click="logout">
        ログアウト
      </button>
    </div>
    <div v-else class="container">
      <button class="button is-primary is-rounded" @click="login">
        ログイン
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
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
