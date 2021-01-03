import {
  validateBoolRaw,
  validateFloatRaw,
  validateFloatParsed,
  validateIntRaw,
  validateIntParsed,
  numericValidator,
  NumericOptions,
} from './validators';
import { URL } from 'url';
import { BasicFieldOptions, FieldOptions, ItsOptional, ItsRequired } from './main';
import { JsonValue, myParseFloat, myParseInt, parseBigInt, parseBool, parseJson, parseString, parseUrl } from './parsers';

const intOptions = {
    parser: myParseInt,
    validateRaw: [validateIntRaw],
    validateParsed: [ validateIntParsed ],
  };

const floatOptions = {
    parser: myParseFloat,
    validateRaw: [ validateFloatRaw ],
    validateParsed: [ validateFloatParsed ],
  };

const bigIntOptions = {
    parser: parseBigInt,
    validateRaw: [ validateIntRaw ],
  };

const boolOptions = {
    parser: parseBool,
    validateRaw: [ validateBoolRaw ],
  };

const stringOptions = {
  parser: parseString,
};

// FIXME: can I get rid of the "as unknown" in these?
// TODO: make all of these params have an optional value of {} (or somethign with required if must be)
export const fooInt = <T extends BasicFieldOptions<number>>(options: T): T extends ItsRequired ? FieldOptions<number> & ItsRequired : FieldOptions<number> & ItsOptional =>
  ({
    parser: myParseInt,
    validateRaw: [validateIntRaw],
    validateParsed: [ validateIntParsed ],
    ...options
  }) as unknown as T extends ItsRequired ? FieldOptions<number> & ItsRequired : FieldOptions<number> & ItsOptional;

  export const fooString = <T extends BasicFieldOptions<string>>(options: T): T extends ItsRequired ? FieldOptions<string> & ItsRequired : FieldOptions<string> & ItsOptional =>
  ({
    parser: parseString,
    ...options
  }) as unknown as T extends ItsRequired ? FieldOptions<string> & ItsRequired : FieldOptions<string> & ItsOptional;

export const fooBool = <T extends BasicFieldOptions<boolean>>(options: T): T extends ItsRequired ? FieldOptions<boolean> & ItsRequired : FieldOptions<boolean> & ItsOptional =>
  ({
    parser: parseBool,
    ...options
  }) as unknown as T extends ItsRequired ? FieldOptions<boolean> & ItsRequired : FieldOptions<boolean> & ItsOptional;

//fooFloat

//fooBigInt

// export const getPort = (options: BasicOptionalFieldOptions<number> = {}): OptionalFieldOptions<number> =>
//   getInt({ min: 0, max: 65535, ...options });

// export const requirePort = (options: BasicRequiredFieldOptions<number> = {}): RequiredFieldOptions<number> =>
//   requireInt({ min: 0, max: 65535, ...options });

export const fooUrl = <T extends BasicFieldOptions<URL>>(options: T): T extends ItsRequired ? FieldOptions<URL> & ItsRequired : FieldOptions<URL> & ItsOptional =>
  ({ parser: parseUrl, ...options,
  }) as unknown as T extends ItsRequired ? FieldOptions<URL> & ItsRequired : FieldOptions<URL> & ItsOptional;

export const fooJson = <T extends BasicFieldOptions<URL>>(options: T): T extends ItsRequired ? FieldOptions<JsonValue> & ItsRequired : FieldOptions<JsonValue> & ItsOptional =>
  ({ parser: parseJson, ...options,
  }) as unknown as T extends ItsRequired ? FieldOptions<JsonValue> & ItsRequired : FieldOptions<JsonValue> & ItsOptional;
