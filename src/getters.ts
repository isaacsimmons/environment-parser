import {
  validateBoolString,
  validateFloatString,
  validateFloatValue,
  validateIntString,
  validateIntValue,
  numericValidator,
  NumericOptions,
} from './validators';
import { URL } from 'url';
import { BasicFieldOptions, BasicOptionalFieldOptions, BasicRequiredFieldOptions, OptionalFieldOptions, RequiredFieldOptions } from './main';
import { JsonValue, myParseFloat, myParseInt, parseBigInt, parseBool, parseJson, parseString, parseUrl } from './parsers';

const intOptions = (
  { validateRaw = [], validateParsed = [], min, max, ...options }: BasicFieldOptions<number>&NumericOptions
) =>
  ({
    validateRaw: [ validateIntString, ...validateRaw ],
    validateParsed: [ validateIntValue, numericValidator({ min, max }), ...validateParsed ],
    ...options,
  });

const floatOptions = (
  { validateRaw = [], validateParsed = [], min, max, ...options }: BasicFieldOptions<number>&NumericOptions
) =>
  ({
    validateRaw: [ validateFloatString, ...validateRaw ],
    validateParsed: [ validateFloatValue, numericValidator({ min, max }), ...validateParsed ],
    ...options,
  });

const bigIntOptions = (
  { validateRaw = [], validateParsed = [], ...options }: BasicFieldOptions<BigInt>&NumericOptions
) =>
  ({
    validateRaw: [ validateIntString, ...validateRaw ],
    validateParsed: [ ...validateParsed, numericValidator(options) ],
    ...options,
  });

const boolOptions = ({ validateRaw = [], ...options }: BasicFieldOptions<boolean>) =>
  ({
    validateRaw: [ validateBoolString, ...validateRaw ],
    ...options,
  });

export const getString = (options: BasicOptionalFieldOptions<string> = {}): OptionalFieldOptions<string> =>
  ({ parser: parseString, ...options, required: false });

export const requireString = (options: BasicRequiredFieldOptions<string> = {}): RequiredFieldOptions<string> =>
  ({ parser: parseString, ...options });

export const getInt = (options: BasicOptionalFieldOptions<number>&NumericOptions = {}): OptionalFieldOptions<number> =>
  ({ parser: myParseInt, ...intOptions(options), required: false });

export const requireInt = (options: BasicRequiredFieldOptions<number>&NumericOptions = {}): RequiredFieldOptions<number> =>
  ({ parser: myParseInt, ...intOptions(options) });

export const getFloat = (options: BasicOptionalFieldOptions<number>&NumericOptions = {}): OptionalFieldOptions<number> =>
  ({ parser: myParseFloat, ...floatOptions(options), required: false });

export const requireFloat = (options: BasicRequiredFieldOptions<number>&NumericOptions = {}): RequiredFieldOptions<number> =>
  ({ parser: myParseFloat, ...floatOptions(options) });

export const getBigInt = (options: BasicOptionalFieldOptions<BigInt>&NumericOptions = {}): OptionalFieldOptions<BigInt> =>
  ({ parser: parseBigInt, ...bigIntOptions(options), required: false });

export const requireBigInt = (options: BasicRequiredFieldOptions<BigInt>&NumericOptions = {}): RequiredFieldOptions<BigInt> =>
  ({ parser: parseBigInt, ...bigIntOptions(options)});

export const getBool = (options: BasicOptionalFieldOptions<boolean> = {}): OptionalFieldOptions<boolean> =>
  ({ parser: parseBool, ...boolOptions(options), required: false });

export const requireBool = (options: BasicRequiredFieldOptions<boolean> = {}): RequiredFieldOptions<boolean> =>
  ({ parser: parseBool, ...boolOptions(options) });

export const getPort = (options: BasicOptionalFieldOptions<number> = {}): OptionalFieldOptions<number> =>
  getInt({ min: 0, max: 65535, ...options });

export const requirePort = (options: BasicRequiredFieldOptions<number> = {}): RequiredFieldOptions<number> =>
  requireInt({ min: 0, max: 65535, ...options });

export const getUrl = (options: BasicOptionalFieldOptions<URL> = {}): OptionalFieldOptions<URL> =>
  ({ parser: parseUrl, ...options, required: false });

export const requireUrl = (options: BasicRequiredFieldOptions<URL> = {}): RequiredFieldOptions<URL> =>
  ({ parser: parseUrl, ...options });

export const getJson = (options: BasicOptionalFieldOptions<JsonValue> = {}): OptionalFieldOptions<JsonValue> =>
  ({ parser: parseJson, ...options, required: false });

export const requireJson = (options: BasicRequiredFieldOptions<JsonValue> = {}): RequiredFieldOptions<JsonValue> =>
  ({ parser: parseJson, ...options });
