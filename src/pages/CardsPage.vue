<template>
  <div id="app">
    <div class="main-content">
      <h4>Карточки посетителей</h4>
      <hr class="hr" />
      <q-btn
        v-if="isAdmin || isOperator"
        class="add-visit-button"
        color="primary"
        label="Добавить посещение"
        @click="showDialog = true"
      ></q-btn>

      <div class="search-bar">
        <input type="text" placeholder="Имя" v-model="searchName" />
        <input type="text" placeholder="Фамилия" v-model="searchLastName" />
        <input type="text" placeholder="ID" v-model="searchId" />
        <input type="text" placeholder="Телефон" v-model="searchPhone" />
        <input type="text" placeholder="ИИН" v-model="searchIin" />
      </div>

      <div class="visitor-cards">
        <VisitorCard
          v-for="visitor in filteredVisitors"
          :key="visitor.id"
          :visitor="visitor"
          @delete="deleteVisitor(visitor.id)"
          @update="updateVisitor"
        />
      </div>
    </div>

    <VisitorCardDialog
      :show="showDialog"
      @save="saveVisit"
      @update:show="showDialog = $event"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
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
      searchName: "",
      searchLastName: "",
      searchId: "",
      searchPhone: "",
      searchIin: "",
      showModal: false,
      newVisit: {
        firstName: "",
        lastName: "",
        iin: "",
        phoneNumber: "",
        company: "",
        position: "",
        type: "",
      },
    };
  },
  computed: {
    ...mapState(["cards", "user"]),
    isAdmin() {
      return this.user && this.user.role === "admin";
    },
    isOperator() {
      return this.user && this.user.role === "operator";
    },
    isEmployee() {
      return this.user && this.user.role === "employee";
    },

    filteredVisitors() {
      return this.cards.filter((visitor) => {
        const queryName = this.searchName.toLowerCase();
        const queryLastName = this.searchLastName.toLowerCase();
        const queryId = this.searchId.toLowerCase();
        const queryPhone = this.searchPhone.toLowerCase();
        const queryIin = this.searchIin.toLowerCase();
        const nameMatches = visitor.firstName.toLowerCase().includes(queryName);
        const lastNameMatches = visitor.lastName
          .toLowerCase()
          .includes(queryLastName);
        const idMatches = visitor.id.toString().includes(queryId);
        const phoneMatches = visitor.phoneNumber
          .toLowerCase()
          .includes(queryPhone);
        const iinMatches = visitor.iin.includes(queryIin);
        return (
          nameMatches &&
          lastNameMatches &&
          idMatches &&
          phoneMatches &&
          iinMatches
        );
      });
    },
  },
  methods: {
    ...mapActions(["fetchCards", "addCard", "updateCard", "deleteCard"]),
    deleteVisitor(id) {
      this.deleteCard(id);
    },
    updateVisitor(visitor) {
      this.updateCard(visitor);
    },
    closeModal() {
      this.showModal = false;
      this.resetForm();
    },
    resetForm() {
      this.newVisit = {
        firstName: "",
        lastName: "",
        iin: "",
        phoneNumber: "",
        company: "",
        position: "",
        type: "",
      };
    },
    saveVisit(newVisit) {
      this.addCard(newVisit)
        .then(() => {
          console.log("Карточка добавлена");
          this.closeModal();
        })
        .catch((error) => {
          console.error("Ошибка");
        });
      this.showDialog = false;
    },
    addVisit() {
      this.saveVisit();
    },
  },
  created() {
    this.fetchCards();
  },
};
</script>

<style>
#app {
  display: flex;
}

.main-content {
  width: 100%;
  padding: 30px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
}

.modal-content h2 {
  margin-bottom: 10px;
}

.modal-content form input {
  margin-bottom: 10px;
  padding: 5px;
}

.modal-content form button {
  background-color: orange;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  margin-right: 10px;
}

.modal-content form button:last-child {
  background-color: rgb(68, 68, 68);
}

.user-name {
  font-weight: bold;
}

.online-status {
  display: flex;
  align-items: center;
  color: white;
  font-size: 12px;
}

.search-bar {
  margin-bottom: 20px;

  display: flex;
  gap: 15px;
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
