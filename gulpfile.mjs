import gulp from 'gulp';
import { exec, task } from 'gulp-execa';
import rename from 'gulp-rename';
import { Transform } from 'stream';
import yaml from 'js-yaml';

/**
 * The directory where compiled locales will go
 */
const COMPILED_DEST = `src/app/i18n/locales/.dist`;

/**
 * Remove the directory for compiled locales
 */
const cleanLocales = task(`rm -r ${COMPILED_DEST}`, { reject: false });

/**
 * A mini inline Gulp plugin that takes in a YAML file and converts it to a JSON file.
 * As a bonus, the JSON files are minified.
 *
 * Code based on:
 * - https://stackoverflow.com/a/40621445
 * - https://nodejs.org/docs/latest-v18.x/api/stream.html#new-streamtransformoptions
 * - https://stackoverflow.com/a/71459663
 */
const jsonToYamlConverter = new Transform({
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

/**
 * Restore the Git repository to its original state before the stashing
 */
const stashPop = task('git stash pop', { reject: false });

/**
 * Restore the Git repository to its original state before the stashing and return an error. For
 * cleaning up after a task fails.
 *
 * @param {string} errorMsg Message for the thrown error
 * @returns {boolean} False, which results in error
 */
const stashPopFail = async (errorMsg = '') => {
  await exec('git stash pop', { reject: false });
  return false;
};

/*
 *******************************************************************************
 * Tasks                                                                       *
 *******************************************************************************
 */

/**
 * Build the `jest-chance` dependency
 *
 * This is needed because a fork of jest-chance is being used. This task can be removed if using
 * the official jest-chance package.
 */
export const buildJestChance = gulp.series(
  (cb) => {
    const dir = './node_modules/jest-chance';

    process.chdir(dir);
    console.log(`cwd ${dir}`);
    cb();
  },
  task('yarn install'),
  task('yarn build'),
);

/**
 * Compiles the YAML files for language translations (locales) to minified JSON
 *
 * Code based on: https://gulpjs.com/docs/en/getting-started/using-plugins#inline-plugins
 *
 * @returns Node ReadWriteStream object
 */
export const compileLocales = gulp.series(
  cleanLocales,
  function _compileLocales() { // Use named function so output doesn't show '<anonymous>'
    return gulp.src(['src/app/i18n/locales/**/*.yml', 'src/app/i18n/locales/**/*.yaml'])
      .pipe(jsonToYamlConverter)
      .pipe(rename({ extname: '.json' }))
      .pipe(gulp.dest(COMPILED_DEST))
      .on('finish', () => { console.log(`Compiled locales to ${COMPILED_DEST}`); });
  }
);

/**
 * Pre-commit hook for Git. Runs the task that stashes, lints, and tests; then runs a task to
 * restore the Git repository to its original state before the stashing in the first task.
 */
export const precommitHook = gulp
  .series(
    // Stash away unstaged changes that are not going to be committed, so the linting and tests are
    // run on the changes that are going to be committed
    task(
      'git stash push -k -u -m "precommit"',
      { reject: false } // Continue onto next task even if there is an error
    ),
    // Lint first, a lint error will cause this task to end early. Errors caught by the linter often
    // cause unit test and E2E test failures, so lint error should be fixed before running the
    // tests.
    () => exec('yarn next lint').catch(stashPopFail('Lint failed')), // Clean up if fail
    // Needed for the build that happens before the tests
    compileLocales,
    // Run all of the unit tests before E2E tests because if one of those fails, there's no need to
    // run the E2E tests, which typically take much longer. Something that causes a unit test to
    // fail is likely to cause at least one of the E2E tests to fail.
    () => exec('yarn jest -b').catch(stashPopFail('Unit testing failed')), // Clean up if fail
    // E2E tests. Typically take a long time
    () => exec('yarn playwright test -x').finally(stashPop), // Always clean up after last item
  );
