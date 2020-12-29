import { BuiltInCapitalizationStyle, fixCapitalization } from './capitalization';
import { ConfigError } from './error';

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

export interface BasicOptionalFieldOptions<T> {
  envName?: string;
  validateRaw?: Array<(value: string) => void>;
  validateParsed?: Array<(value: T) => void>;
  trim?: TrimValue;
  lazy?: boolean;
}

// TODO: is it worth it to have this extra type just to prevent an "optional" parser from being paired with a default value?
export interface BasicRequiredFieldOptions<T> {
  envName?: string;
  validateRaw?: Array<(value: string) => void>;
  validateParsed?: Array<(value: T) => void>;
  trim?: TrimValue;
  lazy?: boolean;

  defaultValue?: T;
}

export type BasicFieldOptions<T> = BasicOptionalFieldOptions<T> | BasicRequiredFieldOptions<T>;

export interface RequiredFieldOptions<T> extends BasicRequiredFieldOptions<T> {
  parser: (stringValue: string) => T;
  required?: true;
//  required?: true;
}

export interface OptionalFieldOptions<T> extends BasicOptionalFieldOptions<T> {
  parser: (stringValue: string) => T;
  required: false;
}

type FieldOptions<T> = RequiredFieldOptions<T> | OptionalFieldOptions<T>;

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

      const required = fieldOptions.required ?? true;
      if (required) {
        throw new ConfigError('Missing required value'); // FIXME: more details in the error message
      } else {
        return undefined;
      }
    }

    // Validate the string before parsing
    try {
      for (const validateRaw of fieldOptions.validateRaw ?? []) {
        validateRaw(trimmedValue);
      }
    } catch (err) {
      throw new ConfigError(err, `Error validating raw config value for ${envKey}`);
    }


    // Parse the string into the final value
    let parsedValue: F;
    try {
      parsedValue = fieldOptions.parser(trimmedValue);
    } catch (err) {
      throw new ConfigError(err, `Error parsing config value for ${envKey}`);
    }

    // Validate the post-parsing result as well
    try {
      for (const validateParsed of fieldOptions.validateParsed ?? []) {
        validateParsed(parsedValue);
      }
    } catch (err) {
      throw new ConfigError(err, `Error validating parsed config value for ${envKey}`);
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

export const Settings = <T extends SettingsConfig>(config: T, options: GlobalOptions = {}): {[key in keyof T]: (T[key] extends RequiredFieldOptions<ReturnType<T[key]['parser']>> ? ReturnType<T[key]['parser']> : (ReturnType<T[key]['parser']> | undefined))} => {
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
  return new Proxy(readers, { get }) as {[key in keyof T]: (T[key] extends RequiredFieldOptions<ReturnType<T[key]['parser']>> ? ReturnType<T[key]['parser']>: (ReturnType<T[key]['parser']> | undefined))};
};
