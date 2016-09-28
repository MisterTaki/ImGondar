// 载入插件
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    zip = require("gulp-zip"),
    package = require('./package.json'),
    sass = require("gulp-sass"),
    browserSync = require('browser-sync'), // 浏览器同步
    reload = browserSync.reload; // 自动刷新

// 定义web服务模块，增加浏览器同步浏览
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'dist',
            index: "index.html"
        }
    });
});

//HTML
gulp.task('html', function() {
    return gulp.src('src/index.html')
        .pipe(gulp.dest('dist'))
        .pipe(reload({
            stream: true
        }));
});

// 样式
gulp.task('styles', function() {
    return gulp.src('src/style/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({
          browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
          cascade: false
        }))
        .pipe(concat('style.css'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/style'))
        .pipe(reload({
            stream: true
        }));
});

// 脚本
gulp.task('scripts', function() {
    return gulp.src('src/scripts/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'))
        .pipe(reload({
            stream: true
        }));
});

// 图片
gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe(reload({
            stream: true
        }));
});

// 压缩
gulp.task('zip', function() {
    function checkTime(i) {
        if (i < 10) {
            i = "0" + i
        }
        return i
    }
    var d = new Date();
    var year = d.getFullYear();
    var month = checkTime(d.getMonth() + 1);
    var day = checkTime(d.getDate());
    var hour = checkTime(d.getHours());
    var minute = checkTime(d.getMinutes());

    return gulp.src('dist/**/*')
        .pipe(zip(package.name + '-' + year + month + day + hour + minute + '.zip'))
        .pipe(gulp.dest('export'));
})

// 清理
gulp.task('clean', function() {
    return gulp.src('dist/!(lib)**/*', {
            read: false
        })
        .pipe(clean());
});

// 预设任务
gulp.task('default', ['clean', 'browser-sync'], function() {
    gulp.start('html', 'styles', 'scripts', 'images');

    // 检测文件发送变化 - 分开监听为了执行对应的命令
    gulp.watch('src/index.html', ['html']);
    gulp.watch('src/style/**/*.scss', ['styles']);
    gulp.watch('src/scripts/**/*.js', ['scripts']);
    gulp.watch('src/images/**/*', ['images']);
});
