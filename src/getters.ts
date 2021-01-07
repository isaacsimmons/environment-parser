import { URL } from 'url';
import { BasicFieldOptions, FieldOptions, OptionalFieldOptions, RequiredFieldOptions } from './main';
import { JsonValue, myParseFloat, myParseInt, parseBigInt, parseBool, parseJson, Parser, parseString, parseUrl } from './parsers';

export function getInt(options?: BasicFieldOptions<number> & RequiredFieldOptions): FieldOptions<number>;
export function getInt(options: BasicFieldOptions<number> & OptionalFieldOptions): FieldOptions<number> & OptionalFieldOptions;
export function getInt(options?: BasicFieldOptions<number>): typeof options & {parser: Parser<number>} {
  return {
    parser: myParseInt,
    ...options,
  };
}

export function getString(options?: BasicFieldOptions<string> & RequiredFieldOptions): FieldOptions<string>;
export function getString(options: BasicFieldOptions<string> & OptionalFieldOptions): FieldOptions<string> & OptionalFieldOptions;
export function getString(options?: BasicFieldOptions<string>): typeof options & {parser: Parser<string>} {
  return {
    parser: parseString,
    ...options,
  };
}

export function getFloat(options?: BasicFieldOptions<number> & RequiredFieldOptions): FieldOptions<number>;
export function getFloat(options: BasicFieldOptions<number> & OptionalFieldOptions): FieldOptions<number> & OptionalFieldOptions;
export function getFloat(options?: BasicFieldOptions<number>): typeof options & {parser: Parser<number>} {
  return {
    parser: myParseFloat,
    ...options,
  };
}

export function getBool(options?: BasicFieldOptions<boolean> & RequiredFieldOptions): FieldOptions<boolean>;
export function getBool(options: BasicFieldOptions<boolean> & OptionalFieldOptions): FieldOptions<boolean> & OptionalFieldOptions;
export function getBool(options?: BasicFieldOptions<boolean>): typeof options & {parser: Parser<boolean>} {
  return {
    parser: parseBool,
    ...options,
  };
}

export function getBigInt(options?: BasicFieldOptions<BigInt> & RequiredFieldOptions): FieldOptions<BigInt>;
export function getBigInt(options: BasicFieldOptions<BigInt> & OptionalFieldOptions): FieldOptions<BigInt> & OptionalFieldOptions;
export function getBigInt(options?: BasicFieldOptions<BigInt>): typeof options & {parser: Parser<BigInt>} {
  return {
    parser: parseBigInt,
    ...options,
  };
}

export function getUrl(options?: BasicFieldOptions<URL> & RequiredFieldOptions): FieldOptions<URL>;
export function getUrl(options: BasicFieldOptions<URL> & OptionalFieldOptions): FieldOptions<URL> & OptionalFieldOptions;
export function getUrl(options?: BasicFieldOptions<URL>): typeof options & {parser: Parser<URL>} {
  return {
    parser: parseUrl,
    ...options,
  };
}

export function getJson(options?: BasicFieldOptions<JsonValue> & RequiredFieldOptions): FieldOptions<JsonValue>;
export function getJson(options: BasicFieldOptions<JsonValue> & OptionalFieldOptions): FieldOptions<JsonValue> & OptionalFieldOptions;
export function getJson(options?: BasicFieldOptions<JsonValue>): typeof options & {parser: Parser<JsonValue>} {
  return {
    parser: parseJson,
    ...options,
  };
}
