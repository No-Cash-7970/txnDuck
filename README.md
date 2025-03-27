# txnDuck 🦆 Transaction Builder UI

[![Algorand badge](https://img.shields.io/badge/Algorand-006883?style=for-the-badge&logo=Algorand)](https://developer.algorand.org/)&nbsp;
[![Next.js badge](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)&nbsp;
[![Tailwindcss badge](https://img.shields.io/badge/Tailwindcss-0ea5e9?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)&nbsp;
[![License MIT badge](https://img.shields.io/github/license/No-Cash-7970/txnDuck?style=for-the-badge&color=8e5548)](LICENSE.md)&nbsp;

[![PWA Shields](https://www.pwa-shields.com/1.0.0/series/install/green.svg)](https://txnduck.vercel.app)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FNo-Cash-7970%2FtxnDuck.svg?type=small)](https://app.fossa.com/projects/git%2Bgithub.com%2FNo-Cash-7970%2FtxnDuck?ref=badge_small)

A free and open source web-based graphical user interface (GUI) for easily
creating and sending transactions on [Algorand](https://algorand.co/).

## :globe_with_meridians: Websites

You can use txnDuck for free (excluding any Algorand network fees) at the
following websites:

**Production:** <https://txnduck.vercel.app>  
Preview: <https://txnduck-preview.vercel.app>

The Production website hosts the latest stable release (the `stable` branch)
where all of the features are considered complete and stable. On the other hand,
the Preview website usually hosts the unstable version (the `main` branch) with
the latest developments, so it may have incomplete and/or unstable features that
have yet to be released. There are times when both websites are the same.

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

If you want to help by adding or fixing a translation, follow the instructions
for doing so in the [Contributing Guidelines](.github/CONTRIBUTING.md#submitting-translations).

Language | Completeness | Machine translated?
---------|--------------|---------------------
English  | Full         | No
Spanish  | Full         | *Yes*

## :computer: Installation for self-hosting

Instead of using one of the [official txnDuck websites](#globe_with_meridians-websites),
choose from one of the [multiple methods](docs/installation.md) to host and run
a copy of txnDuck privately on your own computer or deploy to a remote public
server.

:book: Refer to the [Installation Guide](docs/installation.md) for installing,
updating or uninstalling a self-hosted instance of txnDuck.

## :hammer_and_wrench: Installation for development

Modifying the code requires installing the development tools and setting up the
development environment.

:book: To get started, follow the [development installation instructions](docs/installation.md#installing-the-development-environment).

:book: Refer to the [Developers Documentation](docs/developers.md) for useful
information for developers.

## :handshake: Contributing

Contributions are highly welcomed and appreciated. Every little bit of help
counts, so do not hesitate! Please read the [Contributing Guidelines](.github/CONTRIBUTING.md)
to learn how to contribute to this project.

## :trophy: Acknowledgments

- [SilentRhetoric](https://github.com/SilentRhetoric) - Proposed the idea of a
  transaction builder for Algorand
- Wes - Recommended the name "txnDuck"
