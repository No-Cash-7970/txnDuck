import { task } from 'gulp-execa';
import gulp from 'gulp';

const unitTest = task('yarn jest');
const audit = task('yarn audit');
const fail = task('yarn foo');
const cleanup = (cb) => {
  console.log('Cleaning up...');
  cb();
}

export const example_task = gulp.series(unitTest, fail, audit);
export const go = gulp.series(task('yarn gulp example_task', { reject: false }), cleanup);
// yarn gulp go
