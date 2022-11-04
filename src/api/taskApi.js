import { userRequest } from "../utils/authUtils";

const taskApi = {
  create: (boardId, params) => userRequest.post(`boards/task/${boardId}/tasks`, params),
  updatePosition: (boardId, params) => userRequest.put(`boards/task/${boardId}/tasks/update-position`, params),
  delete: (boardId, taskId) => userRequest.delete(`boards/task/${boardId}/tasks/${taskId}`),
  update: (boardId, taskId, params) => userRequest.put(`boards/task/${boardId}/tasks/${taskId}`, params),
};

export default taskApi;
