import { BuiltInCapitalizationStyle, fixCapitalization } from './capitalization';
import { ConfigError } from './error';
import { readEnvValue } from './overrides';

// TODO: standardize language -- Settings vs. Config, envKey vs envProp vs etc

export interface GlobalOptions {
  envStyle?: CapitalizationStyle;
  trim?: TrimValue;
  lazy?: boolean;
}

export interface BasicFieldOptions<T> {
  envName?: string;
  defaultValue?: T;
  validateRaw?: Array<(value: string) => void>;
  validateParsed?: Array<(value: T) => void>;
  trim?: TrimValue;
//  lazy?: boolean;  //TODO: support for individual lazy fields?
}

export interface FieldOptions<T> extends BasicFieldOptions<T> {
  parser: (stringValue: string) => T;
}

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
    // FIXME: throw better error? or try/catch this and re-wrap a level up
    throw new ConfigError(`Illegal whitespace on config value for ${'envName'}: "${value}"`);
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
    const rawValue = readEnvValue(envKey);

    // Optionally trim leading/trailing whitespace
    let trimmedValue: string|undefined;
    try {
      trimmedValue = trimValue(rawValue, fieldOptions.trim ?? globalOptions.trim ?? true);
    } catch (err) {
      // rethrow with a message containing envKey
    }

    // TODO: a field-level option to allow null returns? (but I'd need to bake that into the return type of the parse function to be hinted properly)

    // Check for default and throw if missing with no default
    if (trimmedValue === undefined || trimmedValue === '') {
      if (fieldOptions.defaultValue !== undefined) {
        return fieldOptions.defaultValue;
      }
      throw new ConfigError(`Missing required config value: ${envKey}`);
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

  const boundEntries = Object.entries(config).map(([configKey, fieldOptions]) => ([configKey, bindEntry(configKey, fieldOptions)]));
  return Object.fromEntries(boundEntries) as {[key in keyof T]: () => ReturnType<T[key]['parser']>};
};

export const Settings = <T extends SettingsConfig>(config: T, options: GlobalOptions = {}): {[key in keyof T]: ReturnType<T[key]['parser']>} => {
  const readers = bindAllReaders(config, options);

  // TODO: an environment level override to force all values to be lazy (for testing)

  // Invoke them all immediately and return the resulting object
  if (!options.lazy) {
    return Object.fromEntries(Object.entries(readers).map(([key, value]) => [key, value()])) as {[key in keyof T]: ReturnType<T[key]['parser']>};
  }

  // Wrap the readers in a proxy object to transparently invoke them when accessed for the first time
  const cache: Partial<{[key in keyof T]: ReturnType<T[key]['parser']>}> = {};
  const get = (target: {[key in keyof T]: () => ReturnType<T[key]['parser']>}, propertyKey: string & keyof T) => {
    if (!(propertyKey in cache)) {
      const fn = Reflect.get(target, propertyKey);
      const value = fn(propertyKey);
      cache[propertyKey] = value;
    }
    return cache[propertyKey];
  };
  return new Proxy(readers, { get }) as {[key in keyof T]: ReturnType<T[key]['parser']>};
};
