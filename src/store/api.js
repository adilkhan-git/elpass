import { http } from "boot/axios";
import queryString from 'query-string';

const api = {
  login(email, password) {
    return http.post("/login", { email, password }, { title:'Авторизация'});
  },
  fetchWithPagination(){

  },
  fetchCards({ page = 1, limit = 10, filters = {} } = {}) {
    const offset = (page - 1) * limit;
    let filterQuery = {};
    if (filters.uuid) filterQuery.uuid = `ilike.*${filters.uuid}*`;
    if (filters.name) filterQuery.name = `ilike.*${filters.name}*`;
    if (filters.no) filterQuery.no = `ilike.*${filters.no}*`;

    return http.get('/el_tcards',{ 
      params: filterQuery,
      headers: {
        'Prefer':'count=estimated', 
        'Range': offset + '-' + offset+limit }
      }
    ).then((resp)=>{
      const totalRange = resp.headers["content-range"];

      const [startIndex, endIndex, totalCards] = totalRange.split(/-|\//);
  
      console.log('totalRange',totalCards);
  
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
};

export { api };
