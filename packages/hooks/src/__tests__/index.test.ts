import * as techHooks from '..';

//断言
describe('techHooks', () => {
  test('导出的hooks都是可以用的', () => {
    Object.keys(techHooks).forEach((module) => {
      expect(techHooks[module]).toBeDefined(); //断言变量的值不是undefined
    });
  });
});
