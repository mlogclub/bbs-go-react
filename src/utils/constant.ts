// 站点配置项
export const SysConfigSiteTitle = 'siteTitle'; // 站点标题
export const SysConfigSiteDescription = 'siteDescription'; // 站点描述
export const SysConfigSiteKeywords = 'siteKeywords'; // 站点关键字
export const SysConfigSiteNavs = 'siteNavs'; // 站点导航
export const SysConfigUrlRedirect = 'urlRedirect'; // 是否开启链接跳转
export const SysConfigDefaultNodeId = 'defaultNodeId'; // 发帖默认节点
export const SysConfigArticlePending = 'articlePending'; // 是否开启文章审核
export const SysConfigTopicCaptcha = 'topicCaptcha'; // 是否开启发帖验证码
export const SysConfigUserObserveSeconds = 'userObserveSeconds'; // 新用户观察期
export const SysConfigTokenExpireDays = 'tokenExpireDays'; // 登录Token有效天数
export const SysConfigLoginMode = 'loginMethod'; // 登录方式
export const SysConfigRecommendTags = 'recommendTags'; // 推荐标签
export const SysConfigScoreConfig = 'scoreConfig'; // 分数配置
export const SysConfigSiteOrigin = 'siteOrigin';
export const SysConfigSiteNotice = 'siteNotification'; // 公告
export const SysConfigCreateTopicEmailVerified = 'createTopicEmailVerified'; // 发话题需要邮箱认证
export const SysConfigCreateArticleEmailVerified = 'createArticleEmailVerified'; // 发话题需要邮箱认证
export const SysConfigCreateCommentEmailVerified = 'createCommentEmailVerified'; // 发话题需要邮箱认证

// 用户角色
export const UserRolesOwner = 'owner';
export const UserRolesAdmin = 'admin';
export const UserRolesNormal = 'user';

// 操作类型
export const OpTypeCreate = 'create';
export const OpTypeDelete = 'delete';
export const OpTypeUpdate = 'update';
export const OpTypeForbidden = 'forbidden';
export const OpTypeRemoveForbidden = 'removeForbidden';

export const OpTypeList = [OpTypeCreate, OpTypeDelete, OpTypeUpdate, OpTypeForbidden, OpTypeRemoveForbidden];
export const OpTypeMaps = {
  [OpTypeCreate]: '创建',
  [OpTypeDelete]: '删除',
  [OpTypeUpdate]: '更新',
  [OpTypeForbidden]: '禁用',
  [OpTypeRemoveForbidden]: '解除禁用',
};

// 密码 salt
export const PassSalt = 'dedede';
