<template lang="pug">
div#app
  div.main-content
    h4 {{ $t("visitorCardsTitle") }}
    hr.hr
    q-btn(
      class="add-visit-button",
      color="primary",
      :label="$t('addVisitButton')",
      @click="showDialog = true"
    )
    div.search-bar
      input(type="text", :placeholder="$t('searchPlaceholder.firstName')", v-model="searchName")
      input(type="text", :placeholder="$t('searchPlaceholder.lastName')", v-model="searchLastName")
      input(type="text", :placeholder="$t('searchPlaceholder.ID')", v-model="searchId")
      input(type="text", :placeholder="$t('searchPlaceholder.phoneNumber')", v-model="searchPhone")
      input(type="text", :placeholder="$t('searchPlaceholder.iin')", v-model="searchIin")

    div.visitor-cards
      VisitorCard(
        v-for="visitor in filteredVisitors",
        :key="visitor.id",
        :visitor="visitor",
        :photoUrl="visitor.photoUrl"
        @delete="deleteVisitor(visitor.id)"
        @update="updateVisitor"
      )

    VisitorCardDialog(
      :show="showDialog",
      @save="saveVisit",
      @update:show="showDialog = $event"
    )

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
        photoUrl: "",
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
        const safeToLower = (val) => (val ? val.toLowerCase() : "");
        const queryName = safeToLower(this.searchName);
        const queryLastName = safeToLower(this.searchLastName);
        const queryId = safeToLower(this.searchId);
        const queryPhone = safeToLower(this.searchPhone);
        const queryIin = safeToLower(this.searchIin);

        const nameMatches =
          visitor.firstName &&
          safeToLower(visitor.firstName).includes(queryName);
        const lastNameMatches =
          visitor.lastName &&
          safeToLower(visitor.lastName).includes(queryLastName);
        const idMatches =
          visitor.id && safeToLower(visitor.id.toString()).includes(queryId);
        const phoneMatches =
          visitor.phoneNumber &&
          safeToLower(visitor.phoneNumber).includes(queryPhone);
        const iinMatches =
          visitor.iin && safeToLower(visitor.iin).includes(queryIin);

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
      console.log("Photo URL in deleteVisitor:", this.photoUrl);
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
