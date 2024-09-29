<!-- omit in toc -->
# Developers Documentation

Useful information for developers.

<!-- omit in toc -->
## Table of Contents

- [Setting up the development environment](#setting-up-the-development-environment)
- [Technology Stack](#technology-stack)
- [Project structure](#project-structure)
- [Testing](#testing)
  - [Unit testing](#unit-testing)
  - [End-to-end (E2E) testing](#end-to-end-e2e-testing)
- [Code style guidelines](#code-style-guidelines)
- [Git commit message guidelines](#git-commit-message-guidelines)
  - [Common commit message scopes](#common-commit-message-scopes)
  - [Common commit message type and scope combinations](#common-commit-message-type-and-scope-combinations)
- [Git hooks](#git-hooks)
  - [`pre-commit` hook](#pre-commit-hook)
  - [`commit-msg` hook](#commit-msg-hook)
- [Writing Documentation](#writing-documentation)
- [Releases](#releases)
  - [Changelog](#changelog)
  - [Releases on the `stable` branch](#releases-on-the-stable-branch)

## Setting up the development environment

Instructions for installing, updating and uninstalling the
development environment are in the [Installation Guide](installation.md#installing-the-development-environment).

## Technology Stack

- TypeScript (except for a few configuration files)
- [Next.js](https://nextjs.org/) - Web development framework built on React
- [Jotai](https://jotai.org/) - Global state management for React (similar to
  React Redux)
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [daisyUI](https://daisyui.com/) - Library of UI components built with Tailwind
  CSS
- [Radix UI Primitives](https://www.radix-ui.com/primitives) - Headless UI
  components for React
- [i18next](https://www.i18next.com/) - Internationalization framework
- [Algorand blockchain](https://developer.algorand.org/)

## Project structure

- `.github/`: Contains the code of conduct, contributing guidelines, security
  policy, and other files for setting up the repository for this project on
  GitHub.
- `docs/`: Additional documentation (like this file)
- `public/`: Static assets to be served. Part of the
  [Next.js project structure](https://nextjs.org/docs/getting-started/project-structure)
- `src/`: Application source directory. Part of the [Next.js project structure](https://nextjs.org/docs/getting-started/project-structure)
  - `src/app/`: App Router. Part of the [Next.js project structure](https://nextjs.org/docs/getting-started/project-structure).
    - `src/app/[lang]/`: The root of the routing for this project. This
      directory is a “dynamic segment.”  See the [Next.js documentation](https://nextjs.org/docs/app/building-your-application/routing)
      for more information about routing.
    - `src/app/i18n/`: Contains scripts and translation files for
      internationalization (abbreviated as “i18n”)
      - `src/app/i18n/locales/`: Contains the translations files for each
        supported language/locale
    - `src/app/lib/`: Utilities used throughout the project. There are no
      JSX/TSX files here. Shared JSX/TSX files are usually in one of the
      `component/` directories within `src/app/[lang]/`.
  - `src/e2e/`: End-to-end tests
  - `src/middleware.ts`: Request middleware. Part of the
    [Next.js project structure](https://nextjs.org/docs/getting-started/project-structure)
- `.editorconfig`: [EditorConfig](https://editorconfig.org/) file that contains
   the preferred coding style settings for IDEs
- `.env`: Default values of for the environment variables. Part of the
   [Next.js project structure](https://nextjs.org/docs/getting-started/project-structure)
- `.env.development`: Development environment variables. Part of the
   [Next.js project structure](https://nextjs.org/docs/getting-started/project-structure)
- `.env.local`: Local environment variables. Copy the `.env.local.example` file
   to create this file. It must **never** be committed to the project Git
   repository.
- `.env.local.example`: An example of a `.env.local` file. Does not affect the
   environment.
- `.env.production`: Production environment variables. Part of the
  [Next.js project structure](https://nextjs.org/docs/getting-started/project-structure)
- `.env.test`: Environment variables used for the [E2E tests](#end-to-end-e2e-testing).
- `.erclintrc.json`: ESLint configuration
- `.gitattributes`, `.gitignore`: Git configurations files
- `.swcrc`: SWC (Speedy Web Compiler) [configuration file](https://swc.rs/docs/configuration/swcrc)
- `gulpfile.mjs`: Contains the scripts for to be used with [Gulp task runner](https://gulpjs.com/)
- `jest.config.mjs`: Configuration for [Jest](https://jestjs.io/) unit testing
   framework
- `lefthook.yml`: Configuration for [Lefthook](https://github.com/evilmartians/lefthook)
   Git hooks manager
- `LICENSE.md`: License for this project
- `next-env.d.ts`: TypeScript declaration file for Next.js. This file is not
   committed to the project Git repository.
- `next.config.js`: Next.js configuration. Part of the [Next.js project structure](https://nextjs.org/docs/getting-started/project-structure)
- `package.json`: Project dependencies and scripts
- `playwright.config.ts`: Configuration for [Playwright](https://playwright.dev/)
   end-to-end testing framework
- `postcss.config.js`: Configuration for PostCSS, which is used with [Tailwind](https://tailwindcss.com/docs/installation/using-postcss)
- `README.md`: Read it. It contains introductory information about this project.
- `tailwind.config.js`: [Tailwind CSS](https://tailwindcss.com/) configuration.
   The theme is specified in this file.
- `tsconfig.json`: Typescript configuration
- `yarn.lock`: File generated by Yarn in order to get consistent installs
   across machines. It contains a list of the exact versions of dependencies
   that were installed.

## Testing

This project uses both unit testing and end-to-end (E2E) testing.

### Unit testing

To run all of the unit tests once:

```bash
yarn test
```

To run only the unit tests in "watch mode," where tests for modified files are
run when ever a file is saved:

```bash
yarn test:watch
```

### End-to-end (E2E) testing

To run the E2E tests:

```bash
yarn test:e2e
```

> [!IMPORTANT]
> E2E tests often fail when [development web server](installation.md#running-the-development-web-server)
> is running due to the tests being too slow, especially the tests for Firefox.
> It is recommended that you shut down the development web server before running
> E2E tests or making a commit while using the `--no-verify` or `-n` flag.

## Code style guidelines

- Indent with spaces for all files
- Indent with 2 spaces most of the time
- Always terminate line with a semicolon in TypeScript and JavaScript files
- The maximum length of a line in TypeScript and JavaScript files: 100
  characters
- The maximum length of a line in a MarkDown file SHOULD be 80. This limit is
  not enforced by a linter and some exceptions are acceptable.

The code style guidelines for TypeScript, JavaScript and YAML files are enforced
by a linter. Run the linter using the following command:

```bash
yarn lint
```

## Git commit message guidelines

The Git commit messages for this project follows the [Conventional Commits
specification](https://www.conventionalcommits.org/en/v1.0.0/). These commit
message guidelines are enforced by
[commitlint](https://github.com/conventional-changelog/commitlint/tree/master)
in the `commit-msg` Git hook. You can use the [commitizen](https://github.com/commitizen/cz-cli)
tool to easily write properly formatted commit messages. To do so, run the
following instead of `git commit` when creating a commit:

```bash
yarn cz
```

### Common commit message scopes

> [!NOTE]
> This is not an exhaustive list.

- `app`: The app in general. Usually for files in the `/src/app` directory.
- `compose_txn`: The "Compose Transaction" page
- `sign_txn`: The "Sign Transaction" page
- `send_txn`: The "Send Transaction" page
- `txn_presets`: The "Transaction Preset" page
- `i18n`: Internationalization (I18N), language translations

### Common commit message type and scope combinations

> [!NOTE]
> This is not an exhaustive list.

- `docs(readme)`: Changing the README
- `docs(dev)`: Changing the Developers Documentation
- `perf(aesthetics)`: Improving the look and feel of the user interface (UI)
- `perf(usability)`: Improving the user experience (UX) or usability of the UI
- `perf(a11y)`: Improving the accessibility (a11y) of the UI
- `test(e2e)`: Adding or updating end-to-end (E2E) tests

## Git hooks

This project uses both the `pre-commit` and the `commit-msg` hooks. Use the
following commands to skip running these hooks when committing changes:

```bash
git commit --no-verify
```

Or the shortcut:

```bash
git commit -n
```

The same applies to committing changes using [commitizen](https://github.com/commitizen/cz-cli):

```bash
yarn cz --no-verify
```

Including the shortcut:

```bash
yarn cz -n
```

### `pre-commit` hook

The `pre-commit` hook runs before the commit message is allowed to be written.
It runs the tests and the linter. If any of the tests fail or there is a linter
error, the commit will fail and the prompt to write the commit message will not
appear.

### `commit-msg` hook

The `commit-msg` hook runs after the commit message is submitted. It runs
[commitlint](https://github.com/conventional-changelog/commitlint/tree/master)
to check if the commit message follows
[the guidelines](#git-commit-message-guidelines). If the commit message fails
commitlint, the commit will fail.

## Writing Documentation

External documentation (documentation not within the code) is written in
[Git-Flavored Markdown](https://github.github.com/gfm/). Most of this
documentation is stored in the [`docs` directory](./).

The annotation comments for functions, classes and variables in TypeScript files
should be formatted using the [TSDoc](https://tsdoc.org) specification. In
JavaScript files, the [JSDoc](https://google.github.io/styleguide/jsguide.html#jsdoc)
specification should be used.

## Releases

> [!IMPORTANT]
> For repository owners and maintainers only

> [!TIP]
> Before creating a new release, make sure the remote `main` branch on GitHub
> is up to date with the local `main` branch on the development machine **with all
> of the CI checks passing** on the remote branch.

This project uses [semantic versioning](https://semver.org/) and
[commit messages](#git-commit-message-guidelines) to determine the version
number of releases and generate release notes.

The fastest way to create a new release is:

```bash
yarn release
```

This command increments the version number according to the commit
messages. Then it creates a
[tag](https://www.atlassian.com/git/tutorials/inspecting-a-repository/git-tag)
on the `main` branch, merges the `main` branch onto the `stable` branch, pushes
the changes, and generates a URL for creating a
[Release](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)
on GitHub with the release notes generated based on commit messages. Creating a
Release on GitHub requires signing into the GitHub account of the repository
owner or a maintainer with the right permissions.

### Changelog

This project does not keep a changelog in the form a file (e.g. CHANGELOG.md).
[This project's “Releases” on GitHub](https://github.com/No-Cash-7970/txnDuck/releases),
along with their release notes, is used for that purpose instead.

### Releases on the `stable` branch

Releases happen on the `main` branch first. After a release on the `main`
branch, those changes from the `main` branch should immediately be merged onto
the `stable` branch. This is done automatically when using the `yarn release`
command. The most recent commit on the `stable` branch should always be the
latest release with a version [tag](https://www.atlassian.com/git/tutorials/inspecting-a-repository/git-tag).
This means that only “released” code is deployed to [Production](https://txnduck.vercel.app).
