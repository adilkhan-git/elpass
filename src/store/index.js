import { createStore } from "vuex";
import axios from "axios";
import "./mock.js";

export default createStore({
  state: {
    user: null,
    token: null,
    cards: [],
    visits: [],
    dialogVisible: false,
    users: [],
    lists: [],
    terminals: [],
  },
  actions: {
    async login({ state }, user) {
      try {
        const response = await axios.post("/login", {
          email: user.email,
          password: user.password,
        });
        state.user = response.data.user;
        state.token = response.data.token;
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    logout({ state }) {
      state.user = null;
      state.token = null;
    },
    async fetchLists({ state }) {
      try {
        const response = await axios.get("/lists");
        state.lists = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    async deleteList({ state }, id) {
      try {
        await axios.delete(`/lists/${id}`);
        const index = state.lists.findIndex((list) => list.id === id);
        if (index !== -1) {
          state.lists.splice(index, 1);
        }
      } catch (error) {
        console.error("Ошибка при удалении списка:", error);
      }
    },

    async fetchTerminals({ state }) {
      try {
        const response = await axios.get("/terminals");
        state.terminals = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async addTerminal({ state }, terminal) {
      try {
        const response = await axios.post("/terminals", terminal);
        const newTerminal = response.data;
        state.terminals.push(newTerminal);
      } catch (error) {
        console.error("Error adding terminal:", error);
      }
    },

    async deleteTerminal({ state }, id) {
      try {
        await axios.delete(`/terminals/${id}`);
        const index = state.terminals.findIndex(
          (terminal) => terminal.id === id
        );
        if (index !== -1) {
          state.terminals.splice(index, 1);
        }
      } catch (error) {
        console.error("Ошибка при удалении терминала:", error);
      }
    },

    async fetchUsers({ state }) {
      try {
        const response = await axios.get("/users");
        state.users = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    updateUser({ state }, user) {
      console.log("Updating user in Vuex action", user);
      return axios.put(`/users/${user.id}`, user).then((response) => {
        const index = state.users.findIndex((u) => u.id === user.id);
        if (index !== -1) state.users[index] = response.data; // Здесь мы обновляем данные в state.
        console.log("Updated user in state:", state.users[index]); // Лог после обновления
      });
    },

    addUser({ state }, user) {
      return axios.post("/users", user).then((response) => {
        state.users.push(response.data);
        return response;
      });
    },

    deleteUser({ state }, userId) {
      return axios.delete(`/users/${userId}`).then((response) => {
        const index = state.users.findIndex((user) => user.id === userId);
        if (index !== -1) state.users.splice(index, 1);
        return response;
      });
    },

    async fetchCards({ state }) {
      try {
        const response = await axios.get("/cards");
        state.cards = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchVisits({ state }) {
      try {
        const response = await axios.get("/visits");
        state.visits = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async addCard({ state }, card) {
      try {
        const response = await axios.post("/cards", card);
        const newCard = response.data;
        state.cards.push(newCard);
        return newCard;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async deleteCard({ state }, id) {
      try {
        await axios.delete(`/cards/${id}`);
        state.cards = state.cards.filter((card) => card.id !== id);
      } catch (error) {
        console.error(error);
      }
    },
    async updateCard({ state }, updatedCard) {
      try {
        await axios.put(`/cards/${updatedCard.id}`, updatedCard);
        const index = state.cards.findIndex(
          (card) => card.id === updatedCard.id
        );
        if (index !== -1) {
          state.cards.splice(index, 1, updatedCard);
        } else {
          throw new Error("Карточка не найдена");
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    setDialogVisible({ state }, value) {
      state.dialogVisible = value;
    },
  },
  getters: {
    getVisits: (state) => state.visits,
    getUsers: (state) => state.users,
    lists: (state) => state.lists,
  },
});
