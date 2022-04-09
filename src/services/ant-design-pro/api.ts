// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/v1/search_user_info', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function updateUserAvator(body: any, options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/v1/save_user_info', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function getAllAvator(options?: { [key: string]: any }) {
  return request<{
    data: any;
  }>('/api/v1/avator_get', {
    method: 'GET',
    ...(options || {}),
  });
}
export async function delOneAvator(options?: { [key: string]: any }) {
  return request<{
    data: any;
  }>('/api/v1/avator_del', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function createVideoRecord(body: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/v1/create_video_record', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function getVideoRecord(body: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/v1/get_video_list', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function getVideoRecordById(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/v1/search_video_list', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function updateVideoRecord(body: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/v1/update_video_list', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function delVideoRecordById(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/v1/delete_video_record', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function createTopicRecord(body: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/v1/create_topic_record', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}
