import { TRUE_VALUES } from './validators';
import { URL } from 'url';
import { ConfigError } from './error';

export type JsonValue = boolean | number | string | null | JsonArray | JsonMap;
type JsonMap = {[key: string]: JsonValue };
type JsonArray = JsonValue[];

type Parser<T> = (stringValue: string) => T;

const parseString: Parser<string> = s => s;
const myParseInt: Parser<number> = s => parseInt(s, 10);
const myParseFloat: Parser<number> = parseFloat;
const parseBigInt: Parser<BigInt> = s => BigInt(s);
const parseBool: Parser<boolean> = s => TRUE_VALUES.includes(s);
const parseUrl: Parser<URL> = s => new URL(s);
const parseJson: Parser<JsonValue> = s => JSON.parse(s);

const required = <T>(parser: Parser<T>) =>
  (value: string|undefined): T => {
    if (value === undefined) {
      throw new ConfigError('Missing required value');
    }
    return parser(value);
  };

const optional = <T>(parser: Parser<T>) =>
  (value: string|undefined): T|undefined =>
    value === undefined ? undefined : parser(value);

export const requiredString = required(parseString);
export const optionalString = optional(parseString);
export const requiredInt = required(myParseInt);
export const optionalInt = optional(myParseInt);
export const requiredFloat = required(myParseFloat);
export const optionalFloat = optional(myParseFloat);
export const requiredBigInt = required(parseBigInt);
export const optionalBigInt = optional(parseBigInt);
export const requiredBool = required(parseBool);
export const optionalBool = optional(parseBool);
export const requiredUrl = required(parseUrl);
export const optionalUrl = optional(parseUrl);
export const requiredJson = required(parseJson);
export const optionalJson = optional(parseJson);

