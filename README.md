# Environment Parser

Enviromnemt parser is designed to aid in reading configuration parameters from environment variables in [Node.js](https://nodejs.org/) projects.
It provides a framework for parsing and validating those values with a broad range of default parsers and validators in addition to allowing user-provided extensions.
It can be used in JavaScript projects but is written in [typescript](https://www.typescriptlang.org/) and provides built-in types for use there.

## Usage

TODO: docs and examples

`ENVIRONMENT_PARSER_ALL_LAZY`
## Requirements

JS version? TS version?
## Developing

### Testing

Tests are written using [jest](https://jestjs.io/) and can be run with `yarn test`.

### Linting

Linting is provided by [eslint](https://eslint.org/) and based on the typescript-recommended ruleset.
Run `yarn lint` to check for lint errors, `yarn lint --fix` to attempt to auto-fix them.

### Building and Publishing

Build artifacts (*.js, *.d.ts) can be compiled from the typescript sources with `yarn build`.
They can be removed with `yarn clean`.
// publish to NPM

Semver? Releases?