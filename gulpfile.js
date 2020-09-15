var gulp = require("gulp");
var browserSync = require("browser-sync");
var sass = require("gulp-sass");
var browserify = require("browserify");
var del = require("del");
var concat = require("gulp-concat");
var rename = require("gulp-rename");
var source = require("vinyl-source-stream");
var watchify = require("watchify");

var config = {
  sourceDir: "src",
  destDir: "public",
  jsDir: "/js",
  sassDir: "/scss",
  cssDir: "/css",
  serverDir: "/server",
  assetsDir: "/assets",
  jsFile: "main.js",
};

//create web server at the /public folder
gulp.task("browserSync", function () {
  browserSync({
    port: 8080,
    server: {
      baseDir: config.destDir,
    },
  });
});

function reload(done) {
  browserSync.reload();
  done();
}

//task sass transform scss in css
gulp.task("sass", function () {
  return gulp
    .src(config.sourceDir + config.sassDir + "/**/*.scss") // All files .scss
    .pipe(sass())
    .pipe(concat("main.css"))
    .pipe(gulp.dest(config.destDir + config.cssDir)); // transform .css in the folder public/css
});

//task js
var scripts = watchify(
  browserify("./" + config.sourceDir + config.jsDir + "/" + config.jsFile)
);
function bundle() {
  return scripts
    .bundle() // add dependencies
    .pipe(source(config.sourceDir + config.jsDir + "/" + config.jsFile))
    .pipe(rename(config.jsFile))
    .pipe(gulp.dest("./" + config.destDir + config.jsDir)); // copy in the folder public/js
}
scripts.on("update", bundle);
gulp.task("js", bundle);

//task copy html files
gulp.task("html", function () {
  return gulp
    .src(config.sourceDir + "/**/*.html") // All files .html
    .pipe(gulp.dest(config.destDir)); // copy in the folder public
});

//task watch files
gulp.task(
  "watch",
  gulp.series(function () {
    gulp.watch(
      config.sourceDir + config.sassDir + "/**/*.scss",
      gulp.series("sass", reload)
    );
    gulp.watch(
      config.sourceDir + config.jsDir + "/**/*.js",
      gulp.series("js", reload)
    );
    gulp.watch(config.sourceDir + "/**/*.html", gulp.series("html", reload));
    gulp.watch(
      config.sourceDir + config.serverDir + "/**/*.js",
      gulp.series("api", reload)
    );
  })
);
//task copy assets
gulp.task("assets", function () {
  return gulp
    .src(config.sourceDir + config.assetsDir + "/**/*")
    .pipe(gulp.dest(config.destDir + config.assetsDir));
});

//task copy api files
gulp.task("api", function () {
  return gulp
    .src(config.sourceDir + config.serverDir + "/**/*")
    .pipe(gulp.dest(config.destDir + config.serverDir));
});

//clean files
gulp.task("clean:public", function () {
  return del([config.destDir + "/**/*"]);
});

//combine all tasks
//first task clean, and simultaneously sass, js ...
gulp.task(
  "build",
  gulp.series(
    "clean:public",
    gulp.parallel("sass", "js", "html", "api", "assets")
  )
);

// default to use only "gulp" without task
// dev env
gulp.task(
  "default",
  gulp.parallel("assets", "sass", "js", "html", "api", "browserSync", "watch")
);
