<template>
  <div class="main-content">
    <h4>Отчет о посещениях</h4>
    <hr class="hr" />

    <div class="search-bar">
      <input type="text" placeholder="ID" v-model="searchId" />
      <input type="text" placeholder="ФИО" v-model="searchName" />
      <input type="text" placeholder="Дата с" v-model="searchDateFrom" />
      <input type="text" placeholder="Дата до" v-model="searchDateTo" />
      <q-btn color="primary" label="Очистить" @click="clearFilters" />
    </div>

    <q-table :rows="filteredVisits" :columns="columns" row-key="id">
      <template v-slot:body-cell[id]="{ props }">
        {{ props.row.id }}
      </template>
      <template v-slot:body-cell[dateTime]="{ props }">
        {{ props.row.dateTime }}
      </template>
      <template v-slot:body-cell[visitorId]="{ props }">
        {{ props.row.visitorId }}
      </template>
      <template v-slot:body-cell[visitorName]="{ props }">
        {{ props.row.visitorName }}
      </template>
      <template v-slot:body-cell[entrance]="{ props }">
        {{ props.row.entrance }}
      </template>
      <template v-slot:body-cell[direction]="{ props }">
        {{ props.row.direction }}
      </template>
      <template v-slot:body-cell[similarity]="{ props }">
        {{ props.row.similarity }}%
      </template>
    </q-table>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import axios from "axios";

export default {
  name: "UserVisits",
  data() {
    return {
      searchId: "",
      searchName: "",
      searchDateFrom: "",
      searchDateTo: "",
    };
  },
  computed: {
    ...mapState({
      visits: (state) => state.visits,
    }),
    columns() {
      return [
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
      ];
    },
    filteredVisits() {
      const filtered = this.visits.filter((visit) => {
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

      return filtered;
    },
  },
  created() {
    this.fetchVisits();
  },
  methods: {
    ...mapActions(["fetchVisits"]),
    loadVisits() {
      axios
        .get("/visits")
        .then((response) => {
          this.visits = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
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

.q-table__container {
  overflow-x: auto;
}

.q-table__middle.scroll {
  height: calc(100vh - 250px);
}
</style>
