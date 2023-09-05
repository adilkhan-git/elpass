<template lang="pug">
q-page.q-pa-lg
  q-table.q-my-md(
    :title="$t('Cards')",
    :rows="cards",
    row-key="uuid",
    hide-header,
    virtual-scroll,
    dense,
    flat,
    bordered,
    v-model:pagination="pagination",
    :loading="loading",
    :filter="filter",
    @request="handleGetCards"
  )
    template(v-slot:header)
      q-tr
        q-th Name
        q-th Group
        q-th Upload
        q-th Actions

    template(v-slot:top-right)
      .q-mt-md.row.q-gutter-sm.items-start
        q-btn(
          color="primary",
          unelevated,
          dense,
          icon="add",
          no-caps,
          :label="$t('Add Card')",
          
        )
        q-input(dense, square, filled, v-model="filterNo", placeholder="No")
        q-input(
          dense,
          square,
          filled,
          v-model="filterUuid",
          placeholder="UUID"
        )
        q-input(
          dense,
          square,
          filled,
          v-model="filter",
          placeholder="Name",
          debounce="300"
        )
          template(v-slot:append)
            q-icon(name="search", @click="handleGetCards")

    template(v-slot:body="props")
      q-tr
        q-td: q-avatar: img(
          :src="'https://astanahub.elpass.uz/storage/visits/red/' + props.row.photo + '_.jpg'"
        )
        q-td
          .text-weight-bold {{ props.row.name }}
          | {{ props.row.no }}
        q-td {{ props.row.group }}
        q-td
          q-badge {{ props.row.isOK }}
          .text-weight-bold {{ props.row.uuid }}
        q-td {{ formatDate(props.row.created_at) }}
        q-td {{ formatDate(props.row.begin_at) }} {{ formatDate(props.row.end_at) }}

        q-td
          template(v-if="isAdmin")
            q-icon(
              flat,
              dense,
              size="sm",
              name="edit",
              color="orange",
              @click="editCard(props.row.uuid)",
              label="Edit"
            )
            q-icon(
              flat,
              dense,
              size="sm",
              name="delete",
              color="negative",
              @click="deleteCard(props.row.uuid)",
              label="Delete"
            )

    template(v-slot:no-data="{ icon, message, filter }")
      .full-width.row.flex-center.text-accent.q-gutter-sm No Data

    //- VisitorCardDialog(
    //-   :show="showDialog",
    //-   :visitor="selectedVisitor",
    //-   @update:show="handleUpdateShow",
    //-   @save="handleSave"
    //- )
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import VisitorCardDialog from "src/components/VisitorCardDialog.vue";
import { date } from "quasar";

export default {
  name: "CardPage",
  components: {
    VisitorCardDialog,
  },
  data() {
    return {
      selectedCard: {},
      loading: false,
      pagination: {
        sortBy: "desc",
        descending: false,
        page: parseInt(this.$route.query.page, 10) || 1,
        rowsPerPage: 10,
        rowsNumber: 10,
      },
      filterUuid: this.$route.query.uuid || "",
      filter: this.$route.query.name || "",
      filterNo: this.$route.query.no || "",
    };
  },
  computed: {
    ...mapState(["cards", "totalCards", "user"]),
    ...mapGetters(["isAdmin"]),
    totalPages() {
      return Math.ceil(this.totalCards / this.pagination.rowsPerPage);
    },
    filterQuery() {
      let query = {};

      if (this.filterUuid) query.uuid = this.filterUuid;
      if (this.filterName) query.name = this.filterName;
      if (this.filterNo) query.no = this.filterNo;
      query.page = this.pagination.page;

      return query;
    },
    formatDate() {
      return (dateTime) => {
        return date.formatDate(dateTime, "DD MMM YY HH:mm");
      };
    },
  },
  methods: {
    ...mapActions(["fetchCards", "upsertCard", "deleteCard"]),

    deleteCard(uuid) {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Do you really want to delete this card?",
          ok: {
            label: "Yes",
            unelevated: true,
            color: "positive",
          },
          cancel: {
            label: "No",
            color: "negative",
          },
        })
        .onOk(() => {
          this.$store
            .dispatch("deleteCard", uuid)
            .then(() => {
              this.$q.notify({
                color: "green-4",
                textColor: "white",
                icon: "info",
                message: "Card deleted successfully",
              });
              this.handleGetCards();
            })
            .catch((error) => {
              console.error("Error deleting card:", error);
              this.$q.notify({
                color: "red-4",
                textColor: "white",
                icon: "warning",
                message: "Failed to delete card",
              });
            });
        })
        .onCancel(() => {
          // User cancelled the action
        });
    },

    async handleSaveCard(card) {
      try {
        await this.upsertCard(card);
        this.$q.notify({
          color: "green-4",
          textColor: "white",
          icon: "info",
          message: card.uuid
            ? "Card updated successfully"
            : "Card added successfully",
        });
      } catch (error) {
        this.$q.notify({
          color: "red-4",
          textColor: "white",
          icon: "warning",
          message: card.uuid ? "Failed to update card" : "Failed to add card",
        });
        console.error(error);
      } finally {
        this.showDialog = false;
        this.handleGetCards();
      }
    },

    handleGetCards(props) {
      if (props) {
        this.pagination = props.pagination;
        const filter = props.filter;
        console.log("page", this.pagination.page);
      }

      this.$router.push({ path: "/cards", query: this.filterQuery });

      this.loading = true;

      this.fetchCards({
        page: this.pagination.page,
        limit: this.pagination.rowsPerPage,
        filters: {
          uuid: this.filterUuid,
          name: this.filter,
          no: this.filterNo,
        },
      })
        .then((data) => {
          this.pagination.rowsNumber = data.totalCards;
          // this.pagination.page = page
          // this.pagination.sortBy = sortBy
          // this.pagination.descending = descending
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  created() {
    this.handleGetCards();
  },
};
</script>

<style lang="stylus"></style>
