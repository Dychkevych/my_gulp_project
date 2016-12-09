var gulp         = require('gulp');
var sass         = require('gulp-sass');
var browserSync  = require('browser-sync');
var concat       = require('gulp-concat');
var uglify		 = require('gulp-uglifyjs');
var cssnano      = require('gulp-cssnano');
var rename       = require('gulp-rename');
var del          = require('del');
var imagemin     = require('gulp-imagemin');
var pngquant     = require('imagemin-pngquant');
var autoprefixer = require('gulp-autoprefixer');
var scss 		 = require("gulp-scss");



// gulp.task('sass', function(){				// підключити SASS
// 	return gulp.src('assets/sass/**/*.sass')     
// 	.pipe(sass())
// 		.pipe(autoprefixer(['last 15 version', '>1%'], {cascade: true}))
// 	.pipe(gulp.dest('assets/css'))
// 	.pipe(browserSync.reload({stream: true}))
// });

// ---------------------------------------------
gulp.task("scss", function () {                      // підключити SCSS
        gulp.src("assets/sass/**/*.scss")
        .pipe(scss())
        .pipe(gulp.dest("assets/css"))
        .pipe(browserSync.reload({stream: true}));
    });


gulp.task('scripts', function() {     //  підключити бібліотеки
	return gulp.src([
		"node_modules/jquery/dist/jquery.min.js",
		"node_modules/bootstrap/dist/js/bootstrap.min.js"
	])
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('assets/js/libs'));
});

gulp.task('bootstrap', function() {     //  підключити бібліотеку bootstrap (не активно)
	return gulp.src([
		"node_modules/bootstrap/dist/css/bootstrap.css"
	])
		.pipe(concat('bootstrap.min.css'))
		.pipe(gulp.dest('assets'));
});


gulp.task('css-libs',['scss'], function() {            // зжати css файл  (не активно)
	return gulp.src('assets/css/main.css')
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('assets/css'));
})

gulp.task('browser-sync', function(){                   //  livereload
	browserSync({
		server: {
			baseDir: 'assets'
		},
		notify: false
	})
});

gulp.task('clean', function() {						// очистити папку dist
	return del.sync('dist');
});

gulp.task('img', function() {                         // зжати і перенести img
	return gulp.src('assets/img/**/*')
	.pipe(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		une: [pngquant()]
	}))
		.pipe(gulp.dest('dist/img'));
})

gulp.task('watch',['browser-sync', 'css-libs', 'scripts'], function(){    //watch
	gulp.watch('assets/sass/**/*.scss', ['scss']);
	gulp.watch('assets/*.html', browserSync.reload);
	gulp.watch('assets/js/**/*.js', browserSync.reload);
});

gulp.task('build',['clean', 'img', 'scss', 'scripts'], function() {     // перенести зжаті файли у папку dist

	var buildCss = gulp.src( 							// gulp.src([" ", " "])
		'assets/css/main.min.css'
	)
		.pipe(gulp.dest('dist/css'));

	var buildfonts = gulp.src('assets/fonts/**/*')

	.pipe(gulp.dest('dist/fonts'));

	var buildjs = gulp.src('assets/js/**/*')
		.pipe(gulp.dest('dist/js'));

	var buildhtml = gulp.src('assets/*.html')
		.pipe(gulp.dest('dist'));

});