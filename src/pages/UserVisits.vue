<template lang="pug">
div.main-content
    h4 {{$t("visitsReport")}}
    hr.hr
    div.search-bar
      input(type="text", :placeholder="$t('ID')", v-model="searchId")
      input(type="text", :placeholder="$t('fullName')", v-model="searchName")
      input(type="text", :placeholder="$t('fromDate')", v-model="searchDateFrom")
      input(type="text", :placeholder="$t('toDate')", v-model="searchDateTo")
      q-btn(color="primary", :label="$t('clearFilters')", @click="clearFilters")
        
    q-table(:rows="filteredVisits", :columns="columns", row-key="id")
      template(v-slot:body-cell[id]="{ props }")
        | {{ props.row.id }}
      template(v-slot:body-cell[dateTime]="{ props }")
        | {{ props.row.dateTime }}
      template(v-slot:body-cell[visitorId]="{ props }")
        | {{ props.row.visitorId }}
      template(v-slot:body-cell[visitorName]="{ props }")
        | {{ props.row.visitorName }}
      template(v-slot:body-cell[entrance]="{ props }")
        | {{ props.row.entrance }}
      template(v-slot:body-cell[direction]="{ props }")
        | {{ props.row.direction }}
      template(v-slot:body-cell[similarity]="{ props }")
        | {{ props.row.similarity }}%
</template>
  
  <script>
  import { mapActions, mapState } from "vuex";
  
  function parseCustomDate(dateTimeStr) {
    if (!dateTimeStr) {
      return null;
    }
  
    const [date, time] = dateTimeStr.split(" ");
    if (!date || !time) {
      return null;
    }
  
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);
  
    return new Date(year, month - 1, day, hour, minute);
  }
  
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
      ...mapState(["visits"]),
      columns() {
        return [
          {
            name: "id",
            required: true,
            label: this.$t("columns.id"),
            align: "left",
            field: "id",
            sortable: true,
          },
          {
            name: "dateTime",
            required: true,
            label: this.$t("columns.dateTime"),
            align: "left",
            field: "dateTime",
            sortable: true,
          },
          {
            name: "visitorId",
            required: true,
            label: this.$t("columns.visitorId"),
            align: "left",
            field: "visitorId",
            sortable: true,
          },
          {
            name: "visitorName",
            required: true,
            label: this.$t("columns.visitorName"),
            align: "left",
            field: "visitorName",
            sortable: true,
          },
          {
            name: "entrance",
            required: true,
            label: this.$t("columns.entrance"),
            align: "left",
            field: "entrance",
            sortable: true,
          },
          {
            name: "direction",
            required: true,
            label: this.$t("columns.direction"),
            align: "left",
            field: "direction",
            sortable: true,
          },
          {
            name: "similarity",
            required: true,
            label: this.$t("columns.similarity"),
            align: "left",
            field: "similarity",
            sortable: true,
          },
        ];
      },
      queryId() {
        return this.searchId.toLowerCase();
      },
      queryName() {
        return this.searchName.toLowerCase();
      },
      queryDateFrom() {
        return this.searchDateFrom ? parseCustomDate(this.searchDateFrom) : null;
      },
      queryDateTo() {
        return this.searchDateTo ? parseCustomDate(this.searchDateTo) : null;
      },
      filteredVisits() {
        return this.visits.filter((visit) => {
          const visitDate = parseCustomDate(visit.dateTime);
          return (
            visit.id.toString().includes(this.queryId) &&
            visit.visitorName.toLowerCase().includes(this.queryName) &&
            (!this.searchDateFrom || visitDate >= this.queryDateFrom) &&
            (!this.searchDateTo || visitDate <= this.queryDateTo)
          );
        });
      },
    },
    created() {
      this.fetchVisits();
      console.log(this.visits);
    },
    methods: {
      ...mapActions(["fetchVisits"]),
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
  