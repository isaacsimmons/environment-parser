# Environment Parser

Enviromnemt parser is designed to aid in reading configuration parameters from environment variables in [Node.js](https://nodejs.org/) projects.
It provides a framework for parsing and validating those values with a broad range of default parsers and validators in addition to allowing user-provided extensions.
It can be used in JavaScript projects but is written in [TypeScript](https://www.typescriptlang.org/) and provides built-in types for use there.

## Usage

The base use case involves importing the `Settings` function and invoking it with SettingsConfig object.

```typescript
import { Settings, envType, validateRange } from 'environment-parser';

const settings = Settings({
    JWT_SECRET: envType.string({optional:true}),
    DB_PORT: envType.int({validate: validateRange({min: 0, max: 65535})}),
    USE_SSL: envType.bool({defaultValue: false}),
    DEFAULT_CATEGORIES: {parser: s => s.split(' '), defaultValue: ['foo', 'bar']},
});
```

The resulting object would draw its values from the environment keys `JWT_SECRET`, `DB_PORT`, `USE_SSL`, and `DEFAULT_CATEGORIES` and have the type:
 ```typescript
{
    JWT_SECRET: string | undefined;
    DB_PORT: number;
    USE_SSL: boolean;
    DEFAULT_CATEGORIES: string[];
}
```
The the parser's return type will have `| undefined` added to its type if `optional: true` is in the parameters.
The `envType` object has several helper methods useful for generating the required `FieldConfig` objects, but they can also be created directly if you wish to use custom parser functions.
Any field config can have a "defaultValue" which will be used in the case that the expected property is either not found in the environment or empty.
Having any properties that aren't marked "optional" and which have no default value will throw an error if value isn't present in the environment.

### Validation

In addition to making values "optional" or not (required), the numeric and boolean helpers come with a batch of built-in validators.
If invalid values are passed (non-integer environment values matching a `envType.int()` property key for instance) the package will raise an error.
Boolean environment values must be one of the following strings: `1`, `TRUE`, `true`, `0`, `FALSE`, `false`.
All values read from the environment will have leading and trailing whitespace trimmed by default.
You can prevent that behavior (or cause it to throw a validation error instead) with either a field-level or global config value of `{trim: true}`, `{trim: false}`, or `{trim: 'throw'}`.
If both are present, the field-level option will take precedence.

### Eager vs. Lazy

By default, having an invalid configuration in any way -- missing or invalid values -- will cause the settings object to throw immediately upon its creation.
This behavior can be altered to only throw when someone attempts to access an invalid value by passing `{lazy: true}` as a global config option (which will apply to all properties in the object) or a as a field-level config option (which will apply to only that specific field).

### Extensibility

In addition to the built-in types and validators user-defined validators can be provided as well.
An additional validation step can be added to any (new or existing) helper by providing a validation function in the field-level option `validate`.
Such functions should return no value but throw an Error if the value is invalid.

### Environment Keys

If you want the config object keys to draw from environment variables with different names, there are two options.
The environment key to draw any individual field's value from can be set with the "envKey" option (e.g. `TEST_1: envType.int({envKey: 'TEST_ONE'}),`).
Additionally, the keys for the entire object can be overridden at once if you want uniformly use a different capitalization style.
For instance, the following settings object
```typescript
const settings = Settings({
    dbHost: envType.tring(),
    dbPort: envType.int({default: 5432}),
}, {envStyle: 'lower_snake'});
```
will draw its values from the environment variables `db_host` and `db_port` rather than `dbHost` and `dbPort`.

### Testing components that use these settings

There are a few features designed to aide in writing tests for components that rely on settings values provided by this library.
If the environment value `ENVIRONMENT_PARSER_ALL_LAZY=1` is set, all fields will be "lazy" loaded regardless of the field-level or global config paramters that are passed in.
There is a global config parameter to pass in a set of environment overrides like `{overrides: {FOO: 'BAR', BAZ: 'QUX'}}` which will be checked before `process.env`.
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
They can be removed with `yarn clean` (and you should run clean before building a publication candidate).
New versions can be published to npm with `yarn publish`.
