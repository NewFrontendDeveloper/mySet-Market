const
    gulp = require('gulp'),
    fileInclude = require("gulp-file-include"),

    //style
    sass = require('gulp-sass')(require('sass')),
    sassGlob = require('gulp-sass-glob'),
    sourceMap = require('gulp-sourcemaps'),
    smartgrid = require('smart-grid'),
    gcmq = require('gulp-group-css-media-queries'),
    autoprefixer = require("autoprefixer"),
    postcss = require('gulp-postcss'),

    //server
    server = require('gulp-server-livereload'),
    debug = require("gulp-debug"),
    clean = require('gulp-clean'),
    fs = require('fs'),
    browsersync = require('browser-sync').create(),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    webpack = require('webpack-stream'),
    babel = require('gulp-babel');


/* const changed = require ('gulp-changed'), */


const fileIncludeSettings = {
    prefix: '@@',
    basepath: '@file'
}

const startServerSettings = {
    livereload: true,
    open: true
}

const reload = browsersync.reload

const settings = {
    outputStyle: "scss",
    filename: "_smart-grid",
    columns: 12,
    offset: "20px",
    mobileFirst: true,
    mixinNames: {
        container: "wrap",
        row: "row",
    },
    container: {
        maxWidth: '1320px',
        fields: "10px"
    },
    breakPoints: {
        // bootstrap bp
        x4l: {
            width: '2560px'
        },
        x3l: {
            width: '1920px'
        },
        x2l: {
            width: '1400px'
        },
        xl: {
            width: '1200px'
        },
        lg: {
            width: '992px'
        },
        md: {
            width: '768px'
        },
        sm: {
            width: '576px'
        },
        // + very small
        xs: {
            width: '400px',
        }
    }
}
smartgrid('./src/scss/vendor/', settings);

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
        build: './build/',
        watch: './src/**/*.html'
    },
    sass: {
        src:
            './src/scss/**/*.scss',
        build: './build/css/',
        watch: './src/scss/**/*.scss'
    },
    images: {
        src: './src/img/**/*.{jpg,jpeg,png,gif,svg,jfif}',
        build: './build/img/',
        watch: './src/img/**/*.{jpg,jpeg,png,gif,svg,jfif}'
    },
    fonts: {
        src: './src/fonts/**/*',
        build: './build/fonts/',
        watch: './src/fonts/**/*'
    },
    js: {
        src: './src/js/*.js',
        build: './build/js/',
        watch: './src/js/**/.*js'
    }
}

gulp.task('browsersync:dev', function () {
    browsersync.init({
        server: {
            baseDir: './build/',
        },
        tunnel: false,
        notify: true
    });
    gulp.watch(paths.sass.watch, gulp.parallel('sass:dev'));
    gulp.watch(paths.html.watch, gulp.parallel('html:dev'));
    gulp.watch(paths.images.watch, gulp.parallel('images:dev'));
    gulp.watch(paths.fonts.watch), gulp.parallel('fonts:dev');
    gulp.watch(paths.js.watch, gulp.parallel('js:dev'));
});

gulp.task('html:dev', function () {
    return gulp
        .src(paths.html.src)
        .pipe(fileInclude(fileIncludeSettings))
        .pipe(gulp.dest(paths.html.build))
        .pipe(debug({ 'title': "HTML files" }))
        .pipe(reload({ stream: true }));
})

gulp.task('sass:dev', function () {
    return gulp
        .src(paths.sass.src)
        .pipe(plumber(plumberSettings))
        .pipe(sourceMap.init())
        /*         .pipe(autoprefixer(["last 5 version", "> 1%", "ie 8"])) */
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer(["last 5 version", "> 1%", "ie 8"]),
        ]))
        .pipe(gcmq())
        .pipe(sourceMap.write())
        .pipe(gulp.dest(paths.sass.build))
        .pipe(debug({ 'title': "CSS file" }))
        .pipe(reload({ stream: true }));
})
gulp.task('fonts:dev', function () {
    return gulp
        .src(paths.fonts.src, { encoding: false })
        .pipe(gulp.dest(paths.fonts.build))
        .pipe(reload({ stream: true }));
})

gulp.task('images:dev', function () {
    return gulp
        .src(paths.images.src, { encoding: false })
        /*      .pipe(imagemin({verbose:true})) */
        .pipe(gulp.dest(paths.images.build))
        .pipe(debug({ 'title': "IMG file" }))
        .pipe(reload({ stream: true }));
})

gulp.task('js:dev', function () {
    return gulp.src(paths.js.src)
        //.pipe(babel())
        .pipe(webpack(require('./../webpack.config.js')))
        .pipe(babel())
        .pipe(gulp.dest(paths.js.build))
        .pipe(debug({ 'title': "JS file" }))
        .pipe(reload({ stream: true }));
})

gulp.task('server:dev', function () {
    return gulp
        .src('./build/')
        .pipe(server(startServerSettings));
})

gulp.task('clean:dev', function (done) {
    if (fs.existsSync('./build/')) {
        return gulp.src('./build/', { read: false }).pipe(clean());
    }
    done();
});




