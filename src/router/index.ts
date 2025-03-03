import {createRouter, createWebHistory, type RouteMeta} from 'vue-router'
import {useStore} from "@/stores/counter.ts";
import {Message} from "@arco-design/web-vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'web',
      meta: { title: '前台首页' },
      component: () => import('../views/web/web.vue'),
      children: [
        {
          path: "",
          name: "index",
          component: () => import('../views/web/index.vue'),
        },
        {
          path: "ai",
          name: "ai",
          component: () => import('../views/web/ai/index.vue'),
          redirect: "/ai/role_square",
          children:[
            {
              path: "role_square",  // 角色广场
              name: "role_square",
              component: () => import('../views/web/ai/role_square.vue'),
              meta: {
                isLogin: true,
              }
            },
            {
              path: "role_session",  // 会话列表
              name: "role_session",
              component: () => import('../views/web/ai/role_session.vue'),
            }
          ]
        },
        {
          path: "search",
          name: "search",
          component: () => import('../views/web/search.vue'),
        },
        {
          path: "chat",
          name: "chat",
          component: () => import('../views/web/chat.vue'),
        },
        {
          path: "article/:id",
          name: "article",
          component: () => import('../views/web/article.vue'),
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      meta: { title: '登录页面' },
      component: () => import('../views/login/index.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      meta: { title: '首页', isLogin: true, isTourist: true },
      component: () => import('../views/admin/index.vue'),
      children: [
          // 后台首页
        {
          path: "",
          name: "home",
          meta: { title: 'Home',  },
          component: () => import('../views/admin/home/index.vue'),
        },
          // 个人中心
        {
          path: "user_center",
          name: "user_center",
          meta: { title: '个人中心', isTourist: true },
          children: [
              // 用户信息详情
            {
              path: "user_info",
              name: "user_info",
              meta: { title: '我的详情' },
              component: () => import('../views/admin/user_center/user_info.vue'),
            },
              // 用户文章发布
            {
              path: "user_public",
              name: "user_public",
              meta: { title: '我的文章', isTourist:false },
              component: () => import('../views/admin/user_center/user_public.vue'),
            },
              // 用户收藏
            {
              path: "user_collect",
              name: "user_collect",
              meta: { title: '我的收藏', isTourist:false },
              component: () => import('../views/admin/user_center/user_collect.vue'),
            },
              // 用户消息
            {
              path: "user_message",
              name: "user_message",
              meta: { title: '我的消息', isTourist:false },
              component: () => import('../views/admin/user_center/user_message.vue'),
            },
          ]
        },
          // 文章管理
        {
          path: "articles",
          name: "articles",
          meta: { title: '文章管理', isAdmin: true, isTourist: false, isUser: false },
          children: [
              // 文章列表
            {
              path: "article_list",
              name: "article_list",
              meta: { title: '文章列表' },
              component: () => import('../views/admin/articles/article_list.vue'),
            },
              // 图片列表
            {
              path: "image_list",
              name: "image_list",
              meta: { title: '图片列表' },
              component: () => import('../views/admin/articles/image_list.vue'),
            },
              // 评论列表
            {
              path: "comment_list",
              name: "comment_list",
              meta: { title: '评论列表' },
              component: () => import('../views/admin/articles/comment_list.vue'),
            },
          ]
        },
          // 用户管理
        {
          path: "users",
          name: "users",
          meta: { title: '用户管理', isAdmin: true, isTourist: false, isUser: false },
          children: [
              // 用户列表
            {
              path: "users_list",
              name: "users_list",
              meta: { title: '用户列表' },
              component: () => import('../views/admin/users/users_list.vue'),
            },
            // 用户消息
            {
              path: "users_message",
              name: "users_message",
              meta: { title: '用户消息管理' },
              component: () => import('../views/admin/users/users_message.vue'),
            },
          ]
        },
          // 系统管理
        {
          path: "system",
          name: "system",
          meta: { title: '系统管理', isAdmin: true, isTourist: false, isUser: false },
          children: [
              // 菜单列表
            {
              path: "menu_list",
              name: "menu_list",
              meta: { title: '菜单列表' },
              component: () => import('../views/admin/system/menu_list.vue'),
            },
              // 广告列表
            {
              path: "ad_list",
              name: "ad_list",
              meta: { title: '广告列表' },
              component: () => import('../views/admin/system/ad_list.vue'),
            },
            // 系统配置列表
            {
              path: "system_setting",
              name: "system_setting",
              redirect:"/admin/system/system_setting/web_config",
              meta: { title: '系统配置' },
              component: () => import('../views/admin/system/system_setting.vue'),
              children: [
                {
                  path: "web_config",
                  name: "web_config",
                  meta: { title: '网站配置' },
                  component: () => import('../views/admin/system/config/web_config.vue'),
                },
                {
                  path: "email_config",
                  name: "email_config",
                  meta: { title: '邮箱配置' },
                  component: () => import('../views/admin/system/config/email_config.vue'),
                },
                {
                  path: "qiniu_config",
                  name: "qiniu_config",
                  meta: { title: '七牛云配置' },
                  component: () => import('../views/admin/system/config/qiniu_config.vue'),
                },
                {
                  path: "jwt_config",
                  name: "jwt_config",
                  meta: { title: 'jwt配置' },
                  component: () => import('../views/admin/system/config/jwt_config.vue'),
                },
              ]
            },
          ]
        },
          // 群聊管理
        {
          path: "chat_group",
          name: "chat_group",
          meta: { title: '群聊管理', isAdmin: true, isTourist: false, isUser: false },
          children: [
              // 群聊记录
            {
              path: "chat_list",
              name: "chat_list",
              meta: { title: '群聊记录' },
              component: () => import('../views/admin/chat_group/chat_list.vue'),
            },
          ]
        },
          // 大模型管理
        {
          path: "gpt",
          name: "gpt",
          meta: { title: '大模型管理', isAdmin: true, isTourist: false, isUser: false },
          component: () => import('../views/admin/gpt/index.vue'),

          children: [
              // 参数配置
            {
              path: "param_setting",
              name: "param_setting",
              meta: { title: '参数配置' },
              component: () => import('../views/admin/gpt/param/index.vue'),
              children: [
                // 基本配置
                {
                  path: "base_option",
                  name: "base_option",
                  meta: { title: '基本配置' },
                  component: () => import('../views/admin/gpt/param/base_option.vue'),
                },
                // 会话配置
                {
                  path: "session_option",
                  name: "session_option",
                  meta: { title: '会话配置' },
                  component: () => import('../views/admin/gpt/param/session_option.vue'),
                },
                // 自动回复配置
                {
                  path: "reply_option",
                  name: "reply_option",
                  meta: { title: '自动回复配置' },
                  component: () => import('../views/admin/gpt/param/reply_option.vue'),
                },
              ]
            },
            // 角色配置
            {
              path: "role_setting",
              name: "role_setting",
              meta: { title: '角色配置' },
              component: () => import('../views/admin/gpt/role/index.vue'),
              children: [
                  // 角色标签
                {
                  path: "role_tag",
                  name: "role_tag",
                  meta: { title: '角色标签' },
                  component: () => import('../views/admin/gpt/role/role_tag.vue'),
                },
                  // 角色列表
                {
                  path: "role_list",
                  name: "role_list",
                  meta: { title: '角色列表' },
                  component: () => import('../views/admin/gpt/role/role_list.vue'),
                },
              ]
            },
              // 会话管理
            {
              path: "session_setting",
              name: "session_setting",
              meta: { title: '会话管理' },
              component: () => import('../views/admin/gpt/session/index.vue'),
            },
          ]
        },
          // 日志管理
        {
          path: "log",
          name: "log",
          meta: { title: '日志管理', isAdmin: true, isTourist: false, isUser: false },
          children: [
            // 日志列表
            {
              path: "log_list",
              name: "log_list",
              meta: { title: '日志列表' },
              component: () => import('../views/admin/log/log_list.vue'),
            },
          ]
        },
      ]
    }
  ],
})

export default router

router.beforeEach((to, from, next) => {
  const store = useStore()
  const meta = to.meta
  if (meta.isLogin && !store.isLogin) {
    Message.warning("需要登录才可以哦！")
    router.push({ name: from.name as string })
    return
  }
  if ((meta.isUser === false) && store.isUser) {
    Message.warning("非管理员没有权限嗷！")
    router.push({ name: from.name as string })
    return
  }
  if ((meta.isTourist === false) && store.isTourist) {
    Message.warning("游客没有权限嗷！")
    router.push(from)
    return
  }
  next();
})