import { setConfigOverrides, clearConfigOverrides, withConfigOverrides, readEnvValue } from './overrides';

test('No double override', () => {
  setConfigOverrides({});
  expect(() => setConfigOverrides({})).toThrow();
  clearConfigOverrides();
});

test('Override twice when clearing', () => {
  setConfigOverrides({});
  clearConfigOverrides();
  setConfigOverrides({});
  clearConfigOverrides();
});

const TEST_KEY = 'TEST_ENV_KEY';
const TEST_VALUE = '123';
const TEST_OVERRIDE = {[TEST_KEY]: TEST_VALUE};

test('WithOverrides works', () => {
  expect(readEnvValue(TEST_KEY)).toBeUndefined();
  withConfigOverrides(TEST_OVERRIDE, () => {
    expect(readEnvValue(TEST_KEY)).toEqual(TEST_VALUE);
  });
  expect(readEnvValue(TEST_KEY)).toBeUndefined();
});

test('set and clear overrides works', () => {
  expect(readEnvValue(TEST_KEY)).toBeUndefined();
  setConfigOverrides(TEST_OVERRIDE);
  expect(readEnvValue(TEST_KEY)).toEqual(TEST_VALUE);
  clearConfigOverrides();
  expect(readEnvValue(TEST_KEY)).toBeUndefined();
});

test('WithOverrides clears on error', () => {
  expect(readEnvValue(TEST_KEY)).toBeUndefined();
  expect(() => {
    withConfigOverrides(TEST_OVERRIDE, () => {
      expect(readEnvValue(TEST_KEY)).toEqual(TEST_VALUE);
      throw new Error();
    });
    expect(readEnvValue(TEST_KEY)).toBeUndefined();
  }).toThrow();
  expect(readEnvValue(TEST_KEY)).toBeUndefined();
});
