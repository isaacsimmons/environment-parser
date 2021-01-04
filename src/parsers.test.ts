import { myParseFloat, myParseInt, parseBigInt, parseJson, parseUrl, parseBool, BOOL_TRUE_VALUES, BOOL_FALSE_VALUES } from './parsers';

test('int parser test', () => {
  expect(myParseInt('42')).toEqual(42);
  expect(myParseInt('+42')).toEqual(42);
  expect(myParseInt('-42')).toEqual(-42);
  expect(myParseInt('0')).toEqual(0);
  expect(myParseInt('+0')).toEqual(0);
  expect(myParseInt('9007199254740991')).toEqual(9007199254740991); // MAX_SAFE_INTEGER
  expect(myParseInt('-0') === 0).toBeTruthy();  // Sidestep the fact that expect 0 toEqual -0 fails
});

test('float parser test', () => {
  expect(myParseFloat('42')).toEqual(42);
  expect(myParseFloat('4.2')).toEqual(4.2);
  expect(myParseFloat('-4.2')).toEqual(-4.2);
  expect(myParseFloat('0.42')).toEqual(0.42);
  expect(myParseFloat('.42')).toEqual(0.42);
  expect(myParseFloat('-.42')).toEqual(-0.42);
  expect(myParseFloat('3.0')).toEqual(3);
  expect(myParseFloat('9007199254740991')).toEqual(9007199254740991); // MAX_SAFE_INTEGER
});

test('bigint parser test', () => {
  expect(parseBigInt('0')).toEqual(0n);
  expect(parseBigInt('9007199254740991')).toEqual(9007199254740991n);
  expect(parseBigInt('9007199254740993')).toEqual(9007199254740993n);
  expect(parseBigInt('-9000')).toEqual(-9000n);
});

test('bool parser test', () => {
  BOOL_TRUE_VALUES.forEach(trueString => expect(parseBool(trueString)).toEqual(true));
  BOOL_FALSE_VALUES.forEach(falseString => expect(parseBool(falseString)).toEqual(false));
});

test('json parser test', () => {
  expect(parseJson('{"foo": "bar"}')).toEqual({ foo: 'bar' });
  expect(parseJson('[1,2,"a","b"]')).toEqual([ 1,2,'a','b' ]);
  expect(parseJson('"hello"')).toEqual('hello');
  expect(parseJson('77')).toEqual(77);
});

test('url parser test', () => {
  const parsedUrl1 = parseUrl('http://localhost:3000');
  expect(parsedUrl1.protocol).toEqual('http:');
  expect(parsedUrl1.hostname).toEqual('localhost');
  expect(parsedUrl1.port).toEqual('3000');

  const parsedUrl2 = parseUrl('https://example.com/foo/bar?baz=qux');
  expect(parsedUrl2.hostname).toEqual('example.com');
  expect(parsedUrl2.protocol).toEqual('https:');
  expect(parsedUrl2.pathname).toEqual('/foo/bar');
  expect(parsedUrl2.search).toEqual('?baz=qux');
});


const intStrings = [ '1000', '-1000', '+1000', '0', '+0', '-0', '9007199254740991', '-9007199254740991' ];
const floatStrings = [ '4.2', '.52', '0.78', '-.5', '+.5', '+3.14', '5.0', '-5.0', '+5.0' ];
const bigIntStrings = ['9007199254740993', '-9007199254740993', '999999999999999999999999999999999999'];

const badNumberStrings = [ '', '.', '-.', '203,2', '123foo', 'One', 'Eleventy', '1/2', 'Inf', 'NaN', '10n', '0xFF', '3.2.2', '1,000', 'MCMLXXXIV' ];

test('int validation', () => {
  [
    ...badNumberStrings,
    ...floatStrings,
    ...bigIntStrings,
   ].forEach(badString => expect(() => myParseInt(badString)).toThrow());
});

test('float validation', () => {
  badNumberStrings.forEach(badString => expect(() => myParseFloat(badString)).toThrow());
});

test('bigint validation', () => {
  [
    ...badNumberStrings,
    ...floatStrings,
  ].forEach(badString => expect(() => parseBigInt(badString)).toThrow());
});
