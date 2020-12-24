import { BuiltInCapitalizationStyle, fixCapitalization } from './capitalization';
import { ConfigError } from './error';

// TODO: standardize language -- Settings vs. Config, envKey vs envProp vs etc

export interface ConfigOverrides {
  [envKey: string]: string;
}

export interface GlobalOptions {
  envStyle?: CapitalizationStyle;
  trim?: TrimValue;
  lazy?: boolean;
  overrides?: ConfigOverrides;
}

export interface BasicOptionalFieldOptions<T> {
  envName?: string;
  validateRaw?: Array<(value: string) => void>;
  validateParsed?: Array<(value: T) => void>;
  trim?: TrimValue;
  lazy?: boolean;
}

// TODO: is it worth it to have this extra type just to prevent an "optional" parser from being paired with a default value?
export interface BasicRequiredFieldOptions<T> extends BasicOptionalFieldOptions<T> {
  defaultValue?: T;
}

export type BasicFieldOptions<T> = BasicOptionalFieldOptions<T> | BasicRequiredFieldOptions<T>;

export interface RequiredFieldOptions<T> extends BasicRequiredFieldOptions<T> {
  parser: (stringValue: string|undefined) => T;
}

export interface OptionalFieldOptions<T> extends BasicOptionalFieldOptions<T> {
  parser: (stringValue: string|undefined) => T | undefined;
}

type FieldOptions<T> = RequiredFieldOptions<T> | OptionalFieldOptions<T>;

export interface SettingsConfig {
  [key: string]: FieldOptions<any>;
}

export type TrimValue = true | false | 'throw';

export type CapitalizationStyle = BuiltInCapitalizationStyle | ((propKey: string) => string);


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

// FIXME: bleh, SettingsConfig? that name kinda sucks

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
    // lump together emptystring and undefined
    if (trimmedValue !== undefined && trimmedValue.length === 0) {
      trimmedValue = undefined;
    }

    // If no value was found and we have a default, return that
    if (trimmedValue === undefined && 'defaultValue' in fieldOptions && fieldOptions.defaultValue !== undefined) {
      return fieldOptions.defaultValue;
    }

    // Validate the string before parsing
    if (trimmedValue !== undefined) {
      try {
        for (const validateRaw of fieldOptions.validateRaw ?? []) {
          validateRaw(trimmedValue);
        }
      } catch (err) {
        throw new ConfigError(err, `Error validating raw config value for ${envKey}`);
      }
    }

    // Parse the string into the final value
    let parsedValue: F | undefined;
    try {
      parsedValue = fieldOptions.parser(trimmedValue);
    } catch (err) {
      throw new ConfigError(err, `Error parsing config value for ${envKey}`);
    }

    // Validate the post-parsing result as well
    if (parsedValue !== undefined) {
      try {
        for (const validateParsed of fieldOptions.validateParsed ?? []) {
          validateParsed(parsedValue);
        }
      } catch (err) {
        throw new ConfigError(err, `Error validating parsed config value for ${envKey}`);
      }
    }

    return parsedValue;
  };

  const boundEntries = Object.entries(config).map(([configKey, fieldOptions]) => {
    const reader = bindEntry(configKey, fieldOptions);
    // FIXME: finalize that env var name, add to README
    const lazy = process.env['MODULENAME_ALL_LAZY'] === '1' || (fieldOptions.lazy ?? globalOptions.lazy ?? false);
    if (!lazy) {
      // Invoke it immediately to force validation
      reader();
    }
    return [configKey, reader];
  });
  return Object.fromEntries(boundEntries) as {[key in keyof T]: () => ReturnType<T[key]['parser']>};
};

let cacheEpoch = 0;
export const clearEnvironnentCache = () => { cacheEpoch++; };

export const Settings = <T extends SettingsConfig>(config: T, options: GlobalOptions = {}): {[key in keyof T]: ReturnType<T[key]['parser']>} => {
  const readers = bindAllReaders(config, options);

  // Wrap the readers in a proxy object to transparently invoke them when accessed for the first time
  let cache: Partial<{[key in keyof T]: ReturnType<T[key]['parser']>}> = {};
  let cacheVersion = cacheEpoch;

  const get = (target: {[key in keyof T]: () => ReturnType<T[key]['parser']>}, propertyKey: string & keyof T) => {
    if (cacheVersion !== cacheEpoch) {
      cacheVersion = cacheEpoch;
      cache = {};
    }

    if (!(propertyKey in cache)) {
      const fn = Reflect.get(target, propertyKey);
      const value = fn(propertyKey);
      cache[propertyKey] = value;
    }

    return cache[propertyKey];
  };
  return new Proxy(readers, { get }) as {[key in keyof T]: ReturnType<T[key]['parser']>};
};
