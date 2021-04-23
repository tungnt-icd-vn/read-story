const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const del = require('del');

// Clean style when build
function clean() {
  return del(['./root/assets/css/'], ['./root/**/*.html']);
}

//compile scss into css
function style() {
  return gulp.src('root/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write({includeContent: false}))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('root/assets/css'))
    .pipe(browserSync.stream());
}

//compile jade into html
function html() {
  return gulp.src(['root/pug/**/*.pug', '!root/pug/_layout/*.pug', '!root/pug/_modules/*.pug', '!root/pug/_mixins/*.pug'])
    .pipe(pug({
      doctype: 'html',
      pretty: true
    }))
    .pipe(gulp.dest('root/'));
}

function watch() {
  browserSync.init({
    server: {
      baseDir: "./root"
    },
    port: 4000
  });
  gulp.watch('root/scss/**/*.scss', style);
  gulp.watch('root/pug/**/*.pug', html);
  gulp.watch('root/pug/**/*.pug').on('change', browserSync.reload);
  gulp.watch('root/*.html').on('change', browserSync.reload);
  gulp.watch('root/assets/js/**/*.js').on('change', browserSync.reload);
}

// define complex tasks
const build = gulp.series(clean, style, html);

// export tasks
exports.style = style;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;