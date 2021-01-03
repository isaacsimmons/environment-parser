import {
  FALSE_VALUES,
  TRUE_VALUES,
  numericValidator,
  validateBoolRaw,
  validateFloatRaw,
  validateFloatParsed,
  validateIntRaw,
  validateIntParsed,
  restrictValues,
  validateBase64Raw,
} from './validators';

const intStrings = [ '1000', '-1000', '+1000', '0', '+0', '-0' ];
const floatStrings = [ '4.2', '.52', '0.78', '-.5', '+.5', '+3.14', '5.0', '-5.0', '+5.0' ];

const badNumberStrings = [ '', '.', '-.', '203,2', '123foo', 'One', 'Eleventy', '1/2', 'Inf', 'NaN', '10n', '0xFF', '3.2.2', '1,000', 'MCMLXXXIV' ];

const ints = [ 0, -42, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER ];
const floats = [ 2.5, -42.42, 3.24e30 ];
// TODO: some bigint tests
// const bigints = [9007199254740993n, -9007199254740993n, 0n, 42n, 999999999999999999999999999999999999n];

const badNumbers = [ NaN, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY ];
const badInts = [ 9007199254740993, -9007199254740993 ];

test('int validators', () => {
  intStrings.forEach(validateIntRaw);

  const badStrings = [ ...badNumberStrings, ...floatStrings ];
  badStrings.forEach(badString => expect(() => validateIntRaw(badString)).toThrow());

  ints.forEach(validateIntParsed);

  const badValues = [ ...floats, ...badNumbers, ...badInts ];
  badValues.forEach(badValue => expect(() => validateIntParsed(badValue)).toThrow());
});

test('float validators', () => {
  [ ...intStrings, ...floatStrings ].forEach(validateFloatRaw);
  badNumberStrings.forEach(badString => expect(() => validateFloatRaw(badString)).toThrow());

  [ ...ints, ...floats ].forEach(validateFloatParsed);
  badNumbers.forEach(badNumber => expect(() => validateFloatParsed(badNumber)).toThrow());
});

test('boolean validators', () => {
  [ ...TRUE_VALUES, ...FALSE_VALUES ].forEach(validateBoolRaw);
  [ 'yes', 'Y', 'TrUe', '', 'foo' ].forEach(badBool => expect(() => validateBoolRaw(badBool)).toThrow());
});

test('numeric validator', () => {
  const fiveToTen = numericValidator({ min: 5, max: 10 });
  [ 5, 5.0, 5.5, 8, 10, 10n, 10.0 ].forEach(fiveToTen);
  [ 4.9999, -5, 12, 50000000 ].forEach(badNumber => expect(() => fiveToTen(badNumber)).toThrow());
});

test('restricted values validator', () => {
  const odds = [ 1,3,5,7,9 ];
  const evens = [ 0,2,4,6,8 ];
  const assertOdd = restrictValues(odds);

  odds.forEach(assertOdd);
  evens.forEach(even => expect(() => assertOdd(even)).toThrow());
});

test('base64 tester', () => {
  [ '1qAZ2WSx3EDc++++', 'QWERTY==', 'ASD=', '/A==' ].forEach(validateBase64Raw);
  [ 'x', 'ABCDE===', '1!qw', '1Qa', 'aeiou==' ].forEach(bad64 => expect(() => validateBase64Raw(bad64)).toThrow());
});
