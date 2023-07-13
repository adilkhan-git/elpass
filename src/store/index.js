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
    entrance: "Entrance1",
    direction: "Внутрь",
    similarity: 80,
  },
  {
    id: 2,
    dateTime: "2023-07-02 15:30",
    visitorId: 2,
    visitorName: "Анна Иванова",
    companyName: "АО Kcell",
    entrance: "Entrance1",
    direction: "Наружу",
    similarity: 95,
  },
  {
    id: 3,
    dateTime: "2023-07-03 14:15",
    visitorId: 3,
    visitorName: "Мария Сидорова",
    companyName: "ИП Семакина",
    entrance: "Entrance1",
    direction: "Внутрь",
    similarity: 70,
  },
  {
    id: 4,
    dateTime: "2023-07-04 11:30",
    visitorId: 4,
    visitorName: "Петр Иванов",
    companyName: "ООО Строитель",
    entrance: "Entrance1",
    direction: "Наружу",
    similarity: 85,
  },
  {
    id: 5,
    dateTime: "2023-07-05 09:45",
    visitorId: 5,
    visitorName: "Елена Петрова",
    companyName: "АО Телеком",
    entrance: "Entrance1",
    direction: "Внутрь",
    similarity: 90,
  },
  {
    id: 6,
    dateTime: "2023-07-01 10:13",
    visitorId: 6,
    visitorName: "Иван Петров",
    companyName: "ООО Road Construction",
    entrance: "Entrance1",
    direction: "Внутрь",
    similarity: 95,
  },
  {
    id: 7,
    dateTime: "2023-07-02 15:30",
    visitorId: 7,
    visitorName: "Казбек Азаматов",
    companyName: "АО Kcell",
    entrance: "Entrance1",
    direction: "Наружу",
    similarity: 99,
  },
  {
    id: 8,
    dateTime: "2023-07-03 14:15",
    visitorId: 8,
    visitorName: "Юлия Семакина",
    companyName: "ИП Семакина",
    entrance: "Entrance1",
    direction: "Внутрь",
    similarity: 93,
  },
  {
    id: 9,
    dateTime: "2023-07-04 11:30",
    visitorId: 9,
    visitorName: "Петр Иванов",
    companyName: "ООО Строитель",
    entrance: "Entrance1",
    direction: "Наружу",
    similarity: 89,
  },
  {
    id: 10,
    dateTime: "2023-07-05 09:45",
    visitorId: 10,
    visitorName: "Азамат Мауленов",
    companyName: "АО Телеком",
    entrance: "Entrance1",
    direction: "Внутрь",
    similarity: 94,
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
    addCard(state, card) {
      state.cards.push(card);
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
    addCard({ commit }, card) {
      axios
        .post("/cards", card)
        .then((response) => {
          commit("addCard", response.data);
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
