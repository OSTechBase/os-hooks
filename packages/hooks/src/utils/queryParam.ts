const addQueryParam = (key, value) => {
  const url = new URL(window.location.href);
  url.searchParams.set(key, value);
  window.history.pushState({}, '', url.toString());
};
const removeQueryParam = (key) => {
  const url = new URL(window.location.href); // 创建 URL 对象
  url.searchParams.delete(key); // 删除指定参数
  window.history.pushState({}, '', url.toString()); // 更新地址栏
};
export { addQueryParam, removeQueryParam };
