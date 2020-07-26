<template>
  <div>
    <div v-if="isAuthenticated">
      <span class="title is-s">{{ $store.getters.getUserName }}さん</span>
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
          <th>物件名</th>
          <th>価格</th>
          <th>管理費等</th>
          <th>修繕積立金</th>
          <th>35年ローン総額</th>
          <th>月の支払い額</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="favorite in $store.getters.getFavorites" :key="favorite.id">
          <td>{{ favorite.name }}</td>
          <td>{{ favorite.price | addComma }}</td>
          <td>{{ favorite.managementFee | addComma }}</td>
          <td>{{ favorite.renovationJackpot | addComma }}</td>
          <td>
            {{
              totalCost(
                favorite.price,
                favorite.managementFee,
                favorite.renovationJackpot
              ) | addComma
            }}
          </td>
          <td>
            {{
              monthlyAmount(
                favorite.price,
                favorite.managementFee,
                favorite.renovationJackpot
              ) | addComma
            }}
          </td>
          <td><a :href="favorite.url"> リンク </a></td>
        </tr>
      </tbody>
    </table>
    <button class="button is-primary" @click="addFavorite()">追加</button>
    <b-modal :active.sync="isModalActive" has-modal-card>
      <add-favorite></add-favorite
    ></b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import addFavoriteModal from '@/components/addFavoriteModal'
const LOAN_YEARS = 35
const MONTHS = 12
export default {
  data() {
    return {
      isModalActive: false,
    }
  },
  created() {
    this.$store.dispatch('fetchFavorites')
  },
  methods: {
    addFavorite() {
      this.isModalActive = true
    },
    login() {
      console.log('login')
      this.$store.dispatch('login')
      this.$store.dispatch('fetchFavorites')
    },
    logout() {
      console.log('logout')
      this.$store.dispatch('logout')
    },
    totalCost(price, managementFee, renovationJackpot) {
      const totalManagementFee = managementFee * LOAN_YEARS * MONTHS
      const totalRenovationJackpot = renovationJackpot * LOAN_YEARS * MONTHS
      return (
        this.costByInterest(price) * (LOAN_YEARS * MONTHS) +
        totalManagementFee +
        totalRenovationJackpot
      )
    },
    monthlyAmount(price, managementFee, renovationJackpot) {
      return Math.floor(
        this.totalCost(price, managementFee, renovationJackpot) /
          (LOAN_YEARS * MONTHS)
      )
    },

    // （例）借入金1000万円，利率年3.0%，返済期間20年の場合の
    // 【１行数式】10000000*3/100/12*(1+3/12/100)^(20*12)/((1+3/100/12)^(20*12)-1)
    costByInterest(price) {
      const yearlyInterestRate = 0.00725
      const monthryInterenstRate = yearlyInterestRate / MONTHS
      const that = (1 + monthryInterenstRate) ** (LOAN_YEARS * MONTHS)

      return Math.floor((price * monthryInterenstRate * that) / (that - 1))
    },
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  filters: {
    addComma(value) {
      return value.toLocaleString()
    },
  },
  components: {
    'add-favorite': addFavoriteModal,
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
