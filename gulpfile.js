var gulp = require('gulp'); 
var sass = require('gulp-sass');
var fileinclude = require('gulp-file-include');
var livereload = require('gulp-livereload');
var rev = require('gulp-rev-append');
var replace = require('gulp-url-replace');
var cssmin = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var base64func =require("gulp-base64");
var base64= {
    //src: __dirname + 'css/*.css',
    //dest: __dirname + '/css',
    options: {
        //baseDir: __dirname,
        extensions: ['png'],
        maxImageSize: 20 * 1024, // bytes
        // debug: false
    }
}

gulp.task('sass', function() {
    gulp.src(['./static_temp/sass/*.scss',"./static_temp/sass/*/*.scss"])
        .pipe(sass())
        .on('error', function(err) {
            gutil.log('scss Error!', err.message);
            this.end();
        })
        .pipe(cssmin())
        .pipe(base64func(base64))
        .pipe(gulp.dest('./static/css'));
});
gulp.task('js', function() {
    gulp.src(['./static_temp/js/*.js',"./static_temp/js/*/*.js"])
        .pipe(uglify({ mangle: true }))
        .pipe(gulp.dest('./static/js/'));
});
gulp.task('html', function() {
    gulp.src(['./view_temp/*.html','./view_temp/html/*.html'])
        .pipe(fileinclude({
          prefix: '@@',
          basepath: '@file'
        }))
        .on('error', function(err) {
            gutil.log('html Error!', err.message);
            this.end();
        })
        .pipe(replace({"../static/":"F:/golang/code/src/zhcsdata/static/"}))
        .pipe(rev())
        .pipe(replace({"F:/golang/code/src/zhcsdata/static/":"../static/"}))
        .pipe(gulp.dest('./view'),{base:"."});
});
gulp.task("reload",function(event){
    livereload.listen();  
});
gulp.task('default', function(){
    gulp.run('html',"reload",'js');
    gulp.watch(["./view_temp/html/*.html","./view_temp/html/*/*.html","./view_temp/common/*.html"],function(event){
        console.log("common html changed");
        gulp.run("html");
    });
    gulp.watch(['./static_temp/sass/*.scss','./static_temp/sass/*/*.scss'],function(){
        gulp.run("sass");
    });
    gulp.watch(["./view/*.html","./view/*/*.html","./static/css/*.css","./static/css/*/*.css"],function(event){
        console.log("file  changed ,reload");
        livereload.changed(event.path);
        gulp.run("reload");
    })
});