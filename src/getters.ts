import { BasicFieldOptions, FieldOptions, OptionalFieldOptions } from './main';
import { myParseFloat, myParseInt, parseBigInt, parseBool, parseJson, Parser, parseString, parseUrl } from './parsers';

const withParser = <TYPE>(parser: Parser<TYPE>) => <OPTIONS_TYPE extends BasicFieldOptions<TYPE>>(options?: OPTIONS_TYPE): OPTIONS_TYPE extends OptionalFieldOptions ? FieldOptions<TYPE> & OptionalFieldOptions : FieldOptions<number> =>
({
  parser,
  ...options,
}) as OPTIONS_TYPE extends OptionalFieldOptions ? FieldOptions<TYPE> & OptionalFieldOptions : FieldOptions<number>;

export const fooInt = withParser(myParseInt);

export const fooString = withParser(parseString);

export const fooBool = withParser(parseBool);

export const fooFloat = withParser(myParseFloat);

export const fooBigInt = withParser(parseBigInt);

// export const getPort = (options: BasicOptionalFieldOptions<number> = {}): OptionalFieldOptions<number> =>
//   getInt({ min: 0, max: 65535, ...options });

// export const requirePort = (options: BasicRequiredFieldOptions<number> = {}): RequiredFieldOptions<number> =>
//   requireInt({ min: 0, max: 65535, ...options });

export const fooUrl = withParser(parseUrl);

export const fooJson = withParser(parseJson);
