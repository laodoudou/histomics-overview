import request from './request'

//获取任务详情
export function getTaskDetail(data) {
  return request({
    url: "/annotation/task-detail/get-answer-detail",
    method: "get",
    params: data
  });
}