const
    gulp = require('gulp'),
    fileInclude = require("gulp-file-include"),
    htmlclean = require('gulp-htmlclean'),

    //style
    sass = require('gulp-sass')(require('sass')),
    sassGlob = require('gulp-sass-glob'),
    sourceMap = require('gulp-sourcemaps'),
    smartgrid = require('smart-grid'),
    gcmq = require('gulp-group-css-media-queries'),
    autoprefixer = require("gulp-autoprefixer"),
    csso = require('gulp-csso'),

    //server
    server = require('gulp-server-livereload'),
    debug = require("gulp-debug"),
    clean = require('gulp-clean'),
    fs = require('fs'),
    browsersync = require('browser-sync').create(),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    webpack = require('webpack-stream'),
    babel = require('gulp-babel'),

    minify = require('gulp-minify');


/* const changed = require ('gulp-changed'), */


const fileIncludeSettings = {
    prefix: '@@',
    basepath: '@file'
}

const startServerSettings = {
    livereload: true,
    open: true
}

/* const reload = browsersync.reload */

/* const settings = {
    outputStyle: 'scss',
    columns: 12,
    offset: '30px',
    container: {
        maxWidth: '1200px',
        fields: '30px'
    },
    breakPoints: {
        lg: {
            width: '1100px'
        },
        md: {
            width: '960px'
        },
        sm: {
            width: '720px'
        },
        xs: {
            width: '576px'
        }
    }
}
smartgrid('./src/scss/vendor/', settings); */

const plumberSettings = {
    errorHandler: notify.onError({
        title: 'Style',
        message: 'Error <%= error.message %>',
        sound: false
    })
}

const paths = {
    html: {
        src: [
            './src/html/**/*.html',
            '!./src/html/blocks/*.html'
        ],
        docs: './docs/',
        watch: './src/**/*.html'
    },
    sass: {
        src: [
            './src/scss/**/*.scss',
            '!./src/scss/vendor/*.scss'
        ],
        docs: './docs/css/',
        watch: './src/scss/**/*.scss'
    },
    images: {
        src: './src/img/**/*.{jpg,jpeg,png,gif,svg}',
        docs: './docs/img/',
        watch: './src/img/**/*.{jpg,jpeg,png,gif,svg}'
    },
    js: {
        src: './src/js/*.js',
        docs: './docs/js/',
        watch: './src/js/**/.*js'
    }
}

/* gulp.task('browsersync:docs', function () {
    browsersync.init({
        server: {
            baseDir: './docs/',
        },
        tunnel: false,
        notify: true
    });
    gulp.watch(paths.sass.watch, gulp.parallel('sass:docs'));
    gulp.watch(paths.html.watch, gulp.parallel('html:docs'));
    gulp.watch(paths.images.watch, gulp.parallel('images:docs'));
    gulp.watch(paths.js.watch, gulp.parallel('js:docs'));
}); */

gulp.task('html:docs', function () {
    return gulp
        .src(paths.html.src)
        .pipe(fileInclude(fileIncludeSettings))
        .pipe(htmlclean())
        .pipe(gulp.dest(paths.html.docs))
        .pipe(debug({ 'title': "HTML files" }))
    /*         .pipe(reload({ stream: true })); */
})

gulp.task('sass:docs', function () {
    return gulp
        .src(paths.sass.src)
        .pipe(plumber(plumberSettings))
        .pipe(sourceMap.init())
        .pipe(autoprefixer(["last 5 version", "> 1%", "ie 8"]))
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(gcmq())
        .pipe(csso())
        .pipe(sourceMap.write())
        .pipe(gulp.dest(paths.sass.docs))
        .pipe(debug({ 'title': "CSS file" }))
    /*         .pipe(reload({ stream: true })); */
})

gulp.task('images:docs', function () {
    return gulp
        .src(paths.images.src)
        /*      .pipe(imagemin({verbose:true})) */
        .pipe(gulp.dest(paths.images.docs))
        .pipe(debug({ 'title': "IMG file" }))
    /*         .pipe(reload({ stream: true })); */
})

gulp.task('js:docs', function () {
    return gulp.src(paths.js.src)
        //.pipe(babel())
        .pipe(webpack(require('./../webpack.config.js')))
        .pipe(babel())
        .pipe(minify())
        .pipe(gulp.dest(paths.js.docs))
        .pipe(debug({ 'title': "JS file" }))
    /*         .pipe(reload({ stream: true })); */
})

gulp.task('server:docs', function () {
    return gulp
        .src('./docs/')
        .pipe(server(startServerSettings));
})

gulp.task('clean:docs', function (done) {
    if (fs.existsSync('./docs/')) {
        return gulp.src('./docs/', { read: false }).pipe(clean());
    }
    done();
});




