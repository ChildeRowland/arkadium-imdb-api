var gulp = require('gulp');
var del = require('del');

var deployment = 'build';

gulp.task('clean', function() {
	del([ (deployment + '/**/*'), '!.git']);
});

gulp.task('packageFile', function() {
	return gulp.src('package.json')
		.pipe(gulp.dest(deployment));
});

// gulp.task('serverFiles', function() {
// 	return gulp.src('src/server/**/*')
// 		.pipe(gulp.dest(deployment + '/server'));
// });

gulp.task('sourceFiles', function() {
	return gulp.src('src/**/*')
		.pipe(gulp.dest(deployment));
});

gulp.task('entryPoint', function() {
	return gulp.src('Procfile')
		.pipe(gulp.dest(deployment));
});

gulp.task('build', ['clean', 'packageFile', 'sourceFiles', 'entryPoint']);




