import { URL } from 'url';
import { BasicFieldOptions, FieldOptions, OptionalFieldOptions, RequiredFieldOptions } from './main';
import { JsonValue, myParseFloat, myParseInt, parseBigInt, parseBool, parseJson, parseString, parseUrl } from './parsers';

function getInt(options?: BasicFieldOptions<number> & RequiredFieldOptions): FieldOptions<number>;
function getInt(options: BasicFieldOptions<number> & OptionalFieldOptions): FieldOptions<number> & OptionalFieldOptions;
function getInt(options?: BasicFieldOptions<number>): FieldOptions<number> {
  return {
    parser: myParseInt,
    ...options,
  };
}

function getString(options?: BasicFieldOptions<string> & RequiredFieldOptions): FieldOptions<string>;
function getString(options: BasicFieldOptions<string> & OptionalFieldOptions): FieldOptions<string> & OptionalFieldOptions;
function getString(options?: BasicFieldOptions<string>): FieldOptions<string> {
  return {
    parser: parseString,
    ...options,
  };
}

function getFloat(options?: BasicFieldOptions<number> & RequiredFieldOptions): FieldOptions<number>;
function getFloat(options: BasicFieldOptions<number> & OptionalFieldOptions): FieldOptions<number> & OptionalFieldOptions;
function getFloat(options?: BasicFieldOptions<number>): FieldOptions<number> {
  return {
    parser: myParseFloat,
    ...options,
  };
}

function getBool(options?: BasicFieldOptions<boolean> & RequiredFieldOptions): FieldOptions<boolean>;
function getBool(options: BasicFieldOptions<boolean> & OptionalFieldOptions): FieldOptions<boolean> & OptionalFieldOptions;
function getBool(options?: BasicFieldOptions<boolean>): FieldOptions<boolean> {
  return {
    parser: parseBool,
    ...options,
  };
}

function getBigInt(options?: BasicFieldOptions<BigInt> & RequiredFieldOptions): FieldOptions<BigInt>;
function getBigInt(options: BasicFieldOptions<BigInt> & OptionalFieldOptions): FieldOptions<BigInt> & OptionalFieldOptions;
function getBigInt(options?: BasicFieldOptions<BigInt>): FieldOptions<BigInt> {
  return {
    parser: parseBigInt,
    ...options,
  };
}

function getUrl(options?: BasicFieldOptions<URL> & RequiredFieldOptions): FieldOptions<URL>;
function getUrl(options: BasicFieldOptions<URL> & OptionalFieldOptions): FieldOptions<URL> & OptionalFieldOptions;
function getUrl(options?: BasicFieldOptions<URL>): FieldOptions<URL> {
  return {
    parser: parseUrl,
    ...options,
  };
}

function getJson(options?: BasicFieldOptions<JsonValue> & RequiredFieldOptions): FieldOptions<JsonValue>;
function getJson(options: BasicFieldOptions<JsonValue> & OptionalFieldOptions): FieldOptions<JsonValue> & OptionalFieldOptions;
function getJson(options?: BasicFieldOptions<JsonValue>): FieldOptions<JsonValue> {
  return {
    parser: parseJson,
    ...options,
  };
}

export const envType = {
  int: getInt,
  float: getFloat,
  bigInt: getBigInt,
  bool: getBool,
  url: getUrl,
  json: getJson,
  string: getString,
};
