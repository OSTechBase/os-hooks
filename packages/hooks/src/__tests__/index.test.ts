import * as osHooks from '..';

//断言
describe('osHooks', () => {
  test('导出的hooks都是可以用的', () => {
    Object.keys(osHooks).forEach((module) => {
      expect(osHooks[module]).toBeDefined(); //断言变量的值不是undefined
    });
  });
});
