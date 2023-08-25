<template>
  <q-page>
    <div class="main-content">
      <h4>{{ $t("visitorCardsTitle") }}</h4>
      <hr class="hr" />
      <q-btn
        class="add-visit-button"
        color="primary"
        :label="$t('addVisitButton')"
        @click="showDialog = true"
      ></q-btn>

      <div class="visitor-cards">
        <VisitorCard
          v-for="card in paginatedCards"
          :key="card.uuid"
          :visitor="card"
        />
      </div>

      <div class="pagination-container">
        <q-pagination
          v-model="currentPage"
          :max="totalPages"
          direction-links
          outline
          color="orange"
          active-design="unelevated"
          active-color="primary"
          active-text-color="orange"
          @update:modelValue="pageChanged"
        />
      </div>

      <VisitorCardDialog
        :show="showDialog"
        @save="saveVisit"
        @update:show="showDialog = $event"
      />
    </div>
  </q-page>
</template>

<script>
import { mapState, mapActions } from "vuex";
import VisitorCard from "../components/VisitorCard.vue";
import VisitorCardDialog from "src/components/VisitorCardDialog.vue";

export default {
  name: "CardPage",
  components: {
    VisitorCard,
    VisitorCardDialog,
  },
  data() {
    return {
      showDialog: false,
      currentPage: 1,
      itemsPerPage: 6,
      totalPages: 0,
    };
  },
  computed: {
    ...mapState(["cards", "totalCards"]),
    paginatedCards() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = this.currentPage * this.itemsPerPage;
      return this.cards.slice(start, end);
    },
  },
  methods: {
    ...mapActions(["fetchCards", "addCard", "updateCard", "deleteCard"]),
    fetchAllCards() {
      this.fetchCards().then(() => {
        this.totalPages = Math.ceil(this.cards.length / this.itemsPerPage);
      });
    },

    pageChanged(page) {
      this.$router.push({ query: { page: page } });
      this.fetchAllCards();
    },

    saveVisit(newVisit) {
      this.addCard(newVisit)
        .then(() => {
          this.$q.notify("Карточка добавлена");
          this.showDialog = false;
        })
        .catch(() => {
          this.$q.notify({
            color: "negative",
            message: "Ошибка при добавлении карточки",
          });
        });
    },
  },
  created() {
    if (this.$route.query.page) {
      this.currentPage = parseInt(this.$route.query.page, 10) || 1;
    }
    this.fetchAllCards();
  },
};
</script>

<style>
.pagination-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.main-content {
  width: 100%;
  padding: 20px;
}

.add-visit-button {
  background-color: orange;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  margin-bottom: 20px;
}

.visitor-cards {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.hr {
  background-color: orange;
  height: 4px;
  border: none;
}
</style>
