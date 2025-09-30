import gulp from 'gulp';
import { exec, task } from 'gulp-execa';
import rename from 'gulp-rename';
import fs from 'node:fs';
import { Transform } from 'node:stream';
import yaml from 'js-yaml';
import archiver from 'archiver';

/** The directory where compiled locales will go */
const COMPILED_DEST = `src/app/i18n/locales/.dist`;
/** Name of the "main" Git branch, which has the latest *changes* */
const GIT_BRANCH_MAIN = 'main';
/** Name of the "stable" Git branch, which has the latest *release* */
const GIT_BRANCH_STABLE = 'stable';

/** Remove the directory for compiled locales */
const cleanLocales = task(`rm -r ${COMPILED_DEST}`, { reject: false });

/** Convert the YAML local files to JSON
 * @returns {NodeJS.ReadWriteStream}
 */
const convertLocales = () => {
  return gulp.src(['src/app/i18n/locales/**/*.yml', 'src/app/i18n/locales/**/*.yaml'])
    .pipe(yamlToJsonConverter)
    .pipe(rename({ extname: '.json' }))
    .pipe(gulp.dest(COMPILED_DEST))
    .on('finish', () => { console.log(`Compiled locales to ${COMPILED_DEST}`); });
};

/** A mini inline Gulp plugin that takes in a YAML file and converts it to a JSON file.
 * As a bonus, the JSON files are minified.
 *
 * Code based on:
 * - https://stackoverflow.com/a/40621445
 * - https://nodejs.org/docs/latest-v18.x/api/stream.html#new-streamtransformoptions
 * - https://stackoverflow.com/a/71459663
 */
const yamlToJsonConverter = new Transform({
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

/** Lint subtask for the Git pre-commit hook
 * @returns {ExecaChildProcess|Promise}
 */
const precommitLint = () => {
  return exec('yarn lint')
    .catch(() => stashPopFail('Lint failed')); // Clean up if fail
};

/** End-to-end testing subtask for the Git pre-commit hook
 * @returns {ExecaChildProcess|Promise}
 */
const precommitE2eTest = () => {
  return exec('yarn playwright test -x --reporter=dot')
    .catch(() => stashPopFail('E2E testing failed')); // Clean up if fail
};

/** Unit testing subtask for the Git pre-commit hook
 * @returns {ExecaChildProcess|Promise}
 */
const precommitUnitTest = () => {
  return exec('yarn jest -b --reporters=jest-wip-reporter')
    .catch(() => stashPopFail('Unit testing failed')); // Clean up if fail
};

/** Restore the Git repository to its original state before the stashing */
const stashPop = task('git stash pop', { reject: false });

/** Restore the Git repository to its original state before the stashing and return an error. For
 * cleaning up after a task fails.
 *
 * @param {string} errorMsg Message for the thrown error
 * @throws {Error} An error with the given error message
 */
const stashPopFail = async (errorMsg = '') => {
  await exec('git stash pop', { reject: false });
  throw new Error(errorMsg);
};

/** Zip the files for easier distribution
 * @returns A promise that resolves when zip has been created
 */
const zipStandalone = async () => {
  const outFilename = process.env.STANDALONE_FILENAME
    || `${process.env.npm_package_name}-${process.env.npm_package_version}`;
  const output = fs.createWriteStream(`./build/${outFilename}.zip`);
  const archive = archiver('zip').glob('**', { cwd: '.next/standalone', dot: true });

  // Pipe archive data to the file
  archive.pipe(output)
    // Good practice to catch this error explicitly
    .on('error', err => { throw err; })
    // Good practice to catch warnings (i.e. stat failures and other non-blocking errors)
    .on('warning', err => console.warn(err));

  // The 'close' event is fired only when a file descriptor is involved
  output.on('close', () => console.log(`${archive.pointer()} total bytes written to archive.`))
    // This event is fired when the data source is drained no matter what was the data source.
    // It is not part of this library but rather from the NodeJS Stream API.
    // @see: https://nodejs.org/api/stream.html#stream_event_end
    .on('end', () => console.log('Data has been drained'));

  // Finalize the archive (ie we are done appending files but streams have to finish yet)
  // 'close', 'end' or 'finish' events may be fired right after calling this method so register to
  // them beforehand
  return await archive.finalize();
};

/*
 *******************************************************************************
 * Tasks                                                                       *
 *******************************************************************************
 */

/** Compiles the YAML files for language translations (locales) to minified JSON
 *
 * Code based on: https://gulpjs.com/docs/en/getting-started/using-plugins#inline-plugins
 */
export const compileLocales = gulp.series(cleanLocales, convertLocales);

/** Install and set up developer tools */
export const installDev = gulp.parallel(
  task('yarn lefthook install'),
  task('yarn playwright install')
);

/** Things that need to be done before building the project. The "prebuild". Usually consists of
 * compiling files that will be used in the building process.
 */
export const prebuild = gulp.parallel(
  compileLocales,
);

/** Pre-commit hook for Git. Runs the task that stashes, lints, and tests; then runs a task to
 * restore the Git repository to its original state before the stashing in the first task.
 */
export const precommitHook = gulp.series(
  // Stash away unstaged changes that are not going to be committed, so the linting and tests are
  // run on the changes that are going to be committed
  task(
    'git stash push -k -u -m "precommit"',
    { reject: false } // Continue onto next task even if there is an error
  ),
  // Lint first, a lint error will cause this task to end early. Errors caught by the linter often
  // cause unit test and E2E test failures, so lint error should be fixed before running the tests.
  precommitLint,
  // Needed for the build that happens before the tests
  compileLocales,
  // Run all of the unit tests before E2E tests because if one of those fails, there's no need to
  // run the E2E tests, which typically take much longer. Something that causes a unit test to fail
  // is likely to cause at least one of the E2E tests to fail.
  precommitUnitTest,
  // E2E tests. Typically take a long time
  precommitE2eTest,
  // Clean up if everything succeeds
  stashPop
);

/** Series of tasks after making a release */
export const postRelease = gulp.series(
  // Update the "stable" branch and push the update to remote
  task(`git checkout ${GIT_BRANCH_STABLE}`),
  task(`git merge ${GIT_BRANCH_MAIN}`),
  task('git push'),
  task(`git checkout ${GIT_BRANCH_MAIN}`),
);

/** Create a standalone build that includes the static assets. */
export const buildStandalone = gulp.series(
  // Build using "standalone" mode
  async function setEnv() { process.env.STANDALONE_BUILD = true; },
  task('yarn build'),
  // Add static assets because NextJS's static build does not include it
  task('cp -r public .next/standalone'),
  task('cp -r .next/static .next/standalone/.next'),
  // The public/index.html is for static build only, so remove it for the standalone build
  task('rm .next/standalone/public/index.html', { reject: false }),
);

/** Build standalone and zip it. Usually used for making a GitHub
 * release artifact. */
export const buildZipStandalone = gulp.series(
  buildStandalone,
  // Make the "build" directory in case it does not exist
  task('mkdir build', { reject: false }),
  zipStandalone,
);
