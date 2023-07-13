<template>
  <div id="app">
    <div class="main-content">
      <h4>Карточки посетителей</h4>
      <hr class="hr" />
      <button class="add-visit-button" @click="openModal">
        Добавить посещение
      </button>
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
          @delete="deleteVisitor"
        />
      </div>
    </div>

    <!-- Модальное окно -->
    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <h2>Заполните данные посещения</h2>
        <form @submit.prevent="addVisit">
          <input
            type="text"
            v-model="newVisit.firstName"
            placeholder="Имя"
            required
          />
          <input
            type="text"
            v-model="newVisit.lastName"
            placeholder="Фамилия"
            required
          />
          <input
            type="text"
            v-model="newVisit.iin"
            placeholder="ИИН"
            required
          />
          <input
            type="text"
            v-model="newVisit.phoneNumber"
            placeholder="Телефон"
            required
          />
          <input
            type="text"
            v-model="newVisit.company"
            placeholder="Компания"
            required
          />
          <input
            type="text"
            v-model="newVisit.position"
            placeholder="Должность"
            required
          />
          <input
            type="text"
            v-model="newVisit.type"
            placeholder="Тип"
            required
          />
          <button type="submit">Сохранить</button>
          <button @click="closeModal">Отмена</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import VisitorCard from "../components/VisitorCard.vue";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(axios);

const cards = [
  {
    id: 1,
    firstName: "Иван",
    lastName: "Петров",
    iin: "791225758965",
    phoneNumber: "+77478889977",
    company: "ООО Road Construction",
    position: "Менеджер",
    type: "Многоразовый",
    lastLogin: "2023-05-31",
  },
  {
    id: 2,
    firstName: "Анна",
    lastName: "Иванова",
    iin: "987654321098",
    phoneNumber: "+79876543210",
    company: "АО Kcell",
    position: "Разработчик",
    type: "Многоразовый",
    lastLogin: "2023-06-02",
  },
  {
    id: 3,
    firstName: "Мария",
    lastName: "Сидорова",
    iin: "456789012345",
    phoneNumber: "+74567890123",
    company: "ИП Семакина",
    position: "Бухгалтер",
    type: "Временный",
    lastLogin: "2023-06-04",
  },
];

mock.onGet("/cards").reply(200, cards);

export default {
  name: "App",
  components: {
    VisitorCard,
  },
  data() {
    return {
      visitors: [],
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
  created() {
    this.loadCards();
  },
  computed: {
    filteredVisitors() {
      return this.visitors.filter((visitor) => {
        const name =
          visitor.firstName.toLowerCase() +
          " " +
          visitor.lastName.toLowerCase();
        const queryName = this.searchName.toLowerCase();
        const queryLastName = this.searchLastName.toLowerCase();
        const queryId = this.searchId.toLowerCase();
        const queryPhone = this.searchPhone.toLowerCase();
        const queryIin = this.searchIin.toLowerCase();
        return (
          name.includes(queryName) &&
          visitor.lastName.toLowerCase().includes(queryLastName) &&
          visitor.id.toString().includes(queryId) &&
          visitor.phoneNumber.toLowerCase().includes(queryPhone) &&
          visitor.iin.includes(queryIin)
        );
      });
    },
  },
  methods: {
    deleteVisitor(id) {
      this.visitors = this.visitors.filter((visitor) => visitor.id !== id);
    },
    openModal() {
      this.showModal = true;
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
    addVisit() {
      const newVisitor = {
        id: this.visitors.length + 1,
        firstName: this.newVisit.firstName,
        lastName: this.newVisit.lastName,
        iin: this.newVisit.iin,
        phoneNumber: this.newVisit.phoneNumber,
        company: this.newVisit.company,
        position: this.newVisit.position,
        type: this.newVisit.type,
        lastLogin: new Date().toISOString().split("T")[0],
      };
      this.visitors.push(newVisitor);
      this.closeModal();
    },
    loadCards() {
      axios
        .get("/cards")
        .then((response) => {
          this.visitors = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
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
