import { URL } from 'url';
import { BasicFieldOptions, FieldOptions, OptionalFieldOptions } from './main';
import { JsonValue, myParseFloat, myParseInt, parseBigInt, parseBool, parseJson, parseString, parseUrl } from './parsers';

//const fooT = <T>(parser: Parser<T>) => ();

// FIXME: can I get rid of the "as unknown" in these?
// TODO: make all of these params have an optional value of {} (or somethign with required if must be)
export const fooInt = <T = BasicFieldOptions<number>>(options?: T): T extends OptionalFieldOptions ? FieldOptions<number> & OptionalFieldOptions : FieldOptions<number> =>
  ({
    parser: myParseInt,
    ...options,
  }) as unknown as T extends OptionalFieldOptions ? FieldOptions<number> & OptionalFieldOptions : FieldOptions<number>;

export const fooString = <T extends BasicFieldOptions<string>>(options?: T): T extends OptionalFieldOptions ? FieldOptions<string> & OptionalFieldOptions : FieldOptions<string> =>
  ({
    parser: parseString,
    ...options,
  }) as unknown as T extends OptionalFieldOptions ? FieldOptions<string> & OptionalFieldOptions : FieldOptions<string>;

export const fooBool = <T extends BasicFieldOptions<boolean>>(options?: T): T extends OptionalFieldOptions ? FieldOptions<boolean> & OptionalFieldOptions : FieldOptions<boolean> =>
  ({
    parser: parseBool,
    ...options,
  }) as unknown as T extends OptionalFieldOptions ? FieldOptions<boolean> & OptionalFieldOptions : FieldOptions<boolean>;

export const fooFloat = <T extends BasicFieldOptions<number>>(options?: T): T extends OptionalFieldOptions ? FieldOptions<number> & OptionalFieldOptions : FieldOptions<number> =>
  ({
    parser: myParseFloat,
    ...options,
  }) as unknown as T extends OptionalFieldOptions ? FieldOptions<number> & OptionalFieldOptions : FieldOptions<number>;

export const fooBigInt = <T extends BasicFieldOptions<BigInt>>(options?: T): T extends OptionalFieldOptions ? FieldOptions<BigInt> & OptionalFieldOptions : FieldOptions<BigInt> =>
  ({
    parser: parseBigInt,
    ...options,
  }) as unknown as T extends OptionalFieldOptions ? FieldOptions<BigInt> & OptionalFieldOptions : FieldOptions<BigInt>;

// export const getPort = (options: BasicOptionalFieldOptions<number> = {}): OptionalFieldOptions<number> =>
//   getInt({ min: 0, max: 65535, ...options });

// export const requirePort = (options: BasicRequiredFieldOptions<number> = {}): RequiredFieldOptions<number> =>
//   requireInt({ min: 0, max: 65535, ...options });

export const fooUrl = <T extends BasicFieldOptions<URL>>(options?: T): T extends OptionalFieldOptions ? FieldOptions<URL> & OptionalFieldOptions : FieldOptions<URL> =>
  ({ parser: parseUrl, ...options,
  }) as unknown as T extends OptionalFieldOptions ? FieldOptions<URL> & OptionalFieldOptions : FieldOptions<URL>;

export const fooJson = <T extends BasicFieldOptions<JsonValue>>(options?: T): T extends OptionalFieldOptions ? FieldOptions<JsonValue> & OptionalFieldOptions : FieldOptions<JsonValue> =>
  ({ parser: parseJson, ...options,
  }) as unknown as T extends OptionalFieldOptions ? FieldOptions<JsonValue> & OptionalFieldOptions : FieldOptions<JsonValue>;
