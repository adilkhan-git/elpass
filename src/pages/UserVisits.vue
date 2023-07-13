<template>
  <div class="main-content">
    <h4>Отчет о посещениях</h4>
    <hr class="hr" />
    <div class="search-bar">
      <input type="text" placeholder="ID" v-model="searchId" />
      <input type="text" placeholder="ФИО" v-model="searchName" />
      <input type="text" placeholder="Дата с" v-model="searchDateFrom" />
      <input type="text" placeholder="Дата до" v-model="searchDateTo" />
      <q-btn flat label="Очистить" @click="clearFilters" />
    </div>

    <q-table
      :rows="filteredVisits"
      :columns="columns"
      row-key="id"
      :rows-per-page-options="[10, 15, 20]"
    >
      <template v-slot:body-cell-entrance="{ props }">
        {{ props.row.entrance }}
      </template>
      <template v-slot:body-cell-direction="{ props }">
        {{ props.row.direction }}
      </template>
      <template v-slot:body-cell-similarity="{ props }">
        {{ props.row.similarity }}%
      </template>
    </q-table>
  </div>
</template>
<script>
import { mapState } from "vuex";
import axios from "axios";

export default {
  name: "UserVisits",
  data() {
    return {
      searchId: "",
      searchName: "",
      searchDateFrom: "",
      searchDateTo: "",
      columns: [
        {
          name: "id",
          required: true,
          label: "ID",
          align: "left",
          field: "id",
          sortable: true,
        },
        {
          name: "dateTime",
          required: true,
          label: "Дата",
          align: "left",
          field: "dateTime",
          sortable: true,
        },
        {
          name: "visitorId",
          required: true,
          label: "Id посетителя",
          align: "left",
          field: "visitorId",
          sortable: true,
        },
        {
          name: "visitorName",
          required: true,
          label: "Посетитель",
          align: "left",
          field: "visitorName",
          sortable: true,
        },
        {
          name: "entrance",
          required: true,
          label: "Вход",
          align: "left",
          field: "entrance",
          sortable: true,
        },
        {
          name: "direction",
          required: true,
          label: "Направление",
          align: "left",
          field: "direction",
          sortable: true,
        },
        {
          name: "similarity",
          required: true,
          label: "Сходство",
          align: "left",
          field: "similarity",
          sortable: true,
        },
      ],
    };
  },

  computed: {
    ...mapState(["visits"]),
    filteredVisits() {
      return this.visits.filter((visit) => {
        const queryId = this.searchId.toLowerCase();
        const queryName = this.searchName.toLowerCase();
        const queryDateFrom = this.searchDateFrom.toLowerCase();
        const queryDateTo = this.searchDateTo.toLowerCase();

        return (
          visit.id.toString().includes(queryId) &&
          visit.visitorName.toLowerCase().includes(queryName) &&
          visit.dateTime.includes(queryDateFrom) &&
          visit.dateTime.includes(queryDateTo)
        );
      });
    },
  },
  methods: {
    clearFilters() {
      this.searchId = "";
      this.searchName = "";
      this.searchDateFrom = "";
      this.searchDateTo = "";
    },
  },
};
</script>

<style scoped>
.main-content {
  width: 100%;
  padding: 30px;
}

.search-bar {
  margin-bottom: 20px;
  display: flex;
  gap: 15px;
}

.clear-button {
  margin-top: 7px;
}

.q-table__container {
  overflow-x: auto;
}

.q-table__middle.scroll {
  height: calc(100vh - 250px);
}
</style>
