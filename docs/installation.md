<!-- omit in toc -->
# Installation Guide

This guide contains instructions for the multiple methods of installing and
running a self-hosted instance of txnDuck. There are also upgrade and
uninstallation instructions for each of the installation methods.

## Which installation method should I choose?

- For the fastest and easiest installation of the stable Production version using Node:
  [Portable package installation](#portable-package-installation)
- For the fastest and easiest installation of the stable Production version using Docker:
  [Production Docker image](#production-docker-image)
- For more flexibility and customization with either the Production or Preview version:
  [Source code installation](#source-code-installation)
- For modifying and testing the code for development:
  [Development environment installation](#development-environment-installation)
- For quickly and easily setting up the development environment using Docker:
  [Development environment using Docker](#development-environment-with-docker)

<!-- Portable package installation method:

- Fastest and easiest method
- Only supports installing a *stable* release
- Not for development
- The least flexible
- Web server must serve at localhost
- Installation can be easily moved to another machine or location on the same machine

Source code installation method:

- Possible to get the latest cutting edge features
- Takes longer
- Not for development
- More configuration options: Web server can be localhost or remote at some other domain

Development environment installation method:

- For development
- Takes the longest to install
- The most flexible and configurable
- Only needed if making changes to the code -->

## Portable package installation

Easily run a private instance of txnDuck by installing the portable,
self-contained, "standalone" package for the [latest stable release](https://github.com/No-Cash-7970/txnDuck/releases/latest).
It includes a lightweight server that allows for a private self-hosted instance
of txnDuck to be quick and easy to run.

> [!IMPORTANT]
> This installation method is not for development.

### Requirements for the portable package installation

- Access to the command-line interface (CLI), such as Terminal, PowerShell or
  Command Prompt
- [Node.js](https://nodejs.org) version 18.18.0 or higher installed. Version
  20.0.0 or higher is recommended.

### Installing and running the portable package

1. Download the `txnduck-x.x.x.zip` file for the [latest release](https://github.com/No-Cash-7970/txnDuck/releases/latest).
2. Unzip the downloaded file. There should now be a new folder that contains a
   bunch of files and folders, such as `public` and `server.js`.
3. Open the CLI and go to the folder created in Step #2 by running the following
   in the CLI. Of course, replace `PATH/TO/SOURCE_CODE/FOLDER` with the actual
   path to the folder.

    ```bash
    cd PATH/TO/SOURCE_CODE/FOLDER
    ```

4. Run the web server.

    ```bash
    node server.js
    ```

    <details>
    <summary>
        :bulb: TIP: Makes sure the server is serving at localhost:3000.
        Click for more details.
    </summary>

    The portable package installation assumes the web server is serving at
    `http://localhost:3000`. However, the installation on some machines may
    default to some other URL. The web server *not* serving at
    `http://localhost:3000` may cause certain features to not work correctly.

    To force the web server to serve at `http://localhost:3000`, set the
    `HOSTNAME` and `PORT` environment variables before running the server:

    ```bash
    PORT=3000 HOSTNAME=localhost node server.js
    ```

    </details>

5. Open a web browser and go to <http://localhost:3000> to start using your
   own txnDuck! :tada: The web server must be running in the CLI (Command Line
   Interface) to use your txnDuck.
6. If you are finished using your txnDuck, stop the web server by closing the
   CLI window or by pressing <kbd>Ctrl</kbd>+<kbd>C</kbd> (or
   <kbd>Cmd</kbd>+<kbd>C</kbd> on Mac)
   while in the CLI. Start the web server again by following Steps #3–5.

### Uninstalling and removing the portable package

1. Make sure the web server is not running. Stop the server if it is. Refer to
   Step #6 in the [installation instructions](#installing-and-running-the-portable-package).
2. Delete the folder created in Step #2 of the [installation instructions](#installing-and-running-the-portable-package).
3. OPTIONAL: Uninstall software listed in the [requirements](#requirements-for-the-portable-package-installation)
   if the software is not needed for something else.

### Upgrading to the latest portable package

Some time after [installing the portable package](#installing-and-running-the-portable-package),
there will likely be a newer version of the txnDuck portable package. Upgrade to
the latest version to get the latest features and bug fixes:

1. Make sure the web server is not running. Stop the server if it is. Refer to
   Step #6 in the [installation instructions](#installing-and-running-the-portable-package).
2. Follow the [installation instructions](#installing-and-running-the-portable-package)
   again.

## Production Docker image

Use Docker to run an instance of the production version of txnDuck without
installing extra dependencies on your machine.

> [!IMPORTANT]
> This installation method is not for development.

### Requirements for the production Docker image

- Access to the command-line interface (CLI), such as Terminal, PowerShell or
  Command Prompt
- [Docker](https://www.docker.com/) installed.

### Installing and running the production Docker image

1. Pull the image.

   ```bash
   docker pull ghcr.io/no-cash-7970/txnduck
   ```

2. Create and run a container.

   ```bash
   docker run -d -p 3000:3000 ghcr.io/no-cash-7970/txnduck
   ```

    If you need to use a port other than 3000, use the following instead:

    ```bash
    docker run -d -p [PORT]:3000 ghcr.io/no-cash-7970/txnduck
    ```

    Replace `[PORT]` with the port number you would like to use. For example,
    use port 3001 instead of 3000:

    ```bash
    docker run -d -p 3001:3000 ghcr.io/no-cash-7970/txnduck
    ```

3. OPTIONAL: Stop the container.

   ```bash
   docker stop container_name
   ```

4. OPTIONAL: Run the container after stopping it.

   ```bash
   docker run -d container_name
   ```

### Uninstalling and removing the production Docker image

1. Stop the container if it is running.

   ```bash
   docker stop ghcr.io/no-cash-7970/txnduck
   ```

2. Delete the container.

   ```bash
   docker rm ghcr.io/no-cash-7970/txnduck
   ```

3. Delete the image.

   ```bash
   docker rmi ghcr.io/no-cash-7970/txnduck
   ```

### Upgrading to the latest production Docker image

1. [Uninstall the image](#uninstalling-and-removing-the-production-docker-image)
2. [Install the newer version of the image](#installing-and-running-the-production-docker-image)

## Source code installation

Install a self-hosted instance of txnDuck by building the source code.

> [!IMPORTANT]
> Although this installation method is close to the
> [installation method for development](#development-environment-installation),
> it is *not* for development. It does not include the installation of the
> development tools.

### Requirements for source code installation

- Access to the command-line interface (CLI), such as Terminal, PowerShell or
  Command Prompt
- [Node.js](https://nodejs.org/en) version 18.18.0 or higher installed. Version
  20.0.0 or higher is recommended.
- [Yarn](https://yarnpkg.com/getting-started/install) package manager installed.
  Version 2.0.0 or higher, version 4.0.0 or higher is recommended.
   > NOTE: If you have Yarn 1.x.x installed, install and switch to Yarn 2.0.0 or
   > higher by running `corepack enable && yarn set version berry`.

### Installing and running the source code

1. Download the latest source code.
    - Production (`stable` branch):
      <https://github.com/No-Cash-7970/txnDuck/archive/refs/heads/stable.zip>
    - Preview (`main` branch):
      <https://github.com/No-Cash-7970/txnDuck/archive/refs/heads/main.zip>
2. Unzip the downloaded file. There should now be a new folder that contains a
   bunch of files and folders, such as `public` and `yarn.lock`.
3. Open the CLI and go to the folder created in Step #2 by running the following
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

    <details>
    <summary>
        :dart: ADVANCED TIP: Customize the build by setting environment
        variables.
        Click for more details.
    </summary>

    The output of the build can be changed by setting certain environment
    variables before running the `yarn build` command. For a list of
    environment variables that change the build output, look within the
    `.env.local.example` file in the source code.

    ***Example 1***: Specify a different base URL by setting the `BASE_URL`.
    This allows for a web server to serve at the specified URL without issue.

    ```bash
    BASE_URL=localhost:8080 yarn build
     ```

    ***Example 2***: Enable WalletConnect as a wallet connection method by
    setting the WalletConnect Project ID.

    ```bash
    NEXT_PUBLIC_WC_PROJECT_ID=f1696e8f42e091fd86849791bd309d82 yarn build
    ```

    ***Example 3***: Create and use a `.env.local` file to set environment
    variables. It is better to use a `.env.local` file when setting many
    environment variables. Quickly create a `.env.local` file by copying the
    `.env.local.example` file and renaming the copy to `.env.local`.
    Environment variables not set in the `.env.local` file will use the values
    set in the `.env.production` file. After creating a `.env.local` file, use
    the normal build command:

    ```bash
    yarn build
    ```

    </details>

6. Run the web server.

    ```bash
    yarn start
    ```

    <details>
    <summary>
        :dart: ADVANCED TIP: Use "-H" and "-p" options to change the URL the web
        server serves at.
        Click for more details.
    </summary>

    If the web server needs to serve at a URL other than
    `http://localhost:3000`, use the `-H` and the `-p` options for `yarn start`
    to specify the hostname and the port of the web server.

    For example, to have the server serve at `http://192.168.1.42:80`, use both
    the `-H` and the `-p` options:

    ```bash
    yarn start -H 192.168.1.42 -p 80
    ```

    If only the port on `localhost` needs to be changed, then only use the `-p`
    option:

    ```bash
    yarn start -p 8080
    ```

    </details>

7. Open a web browser and go to <http://localhost:3000> to start using your
   own txnDuck! :tada: The web server must be running in the CLI (Command Line
   Interface) to use your txnDuck.
8. If you are finished using your txnDuck, stop the web server by closing the
   CLI window or by pressing <kbd>Ctrl</kbd>+<kbd>C</kbd> (or
   <kbd>Cmd</kbd>+<kbd>C</kbd> on Mac)
   while in the CLI. Start the web server again by following Steps #5–7.

### Uninstalling and removing the source code installation

1. Make sure the web server is not running. Stop the server if it is. Refer to
   Step #8 in the [installation instructions](#installing-and-running-the-source-code).
2. Delete the source code folder created in Step #2 of the [installation instructions](#installing-and-running-the-source-code)
3. OPTIONAL: Uninstall the software listed in the [requirements](#requirements-for-source-code-installation)
   if the software is not needed for something else.

### Upgrading to the latest source code

Some time after [installing using the source code](#installing-and-running-the-source-code),
there will likely be a newer version of the txnDuck source code. Upgrade to the
latest version to get the latest features and bug fixes:

1. Choose one of the following options:
    - OPTION #1: Uninstall the old version by following Steps #1 and #2 of the
      [uninstallation instructions](#uninstalling-and-removing-the-source-code-installation).
    - OPTION #2: Keep the old version and rename the source code folder for the
      old version.
    - OPTION #3: Keep the old version without renaming its source code folder.
      When installing the new version, use a different name for the new
      version's source code folder.
2. Make sure the web server is not running. Stop the server if it is. Refer to
   Step #8 in the [installation instructions](#installing-and-running-the-source-code).
3. Follow the [installation instructions](#installing-and-running-the-source-code) again.
   Make sure you download the latest source code.

## Development environment installation

Install a private instance of txnDuck with the tools for modifying and testing
the source code.

> [!TIP]
> Useful information about the development environment can be found in the
> [Developers Documentation](developers.md).

### Requirements for the development environment

- Access to the command-line interface (CLI), such as Terminal, PowerShell or
  Command Prompt
- [Git](https://git-scm.com/) installed
- [Node.js](https://nodejs.org/en) version 20.0.0 or higher installed.
- [Yarn](https://yarnpkg.com/getting-started/install) package manager installed.
  Version 2.0.0 or higher, version 4.0.0 or higher is recommended.
   > NOTE: If you have Yarn 1.x.x installed, install and switch to Yarn 2.0.0 or
   > higher by running `corepack enable && yarn set version berry`.
- OPTIONAL BUT RECOMMENDED: [Visual Studio Code](https://code.visualstudio.com/)
  IDE (integrated development environment)

### Installing the development environment

1. Clone the repository.

    ```bash
    git clone https://github.com/No-Cash-7970/txnDuck.git
    ```

2. Enter the project folder

    ```bash
    cd txnDuck
    ```

3. Install the dependencies.

    ```bash
    yarn install && yarn install:dev
    ```

### Uninstalling the development environment

1. Delete the project directory that was created when cloning the repository
   (step #1 of the [installation instructions](#installing-the-development-environment)).
2. OPTIONAL: Uninstall the software listed in the
   [requirements for the development environment](#requirements-for-the-development-environment)
   if you do not need them for something else.

### Upgrading the development environment

1. Pull the changes.

    ```bash
    git pull
    ```

2. Update the dependencies.

    ```bash
    yarn install:dev
    ```

## Development environment with Docker

Use Docker to run a private instance of txnDuck with the tools for modifying and
testing the source code without installing extra dependencies on your machine.

> [!NOTE]
> Running the development environment inside of a Docker container is
> significantly slower than running the development environment without Docker.
> To install the development environment without Docker, follow the instructions
> for installing the [regular development environment](#development-environment-installation).

<!-- This tip is separate from the note above -->
> [!TIP]
> Useful information about the development environment can be found in the
> [Developers Documentation](developers.md).

### Requirements for the development environment with Docker

- Access to the command-line interface (CLI), such as Terminal, PowerShell or
  Command Prompt
- [Docker](https://www.docker.com/) version 23.0 or higher installed.

### Installing and running the development environment with Docker

The development environment with Docker makes use of a
[bind mount](https://docs.docker.com/engine/storage/bind-mounts/). The changes
to source code outside a Docker container are applied within the container, and
changes to source code within the container are applied outside of the
container.

1. Clone the repository.

    ```bash
    git clone https://github.com/No-Cash-7970/txnDuck.git
    ```

2. Enter the project directory.

    ```bash
    cd txnDuck
    ```

3. Create and run a container for the development environment. The docker image
   will be built if one does not exist.

    ```bash
    docker compose run --rm -it -p 3000:3000 dev bash
    ```

    This command runs the newly created docker container and starts the bash
    shell within the container where you can run commands like `yarn dev` or
    `git status`.

    If you need to use a port other than 3000 on your machine, use the following
    instead:

    ```bash
    docker compose run --rm -it -p [PORT]:3000 dev bash
    ```

    Replace `[PORT]` with the port number you would like to use. For example,
    use port 3001 instead of 3000:

    ```bash
    docker compose run --rm -it -p 3001:3000 dev bash
    ```

4. OPTIONAL: Exit the container's shell by running the `exit` command within the
   shell. If you used one of the commands in step #3, the container will
   automatically be stopped and deleted when you exit the shell. The source code
   on your machine remains intact when the container is deleted. Run a new
   container by running one of the commands in step #3 again.

5. OPTIONAL: If you install, upgrade or uninstall Node dependencies for txnDuck,
   you will need to rebuild the image before you run a new container to apply
   the changes to the new container.

    First, delete the old image.

    ```bash
    docker rmi txnduck-dev
    ```

    Then, build a new image and start a new container.

    ```bash
    docker compose run --build --rm -it -p 3000:3000 dev bash
    ```

### Uninstalling and removing the development environment with Docker

1. If the you are in the Docker container shell, exit the shell and stop the container by running the
   `exit` command within the shell. If you used one of the commands in step #3
   of the [installation instructions](#installing-and-running-the-development-environment-with-docker),
   the container will automatically be deleted when you exit the shell and the
   source code will remain intact.

2. Delete the image.

    ```bash
    docker rmi txnduck-dev
    ```

3. Delete the project directory that was created when cloning the repository
   (step #1 of the
   [installation instructions](#installing-and-running-the-development-environment-with-docker)).

### Upgrading to the latest development environment with Docker

1. Pull the changes.

    ```bash
    git pull
    ```

2. Uninstall the image by following steps #1 and #2 of the
   [uninstallation instructions](#uninstalling-and-removing-the-development-environment-with-docker).
3. Reinstall the development environment by following steps #2 and #3 of the
   [installation instructions](#installing-and-running-the-development-environment-with-docker).

## Deploying to platform other than localhost

> [!IMPORTANT]
> This only applies to a [Source code installation](#source-code-installation)
> or a [development installation](#development-environment-installation).

If the build is going to deployed to a platform other than localhost, then the
`BASE_URL` environment variable needs to be set to the URL of the deployed
website. The way in which to set environment variables for a deployment depends
of the platform (e.g. Vercel, AWS). Refer to the documentation for the platform
for how to set the environment variables. However, if your platform does not
provide a way to set environment variable, the `BASE_URL` can be set in a
`.env.local` file. Create a `.env.local` file by copying the
`.env.local.example` file and renaming it to `.env.local`. Refer to
[Next.JS's documentation on environment variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables#environment-variable-load-order)
for details about how environment variables are loaded.

An example of setting the `BASE_URL` in a `.env.local` file:

```shell
# .env.local file
# ...other settings here

BASE_URL=https://example.com

# some more settings here...
```
