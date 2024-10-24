const gulp = require('gulp');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');
const del = require('del');

// 实现clean
gulp.task('clean', async function () {
  await del('dist');
  await del('es');
  await del('lib');
});
// 实现esm ts->js compiler(编译程序)
gulp.task('esm', function () {
  const tsProject = ts.createProject('tsconfig.pro.json', {
    module: 'ESNext',
  });
  // ts->js;  esnext->es5： 依赖babel（兼容性）的js compiler实现的;
  // 在babel之前不能通过esnext语法实现，在babel之后通过添加runtime运行垫片避免代码兼容报错;
  return tsProject.src().pipe(tsProject()).pipe(babel()).pipe(gulp.dest('es/'));
});
// 实现commonjs  esm->cjs:用esm产物实现cjs
gulp.task('cjs', function () {
  return gulp
    .src(['./es/**/*.js'])
    .pipe(
      babel({
        configFile: '../../.babelrc',
      }),
    )
    .pipe(gulp.dest('lib/'));
});
// 实现d.ts类型声明
gulp.task('declaraiton', function () {
  const tsProject = ts.createProject('tsconfig.pro.json', {
    declaration: true,
    emitDeclarationOnly: true,
  });
  return tsProject.src().pipe(tsProject()).pipe(gulp.dest('es/')).pipe(gulp.dest('lib/'));
});
// 复制README
gulp.task('copyReadme', async function () {
  await gulp.src('../../README.md').pipe(gulp.dest('../../packages/hooks/'));
});

exports.default = gulp.series('clean', 'esm', 'cjs', 'declaraiton', 'copyReadme');
