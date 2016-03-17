var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    del = require('del'),
    plumber = require('gulp-plumber'),
    changed = require('gulp-changed'),
    zip = require('gulp-zip'),
    browserSync = require('browser-sync').create();

gulp.task('default', ['clean'], function() {
    gulp.start('styles');
});

gulp.task('styles', function() {
    return sass('src/sass/*.scss', {
            style: 'expanded',
            precision: 6
        })
        .pipe(autoprefixer('last 3 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(changed('dist/css',{
            extension: '.css',
            hasChanged: changed.compareSha1Digest
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({stream: true}))
        .pipe(notify({message: 'Styles task complete!'}));
});

gulp.task('clean', function() {
    return del('dist/css');
});

gulp.task('watch', function() {
    browserSync.init({
        server: {
            baseDir: "./dist",
            online: false
        }
    });
    gulp.watch('src/sass/*.scss', ['styles']);
});

gulp.task('zip',function() {
    return gulp.src(['dist/**'])
        .pipe(zip('task07.zip'))
        .pipe(gulp.dest(process.cwd()));
})
