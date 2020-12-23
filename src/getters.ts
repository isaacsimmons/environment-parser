import {
  validateBoolString,
  validateFloatString,
  validateFloatValue,
  validateIntString,
  validateIntValue,
  numericValidator,
  stringValidator,
  NumericOptions,
  StringOptions,
} from './validators';
import { URL } from 'url';
import { BasicFieldOptions, BasicOptionalFieldOptions, BasicRequiredFieldOptions, OptionalFieldOptions, RequiredFieldOptions } from './main';
import { JsonValue, optionalBigInt, optionalBool, optionalFloat, optionalInt, optionalJson, optionalString, optionalUrl, requiredBigInt, requiredBool, requiredFloat, requiredInt, requiredJson, requiredString, requiredUrl } from './parsers';

const stringOptions = (
  {validateParsed = [], allowedValues, length, minLength, maxLength, ...options}: BasicFieldOptions<string>&StringOptions
) =>
  ({
    validateParsed: [stringValidator({length, minLength, maxLength, allowedValues}), ...validateParsed],
    ...options,
  });

const intOptions = (
  {validateRaw = [], validateParsed = [], min, max, ...options}: BasicFieldOptions<number>&NumericOptions
) =>
  ({
    validateRaw: [validateIntString, ...validateRaw],
    validateParsed: [validateIntValue, numericValidator({min, max}), ...validateParsed],
    ...options,
  });

const floatOptions = (
  {validateRaw = [], validateParsed = [], min, max, ...options}: BasicFieldOptions<number>&NumericOptions
) =>
  ({
    validateRaw: [validateFloatString, ...validateRaw],
    validateParsed: [validateFloatValue, numericValidator({min, max}), ...validateParsed],
    ...options,
  });

const bigIntOptions = (
  {validateRaw = [], validateParsed = [], ...options}: BasicFieldOptions<BigInt>&NumericOptions
) =>
  ({
    validateRaw: [validateIntString, ...validateRaw],
    validateParsed: [...validateParsed, numericValidator(options)],
    ...options,
  });

const boolOptions = ({validateRaw = [], ...options}: BasicFieldOptions<boolean>) =>
  ({
    validateRaw: [validateBoolString, ...validateRaw],
    ...options,
  });

export const getString = (options: BasicFieldOptions<string>&StringOptions = {}): OptionalFieldOptions<string> =>
  ({ parser: optionalString, ...stringOptions(options) });

export const requireString = (options: BasicFieldOptions<string>&StringOptions = {}): RequiredFieldOptions<string> =>
  ({ parser: requiredString, ...stringOptions(options) });

export const getInt = (options: BasicOptionalFieldOptions<number>&NumericOptions = {}): OptionalFieldOptions<number> =>
  ({ parser: optionalInt, ...intOptions(options) });

export const requireInt = (options: BasicRequiredFieldOptions<number>&NumericOptions = {}): RequiredFieldOptions<number> =>
  ({ parser: requiredInt, ...intOptions(options) });

export const getFloat = (options: BasicOptionalFieldOptions<number>&NumericOptions = {}): OptionalFieldOptions<number> =>
  ({ parser: optionalFloat, ...floatOptions(options) });

export const requireFloat = (options: BasicRequiredFieldOptions<number>&NumericOptions = {}): RequiredFieldOptions<number> =>
  ({ parser: requiredFloat, ...floatOptions(options) });

export const getBigInt = (options: BasicOptionalFieldOptions<BigInt>&NumericOptions = {}): OptionalFieldOptions<BigInt> =>
  ({ parser: optionalBigInt, ...bigIntOptions(options) });

export const requireBigInt = (options: BasicRequiredFieldOptions<BigInt>&NumericOptions = {}): RequiredFieldOptions<BigInt> =>
  ({ parser: requiredBigInt, ...bigIntOptions(options) });

export const getBool = (options: BasicOptionalFieldOptions<boolean> = {}): OptionalFieldOptions<boolean> =>
  ({ parser: optionalBool, ...boolOptions(options) });

export const requireBool = (options: BasicRequiredFieldOptions<boolean> = {}): RequiredFieldOptions<boolean> =>
  ({ parser: requiredBool, ...boolOptions(options) });

export const getPort = (options: BasicOptionalFieldOptions<number> = {}): OptionalFieldOptions<number> =>
  getInt({min: 0, max: 65535, ...options});

export const requirePort = (options: BasicRequiredFieldOptions<number> = {}): RequiredFieldOptions<number> =>
  requireInt({min: 0, max: 65535, ...options});

export const getUrl = (options: BasicOptionalFieldOptions<URL> = {}): OptionalFieldOptions<URL> =>
  ({parser: optionalUrl, ...options});

export const requireUrl = (options: BasicRequiredFieldOptions<URL> = {}): RequiredFieldOptions<URL> =>
  ({parser: requiredUrl, ...options});

export const getJson = (options: BasicOptionalFieldOptions<JsonValue> = {}): OptionalFieldOptions<JsonValue> =>
  ({parser: optionalJson, ...options});

export const requireJson = (options: BasicRequiredFieldOptions<JsonValue> = {}): RequiredFieldOptions<JsonValue> =>
  ({parser: requiredJson, ...options});
