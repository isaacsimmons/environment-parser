import { TRUE_VALUES, validateBoolRaw, validateFloatParsed, validateFloatRaw, validateIntParsed, validateIntRaw } from './validators';
import { URL } from 'url';
// import { ConfigError } from './error';

export type JsonValue = boolean | number | string | null | JsonArray | JsonMap;
type JsonMap = {[key: string]: JsonValue };
type JsonArray = JsonValue[];

type Parser<T> = (stringValue: string) => T;  

export const parseString: Parser<string> = s => s;

export const myParseInt: Parser<number> = s => {
    validateIntRaw(s);
    const parsed = parseInt(s, 10);
    validateIntParsed(parsed);
    return parsed;
};

export const myParseFloat: Parser<number> = s => {
    validateFloatRaw(s);
    const parsed = parseFloat(s);
    validateFloatParsed(parsed);
    return parsed;
};

export const parseBigInt: Parser<BigInt> = s => {
    validateIntRaw(s);
    return BigInt(s);
};

export const parseBool: Parser<boolean> = s => {
    validateBoolRaw(s);
    return TRUE_VALUES.includes(s);
};
export const parseUrl: Parser<URL> = s => new URL(s);
export const parseJson: Parser<JsonValue> = s => JSON.parse(s);
