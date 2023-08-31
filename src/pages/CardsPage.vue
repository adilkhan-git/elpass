<template lang="pug">
q-page.q-pa-lg

  //- .text-h5.text-weight-bold {{ $t("Cards")  }}

  

  q-table.q-my-md(
    :title="$t('Cards')"
    :rows="cards"
    row-key="uuid"
    hide-header
    :columns="columns"
    Zvirtual-scroll
    dense flat bordered
    v-model:pagination="pagination"
    :loading="loading"
    :filter="filter"
    @request="handleGetCards")
    template(v-slot:top-right)
      .q-mt-md.row.q-gutter-sm.items-start
        q-btn(color='primary' unelevated Zdense icon="add" no-caps :label="$t('Add Card')" @click='showDialog = true')
        
        q-input(dense square filled v-model='filterNo' placeholder='No')
        q-input(dense square filled v-model="filterUuid" placeholder='UUID')
        q-input(dense square filled v-model='filter' placeholder='Name' debounce="300")
          template(v-slot:append)
            q-icon(name="search" @click='handleGetCards')
        //- q-btn(color='primary' dense icon-right="add" no-caps :label="$t('Add Card')" @click='showDialog = true')

    template(v-slot:body="props")
      q-tr 
        q-td: q-avatar: img(:src="'https://astanahub.elpass.uz/storage/visits/red/'+props.row.photo+'_.jpg'")
        q-td 
          .text-weight-bold {{ props.row.name  }} 
          | {{ props.row.no  }}
        q-td {{ props.row.group  }}
        q-td 
          q-badge {{ props.row.isOK  }}
          .text-weight-bold {{ props.row.uuid }}
        q-td {{ formatDateTime(props.row.created_at)  }}
        q-td {{ formatDateTime(props.row.begin_at)  }} {{ formatDateTime(props.row.end_at)  }}
        q-td
          template(v-if='isAdmin')
            q-icon(flat dense size="sm" name='edit' color='orange' @click='editCard(props.row.uuid)' label="Edit")
            q-icon(flat dense size="sm" name='delete' color='negative' @click='deleteCard(props.row.uuid)' label="Delete")
        
    template(v-slot:no-data="{ icon, message, filter }")
        .full-width.row.flex-center.text-accent.q-gutter-sm No Data 
        
  //- q-pagination(v-model='pagination.page' :max='totalPages' direction-links boundary-links boundary-numbers :max-pages='6' outline color='orange' active-design='unelevated' active-color='primary' active-text-color='orange' @update:modelValue='handleGetCards')

    //- VisitorCard(v-for='card in cards' :key='card.uuid' :visitor='card' @delete='handleDeleteCard')
  VisitorCardDialog(:show='showDialog' @save='handleSaveCard' @update:show='showDialog = $event')
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
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
      loading: false,
      pagination:{
        sortBy: 'desc',
        descending: false,
        page: parseInt(this.$route.query.page, 10) || 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },
      filterUuid: this.$route.query.uuid || "",
      filter: this.$route.query.name || "",
      filterNo: this.$route.query.no || "",
      columns: [
        {
          label: "Name", align: "left",'width': '40%'
        },
        {
          label: "group", align: "left",
        },
        {
          label: "upload",
        },
        {
          name: "actions",
          label: "actions",
        }
      ],
    };
  },
  computed: {
    ...mapState(["cards", "totalCards","user"]),
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
  },
  methods: {
    ...mapActions(["fetchCards", "addCard", "updateCard", "deleteCard"]),
    formatDateTime(dateTime) {
      return new Date(dateTime).toLocaleString("ru-RU", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        day: "numeric",
        month: "short",
        year: "2-digit",
      });
    },
    deleteCard(uuid){
      console.log(uuid);
    },
    editCard(uuid){
      console.log(uuid);
    },
    handleDeleteCard(uuid) {
      this.deleteCard(uuid);
    },
    handleSaveCard(newVisit) {
      this.addCard(newVisit).then(() => {
        this.showDialog = false;
      })
    },
    handleGetCards(props){

      if(props) {
        this.pagination = props.pagination
        const filter = props.filter
        console.log('page',this.pagination.page);
      }

      this.$router.push({ path: "/cards", query: this.filterQuery });

      this.loading = true
      
      this.fetchCards({
        page: this.pagination.page,
        limit: this.pagination.rowsPerPage,
        filters: {
          uuid: this.filterUuid,
          name: this.filter,
          no: this.filterNo,
        },
      }).then((data)=>{
        this.pagination.rowsNumber = data.totalCards
        // this.pagination.page = page
        // this.pagination.sortBy = sortBy
        // this.pagination.descending = descending
      }).finally(()=>{
        this.loading = false
      });
    }
  },
  created() {
    this.handleGetCards();
  },
};
</script>

<style lang="stylus">


</style>
