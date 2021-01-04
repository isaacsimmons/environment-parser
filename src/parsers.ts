import { URL } from 'url';

export type Parser<T> = (stringValue: string) => T;

export const parseString: Parser<string> = s => s;

export const myParseInt: Parser<number> = s => {
  if (!/^[-+]?(\d+)$/.test(s)) {
    throw new Error(`Invalid integer: ${s}`);
  }
  const parsed = parseInt(s, 10);
  if (!Number.isSafeInteger(parsed)) {
    throw new Error(`Bad integer value: ${parsed}`);
  }
  return parsed;
};

export const myParseFloat: Parser<number> = s => {
  if (!/^[-+]?[0-9]*\.?[0-9]+$/.test(s)) {
    throw new Error(`Invalid float: ${s}`);
  }
  const parsed = parseFloat(s);
  if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
    throw new Error(`Bad float value: ${parsed}`);
  }
  return parsed;
};

export const parseBigInt: Parser<BigInt> = s => {
  if (!/^[-+]?(\d+)$/.test(s)) {
    throw new Error(`Invalid integer: ${s}`);
  }
  return BigInt(s);
};

export const BOOL_TRUE_VALUES = [ '1', 'TRUE', 'true' ];
export const BOOL_FALSE_VALUES = [ '0', 'FALSE', 'false' ];
export const parseBool: Parser<boolean> = s => {
  if (BOOL_TRUE_VALUES.includes(s)) {
    return true;
  }
  if (BOOL_FALSE_VALUES.includes(s)) {
    return false;
  }
  throw new Error(`Invalid boolean value: ${s}`);
};

export const parseUrl: Parser<URL> = s => new URL(s);

export type JsonValue = boolean | number | string | null | JsonArray | JsonMap;
type JsonMap = {[key: string]: JsonValue };
type JsonArray = JsonValue[];
export const parseJson: Parser<JsonValue> = s => JSON.parse(s);
