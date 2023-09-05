import { http } from "boot/axios";
import queryString from "query-string";

const api = {
  login({ email, password }) {
    return http.post("/login", { email, password }, { title: "Авторизация" });
  },
  fetchWithPagination() {},
  fetchWithPagination() {},
  fetchCards({ page = 1, limit = 10, filters = {} } = {}) {
    const offset = (page - 1) * limit;
    let filterQuery = {};
    if (filters.uuid) filterQuery.uuid = `ilike.*${filters.uuid}*`;
    if (filters.name) filterQuery.name = `ilike.*${filters.name}*`;
    if (filters.no) filterQuery.no = `ilike.*${filters.no}*`;

    return http
      .get("/el_tcards", {
        params: filterQuery,
        headers: {
          Prefer: "count=estimated",
          Range: offset + "-" + (offset + limit - 1),
        },
      })
      .then((resp) => {
        const totalRange = resp.headers["content-range"];

        const [startIndex, endIndex, totalCards] = totalRange.split(/-|\//);

        console.log("totalRange:", totalCards);

        return {
          cards: resp.data,
          totalCards,
        };
      });

    // const response = await http.get(
    //   `/el_tcards${baseQueryString}&limit=${limit}&offset=${offset}`,
    //   { headers: {'Prefer':'count=estimated', 'Range': offset + '-' + offset+limit }}
    // );
  },
  fetchTerminals() {
    return http
      .get("/el_tdir_terminals")
      .then((resp) => {
        return resp.data;
      })
      .catch((error) => {
        console.error("Error fetching terminals:", error);
        throw error;
      });
  },
  fetchLists() {
    return http
      .get("/el_tcardgroups")
      .then((resp) => {
        return resp.data;
      })
      .catch((error) => {
        console.error("Error fetching cardgroups:", error);
        throw error;
      });
  },
  deleteCard(uuid) {
    return http
      .delete(`/el_tcards?uuid=eq.${uuid}`)
      .then((resp) => {
        return resp.data;
      })
      .catch((error) => {
        console.error("Error deleting card:", error);
        throw error;
      });
  },
  createCard(cardData) {
    return http
      .post("/el_tcards", cardData)
      .then((resp) => {
        return resp.data;
      })
      .catch((error) => {
        console.error("Error creating card:", error);
        throw error;
      });
  },
  updateCard(uuid, card) {
    return http
      .put(`/el_tcards?uuid=eq.${uuid}`, card)
      .then((resp) => resp.data)
      .catch((error) => {
        console.error("Error updating card:", error);
        throw error;
      });
  },
};

export { api };
