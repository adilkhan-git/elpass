<template>
  <div id="app"></div>
  <div class="container">
    <h4>Отчет о посещениях</h4>
    <hr class="hr" />
    <h5>Список для отчета</h5>
    <div class="srch">
      <input type="search" placeholder="ID" v-model="searchId" />
      <input type="search" placeholder="ФИО" v-model="searchName" />
      <input type="search" placeholder="Дата с" v-model="searchDateFrom" />
      <input type="search" placeholder="Дата до" v-model="searchDateTo" />
      <button @click="clearFilters">Очистить</button>
    </div>

    <!-- Добавленная таблица -->
    <table class="report-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Дата</th>
          <th>ID</th>
          <th>Посетитель</th>
          <th>Вход</th>
          <th>Направление</th>
          <th>Сходство</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="visit in filteredVisits" :key="visit.id">
          <td>#(photo)</td>
          <td>{{ visit.dateTime }}</td>
          <td>{{ visit.visitorId }}</td>
          <td>{{ visit.visitorName }} ({{ visit.companyName }})</td>
          <td>{{ visit.entrance }}</td>
          <td>{{ visit.direction }}</td>
          <td>{{ visit.similarity }}%</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(axios);

const visits = [
  {
    id: 1,
    dateTime: "2023-07-01 10:00",
    visitorId: 1,
    visitorName: "Иван Петров",
    companyName: "ООО Road Construction",
    entrance: "1A",
    direction: "Внутрь",
    similarity: 80,
  },
  {
    id: 2,
    dateTime: "2023-07-02 15:30",
    visitorId: 2,
    visitorName: "Анна Иванова",
    companyName: "АО Kcell",
    entrance: "2B",
    direction: "Наружу",
    similarity: 95,
  },
  // Добавьте остальные данные о посещениях по аналогии
];

mock.onGet("/visits").reply(200, visits);

export default {
  data() {
    return {
      searchId: "",
      searchName: "",
      searchDateFrom: "",
      searchDateTo: "",
    };
  },
  computed: {
    filteredVisits() {
      return visits.filter((visit) => {
        const idMatch =
          visit.visitorId.toString().toLowerCase() ===
          this.searchId.toLowerCase();
        const nameMatch = visit.visitorName
          .toLowerCase()
          .includes(this.searchName.toLowerCase());
        const dateMatchFrom =
          !this.searchDateFrom ||
          visit.dateTime >= new Date(this.searchDateFrom).toISOString();
        const dateMatchTo =
          !this.searchDateTo ||
          visit.dateTime <= new Date(this.searchDateTo).toISOString();
        return idMatch && nameMatch && dateMatchFrom && dateMatchTo;
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

<style>
.container {
  padding: 15px;
}

.srch {
  display: flex;
  gap: 40px;
  justify-content: flex-start;
}

.hr {
  background-color: orange;
  height: 4px;
  border: none;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.report-table th,
.report-table td {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: left;
}

.report-table th {
  background-color: #f2f2f2;
}

.report-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}
</style>
