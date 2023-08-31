import { createStore } from "vuex";
import axios from "axios";
import { api } from "./api";
import { http } from "boot/axios";

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
    cards: [],
    totalCards: 0,
    itemsPerPage: 10,
    mock: true,
    debug: false,
  },
  actions: {
    updateUser({ state }, updatedUser) {
      const userIndex = state.users.findIndex(
        (user) => user.id === updatedUser.id
      );
      if (userIndex !== -1) {
        state.users[userIndex] = updatedUser;
      }
    },
    login({ state }, user) {
        return api.login({
          email: user.email,
          password: user.password,
        }).then((resp)=>{
          state.user = resp.data.user;
          state.token = resp.data.token;
        });
    },
    logout({ state }) {
      state.user = null;
      state.token = null;
    },
    async fetchLists({ state }) {
      try {
        const response = await http.get("/lists");
        state.lists = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async addList({ state }, list) {
      try {
        const response = await axios.post("/lists", list);
        if (response.status === 200) {
          state.lists.push(response.data);
        } else {
          console.error("Error adding list:", response.status);
        }
      } catch (error) {
        console.error("Error adding list:", error);
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
    async editList({ state }, list) {
      try {
        console.log("Sending data for edit:", list);
        const response = await axios.put(`/lists/${list.id}`, list);
        console.log("Received response for edit:", response);
        const index = state.lists.findIndex((item) => item.id === list.id);
        if (index !== -1) {
          state.lists[index] = response.data;
          console.log("Updated state after edit:", state.lists);
        }
        return response;
      } catch (error) {
        throw error;
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
    async updateTerminal({ state }, updatedTerminal) {
      try {
        const response = await axios.put(
          `/terminals/${updatedTerminal.id}`,
          updatedTerminal
        );
        const index = state.terminals.findIndex(
          (terminal) => terminal.id === updatedTerminal.id
        );
        if (index !== -1) {
          state.terminals[index] = response.data;
        }
      } catch (error) {
        console.error("Ошибка при обновлении терминала:", error);
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
        if (index !== -1) state.users[index] = response.data;
        console.log("Updated user in state:", state.users[index]);
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

    async fetchVisits({ state }) {
      try {
        const response = await axios.get("/visits");
        state.visits = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    // async fetchCards({ state }, { page = 1, limit = 10, filters = {} } = {}) {
    //   try {
    //     const { cards, totalCards } = await api.fetchCards({
    //       page,
    //       limit,
    //       filters,
    //     });

    //     state.cards = cards;
    //     state.totalCards = totalCards;

    //     console.log("Total cards:", state.totalCards);
    //   } catch (error) {
    //     console.error("Error message:", error);
    //     if (error.response) {
    //       console.error("Error response data:", error.response.data);
    //     }
    //   }
    // },

    fetchCards({ state }, { page = 1, limit = 10, filters = {} } = {}) {
      return api.fetchCards({
        page,
        limit,
        filters,
      }).then((data)=>{
        state.cards = data.cards;
        state.totalCards = data.totalCards;
        return data;
      });
    },

    async deleteCard({ state }, uuid) {
      try {
        await axios.delete(`https://api.elpass.uz/el_tcards?uuid=eq.${uuid}`);
        state.cards = state.cards.filter((card) => card.uuid !== uuid);
      } catch (error) {
        console.error("Axios error:", error);
        if (error.response) {
          console.error("Error response data:", error.response.data);
        }
      }
    },

    // async uploadPhoto({ state }, photo) {
    //   try {
    //     const formData = new FormData();
    //     formData.append("file", photo);
    //     const response = await axios.post("/upload-photo", formData);
    //     console.log("Uploaded photo URL:", response.data.photoUrl);
    //     return response.data.photoUrl;
    //   } catch (error) {

    //     console.error("Ошибка при загрузке фотографии:", error);
    //     throw error;
    //   }
    // },

    async addCard({ dispatch, state }, card) {
      try {
        if (card.photo) {
          const photoUrl = await dispatch("uploadPhoto", card.photo);
          card.photoUrl = photoUrl;
        }
        const response = await axios.post("/cards", card);
        const newCard = response.data;
        state.cards.push(newCard);
        return newCard;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async updateCard({ dispatch, state }, updatedCard) {
      try {
        if (updatedCard.photo) {
          const photoUrl = await dispatch("uploadPhoto", updatedCard.photo);
          updatedCard.photoUrl = photoUrl;
        }
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
  },
  getters: {
    getVisits: (state) => state.visits,
    getUsers: (state) => state.users,
    lists: (state) => state.lists,
    isAdmin : (state) => state.user && state.user.role === 'admin',
    isAuthenticated(state) {
      return state.user && state.user.firstName !== "Guest";
    },
  },
});
