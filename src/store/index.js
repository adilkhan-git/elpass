import { createStore } from "vuex";
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
  {
    id: 4,
    firstName: "dsa",
    lastName: "Сидорова",
    iin: "456789012345",
    phoneNumber: "+74567890123",
    company: "ИП Семакина",
    position: "Бухгалтер",
    type: "Временный",
    lastLogin: "2023-06-04",
  },
];

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
  
];

mock.onGet("/cards").reply(200, cards);
mock.onGet("/visits").reply(200, visits);

export default createStore({
  state: {
    cards: [],
    visits: [],
  },
  mutations: {
    setCards(state, cards) {
      state.cards = cards;
    },
    setVisits(state, visits) {
      state.visits = visits;
    },
  },
  actions: {
    fetchCards({ commit }) {
      axios
        .get("/cards")
        .then((response) => {
          commit("setCards", response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    fetchVisits({ commit }) {
      axios
        .get("/visits")
        .then((response) => {
          commit("setVisits", response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  getters: {
    getVisits: (state) => state.visits,
  },
});
