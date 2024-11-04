const gulp = require('gulp');

require('./gulp/dev.js')
require('./gulp/docs.js')

gulp.task('default', gulp.series(
    'clean:dev',
    gulp.parallel('html:dev', 'sass:dev', 'images:dev', 'js:dev', 'browsersync:dev', 'fonts:dev'/* ,'fonts','files' */),
    gulp.parallel('server:dev')
));

gulp.task('docs', gulp.series(
    'clean:docs',
    gulp.parallel('html:docs', 'sass:docs', 'images:docs', 'js:docs',/* ,'fonts','files' */),
    gulp.parallel('server:docs')
));
