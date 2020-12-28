import { optionalBigInt, optionalBool, optionalFloat, optionalInt, optionalJson, optionalString, optionalUrl, requiredBigInt, requiredBool, requiredFloat, requiredInt, requiredJson, requiredString, requiredUrl } from './parsers';

test('optional parsers allow undefined', () => {
  expect(optionalInt(undefined)).toBeUndefined();
  expect(optionalFloat(undefined)).toBeUndefined();
  expect(optionalBigInt(undefined)).toBeUndefined();
  expect(optionalBool(undefined)).toBeUndefined();
  expect(optionalJson(undefined)).toBeUndefined();
  expect(optionalUrl(undefined)).toBeUndefined();
  expect(optionalString(undefined)).toBeUndefined();
});

test('required parsers dont allow undefined', () => {
  expect(() => requiredInt(undefined)).toThrow();
  expect(() => requiredFloat(undefined)).toThrow();
  expect(() => requiredBigInt(undefined)).toThrow();
  expect(() => requiredBool(undefined)).toThrow();
  expect(() => requiredJson(undefined)).toThrow();
  expect(() => requiredUrl(undefined)).toThrow();
  expect(() => requiredString(undefined)).toThrow();
});

test('int parser test', () => {
  expect(requiredInt('42')).toEqual(42);
  expect(requiredInt('+42')).toEqual(42);
  expect(requiredInt('-42')).toEqual(-42);
  expect(requiredInt('0')).toEqual(0);
  expect(requiredInt('+0')).toEqual(0);
  expect(requiredInt('9007199254740991')).toEqual(9007199254740991); // MAX_SAFE_INTEGER
  expect(requiredInt('-0') === 0).toBeTruthy();  // Sidestep the fact that expect 0 toEqual -0 fails
});

test('float parser test', () => {
  expect(requiredFloat('42')).toEqual(42);
  expect(requiredFloat('4.2')).toEqual(4.2);
  expect(requiredFloat('-4.2')).toEqual(-4.2);
  expect(requiredFloat('0.42')).toEqual(0.42);
  expect(requiredFloat('.42')).toEqual(0.42);
  expect(requiredFloat('-.42')).toEqual(-0.42);
  expect(requiredFloat('3.0')).toEqual(3);
  expect(requiredFloat('9007199254740991')).toEqual(9007199254740991); // MAX_SAFE_INTEGER
});

test('bigint parser test', () => {
  expect(requiredBigInt('0')).toEqual(0n);
  expect(requiredBigInt('9007199254740991')).toEqual(9007199254740991n);
  expect(requiredBigInt('9007199254740993')).toEqual(9007199254740993n);
  expect(requiredBigInt('-9000')).toEqual(-9000n);
});

test('bool parser test', () => {
  expect(requiredBool('TRUE')).toEqual(true);
  expect(requiredBool('1')).toEqual(true);
  expect(requiredBool('FALSE')).toEqual(false);
  expect(requiredBool('0')).toEqual(false);
});

test('json parser test', () => {
  expect(requiredJson('{"foo": "bar"}')).toEqual({ foo: 'bar' });
  expect(requiredJson('[1,2,"a","b"]')).toEqual([ 1,2,'a','b' ]);
  expect(requiredJson('"hello"')).toEqual('hello');
  expect(requiredJson('77')).toEqual(77);
});

test('url parser test', () => {
  const parsedUrl1 = requiredUrl('http://localhost:3000');
  expect(parsedUrl1.protocol).toEqual('http:');
  expect(parsedUrl1.hostname).toEqual('localhost');
  expect(parsedUrl1.port).toEqual('3000');

  const parsedUrl2 = requiredUrl('https://example.com/foo/bar?baz=qux');
  expect(parsedUrl2.hostname).toEqual('example.com');
  expect(parsedUrl2.protocol).toEqual('https:');
  expect(parsedUrl2.pathname).toEqual('/foo/bar');
  expect(parsedUrl2.search).toEqual('?baz=qux');
});
