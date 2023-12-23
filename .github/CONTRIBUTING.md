<!-- omit in toc -->
# Contributing Guidelines

First off, thanks for taking the time to contribute! ❤️

All types of contributions are encouraged and valued. See the [Table of
Contents](#table-of-contents) for different ways to help and details about how
this project handles them. Please make sure to read the relevant section before
making your contribution. It will make it a lot easier for us maintainers and
smooth out the experience for all involved. The community looks forward to your
contributions. 🎉

And if you like the project, but just don't have time to contribute, that's
fine. There are other easy ways to support the project and show your
appreciation, which we would also be very happy about:

- Star the project
- Tweet about it
- Refer this project in your project's readme
- Mention the project at local meetups and tell your friends/colleagues

<!-- omit in toc -->
## Table of contents

- [Code of conduct](#code-of-conduct)
- [Legal notice](#legal-notice)
- [Asking a question](#asking-a-question)
- [Submitting translations](#submitting-translations)
  - [Before submitting or editing a translation](#before-submitting-or-editing-a-translation)
  - [How do I submit a new translation?](#how-do-i-submit-a-new-translation)
  - [How do I fix or edit an existing translation?](#how-do-i-fix-or-edit-an-existing-translation)
- [Reporting bugs](#reporting-bugs)
  - [Before submitting a bug report](#before-submitting-a-bug-report)
  - [How do I submit a good bug report?](#how-do-i-submit-a-good-bug-report)
- [Suggesting enhancements](#suggesting-enhancements)
  - [Before submitting an enhancement](#before-submitting-an-enhancement)
  - [How do I submit a good enhancement suggestion?](#how-do-i-submit-a-good-enhancement-suggestion)
- [Submitting code changes](#submitting-code-changes)
  - [Before submitting a code change](#before-submitting-a-code-change)
  - [How do I submit a code change?](#how-do-i-submit-a-code-change)

## Code of conduct

Help us keep txnDuck open and inclusive. Please read and the follow [Code of
Conduct](CODE_OF_CONDUCT.md).

## Legal notice

When contributing to this project, you must agree that you have authored 100% of
the content, that you have the necessary rights to the content, and that the
content you contribute may be provided under the project license.

## Asking a question

Before you ask a question, it is best to search for existing [Issues](https://github.com/No-Cash-7970/txnDuck/issues)
that might help you. In case you have found a suitable issue and still need
clarification, you can write your question in this issue. It is also advisable
to search the internet for answers first.

If you then still feel the need to ask a question and need clarification, we
recommend the following:

- Open an [Issue](https://github.com/No-Cash-7970/txnDuck/issues/new).
- Provide as much context as you can about what you're running into.
- Provide project and platform versions (nodejs, yarn, etc), depending on what
  seems relevant.

We will then take care of the issue as soon as possible.

## Submitting translations

A goal for txnDuck is to make it accessible to as many people as possible, so
having the txnDuck user interface translated into as many languages as possible
is important.

### Before submitting or editing a translation

- Make sure you are using the latest version. Fork the `main` branch of the
  repository and make sure that fork is up to date.
- [Install](../docs/DEVELOPERS.md#installing-the-development-environment) and
  [use](../docs/DEVELOPERS.md#running-the-development-web-server) the
  development environment to test the translations.
- Look in the [`locales` directory](../src/app/i18n/locales/) to see if the
  translation exists already.
- Check the current status of the language translations in the table in the
  [*Supported languages* section in the
  README](../README.md#speech_balloon-supported-languages).

### How do I submit a new translation?

Submitting a new translation is a specific type of code change. We use GitHub
pull requests to track and manage code changes from the community. To submit a
translation:

1. Put the language files containing the translations in a new directory in
   [`/src/app/i18n/locales`](../src/app/i18n/locales/). Use the language's
   [ISO 639-1 language code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)
   as the name of the new directory.
2. Add the language data to the object of supported languages (`supportedLangs`)
   in the [Internationalization (I18n) settings](../src/app/i18n/settings.ts).

   For example, if `supportedLangs` in the [i18n settings](../src/app/i18n/settings.ts)
   looked something like this:

   ```typescript
   /**
    * Collection of supported languages
    */
   export const supportedLangs: LanguageData = {
     en: {
       name: 'English', // Shown on language button if it is the current language
       listName: 'English (US)', // Shown in language menu
     },
     // ADD DATA FOR NEW LANGUAGE HERE
   };
   ```

   Then after adding Spanish
   ([ISO 639-1 code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) "es"),
   `supportedLangs` should look like this:

   ```typescript
   /**
    * Collection of supported languages
    */
   export const supportedLangs: LanguageData = {
     en: {
       name: 'English', // Shown on language button if it is the current language
       listName: 'English (US)', // Shown in language menu
     },
     es: {
       name: 'Español',
       listName: 'Español (Traducción automática)',
     },
     // ADD DATA FOR NEW LANGUAGE HERE
   };
   ```

3. Open a new [Pull Request](https://github.com/No-Cash-7970/txnDuck/pulls).
   - Provide the language of the translation in the title **in English**.
   - If updating a translation, describe those updates in the pull request
     description **in English**.

<!-- #### Font for new translation -->

<!-- TODO: Add instructions on how to add font for a language that needs more than Latin characters -->

### How do I fix or edit an existing translation?

Edit the files in the directory for the language in the [`locales`
directory](../src/app/i18n/locales/). For example, edit the files `es` directory
to edit the Spanish translation.

## Reporting bugs

### Before submitting a bug report

A good bug report shouldn't leave others needing to prod you for more
information. Therefore, we ask you to investigate carefully, collect information
and describe the issue in detail in your report. Please complete the following
steps in advance to help us fix any potential bug as fast as possible.

- Make sure you are using the latest version.
- Determine if your bug is really a bug and not an error on your side e.g. using
  incompatible environment components/versions. If you are looking for support,
  you might want to check [this section](#asking-a-question).
- To see if other users have experienced (and potentially already solved) the
  same issue you are having, check if there is not already a bug report existing
  for your bug or error in the [bug
  tracker](https://github.com/No-Cash-7970/txnDuck/labels/bug).
- Also make sure to search the internet (including Stack Overflow) to see if
  users outside of the GitHub community have discussed the issue.
- Collect information about the bug:
  - Stack trace (Traceback)
  - OS, Platform and Version (Windows, Linux, macOS, x86, ARM)
  - Version of the interpreter, compiler, SDK, runtime environment, package
    manager, depending on what seems relevant.
  - Possibly your input and the output
  - Can you reliably reproduce the issue? And can you also reproduce it with
    older versions?

### How do I submit a good bug report?

**:warning: You must never report security related issues, vulnerabilities or
bugs including sensitive information to the issue tracker, or elsewhere in
public. Refer to the [security policy](SECURITY.md) for reporting sensitive
bugs.**

We use GitHub issues to track bugs and errors. If you run into an issue with the
project:

- Open a new [Issue](https://github.com/No-Cash-7970/txnDuck/issues/new). (Since
  we can't be sure at this point whether it is a bug or not, we ask you not to
  talk about a bug yet and not to label the issue.)
- Explain the behavior you would expect and the actual behavior.
- Please provide as much context as possible and describe the *reproduction
  steps* that someone else can follow to recreate the issue on their own. This
  usually includes your code. For good bug reports you should isolate the
  problem and create a reduced test case.
- Provide the information you collected in the previous section.

Once it's filed:

- The project team will label the issue accordingly.
- A team member will try to reproduce the issue with your provided steps. If
  there are no reproduction steps or no obvious way to reproduce the issue, the
  team will ask you for those steps and mark the issue as `needs-repro`. Bugs
  with the `needs-repro` tag will not be addressed until they are reproduced.
- If the team is able to reproduce the issue, it will be marked `needs-fix`, as
  well as possibly other tags (such as `critical`), and the issue will be left
  to be implemented by someone.

## Suggesting enhancements

This section guides you through submitting an enhancement suggestion for
txnDuck, **including completely new features and minor improvements to existing
functionality**. Following these guidelines will help maintainers and the
community to understand your suggestion and find related suggestions.

### Before submitting an enhancement

- Make sure you are using the latest version.
- Perform a [search](https://github.com/No-Cash-7970/txnDuck/issues) to see if
  the enhancement has already been suggested. If it has, add a comment to the
  existing issue instead of opening a new one.
- Find out whether your idea fits with the scope and aims of the project. It's
  up to you to make a strong case to convince the project's developers of the
  merits of this feature.

### How do I submit a good enhancement suggestion?

Enhancement suggestions are tracked as
[GitHub issues](https://github.com/No-Cash-7970/txnDuck/issues).

- Use a **clear and descriptive title** for the issue to identify the
  suggestion.
- Provide a **step-by-step description of the suggested enhancement** in as many
  details as possible.
- **Describe the current behavior** and **explain which behavior you expected to
  see instead** and why. At this point you can also tell which alternatives do
  not work for you.
- You may want to **include screenshots and animated GIFs** which help you
  demonstrate the steps or point out the part which the suggestion is related
  to. You can use [this tool](https://www.cockos.com/licecap/) to record GIFs
  on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast)
  or [this tool](https://github.com/GNOME/byzanz) on Linux.
- **Explain why this enhancement would be useful** to most txnDuck users. You
  may also want to point out the other projects that solved it better and which
  could serve as inspiration.

## Submitting code changes

We use GitHub pull requests to track and manage code changes from the community.
This section guides you through submitting a code change for txnDuck,
**including completely new features and minor improvements to existing
functionality**. Following these guidelines will help maintainers and the
community to understand your code change(s) and increase the likelihood of
accepting your code changes.

### Before submitting a code change

- Make sure that you are using the latest version. Fork the `main` branch of the
  repository and make sure that fork is up to date.
- [Install](../docs/DEVELOPERS.md#installing-the-development-environment) and
  [use](../docs/DEVELOPERS.md#running-the-development-web-server) the
  development environment to test the translations.

### How do I submit a code change?

To submit a code change, open a new
[Pull Request](https://github.com/No-Cash-7970/txnDuck/pulls).

- Use a **clear and descriptive title** that describes the change(s).
- Provide a **step-by-step description of the what the software does with the
  change** in as many details as possible.
- **Describe the previous behavior** and **explain the behavior with the change
  you made** and why.
- **Explain why this change would be useful** to most txnDuck users. If your
  code change addresses any of the issues, please provide the links to the
  relevant issues.

<!-- omit in toc -->
## Attribution

This guide is based on the **contributing-gen**.
[Make your own](https://github.com/bttger/contributing-gen)!
