import {
  validateRange,
  restrictValues,
  validateBase64,
} from './validators';

test('numeric validator', () => {
  const fiveToTen = validateRange({ min: 5, max: 10 });
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
  [ '1qAZ2WSx3EDc++++', 'QWERTY==', 'ASD=', '/A==' ].forEach(validateBase64);
  [ 'x', 'ABCDE===', '1!qw', '1Qa', 'aeiou==' ].forEach(bad64 => expect(() => validateBase64(bad64)).toThrow());
});
