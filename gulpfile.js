var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('default', function() {
    // 将你的默认的任务代码放在这
    gulp.src(['./js/css3d.min.js', './js/jstween.js', './js/preload.js', './js/zepto.touch.js', './js/images.data.js', './js/main.js'])
        .pipe(concat('build.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'));
});