# Quality Checks

- [Standardization and Quality Checks](#standardization-and-quality-checks)
  - [Linting](#linting)
  - [Formatting](#formatting)
  - [Unit testing](#unit-testing)
  - [E2E testing](#e2e-testing)
- [What to do when your PR shows a failing status check](#what-to-do-when-your-pr-shows-a-failing-status-check)
  - [Install issues](#install-issues)
  - [Formatting issues](#formatting-issues)
  - [Linting issues](#linting-issues)
  - [Unit testing issues](#unit-testing-issues)
  - [E2E testing issues](#e2e-testing-issues)

This project uses various tools and frameworks for code standardization and ensuring quality. These tools and frameworks are enforced using GitHub Actions, and are run on all Pull Requests to guarantee that all new code does not introduce bugs or degrade the quality of the application in any way.

This document describes those tools and frameworks, explains how to use them, and provides guidance on what to do if they fail in GitHub Actions.

## Standardization and Quality Checks

### Linting

This repo uses [ESlint](https://eslint.org/) to detect and prevent potential issues using static analysis.

ESlint will run automatically as a pre-commit hook anytime you attempt to make a commit. If it detects any problems, it will prevent the commit and alert you to the issue. Once remediated, you should be able to commit cleanly.

To run ESlint manually, execute the following:

```bash
npm run lint
```

To attempt to fix some of these issues automatically (not all issues can be fixed this way; most will require manual interaction), execute the following:

```bash
npm run lint -- --fix
```

### Formatting

This repo uses [Prettier](https://prettier.io/) to ensure standardized formatting rules across the entire codebase.

It's generally a good idea to configure your IDE to format whenever you make a change to a file. If you're using VS Code, you should install the [Prettier extention](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and enable [format on save](https://code.visualstudio.com/updates/v1_6#_format-on-save).

As an additional check, Prettier will run automatically as a pre-commit hook anytime you attempt to make a commit. Any files you have changed will be auto-formatted and added to your commit.

To run Prettier manually, execute the following:

```bash
npm run format:write # writes all formatting changes to disk
npm run format:check # will fail if more than one file is improperly formatted
```

### Unit testing

This repo uses [Karma](https://angular.io/guide/testing) for unit testing.

To run unit tests manually, execute the following:

```bash
npm run test
```

Unit tests will fail if any tests fail, or if code coverage drops below the enforced thresholds. Generally, ideal code coverage levels (for statements/branches/functions/lines) would be around 80%; however, this repo has been set to

To view detailed coverage reports, run the unit tests and then load `./coverage/index.html` in a web browser. This will allow you to view specific coverage information for any file in the repo.

### E2E testing

This repo uses [Cypress](https://www.cypress.io/) for E2E testing.

To run e2e tests manually, execute the following:

```bash
npm run e2e
```

## What to do when your PR shows a failing status check

In the event that your PR fails one or more quality gates, GitHub will show "Merging is blocked" on your PR, and you will see a red X next to the failing status check.

In order to resolve the failing status check, you'll need to do the following:

1. Determine the cause of the issue
2. Reproduce it locally
3. Implement, commit, and push a fix

Once the fix is pushed, GitHub Actions will run again and will re-check your latest code. If everything is successful, it will pass and you're clear to merge as long as the other requirements are met. If it fails again, you'll need to go through the same actions above to see what other errors were found.

So, how do you find out what the problem is? First, click on the "Details" button next to the failing status check. This will take you to the GitHub Actions page, and you'll see what quality gate failed.

Below are some common examples:

### Install issues

If the install fails, you may see any number of errors. One potential common culprit is an npm version mismatch. Generally speaking, you should only see changes in `package-lock.json` if the dependencies in `package.json` have changed. So if there's a large diff in `package-lock.json` without corresponding changes in `package.json`, you'll need to double check your version of node and ensure you're using the correct one. To do so, follow the steps in the [Running the Application](#running-the-application) section.

### Linting issues

If linting fails, you might see something like the following:

```bash
Lint errors found in the listed files.

...

✖ X problems (X errors, 0 warnings)
  Y errors and 0 warnings potentially fixable with the `--fix` option.
```

You'll need reproduce the error locally using the instructions found here under the [Linting](#linting) section. Then implement, commit, and push a fix, and confirm that the next run completes successfully.

### Formatting issues

If formatting fails, you might see something like the following:

```bash
[warn] Code style issues found in the above file(s). Forgot to run Prettier?
Error: Process completed with exit code 1.
```

You'll need reproduce the error locally using the instructions found here under the [Formatting](#formatting) section. Then implement, commit, and push a fix, and confirm that the next run completes successfully.

### Unit testing issues

There are several possible ways that testing could fail.

Tests may not complete successfully. You'll know this is the case if not all tests succeed, which should be evident in the logs. You'll need to reproduce locally using the instructions found here under the [Unit testing](#unit-testing) section. Then implement, commit, and push a fix, and confirm that the next run completes successfully.

Alternatively, test may all complete successfully, but may be below the coverage threshold. This may happen if you have added code, but did not add tests to cover that code. You'll know this is the case if you see one or more of the following in the logs:

```bash
Coverage for statements (X%) does not meet global threshold (Y%)
Coverage for branches (X%) does not meet global threshold (Y%)
Coverage for lines (X%) does not meet global threshold (Y%)
Coverage for functions (X%) does not meet global threshold (Y%)
```

Why would these errors happen even if all tests are passing? Well, these thresholds will cause the overall test operation to fail if the coverage drops below it. Thresholds confirm a certain level of quality and ensure the code is properly covered.

If this happens to you, you have two options:

1. Implement tests to cover the new code that you added. This is the preferred option.
2. If this is not possible, then you can adjust the thresholds. To do this, adjust the numerical thresholds in the [`karma.conf.js`](./karma.conf.js) config file, which correspond to the percentages you see in your error message. Once you adjust the thresholds so that they're less than or equal to the coverage in your branch, then the test operation should pass.

Either way, you should then commit and push the fix, and confirm that the next run completes successfully.

### E2E testing issues

Given that the UI tests are based on HTML selectors and expected text, it's possible that changing either of those may cause the E2E smoke tests to fail.

You'll need reproduce the error locally using the instructions found here under the [E2E testing](#e2e-testing) section. Then implement, commit, and push a fix, and confirm that the next run completes successfully.
