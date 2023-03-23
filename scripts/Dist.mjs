import gulp from "gulp";
import phpMinify from "@cedx/gulp-php-minify";

export default function() {
  return gulp.src("../lib/**/*.php", {read: false})
    .pipe(phpMinify({mode: "fast"}))
    .pipe(gulp.dest("../lib"));
}
