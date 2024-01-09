<!-- omit in toc -->
# Developers Documentation

This is documentation contains information useful for developers.

<!-- omit in toc -->
## Table of Contents

- [Technology Stack](#technology-stack)
- [Requirements for the development environment](#requirements-for-the-development-environment)
- [Installing the development environment](#installing-the-development-environment)
- [Updating the development environment](#updating-the-development-environment)
- [Uninstalling the development environment](#uninstalling-the-development-environment)
- [Running the development web server](#running-the-development-web-server)
- [Building for production](#building-for-production)
  - [Deploying to somewhere other than localhost or Vercel](#deploying-to-somewhere-other-than-localhost-or-vercel)
- [Project structure](#project-structure)
- [Testing](#testing)
  - [Unit testing](#unit-testing)
  - [End-to-end (E2E) testing](#end-to-end-e2e-testing)
- [Code style guidelines](#code-style-guidelines)
- [Git commit message guidelines](#git-commit-message-guidelines)
- [Git hooks](#git-hooks)
  - [`pre-commit` hook](#pre-commit-hook)
  - [`commit-msg` hook](#commit-msg-hook)
- [Documentation](#documentation)
- [Releases](#releases)
  - [Changelog](#changelog)
  - [Releases on the `stable` branch](#releases-on-the-stable-branch)

## Technology Stack

- TypeScript (except for a few configuration files)
- [Next.js](https://nextjs.org/) - Web development framework built on React
- [Jotai](https://jotai.org/) - Global state management for React (similar to
  React Redux)
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [daisyUI](https://daisyui.com/) - Library of UI components built with Tailwind
  CSS
- [i18next](https://www.i18next.com/) - Internationalization framework
- [Algorand blockchain](https://developer.algorand.org/)

## Requirements for the development environment

- Access to your machine's command-line interface (CLI), such as Terminal,
  PowerShell or Command Prompt
- [Git](https://git-scm.com/) installed
- [Node.js](https://nodejs.org/en) version 18.18.0 or higher installed. Version
  20.0.0 or higher is recommended.
- [Yarn](https://yarnpkg.com/getting-started/install) package manager installed.
  Version 2.0.0 or higher, version 4.0.0 or higher is recommended.  
  NOTE: Install and switch to Yarn 2.0.0 or higher by running
  `corepack enable && yarn set version berry`
- (OPTIONAL BUT RECOMMENDED) [Visual Studio Code](https://code.visualstudio.com/)
  IDE (integrated development environment)

## Installing the development environment

1. Clone the repository.

    ```bash
    git clone https://github.com/No-Cash-7970/txnDuck.git
    ```

2. Install the dependencies.

    ```bash
    yarn install && gulp installDev
    ```

## Updating the development environment

1. Pull the changes.

    ```bash
    git pull
    ```

2. Update the dependencies.

    ```bash
    yarn install:dev
    ```

## Uninstalling the development environment

1. Delete the project directory that was created when cloning the repository.
   (Step #1 of the
   [installation instructions](#installing-the-development-environment))
2. OPTIONAL: Uninstall the software listed in the
   [requirements for the development environment](#requirements-for-the-development-environment)
   if you do not need them for something else.

## Running the development web server

The development server runs your local copy of the repository. This local
development server uses [Next.js's Fast
Reload](https://nextjs.org/docs/architecture/fast-refresh) to automatically
refresh the page in the browser as you save changes. Do the following to run and
use the development server:

1. Start the development server.

    ```bash
    yarn dev
    ```

2. Open a web browser and go to <http://localhost:3000>.
3. Edit a file in the `src/app` directory and see the result!
4. Stop the web server by pressing <kbd>Ctrl</kbd>+<kbd>C</kbd> (or
   <kbd>Cmd</kbd>+<kbd>C</kbd> on Mac). You can start the web server again by
   following Step #1.

## Building for production

To build for production run:

```bash
yarn build
```

To run the build locally in a local web server, which would be served at
<http://localhost:3000>:

```bash
yarn start
```

Or, you can build and run with one command:

```bash
yarn prod
```

### Deploying to somewhere other than localhost or Vercel

If the build is going to deployed to somewhere other than localhost or
[Vercel](https://vercel.com/), then the `BASE_URL` environment variable needs
to be set to the URL of what will be the home page of the deployed website. The
`BASE_URL` can be set in a `.env.local` file, which can be created by copying
the `.env.local.example` file and renaming it to `.env.local`. Alternatively,
the `BASE_URL` can be set in the `.env.production` file. However, it is best to
set the `BASE_URL` in the `.env.local` file because it will not be overwritten
when upgrading to a new version.

Here is an example to show what setting the `BASE_URL` looks like:

```shell
# .env.local file
# ...other settings here

BASE_URL=https://example.com

# some more settings here...
```

## Project structure

- `/.github/`: Contains the code of conduct, contributing guidelines, security
  policy, and other files for setting up the repository for this project on
  GitHub.
- `/docs/`: Additional documentation (like this file)
- `/public/`: Static assets to be served. Part of the
  [Next.js project structure](https://nextjs.org/docs/getting-started/project-structure)
- `/src/`: Application source directory. Part of the [Next.js project structure](https://nextjs.org/docs/getting-started/project-structure)
  - `/src/app/`: App Router. Part of the [Next.js project structure](https://nextjs.org/docs/getting-started/project-structure).
    - `/src/app/[lang]/`: The root of the routing for this project. This
      directory is a “dynamic segment.”  See the [Next.js documentation](https://nextjs.org/docs/app/building-your-application/routing)
      for more information about routing.
    - `/src/app/i18n/`: Contains scripts and translation files for
      internationalization (abbreviated as “i18n”)
      - `/src/app/i18n/locales/`: Contains the translations files for each
        supported language/locale
    - `/src/app/lib/`: Utilities used throughout the project. There are no
      JSX/TSX files here. Shared JSX/TSX files are usually in one of the
      `component/` directories within `/src/app/[lang]/`.
  - `/src/e2e/`: End-to-end tests
  - `/src/middleware.ts`: Request middleware. Part of the
    [Next.js project structure](https://nextjs.org/docs/getting-started/project-structure)
- `/.editorconfig`: [EditorConfig](https://editorconfig.org/) file that contains
   the preferred coding style settings for IDEs
- `/.env`: Default values of for the environment variables. Part of the
   [Next.js project structure](https://nextjs.org/docs/getting-started/project-structure)
- `/.env.development`: Development environment variables. Part of the
   [Next.js project structure](https://nextjs.org/docs/getting-started/project-structure)
- `/.env.local`: Local environment variables. Copy the `.env.local.example` file
   to create this file. It must **never** be committed to the project Git
   repository.
- `/.env.local.example`: An example of an `.env.local` file. Does not affect the
   environment.
- `/.env.production`: Production environment variables. Part of the
  [Next.js project structure](https://nextjs.org/docs/getting-started/project-structure)
- `/.erclintrc.json`: ESLint configuration
- `/.gitattributes`, `/.gitignore`: Git configurations files
- `/.swcrc`: SWC (Speedy Web Compiler) [configuration file](https://swc.rs/docs/configuration/swcrc)
- `/gulpfile.mjs`: Contains the scripts for to be used with [Gulp task runner](https://gulpjs.com/)
- `/jest.config.mjs`: Configuration for [Jest](https://jestjs.io/) unit testing
   framework
- `/lefthook.yml`: Configuration for [Lefthook](https://github.com/evilmartians/lefthook)
   Git hooks manager
- `/LICENSE.md`: License for this project
- `/next-env.d.ts`: TypeScript declaration file for Next.js. This file is not
   committed to the project Git repository.
- `/next.config.js`: Next.js configuration. Part of the [Next.js project structure](https://nextjs.org/docs/getting-started/project-structure)
- `/package.json`: Project dependencies and scripts
- `/playwright.config.ts`: Configuration for [Playwright](https://playwright.dev/)
   end-to-end testing framework
- `/postcss.config.js`: Configuration for PostCSS, which is used with [Tailwind](https://tailwindcss.com/docs/installation/using-postcss)
- `/README.md`: Read it. It contains introductory information about this project.
- `/tailwind.config.js`: [Tailwind CSS](https://tailwindcss.com/) configuration.
   The theme is specified in this file.
- `/tsconfig.json`: Typescript configuration
- `/yarn.lock`: File generated by Yarn in order to get consistent installs
   across machines. It contains a list of the exact versions of dependencies
   that were installed.

## Testing

This project uses both unit testing and end-to-end (E2E) testing.

### Unit testing

To run all of the unit tests once (Note that it's **j**est with a **j**, not
**t**est):

```bash
yarn jest
```

To continuously run all of the units when a file is changed (Note that it's
**t**est with a **t**, not **j**est):

```bash
yarn test
```

### End-to-end (E2E) testing

To run the E2E tests:

```bash
yarn test:e2e
```

## Code style guidelines

- Indent with spaces for all files
- Indent with 2 spaces most of the time
- Always terminate line with a semicolon in TypeScript and JavaScript files
- The maximum length of a line in TypeScript and JavaScript files: 100
  characters

The code style guidelines for TypeScript, JavaScript and YAML files are enforced
by a linter. Run the linter using the following command:

```bash
yarn lint
```

## Git commit message guidelines

The Git commit messages for project follows the [Conventional Commits
specification](https://www.conventionalcommits.org/en/v1.0.0/). These commit
message guidelines are enforced by
[commitlint](https://github.com/conventional-changelog/commitlint/tree/master)
in the `commit-msg` Git hook. You can choose to use the
[commitizen](https://github.com/commitizen/cz-cli) tool that is installed to
easily write properly formatted commit messages. Run the following instead of
`git commit` when creating a commit:

```bash
yarn cz
```

## Git hooks

This project uses both the `pre-commit` and the `commit-msg` hook. Use the
following commands to skip running these hooks when committing changes:

```bash
git commit --no-verify
```

Or, the shortcut:

```bash
git commit -n
```

### `pre-commit` hook

The `pre-commit` hook runs before allowing the user to write the commit message.
It runs the tests and the linter. If any of the tests fail or there is a linter
error, the commit will fail and the commit message prompt will not appear.

### `commit-msg` hook

The `commit-msg` hook runs after the commit message is submitted. It runs
[commitlint](https://github.com/conventional-changelog/commitlint/tree/master)
to check if the commit message follows
[the guidelines](#git-commit-message-guidelines). If the commit message fails
commitlint, the commit will fail.

## Documentation

External documentation is written in
[Git-Flavored Markdown](https://github.github.com/gfm/) and stored in the
[`docs` directory](./).

The annotation comments for functions, classes and variables in TypeScript files
should be formatted using the [TSDoc](https://tsdoc.org) specification. In
JavaScript files, the
[JSDoc](https://google.github.io/styleguide/jsguide.html#jsdoc) specification
should be used.

## Releases

:warning: **For repository owners and maintainers only**

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
on the `main` branch, pushes the changes, and generates a URL for creating a
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
branch, those changes from the `main` branch should be merged onto the the
`stable` branch. Therefore, the most recent commit on the `stable` branch should
always be a release with a version
[tag](https://www.atlassian.com/git/tutorials/inspecting-a-repository/git-tag).
This means that only “released” code is deployed to the [Production](https://txnduck.vercel.app).
