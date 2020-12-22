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
import { BasicOptionalFieldOptions, BasicRequiredFieldOptions, OptionalFieldOptions, RequiredFieldOptions } from './main';
import { JsonValue, optionalBigInt, optionalBool, optionalFloat, optionalInt, optionalJson, optionalString, optionalUrl, requiredBigInt, requiredBool, requiredFloat, requiredInt, requiredJson, requiredString, requiredUrl } from './parsers';

export const getString = ({validateParsed = [], ...options}: BasicOptionalFieldOptions<string>&StringOptions = {}): OptionalFieldOptions<string> =>
  ({
    parser: optionalString,
    validateParsed: [stringValidator(options), ...validateParsed],
    ...options,
  });

export const requireString = ({validateParsed = [], ...options}: BasicRequiredFieldOptions<string>&StringOptions = {}): RequiredFieldOptions<string> =>
  ({
    parser: requiredString,
    validateParsed: [stringValidator(options), ...validateParsed],
    ...options,
  });

export const getInt = (
  {validateRaw = [], validateParsed = [], ...options}: BasicOptionalFieldOptions<number>&NumericOptions = {}
): OptionalFieldOptions<number> =>
  ({
    parser: optionalInt,
    validateRaw: [validateIntString, ...validateRaw],
    validateParsed: [validateIntValue, numericValidator(options), ...validateParsed],
    ...options,
  });

export const requireInt = (
  {validateRaw = [], validateParsed = [], ...options}: BasicRequiredFieldOptions<number>&NumericOptions = {}
): RequiredFieldOptions<number> =>
  ({
    parser: requiredInt,
    validateRaw: [validateIntString, ...validateRaw],
    validateParsed: [validateIntValue, numericValidator(options), ...validateParsed],
    ...options,
  });

export const getFloat = (
  {validateRaw = [], validateParsed = [], ...options}: BasicOptionalFieldOptions<number>&NumericOptions = {}
): OptionalFieldOptions<number> =>
  ({
    parser: optionalFloat,
    validateRaw: [validateFloatString, ...validateRaw],
    validateParsed: [validateFloatValue, numericValidator(options), ...validateParsed],
    ...options,
  });

export const requireFloat = (
  {validateRaw = [], validateParsed = [], ...options}: BasicRequiredFieldOptions<number>&NumericOptions = {}
): RequiredFieldOptions<number> =>
  ({
    parser: requiredFloat,
    validateRaw: [validateFloatString, ...validateRaw],
    validateParsed: [validateFloatValue, numericValidator(options), ...validateParsed],
    ...options,
  });

export const getBigInt = (
  {validateRaw = [], validateParsed = [], ...options}: BasicOptionalFieldOptions<BigInt>&NumericOptions = {}
): OptionalFieldOptions<BigInt> =>
  ({
    parser: optionalBigInt,
    validateRaw: [validateIntString, ...validateRaw],
    validateParsed: [...validateParsed, numericValidator(options)],
    ...options,
  });

export const requireBigInt = (
  {validateRaw = [], validateParsed = [], ...options}: BasicRequiredFieldOptions<BigInt>&NumericOptions = {}
): RequiredFieldOptions<BigInt> =>
  ({
    parser: requiredBigInt,
    validateRaw: [validateIntString, ...validateRaw],
    validateParsed: [...validateParsed, numericValidator(options)],
    ...options,
  });

export const getBool = ({validateRaw = [], ...options}: BasicOptionalFieldOptions<boolean> = {}): OptionalFieldOptions<boolean> =>
  ({
    parser: optionalBool,
    validateRaw: [validateBoolString, ...validateRaw],
    ...options,
  });

export const requireBool = ({validateRaw = [], ...options}: BasicRequiredFieldOptions<boolean> = {}): RequiredFieldOptions<boolean> =>
  ({
    parser: requiredBool,
    validateRaw: [validateBoolString, ...validateRaw],
    ...options,
  });

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
