import {
  validateBoolString,
  validateFloatString,
  validateFloatValue,
  validateIntString,
  validateIntValue,
  numericValidator,
  stringValidator,
  TRUE_VALUES,
  NumericOptions,
  StringOptions,
} from './validators';
import { URL } from 'url';
import { BasicFieldOptions, FieldOptions } from './main';

export const getString = ({validateParsed = [], ...options}: BasicFieldOptions<string>&StringOptions = {}): FieldOptions<string> =>
  ({
    parser: s => s,
    validateParsed: [stringValidator(options), ...validateParsed],
    ...options,
  });

export const getInt = (
  {validateRaw = [], validateParsed = [], ...options}: BasicFieldOptions<number>&NumericOptions = {}
): FieldOptions<number> =>
  ({
    parser: s => parseInt(s, 10),
    validateRaw: [validateIntString, ...validateRaw],
    validateParsed: [validateIntValue, numericValidator(options), ...validateParsed],
    ...options,
  });

export const getFloat = (
  {validateRaw = [], validateParsed = [], ...options}: BasicFieldOptions<number>&NumericOptions = {}
): FieldOptions<number> =>
  ({
    parser: parseFloat,
    validateRaw: [validateFloatString, ...validateRaw],
    validateParsed: [validateFloatValue, numericValidator(options), ...validateParsed],
    ...options,
  });

export const getBigInt = (
  {validateRaw = [], validateParsed = [], ...options}: BasicFieldOptions<BigInt>&NumericOptions = {}
): FieldOptions<BigInt> =>
  ({
    parser: s => BigInt(s),
    validateRaw: [validateIntString, ...validateRaw],
    validateParsed: [...validateParsed, numericValidator(options)],
    ...options,
  });

export const getBool = ({validateRaw = [], ...options}: BasicFieldOptions<boolean> = {}): FieldOptions<boolean> =>
  ({
    parser: s => TRUE_VALUES.includes(s),
    validateRaw: [validateBoolString, ...validateRaw],
    ...options,
  });

export const getPort = (options: BasicFieldOptions<number> = {}): FieldOptions<number> =>
  getInt({min: 0, max: 65535, ...options});

export const getUrl = (options: BasicFieldOptions<URL> = {}): FieldOptions<URL> =>
  ({parser: s => new URL(s), ...options});

export const getJson = (options: BasicFieldOptions<any> = {}): FieldOptions<any> =>
  ({parser: s => JSON.parse(s), ...options});
