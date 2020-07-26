<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">物件を追加する</p>
    </header>
    <section class="modal-card-body">
      <b-field label="物件名">
        <b-input v-model="name" placeholder="〇〇マンション" required>
        </b-input>
      </b-field>
      <b-field label="価格">
        <b-input v-model="price" type="number" placeholder="10000000" required>
        </b-input>
      </b-field>
      <b-field label="管理費等">
        <b-input
          v-model="managementFee"
          type="number"
          placeholder="10000"
          required
        >
        </b-input>
      </b-field>
      <b-field label="修繕積立金">
        <b-input
          v-model="renovationJackpot"
          type="number"
          placeholder="10000"
          required
        >
        </b-input>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">
        キャンセル
      </button>
      <button class="button is-primary" @click="add()">追加</button>
    </footer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      name: '',
      price: '', // formにの初期値に空をいれるために数値型であるべきなのに空文字を指定している
      managementFee: '',
      renovationJackpot: '',
    }
  },
  methods: {
    add() {
      this.$store.dispatch('addFavorite', this.$data)
      this.$parent.close()
    },
  },
}
</script>
