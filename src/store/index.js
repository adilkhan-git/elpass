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
];
const users = [
  {
    id: 1,
    email: "admin@gmail.com",
    password: "admin",
    role: "admin",
    phoneNumber: "+12345678901",
  },
  {
    id: 2,
    email: "operator@gmail.com",
    password: "operator",
    role: "operator",
    phoneNumber: "+23456789012",
  },
  {
    id: 3,
    email: "employee@gmail.com",
    password: "employee",
    role: "employee",
    phoneNumber: "+34567890123",
  },
];

mock.onGet("/cards").reply(200, cards);
mock.onGet("/visits").reply(200, visits);
mock.onPost("/cards").reply((config) => {
  const newCard = JSON.parse(config.data);
  const cardId = cards.length + 1;
  newCard.id = cardId;
  console.log(cards);
  cards.push(newCard);
  console.log("pushed");
  return [201, newCard];
});
mock.onDelete(/\/cards\/\d+/).reply(200);
mock.onPut(/\/cards\/\d+/).reply((config) => {
  const updatedCard = JSON.parse(config.data);
  const cardIndex = cards.findIndex((card) => card.id === updatedCard.id);
  if (cardIndex !== -1) {
    cards[cardIndex] = updatedCard;
    console.log("Card is updated");
    return [200, updatedCard];
  } else {
    return [404, { message: "Card not found" }];
  }
});
mock.onPost("/login").reply((config) => {
  const { email, password } = JSON.parse(config.data);
  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (user) {
    return [
      200,
      {
        user: {
          id: user.id,
          role: user.role,
          email: user.email,
          phoneNumber: user.phoneNumber,
        },
        token: "fake-jwt-token",
      },
    ];
  } else {
    return [400, { message: "Email or password is incorrect" }];
  }
});

export default createStore({
  state: {
    user: null,
    token: null,
    cards: [],
    visits: [],
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_TOKEN(state, token) {
      state.token = token;
    },
    setCards(state, cards) {
      state.cards = cards;
    },
    setVisits(state, visits) {
      state.visits = visits;
    },
    addCard(state, card) {
      state.cards.push(card);
    },
    deleteCard(state, id) {
      state.cards = state.cards.filter((card) => card.id !== id);
    },
    updateCard(state, updatedCard) {
      return new Promise((resolve, reject) => {
        const index = state.cards.findIndex(
          (card) => card.id === updatedCard.id
        );
        if (index !== -1) {
          state.cards.splice(index, 1, updatedCard);
          resolve();
        } else {
          reject("Карточка не найдена");
        }
      });
    },
  },
  actions: {
    async login({ commit }, user) {
      console.log(user);
      const response = await axios.post("/login", {
        email: user.email,
        password: user.password,
      });
      commit("SET_USER", response.data.user);
      commit("SET_TOKEN", response.data.token);
      return response;
    },
    logout({ commit }) {
      commit("SET_USER", null);
      commit("SET_TOKEN", null);
    },
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
      return new Promise((resolve, reject) => {
        axios
          .post("/cards", card)
          .then((response) => {
            const newCard = response.data;
            commit("addCard", newCard);
            resolve(newCard);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    deleteCard({ commit }, id) {
      axios
        .delete(`/cards/${id}`)
        .then(() => {
          commit("deleteCard", id);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    updateCard({ commit }, updatedCard) {
      return new Promise((resolve, reject) => {
        axios
          .put(`/cards/${updatedCard.id}`, updatedCard)
          .then((response) => {
            commit("updateCard", response.data);
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
  getters: {
    getVisits: (state) => state.visits,
  },
});
