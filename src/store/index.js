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
    cards: [],
    totalCards: 0,
    itemsPerPage: 10,
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
    async fetchCards({ state }, { page = 1, limit = 10, filters = {} } = {}) {
      try {
        const offset = (page - 1) * limit;
        let filterQuery = "";

        if (filters.uuid) filterQuery += `&uuid=ilike.*${filters.uuid}*`;
        if (filters.name) filterQuery += `&name=ilike.*${filters.name}*`;
        if (filters.no) filterQuery += `&no=ilike.*${filters.no}*`;

        const baseQueryString = filterQuery ? `?${filterQuery.substr(1)}` : "?";

        const response = await axios.get(
          `https://api.elpass.uz/el_tcards${baseQueryString}&limit=${limit}&offset=${offset}`
        );
        state.cards = response.data;

        let totalCards = 0;

        const totalResponse = await axios.head(
          `https://api.elpass.uz/el_tcards${baseQueryString}`
        );
        const totalRange = totalResponse.headers["content-range"];
        if (totalRange) {
          const matches = totalRange.match(/(\d+)-(\d+)\/\*/);
          if (matches) {
            totalCards = parseInt(matches[2], 10) + 1;
          }
        }

        state.totalCards = totalCards || 0;
        console.log("Total cards:", state.totalCards);
      } catch (error) {
        console.error("Error message:", error.message);
        if (error.response) {
          console.error("Error response data:", error.response.data);
        }
      }
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

    async uploadPhoto({ state }, photo) {
      try {
        const formData = new FormData();
        formData.append("file", photo);
        const response = await axios.post("/upload-photo", formData);
        console.log("Uploaded photo URL:", response.data.photoUrl);
        return response.data.photoUrl;
      } catch (error) {
        console.error("Ошибка при загрузке фотографии:", error);
        throw error;
      }
    },

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
    isAuthenticated(state) {
      return state.user && state.user.firstName !== "Guest";
    },
  },
});
