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
    params:params,
  });
}

// 放弃标注任务
export function giveUpTask(data) {
  console.log('放弃标注任务',data);
  return externalApi.request({
    url: "/annotation/task-detail/release-task",
    method: "post",
    data: data,
  });
};