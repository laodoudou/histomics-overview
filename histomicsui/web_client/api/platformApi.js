import externalApi from "./externalRequest";

/**
 * 获取任务详情
 * @param {string} taskId - 任务ID
 * @returns {Promise} 包含任务详情的Promise对象
 */ 
export function getTaskDetail(params) {
  console.log('获取任务详情',params);
  return externalApi.request({
    path: "/annotation/task-detail/get-answer-detail",
    method: "get",
    params
  });
}