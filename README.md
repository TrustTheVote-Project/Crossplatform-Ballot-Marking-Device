# Ballot Markup Application ("Elroy")

- [Running the Application](#running-the-application)
- [Ensuring Quality in the Application](#ensuring-quality-in-the-application)
- [Building Native Binaries](#building-native-binaries)
- [Development Workflow](#development-workflow)

The project (codenamed "Elroy") handles ballot markup. It is part of the overall Markit ecosystem and will eventually be folded into a single application.

## Running the Application

Ensure you're using [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) to handle your node versions. If you don't already have it set up on your machine, use nvm's instructions to download and install it.

This application uses node 16 / npm 7, which is the current active LTS version. To ensure you're on the same version, execute the following:

```bash
nvm use
```

Then install the dependencies as follows:

```bash
npm i
```

To run the application, simply execute the following:

```bash
npm start
```

And navigate to [http://localhost:4200/home](http://localhost:4200/home) in your browser.

## Ensuring Quality in the Application

Information regarding the quality checks and how they're enforced in CI can be found in the [Quality Checks](./QUALITY_CHECKS.md) page.

## Building Native Binaries

> todo: add instructions here

## Development Workflow

To ensure a standardized development workflow, all new changes should be added as Pull Requests. In order to be merged to the main branch, PRs must be:

1. Passing all quality checks (there are implemented as a status check using GitHub Actions)
2. Up to date with the main branch
3. Approved by at least one other person

When merging, the "squash and merge" strategy is used, which ensures all commits in the feature branch have been squashed to a single commit. This keeps the main branch's commit logs clean and readable.

For guidance on what to do if the quality checks fail, see the [corresponding section in the Quality Checks](./QUALITY_CHECKS.md#what-to-do-when-your-pr-shows-a-failing-status-check) page.
