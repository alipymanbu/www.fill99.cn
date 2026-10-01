/* 站点跳转链接集中管理（全程唯一一处，改链接只改这里）
   设计注意事项 一.3：所有「下载 / 获取安装文件资源」类按钮统一读 window.SITE_LINKS，
   页面里不散落硬编码链接。 */
window.SITE_LINKS = {
  /* MagicLight 的安装文件资源（夸克网盘分享链接）。
     注意：目前项目内没有 MagicLight 的网盘分享记录，暂以产品页面充当「获取方式」入口；
     拿到夸克分享链接后只改这一行即可全站生效。 */
  download: 'https://www.magiclight.ai/'
};
