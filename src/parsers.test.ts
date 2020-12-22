import { optionalBigInt, optionalBool, optionalFloat, optionalInt, optionalJson, optionalString, optionalUrl, requiredBigInt, requiredBool, requiredFloat, requiredInt, requiredJson, requiredString, requiredUrl } from './parsers';

// const intStrings = ['1000', '-1000', '+1000', '0', '+0', '-0'];
// const floatStrings = ['4.2', '.52', '0.78', '-.5', '+.5', '+3.14', '5.0', '-5.0', '+5.0'];

// const badNumberStrings = ['', '.', '-.', '203,2', '123foo', 'One', 'Eleventy', '1/2', 'Inf', 'NaN', '10n', '0xFF', '3.2.2', '1,000', 'MCMLXXXIV'];

// const ints = [0, -42, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];
// const floats = [2.5, -42.42, 3.24e30];
// TODO: some bigint tests
// const bigints = [9007199254740993n, -9007199254740993n, 0n, 42n, 999999999999999999999999999999999999n];

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
  expect(requiredInt('-0') === 0).toBeTruthy();  // Sidestep the fact that expect 0 toEqual -0 fails
});
