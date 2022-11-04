import { userRequest } from "../utils/authUtils";
const boardApi = {
  create: () => userRequest.post("boards"),
  getAll: () => userRequest.get("boards"),
  updatePosition: (params) => userRequest.put("boards", params),
  getOne: (id) => userRequest.get(`boards/${id}`),
  delete: (id) => userRequest.delete(`boards/${id}`),
  update: (id, params) => userRequest.put(`boards/${id}`, params),
  getFavourites: () => userRequest.get("boards/favourites"),
  updateFavouritePosition: (params) => userRequest.put("boards/favourites", params),
};

export default boardApi;
