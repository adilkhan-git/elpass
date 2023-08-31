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
      <input v-model="filterUuid" placeholder="UUID filter" />
      <input v-model="filterName" placeholder="Name filter" />
      <input v-model="filterNo" placeholder="No filter" />
      <q-btn @click="applyFilters">Apply Filters</q-btn>

      <div class="visitor-cards">
        <VisitorCard
          v-for="card in cards"
          :key="card.uuid"
          :visitor="card"
          @delete="handleDeleteCard"
        />
      </div>

      <div class="pagination-container">
        <q-pagination
          v-model="currentPage"
          :max="totalPages"
          direction-links
          boundary-links
          boundary-numbers
          :max-pages="12"
          outline
          color="orange"
          active-design="unelevated"
          active-color="primary"
          active-text-color="orange"
          @update:modelValue="handlePageChange"
        />
      </div>

      <VisitorCardDialog
        :show="showDialog"
        @save="handleSaveVisit"
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
      itemsPerPage: 10,
      filterUuid: "",
      filterName: "",
      filterNo: "",
    };
  },
  computed: {
    ...mapState(["cards", "totalCards"]),
    totalPages() {
      return Math.ceil(this.totalCards / this.itemsPerPage);
    },
  },
  methods: {
    ...mapActions(["fetchCards", "addCard", "updateCard", "deleteCard"]),
    async handleDeleteCard(uuid) {
      try {
        await this.deleteCard(uuid);
        this.$q.notify({
          color: "positive",
          message: "Карточка успешно удалена",
        });
      } catch (error) {
        this.$q.notify({
          color: "negative",
          message: "Ошибка при удалении карточки",
        });
      }
    },
    buildFilterQuery() {
      let query = {};

      if (this.filterUuid) query.uuid = this.filterUuid;
      if (this.filterName) query.name = this.filterName;
      if (this.filterNo) query.no = this.filterNo;
      query.page = this.currentPage;

      return query;
    },
    applyFilters() {
      this.$router
        .push({ path: "/cards", query: this.buildFilterQuery() })
        .catch((err) => console.error("Router error:", err));
    },

    handlePageChange(page) {
      this.currentPage = page;
      this.$router
        .push({ path: "/cards", query: this.buildFilterQuery() })
        .catch((err) => console.error("Router error:", err));
    },
    handleSaveVisit(newVisit) {
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
  watch: {
    "$route.query": {
      immediate: true,
      handler() {
        this.filterUuid = this.$route.query.uuid || "";
        this.filterName = this.$route.query.name || "";
        this.filterNo = this.$route.query.no || "";
        this.currentPage = parseInt(this.$route.query.page, 10) || 1;

        this.fetchCards({
          page: this.currentPage,
          limit: this.itemsPerPage,
          filters: {
            uuid: this.filterUuid,
            name: this.filterName,
            no: this.filterNo,
          },
        });
      },
    },
  },
  created() {
    // this.fetchCards({ page: this.currentPage, limit: this.itemsPerPage }); // TJ: ненужно так как сверху в ватчере стоит immediate: true
  },
};
</script>

<style>
.search-container {
  display: flex;
  gap: 15px;
}
.pagination-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
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
