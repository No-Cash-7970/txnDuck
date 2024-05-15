<h1>
    txnDuck 🦆<br>
    Transaction Builder UI
</h1>

[![Algorand badge](https://img.shields.io/badge/Algorand-006883?style=for-the-badge&logo=Algorand)](https://developer.algorand.org/)&nbsp;
[![Next.js badge](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)&nbsp;
[![Tailwindcss badge](https://img.shields.io/badge/Tailwindcss-0ea5e9?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)&nbsp;
[![License MIT badge](https://img.shields.io/github/license/No-Cash-7970/txnDuck?style=for-the-badge&color=8e5548)](LICENSE.md)&nbsp;

[![PWA Shields](https://www.pwa-shields.com/1.0.0/series/install/green.svg)](https://txnduck.vercel.app)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FNo-Cash-7970%2FtxnDuck.svg?type=small)](https://app.fossa.com/projects/git%2Bgithub.com%2FNo-Cash-7970%2FtxnDuck?ref=badge_small)

A free and open source web-based tool that serves as a graphical user interface
(GUI) for easily creating and sending Algorand transactions without the need for
software development knowledge.

<!-- omit in toc -->
## :compass: Table of contents

- [:globe\_with\_meridians: Websites](#globe_with_meridians-websites)
- [:sparkles: Features](#sparkles-features)
- [:speech\_balloon: Supported languages](#speech_balloon-supported-languages)
- [:computer: Setting up and running locally](#computer-setting-up-and-running-locally)
  - [Requirements for local setup](#requirements-for-local-setup)
  - [Installing the local setup](#installing-the-local-setup)
  - [Uninstalling and removing the local setup](#uninstalling-and-removing-the-local-setup)
  - [Updating the local setup](#updating-the-local-setup)
- [:hammer\_and\_wrench: Installation for development](#hammer_and_wrench-installation-for-development)
- [:handshake: Contributing](#handshake-contributing)
- [:trophy: Acknowledgments](#trophy-acknowledgments)

## :globe_with_meridians: Websites

You can use txnDuck for free (excluding any
Algorand network fees) at the following websites:

**Production:** <https://txnduck.vercel.app>  
Preview: <https://txnduck-preview.vercel.app>

The Production website hosts the latest stable release (the `stable` branch)
where are all of the features are considered complete and stable. On the other
hand, the Preview website usually hosts the unstable version (the `main` branch)
with the latest developments, so it may have incomplete and/or unstable features
that have yet to be released. There may be times when both websites are the
same.

## :sparkles: Features

- Build and send a transaction to transfer Algos, create a token or NFT, call an
  application (smart contract), etc.
- Import a transaction file to sign or send
- Export to a signed/unsigned transaction file
- Specify custom Algod node
- FUTURE: Build transaction groups (atomic transactions)

## :speech_balloon: Supported languages

The UI (user interface) for txnDuck has multiple supported languages. However,
not all of the languages have the same amount of support. The translations for
some of the supported languages may be incomplete or contain errors due to being
a machine translation.

If you want to help by adding or fixing a translation, read about how you can do
so [in the Contributing Guidelines](.github/CONTRIBUTING.md#submitting-translations).

Language | Completeness | Machine translated?
---------|--------------|---------------------
English  | Full         | No
Spanish  | Full         | *Yes*

## :computer: Setting up and running locally

> [!IMPORTANT]
> This is not for development. To set up and run txnDuck for development,
> follow the instructions for
> [installing txnDuck for development](#hammer_and_wrench-installation-for-development).

Instead of using one of the [official txnDuck websites](#globe_with_meridians-websites),
you can choose to download the source code and run the software locally on your
own computer that does not rely on an external website.

### Requirements for local setup

- Access to your machine's command line interface (CLI), such as Terminal,
  PowerShell or Command Prompt
- [Node.js](https://nodejs.org/en) version 18.18.0 or higher installed. Version
  20.0.0 or higher is recommended.
- [Yarn](https://yarnpkg.com/getting-started/install) package manager installed.
  Version 2.0.0 or higher, version 4.0.0 or higher is recommended.
   > [!NOTE]
   > If you have Yarn 1.x.x installed, you can install and switch to Yarn 2.0.0
   > or higher by running `corepack enable && yarn set version berry`

### Installing the local setup

1. Download the latest source code.
    - Production (`stable` branch):
      <https://github.com/No-Cash-7970/txnDuck/archive/refs/heads/stable.zip>
    - Preview (`main` branch):
      <https://github.com/No-Cash-7970/txnDuck/archive/refs/heads/main.zip>
2. Unzip the downloaded source code. You should now have a new folder that
   contains a bunch of files and folder, which include "public" and "yarn.lock".
3. Open the CLI and go to the folder created in step #2 by running the following
   in the CLI. Of course, replace `PATH/TO/SOURCE_CODE/FOLDER` with the actual
   path to the folder.

    ```bash
    cd PATH/TO/SOURCE_CODE/FOLDER
    ```

4. Install the source code dependencies.

    ```bash
    yarn workspaces focus --all --production
    ```

5. Build the source code.

    ```bash
    yarn build
    ```

6. Run the web server.

    ```bash
    yarn start
    ```

7. Open a web browser and go to <http://localhost:3000> to start using your
   local txnDuck! :tada: The web server must be running in the
   CLI (Command Line Interface) to use your local txnDuck.
8. (Optional) If you are finished using your local txnDuck, stop the web server
   by closing the CLI window or by
   pressing <kbd>Ctrl</kbd>+<kbd>C</kbd> (or <kbd>Cmd</kbd>+<kbd>C</kbd> on Mac)
   while in the CLI. You can start the web server again by following Steps #6 and #7.

### Uninstalling and removing the local setup

1. Make sure the web server is not running. Stop the server if it is. Refer to
   step #8 in the [installation instructions](#installing-the-local-setup).
2. Delete the source code folder. (The folder created in Step #2 of the
   [installation instructions](#installing-the-local-setup))
3. OPTIONAL: Uninstall the software listed in the
   [requirements for local setup](#requirements-for-local-setup) if you do not
   need them for something else.

### Updating the local setup

Some time after [installing the local setup](#installing-the-local-setup), a new
version of txnDuck may be
[released](https://github.com/No-Cash-7970/txnDuck/releases). It is recommended
that you update to the latest version to have the latest features and bug fixes.

1. OPTION #1: Uninstall the old version by following [Steps #1 and #2 of the
   uninstallation instructions](#uninstalling-and-removing-the-local-setup).  
   OPTION #2: Keep the old version and rename the source code folder for the old
   version.  
   OPTION #3: Keep the old version without renaming its source code folder. When
   installing the new version, use a different name for the new version's source
   code folder.
2. Make sure the web server is not running. Stop the server if it is. Refer to
   step #8 in the [installation instructions](#installing-the-local-setup).
3. Follow the [installation instructions](#installing-the-local-setup) again.
   Make sure you download the latest source code.

## :hammer_and_wrench: Installation for development

Refer to the [Developers Documentation](docs/DEVELOPERS.md#installing-the-development-environment)
for instructions on how to install, update or uninstall the development environment.

## :handshake: Contributing

Contributions are highly welcomed and appreciated. Every little bit of help
counts, so do not hesitate! Please read the [Contributing Guidelines](.github/CONTRIBUTING.md)
to learn how to contribute to this project.

## :trophy: Acknowledgments

- [SilentRhetoric](https://github.com/SilentRhetoric) - Proposed the idea of a
  transaction builder for Algorand
- [Wes](https://github.com/WesleyMiller1998) - Recommended the name "txnDuck"
