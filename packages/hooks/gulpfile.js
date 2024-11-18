const commonConfig = require('../../gulpfile');
const gulp = require('gulp');
const fs = require('fs');
const fse = require('fs-extra');
const fg = require('fast-glob');// 遍历文件系统并返回与一组指定模式匹配的路径名的方法
const gm = require('gray-matter');
const generateDesc = async (mdPath) => {
  // fs.existsSync 判断文件路径是否存在
  if (!fs.existsSync(mdPath)) {
    return;
  }
  // readFileSync 返回路径文件内容
  const mdFile = fs.readFileSync(mdPath, 'utf-8');
  //   console.log('mdFile', mdFile);
  const { content } = gm(mdFile);
  let description = (
    (content.replace(/\r\n/g, '\n').match(/# \w+[\s\n]+(.+?)(?:, |\. |\n|\.\n)/m) || [])[1] || ''
  ).trim();
  console.log('content', description);
  return description;
};
// 生成metadata.json
// hooks/src/**/index.md */
async function generateMetaData() {
  const metaData = {
    functions: [],
  };
  // 获取hook文件路径并获取文件名
  const hooks = fg
    .sync('src/use*', {
      onlyDirectories: true,
    })
    .map((hook) => hook.replace('src/', ''));

  // 生成metaData
  await Promise.allSettled(
    hooks.map(async (hook) => {
      const description = await generateDesc(`src/${hook}/index.md`);
      return {
        name: hook,
        description,
      };
    }),
  ).then((res) => {
    metaData.functions = res.map((item) => {
      console.log('item', item);
      if (item.status === 'fulfilled') {
        return item.value;
      }
      return null;
    });
  });
  console.log('hooks', hooks);
  return metaData;
}
gulp.task('metadata', async function () {
  const metaData = await generateMetaData();
  console.log('metaData', metaData);
  await fse.writeJson('metadata.json', metaData, {
    spaces: 2, //文件格式：2个空格
  });
});
exports.default = gulp.series(commonConfig.default, 'metadata');
