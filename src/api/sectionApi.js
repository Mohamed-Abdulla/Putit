import { userRequest } from "../utils/authUtils";

const sectionApi = {
  create: (boardId) => userRequest.post(`boards/sec/${boardId}/sections`),
  update: (boardId, sectionId, params) => userRequest.put(`boards/sec/${boardId}/sections/${sectionId}`, params),
  delete: (boardId, sectionId) => userRequest.delete(`boards/sec/${boardId}/sections/${sectionId}`),
};

export default sectionApi;
