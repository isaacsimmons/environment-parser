# Environment Parser

Enviromnemt parser is designed to aid in reading configuration parameters from environment variables in [Node.js](https://nodejs.org/) projects.
It provides a framework for parsing and validating those values with a broad range of default parsers and validators in addition to allowing user-provided extensions.
It can be used in JavaScript projects but is written in [typescript](https://www.typescriptlang.org/) and provides built-in types for use there.

## Usage

The most common use case involves importing the `Settings` function and invoking it with SettingsConfig object.

```typescript
import { Settings } from 'environment-parser';

const settings = Settings({
    FOO: requireString(),
    BAR: getInt(),
    BAZ: requireBool({defaultValue: false}),
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
The "require" helper methods return a parser with the specified return type (e.g. `requireString()` => `string`) while the return type of the parsers returned by the "get" helper methods include undefined  (e.g. `getString()` =>  `string | undefined`).
Any "require" helper method can have a "defaultValue" which will be used in the case that the expected property is either not found in the environment or empty.
Having any properties with a "required" helper method and no default value will throw an error if value isn't present in the environment.

### Validation

In addition to making values "required" or not, the numeric and boolean helpers come with a batch of built-in validators.
If invalid values are passed (non-integer environment values matching a `getInt()` property key for instance) the package will raise an error.
Boolean environment values must be one of the following strings: `1`, `TRUE`, `true`, `0`, `FALSE`, `false`.
All values have leading and trailing whitespace trimmed by default.
You can prevent that behavior (or cause it to throw a validation error instead of automatically fixing it) with either a field-level or global config value of `{trim: true}`, `{trim: false}`, or `{trim: 'throw'}`, with the field-level option taking precedence.

### Eager vs. Lazy

By default, having an invalid configuration in any way -- missing or invalid values -- will cause the settings object to throw immediately upon its creation.
This behavior can be altered to only throw when someone attempts to access an invalid value by passing `{lazy: true}` as a global config option (which will apply to all properties in the object) or a as a field-level config option (which will apply to only that specific field).

### Extensibility

In addition to the built-in types and validators user-defined validators can be provided as well.
Additional validation steps can be added to any (new or existing) helper by providing validation functions in the field-level options for `{validateParsed: [], validateRaw: []}`, depending on if you would like to validate the pre-parsed string value from the environment or the post-parsing value.
Such functions should return no value but throw an Error if the value is invalid.
TODO: expose the optional/required parser helpers better?
TODO: should they just be a separate parameter besides the "parser"? (and use that for the ReturnType<> thing?)

### Environment Keys

If you want the config object keys to draw from environment variables with different names, there are two options.
The environment key to draw any individual field's value from can be set with the "envKey" option (e.g. `TEST_1: requireInt({envKey: 'TEST_ONE'}),`).
Additionally, the keys for the entire object can be overridden at once if you want uniformly use a different capitalization style.
For instance, the following settings object
```typescript
const settings = Settings({
    dbHost: requireString(),
    dbPort: requireInt({default: 5432}),
}, {envStyle: 'lower_snake'});
```
will draw its values from the environment variables `db_host` and `db_port` rather than `dbHost` and `dbPort`.

### Testing components that use these settings

There are a few features designed to aide in writing tests for components that rely on settings values provided by this library.
If the environment value `ENVIRONMENT_PARSER_ALL_LAZY=1` is set, all fields will be "lazy" loaded regardless of the field-level or global config paramters that are passed in.
There is a global config parameter to pass in a set of environment overrides like `{overrides: {FOO: 'BAR', BAZ: 'QUX'}}` which will be used instead of checking process.env for those keys.
You can `import { clearEnvironmentCache } from 'environment-parser';` and use that function to purge the internally cached values of any current Settings objects, causing them to re-read and validate the values upon next access.

## Requirements

JS version? TS version?
## Developing

### Testing

Tests are written using [jest](https://jestjs.io/) and can be found in `/src/*.test.ts`.
They can be run with `yarn test`.

### Linting

Linting is provided by [eslint](https://eslint.org/) and based on the typescript-recommended ruleset.
Run `yarn lint` to check for lint errors, `yarn lint --fix` to attempt to automatically fix them.

### Building and Publishing

Build artifacts (`*.js`, `*.d.ts`) can be compiled from the typescript sources with `yarn build`.
They can be removed with `yarn clean`.
// publish to NPM

Semver? Releases?