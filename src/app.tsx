/* eslint-disable react/jsx-key */
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { SettingDrawer } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig, RequestConfig } from 'umi';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
// import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
// import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import defaultSettings from '../config/defaultSettings';
import { getLocalStroage } from '@/utils/local-stroage'
import MyLoading from '@/components/MyLoading';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

const myUrl = [
  "/user/login",
  "/user/registy",
  "/api/v1/search_user_info",
  "/api/v1/save_user_info",
  "/api/v1/avator_get",
  "/api/v1/avator_del",
  "/api/v1/create_video_record",
  "/api/v1/get_video_list",
  "/api/v1/search_video_list",
  "/api/v1/update_video_list",
  "/api/v1/delete_video_record",
  "/api/v1/create_topic_record",
  "/api/v1/get_topic_list",
  "/api/v1/delete_topic_record",
  "/api/v1/update_topic_list",
  "/api/v1/search_topic_list"
]

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <MyLoading />,
};

export const request: RequestConfig = {
  timeout: 1000 * 60,
  errorConfig: {},
  middlewares: [],
  requestInterceptors: [
    (url, options) => {
      if (myUrl.includes(url)) {
        return {
          url: `http://127.0.0.1:8080${url}`,
          options: {
            ...options,
            headers: ({
              ...options.headers,
              token: localStorage.getItem("token")
            } as HeadersInit)
          }
        }
      } else {
        return {
          url,
        }
      }
    }
  ],
  responseInterceptors: [],
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    const { username, u_id } = getLocalStroage()
    try {
      const msg = await queryCurrentUser(
        {
          params:
          {
            uid: u_id,
            username
          }
        }
      );
      if ((msg as any).code !== 0) {
        history.push(loginPath);
      }
      return msg.data || {};
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  console.log('layout', initialState);
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    // footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
        // <Link to="/umi/plugin/openapi" target="_blank">
        //   <LinkOutlined />
        //   <span>OpenAPI 文档</span>
        // </Link>,
        // <Link to="/~docs">
        //   <BookOutlined />
        //   <span>业务组件文档</span>
        // </Link>,
      ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};
