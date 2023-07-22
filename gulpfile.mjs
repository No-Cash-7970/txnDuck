import { task } from 'gulp-execa';
import gulp from 'gulp';

// const unitTest = task('yarn jest');
// const audit = task('yarn audit');
// const fail = task('yarn foo');
// const cleanup = (cb) => {
//   console.log('Cleaning up...');
//   cb();
// }

// export const example_task = gulp.series(unitTest, fail, audit);
// export const go = gulp.series(task('yarn gulp example_task', { reject: false }), cleanup);
// // yarn gulp go

// This is needed because a fork of jest-chance is being used. This task can be removed if using
// the official jest-chance package.
export const buildJestChance = gulp.series(
  (cb) => {
    process.chdir('./node_modules/jest-chance');
    cb();
  },
  task('yarn install'),
  task('yarn build'),
);

// Stashed unstaged files then runs tests and checks without restoring the
export const stashThenTest = gulp.series(
  // Stash away changes that are not going to be committed, so the checks are on the changes that
  // are going to be committed
  task('git stash push -k -u -m "precommit"', { reject: false }),
  task('yarn next lint'),
  task('yarn jest'),
  task('yarn playwright test'),
);

export const precommitHook = gulp.series(
  // Setting `reject` to `false` allows the next task to run regardless of whether there was an
  // error or not
  task('yarn gulp stashThenTest', { reject: false }),
  task('git stash pop', { reject: false }),
);
