import { BuiltInCapitalizationStyle, fixCapitalization } from './capitalization';
import { ConfigError } from './error';
import { Parser } from './parsers';

// TODO: standardize language -- Settings vs. Config

export interface EnvironmentOverrides {
  [envKey: string]: string;
}

export interface GlobalOptions {
  envStyle?: CapitalizationStyle;
  trim?: TrimValue;
  lazy?: boolean;
  overrides?: EnvironmentOverrides;
}

export type BasicFieldOptions<T> = {
  envName?: string;
  validateRaw?: (value: string) => void;
  validateParsed?: (value: T) => void;
  trim?: TrimValue;
  lazy?: boolean;
} & (RequiredFieldOptions<T> | OptionalFieldOptions);

export interface RequiredFieldOptions<T> {
  defaultValue?: T;
  optional: false;
}

export interface OptionalFieldOptions {
  optional: true;
}

export type FieldOptions<T> = BasicFieldOptions<T> & {
  parser: Parser<T>;
};
export interface SettingsConfig {
  [key: string]: FieldOptions<any>;
}

export type TrimValue = true | false | 'throw';

export type CapitalizationStyle = BuiltInCapitalizationStyle | ((configKey: string) => string);

const trimValue = (value: string|undefined, trim: TrimValue): string|undefined => {
  if (value === undefined) {
    return undefined;
  }

  switch (trim) {
  case true:
    return value.trim();
  case false:
    return value;
  case 'throw':
    if (value === value.trim()) {
      return value;
    }
    throw new ConfigError(`Illegal whitespace on config value: "${value}"`);
  }
};

const getEnvKey = (configKey: string, envNameOverride: string|undefined, capitalizationStyle: CapitalizationStyle|undefined): string => {
  if (envNameOverride !== undefined) {
    return envNameOverride;
  }
  if (capitalizationStyle === undefined) {
    return configKey;
  }
  if (typeof capitalizationStyle === 'function') {
    return capitalizationStyle(configKey);
  }
  return fixCapitalization(configKey, capitalizationStyle);
};

// THUNK
const bindAllReaders = <T extends SettingsConfig>(
  config: T,
  globalOptions: GlobalOptions
): {[key in keyof T]: () => ReturnType<T[key]['parser']>} => {
  const bindEntry = <F>(configKey: string, fieldOptions: FieldOptions<F>) => () => {
    const envKey = getEnvKey(configKey, fieldOptions.envName, globalOptions.envStyle);

    const rawValue = (globalOptions.overrides && globalOptions.overrides[envKey]) ?? process.env[envKey];

    // Optionally trim leading/trailing whitespace
    let trimmedValue: string|undefined;
    try {
      trimmedValue = trimValue(rawValue, fieldOptions.trim ?? globalOptions.trim ?? true);
    } catch (err) {
      throw new ConfigError(err, `Error validating raw config value for ${envKey}`);
    }

    // If no value was found and we have a default, return that, otherwise throw
    if (trimmedValue === undefined || trimmedValue.length === 0) {
      //      return fieldOptions.defaultValue;
      if ('defaultValue' in fieldOptions && fieldOptions.defaultValue !== undefined) {
        return fieldOptions.defaultValue;
      }

      if (fieldOptions.optional) {
        return undefined;
      } else {
        throw new ConfigError('Missing required value'); // FIXME: more details in the error message
      }
    }

    // Validate the string before parsing
    if (fieldOptions.validateRaw) {
      try {
        fieldOptions.validateRaw(trimmedValue);
      } catch (err) {
        throw new ConfigError(err, `Error validating raw config value for ${envKey}`);
      }
    }

    // Parse the string into the final value
    let parsedValue: F;
    try {
      parsedValue = fieldOptions.parser(trimmedValue);
    } catch (err) {
      throw new ConfigError(err, `Error parsing config value for ${envKey}`);
    }

    // Validate the post-parsing result as well
    if (fieldOptions.validateParsed) {
      try {
        fieldOptions.validateParsed(parsedValue);
      } catch (err) {
        throw new ConfigError(err, `Error validating parsed config value for ${envKey}`);
      }
    }

    return parsedValue;
  };

  const boundEntries = Object.entries(config).map(([ configKey, fieldOptions ]) => {
    const reader = bindEntry(configKey, fieldOptions);
    const lazy = process.env['ENVIRONMENT_PARSER_ALL_LAZY'] === '1' || (fieldOptions.lazy ?? globalOptions.lazy ?? false);
    if (!lazy) {
      // Invoke it immediately to force validation
      reader();
    }
    return [ configKey, reader ];
  });
  return Object.fromEntries(boundEntries) as {[key in keyof T]: () => ReturnType<T[key]['parser']>};
};

let cacheEpoch = 0;
export const clearEnvironmentCache = (): void => { cacheEpoch++; };

export const Settings = <T extends SettingsConfig>(config: T, options: GlobalOptions = {}): {[key in keyof T]: (T[key] extends RequiredFieldOptions<unknown> ? ReturnType<T[key]['parser']> : (ReturnType<T[key]['parser']> | undefined))} => {
  const readers = bindAllReaders(config, options);

  // Wrap the readers in a proxy object to transparently invoke them and cache the values
  let cache: Partial<{[key in keyof T]: ReturnType<T[key]['parser']>}> = {};
  let cacheVersion = cacheEpoch;

  const get = (target: {[key in keyof T]: () => ReturnType<T[key]['parser']>}, configKey: string & keyof T) => {
    if (cacheVersion !== cacheEpoch) {
      cacheVersion = cacheEpoch;
      cache = {};
    }

    if (!(configKey in cache)) {
      const fn = Reflect.get(target, configKey);
      const value = fn(configKey);
      cache[configKey] = value;
    }

    return cache[configKey];
  };
  return new Proxy(readers, { get }) as {[key in keyof T]: (T[key] extends RequiredFieldOptions<unknown> ? ReturnType<T[key]['parser']>: (ReturnType<T[key]['parser']> | undefined))};
};
