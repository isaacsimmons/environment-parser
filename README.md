# Environment Parser

Enviromnemt parser is designed to aid in reading configuration parameters from environment variables in [Node.js](https://nodejs.org/) projects.
It provides a framework for parsing and validating those values with a broad range of default parsers and validators in addition to allowing user-provided extensions.
It can be used in JavaScript projects but is written in [typescript](https://www.typescriptlang.org/) and provides built-in types for use there.

## Usage

The use case involves importing `Settings` and invoking it with SettingsConfig object.

```typescript
import { Settings } from 'environment-parser';

const settings = Settings({
    FOO: requireString(),
    BAR: getInt(),
    BAZ: requireBool({defaultValue: true}),
});
```

The resulting object would draw its values from the environment keys `FOO`, `BAR`, and `BAZ` and have the type:
 ```typescript
{
    FOO: string;
    BAR: number | undefined;
    BAZ: boolean;
}
```
Note that the "require" helpers translate into the expected type and the "get" helpers include `undefined` in their types.
Any "required" parameter can have a "defaultValue" added which will be used in the case that the expected property is either not found or empty.

TODO: trim

### Environment Keys

If you want the config object keys to draw from environment variables with different names, there are two options.
The environment key to draw any individual field's value from can be set with the "envKey" option (e.g. `TEST_1: requireInt({envKey: 'TEST_ONE'}),`).
Additinoally, the entire batch can be overridden if you want to change the capitalization style.
For instance, the following settings object
```typescript
const settings = Settings({
    dbHost: requireString(),
    dbPort: requireInt({default: 5432}),
}, {envStyle: 'lower_snake'});
```
will draw its values from the environment variables `db_host` and `db_port`.
### Eager vs. Lazy

TODO: docs and example

`ENVIRONMENT_PARSER_ALL_LAZY`

### Extensibility

This package comes with several built-in types and validators, but they can all be easily overridden.
Additional validation steps can be added to any (new or existing) helper by providing {someKey: [], someOtherKey: []}
TODO: expose the optional/required parser helpers better?
TODO: should they just be a separate parameter besides the "parser"? (and use that for the ReturnType<> thing?)

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