import { BasicFieldOptions, FieldOptions, OptionalFieldOptions } from './main';
import { myParseFloat, myParseInt, parseBigInt, parseBool, parseJson, Parser, parseString, parseUrl } from './parsers';

const withParser = <TYPE>(parser: Parser<TYPE>) => <OPTIONS_TYPE extends BasicFieldOptions<TYPE>>(options?: OPTIONS_TYPE): OPTIONS_TYPE extends OptionalFieldOptions ? FieldOptions<TYPE> & OptionalFieldOptions : FieldOptions<TYPE> =>
({
  parser,
  ...options,
}) as OPTIONS_TYPE extends OptionalFieldOptions ? FieldOptions<TYPE> & OptionalFieldOptions : FieldOptions<TYPE>;

export const getInt = withParser(myParseInt);

export const getString = withParser(parseString);

export const getBool = withParser(parseBool);

export const getFloat = withParser(myParseFloat);

export const getBigInt = withParser(parseBigInt);

export const getUrl = withParser(parseUrl);

export const getJson = withParser(parseJson);
