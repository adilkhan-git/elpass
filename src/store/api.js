import { http } from "boot/axios";
import queryString from 'query-string';

const api = {
  login(email, password) {
    return http.post("/login", { email, password });
  },
  fetchWithPagination(){

  },
  async fetchCards({ page = 1, limit = 10, filters = {} } = {}) {
    const offset = (page - 1) * limit;
    let filterQuery = "";

    if (filters.uuid) filterQuery += `&uuid=ilike.*${filters.uuid}*`;
    if (filters.name) filterQuery += `&name=ilike.*${filters.name}*`;
    if (filters.no) filterQuery += `&no=ilike.*${filters.no}*`;

    const baseQueryString = filterQuery ? `?${filterQuery.substr(1)}` : "?";

    const response = await http.get(
      `/el_tcards${baseQueryString}&limit=${limit}&offset=${offset}`
    );

    const totalResponse = await http.head(
      `/el_tcards${baseQueryString}`
    );
    const totalRange = totalResponse.headers["content-range"];
    let totalCards = 0;
    if (totalRange) {
      const matches = totalRange.match(/(\d+)-(\d+)\/\*/);
      if (matches) {
        totalCards = parseInt(matches[2], 10) + 1;
      }
    }

    return {
      cards: response.data,
      totalCards,
    };
  },
};

export { api };
