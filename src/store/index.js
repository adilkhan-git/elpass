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
  },
});
