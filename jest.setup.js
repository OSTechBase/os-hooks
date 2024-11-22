// mock screen full events
// https://github.com/sindresorhus/screenfull/blob/main/index.js
const screenfullMethods = [
  'requestFullscreen',
  'exitFullscreen',
  'fullscreenElement',
  'fullscreenEnabled',
  'fullscreenchange',
  'fullscreenerror',
];
screenfullMethods.forEach((item) => {
  document[item] = () => { };
  HTMLElement.prototype[item] = () => { };
});
// 忽略过时的内部警告
const consoleError = console.error;
console.error = (...args) => {
  if (args[0]?.includes('ReactDOMTestUtils.act')) {
    return;
  }
  consoleError(...args);
};

