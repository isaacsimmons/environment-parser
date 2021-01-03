import { URL } from 'url';
import { BasicFieldOptions, FieldOptions, OptionalFieldOptions, RequiredFieldOptions } from './main';
import { JsonValue, myParseFloat, myParseInt, parseBigInt, parseBool, parseJson, parseString, parseUrl } from './parsers';

//const fooT = <T>(parser: Parser<T>) => ();

// FIXME: can I get rid of the "as unknown" in these?
// TODO: make all of these params have an optional value of {} (or somethign with required if must be)
export const fooInt = <T extends BasicFieldOptions<number>>(options: T): T extends RequiredFieldOptions<number> ? FieldOptions<number> & RequiredFieldOptions<number> : FieldOptions<number> & OptionalFieldOptions =>
  ({
    parser: myParseInt,
    ...options,
  }) as unknown as T extends RequiredFieldOptions<number> ? FieldOptions<number> & RequiredFieldOptions<number> : FieldOptions<number> & OptionalFieldOptions;

export const fooString = <T extends BasicFieldOptions<string>>(options: T): T extends RequiredFieldOptions<string> ? FieldOptions<string> & RequiredFieldOptions<string> : FieldOptions<string> & OptionalFieldOptions =>
  ({
    parser: parseString,
    ...options,
  }) as unknown as T extends RequiredFieldOptions<string> ? FieldOptions<string> & RequiredFieldOptions<string> : FieldOptions<string> & OptionalFieldOptions;

export const fooBool = <T extends BasicFieldOptions<boolean>>(options: T): T extends RequiredFieldOptions<boolean> ? FieldOptions<boolean> & RequiredFieldOptions<boolean> : FieldOptions<boolean> & OptionalFieldOptions =>
  ({
    parser: parseBool,
    ...options,
  }) as unknown as T extends RequiredFieldOptions<boolean> ? FieldOptions<boolean> & RequiredFieldOptions<boolean> : FieldOptions<boolean> & OptionalFieldOptions;

export const fooFloat = <T extends BasicFieldOptions<number>>(options: T): T extends RequiredFieldOptions<number> ? FieldOptions<number> & RequiredFieldOptions<number> : FieldOptions<number> & OptionalFieldOptions =>
  ({
    parser: myParseFloat,
    ...options,
  }) as unknown as T extends RequiredFieldOptions<number> ? FieldOptions<number> & RequiredFieldOptions<number> : FieldOptions<number> & OptionalFieldOptions;

export const fooBigInt = <T extends BasicFieldOptions<BigInt>>(options: T): T extends RequiredFieldOptions<BigInt> ? FieldOptions<BigInt> & RequiredFieldOptions<BigInt> : FieldOptions<BigInt> & OptionalFieldOptions =>
  ({
    parser: parseBigInt,
    ...options,
  }) as unknown as T extends RequiredFieldOptions<BigInt> ? FieldOptions<BigInt> & RequiredFieldOptions<BigInt> : FieldOptions<BigInt> & OptionalFieldOptions;

// export const getPort = (options: BasicOptionalFieldOptions<number> = {}): OptionalFieldOptions<number> =>
//   getInt({ min: 0, max: 65535, ...options });

// export const requirePort = (options: BasicRequiredFieldOptions<number> = {}): RequiredFieldOptions<number> =>
//   requireInt({ min: 0, max: 65535, ...options });

export const fooUrl = <T extends BasicFieldOptions<URL>>(options: T): T extends RequiredFieldOptions<URL> ? FieldOptions<URL> & RequiredFieldOptions<URL> : FieldOptions<URL> & OptionalFieldOptions =>
  ({ parser: parseUrl, ...options,
  }) as unknown as T extends RequiredFieldOptions<URL> ? FieldOptions<URL> & RequiredFieldOptions<URL> : FieldOptions<URL> & OptionalFieldOptions;

export const fooJson = <T extends BasicFieldOptions<JsonValue>>(options: T): T extends RequiredFieldOptions<JsonValue> ? FieldOptions<JsonValue> & RequiredFieldOptions<JsonValue> : FieldOptions<JsonValue> & OptionalFieldOptions =>
  ({ parser: parseJson, ...options,
  }) as unknown as T extends RequiredFieldOptions<JsonValue> ? FieldOptions<JsonValue> & RequiredFieldOptions<JsonValue> : FieldOptions<JsonValue> & OptionalFieldOptions;
