import { CapitalizationStyle, fixCapitalization } from './capitalization';
import { Parser } from './parsers';

export interface EnvironmentOverrides {
  [envKey: string]: string;
}

export interface GlobalOptions {
  envStyle?: CapitalizationStyle;
  trim?: TrimPolicy;
  lazy?: boolean;
  overrides?: EnvironmentOverrides;
}

export interface BasicFieldOptions<T> {
  envName?: string;
  validate?: (value: T) => void;
  trim?: TrimPolicy;
  lazy?: boolean;
  defaultValue?: T;
  optional?: boolean;
}

export interface OptionalFieldOptions {
  optional: true;
}

export interface RequiredFieldOptions {
  optional?: false;
}
export interface FieldOptions<T> extends BasicFieldOptions<T> {
  parser: Parser<T>;
}

export interface SettingsConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: FieldOptions<any>;
}

export type TrimPolicy = true | false | 'throw';

const trimValue = (value: string|undefined, trim: TrimPolicy): string|undefined => {
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
    throw new Error(`Illegal whitespace on config value: "${value}"`);
  }
};

const getEnvKey = (configKey: string, envNameOverride: string|undefined, capitalizationStyle: CapitalizationStyle|undefined): string => {
  if (envNameOverride !== undefined) {
    return envNameOverride;
  }
  if (capitalizationStyle === undefined) {
    return configKey;
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
      throw new Error(`Error validating raw config value for ${envKey}: ${err.message}`);
    }

    // Handle missing values with defaults and required/optional settings
    if (trimmedValue === undefined || trimmedValue.length === 0) {
      if ('defaultValue' in fieldOptions && fieldOptions.defaultValue !== undefined) {
        return fieldOptions.defaultValue;
      }

      if (fieldOptions.optional) {
        return undefined;
      } else {
        throw new Error(`Missing required environment value: ${envKey}`);
      }
    }

    // Parse the string into the final value
    let parsedValue: F;
    try {
      parsedValue = fieldOptions.parser(trimmedValue);
    } catch (err) {
      throw new Error(`Error parsing config value for ${envKey}: ${err.message}`);
    }

    // Optional validation
    if (fieldOptions.validate) {
      try {
        fieldOptions.validate(parsedValue);
      } catch (err) {
        throw new Error(`Error validating parsed config value for ${envKey}: ${err.message}`);
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

export const Settings = <T extends SettingsConfig>(config: T, options: GlobalOptions = {}): {[key in keyof T]: (T[key] extends OptionalFieldOptions ? ReturnType<T[key]['parser']> | undefined : ReturnType<T[key]['parser']>)} => {
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
  return new Proxy(readers, { get }) as {[key in keyof T]: (T[key] extends OptionalFieldOptions ? ReturnType<T[key]['parser']> | undefined : ReturnType<T[key]['parser']>)};
};
