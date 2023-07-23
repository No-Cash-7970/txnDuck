import gulp from 'gulp';
import { task } from 'gulp-execa';
import rename from 'gulp-rename';
import { Transform } from 'stream';
import yaml from 'js-yaml';

/**
 * Build the `jest-chance` dependency
 *
 * This is needed because a fork of jest-chance is being used. This task can be removed if using
 * the official jest-chance package.
 */
const buildJestChance = gulp.series(
  (cb) => {
    const dir = './node_modules/jest-chance';

    process.chdir(dir);
    console.log(`cwd ${dir}`);
    cb();
  },
  task('yarn install'),
  task('yarn build'),
);

// The directory where compiled locales will go
const compiledDest = `src/app/i18n/locales/.dist`;
// Remove the directory for compiled locales
const cleanLocales = task(`rm -r ${compiledDest}`, { reject: false });

/**
 * Compiles the YAML files for language translations (locales) to minified JSON
 *
 * Code based on: https://gulpjs.com/docs/en/getting-started/using-plugins#inline-plugins
 *
 * @returns Node ReadWriteStream object
 */
const compileLocales = gulp.series(
  cleanLocales,
  function _compileLocals () {
    return gulp.src(['src/app/i18n/locales/**/*.yml', 'src/app/i18n/locales/**/*.yaml'])
      .pipe(_jsonToYamlConverter)
      .pipe(rename({ extname: '.json' }))
      .pipe(gulp.dest(compiledDest))
      .on('finish', () => { console.log(`Compiled locales to ${compiledDest}`); });
  }
);

/**
 * Stash unstaged changes, lint, then run tests without restoring the Git repository to its original
 * state before stashing the unstaged changes. Meant to be used as the first part of the
 * `pre-commit` hook.
 */
const stashThenTest = gulp.series(
  // Stash away unstaged changes that are not going to be committed, so the linting and tests are
  // run on the changes that are going to be committed
  task(
    'git stash push -k -u -m "precommit"',
    { reject: false } // Continue to next task even if there is an error
  ),
  task('yarn next lint'),
  compileLocales, // Needed for the build that happens before the tests
  task('yarn jest'),
  task('yarn playwright test'),
);

/**
 * Pre-commit hook for Git. Runs the task that stashes, lints, and tests; then runs a task to
 * restore the Git repository to its original state before the stashing in the first task.
 */
const precommitHook = gulp.series(
  // Setting `reject` to `false` allows the next task to run regardless of whether there was an
  // error or not
  task('yarn gulp stashThenTest', { reject: false }),
  task('git stash pop', { reject: false }),
);

/**
 * A mini inline Gulp plugin that takes in a YAML file and converts it to a JSON file.
 * As a bonus, the JSON files are minified.
 *
 * Code based on:
 * - https://stackoverflow.com/a/40621445
 * - https://nodejs.org/docs/latest-v18.x/api/stream.html#new-streamtransformoptions
 * - https://stackoverflow.com/a/71459663
 */
const _jsonToYamlConverter = new Transform({
  objectMode: true,
  transform: (file, encoding, callback) => {
    if (file.isBuffer()) {
      // Parse YAML file contents
      const parsedYaml = yaml.load(file.contents.toString());
      // Convert YAML to JSON and write to file
      file.contents = Buffer.from(JSON.stringify(parsedYaml));
    }

    callback(null, file);
  }
});

export {
  buildJestChance,
  compileLocales,
  precommitHook,
  stashThenTest,
};
