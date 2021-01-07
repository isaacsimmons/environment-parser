import { getInt, getBool, getString } from './getters';
import { clearEnvironmentCache, Settings } from './main';
import { validateBase64 } from './validators';

const overrides = { TEST_1: '3', TEST_2: 'foo' };

test('basic eager settings test', () => {
  const settings = Settings({
    TEST_1: getInt(),
    TEST_2: getString({ defaultValue: '123' }),
  }, { lazy: false, overrides });
  expect(settings.TEST_1).toEqual(3);
  expect(settings.TEST_2).toEqual('foo');
});

test('eager settings throw when missing required field', () => {
  expect(() => {
    Settings({
      TEST_1: getInt({ optional: false }),
      TEST_2: getString({ optional: true }),
      TEST_3: getBool(),
    }, { lazy: false, overrides });
  }).toThrow();
});

test('eager settings don\'t throw when missing optional field', () => {
  const settings = Settings({
    TEST_1: getInt({ }),
    TEST_2: getString({ optional: true }),
    TEST_3: getBool({ optional: true }),
  }, { lazy: false, overrides });
  expect(settings.TEST_3).toBeUndefined();
});

test('basic lazy settings test', () => {
  const settings = Settings({
    TEST_1: getInt({ optional: false }),
    TEST_2: getString({ optional: true }),
  }, { lazy: true, overrides });
  expect(settings.TEST_1).toEqual(3);
  expect(settings.TEST_2).toEqual('foo');
});

test('lazy settings don\'t throw when not accessed', () => {
  const settings = Settings({
    TEST_1: getInt({ optional: false }),
    TEST_2: getString({ optional: true }),
    TEST_3: getBool({ optional: true }),
  }, { lazy: true, overrides });
  expect(settings.TEST_1).toEqual(3);
  expect(settings.TEST_2).toEqual('foo');
});

test('individual lazy settings don\'t throw when not accessed', () => {
  const settings = Settings({
    TEST_1: getInt({ optional: false }),
    TEST_2: getString({ optional: true }),
    TEST_3: getBool({ lazy: true, optional: true }),
  }, { lazy: false, overrides });
  expect(settings.TEST_1).toEqual(3);
  expect(settings.TEST_2).toEqual('foo');
});

test('individual eager settings throw when not accessed', () => {
  expect(() => {
    Settings({
      TEST_1: getInt({ optional: false }),
      TEST_2: getString(),
      TEST_3: getBool({ lazy: false, optional: false }),
    }, { lazy: true, overrides });
  }).toThrow();
});

test('individual settings default to eager and throw when not accessed', () => {
  expect(() => {
    Settings({
      TEST_1: getInt({ optional: false }),
      TEST_2: getString(),
      TEST_3: getBool({ lazy: false, optional: false }),
    }, { overrides });
  }).toThrow();
});

test('lazy settings throws when missing required value accessed', () => {
  const settings = Settings({
    TEST_1: getInt(),
    TEST_2: getString({ optional: true }),
    TEST_3: getBool({ optional: false }),
  }, { lazy: true, overrides });
  expect(() => {
    // Just access the value without doing anything to it
    settings.TEST_3;
  }).toThrow();
});

test('lazy settings don\'t throw when missing optional value accessed', () => {
  const settings = Settings({
    TEST_1: getInt({ optional: false }),
    TEST_2: getString({ optional: true }),
    TEST_3: getBool({ optional: true }),
  }, { lazy: true, overrides });
  expect(settings.TEST_3).toBeUndefined();
});

test('lazy settings don\'t throw when missing required value has default', () => {
  const settings = Settings({
    TEST_1: getInt(),
    TEST_2: getString({ optional: true }),
    TEST_3: getBool({ defaultValue: true }),
  }, { lazy: true, overrides });
  expect(settings.TEST_3).toEqual(true);
});

test('Renames environment keys in bulk', () => {
  const settings = Settings({
    test1: getInt(),
    test2: getString({ optional: true }),
  }, { envStyle: 'UPPER_SNAKE', overrides });
  expect(settings.test1).toEqual(3);
  expect(settings.test2).toEqual('foo');
});

test('Renames individual environment keys', () => {
  const settings = Settings({
    TEST_1: getInt(),
    foo: getString({ optional: true, envName: 'TEST_2' }),
  }, { overrides });
  expect(settings.TEST_1).toEqual(3);
  expect(settings.foo).toEqual('foo');
});

test('env values are cached', ()=> {
  const OLD_ENV = process.env;
  process.env = { ...OLD_ENV };
  process.env.TEST_1 = '3';
  try {
    const settings = Settings({ TEST_1: getInt({ optional: false }) });
    expect(settings.TEST_1).toEqual(3);

    process.env.TEST_1 = '4';
    expect(settings.TEST_1).toEqual(3);

    clearEnvironmentCache();
    expect(settings.TEST_1).toEqual(4);
  } finally {
    process.env = OLD_ENV;
  }
});

test('lazy parsing behavior when environment override is specified', ()=> {
  const OLD_ENV = process.env;
  process.env = { ...OLD_ENV };
  process.env.ENVIRONMENT_PARSER_ALL_LAZY = '1';
  try {
    const settings = Settings({
      TEST_1: getInt({ optional: false }),
      TEST_2: getString({ optional: true }),
      TEST_3: getBool(),
    }, { lazy: false, overrides });
    expect(settings.TEST_1).toEqual(3);
    expect(settings.TEST_2).toEqual('foo');
    expect(() => settings.TEST_3).toThrow();
  } finally {
    process.env = OLD_ENV;
  }
});

test('Doesn\'t throw when values are allowed by additional validators', () => {
  const settings = Settings({
    TEST_1: getString({ validate: validateBase64 }),
  }, { overrides: { TEST_1: 'SEVMTE8=' } });
  expect(settings.TEST_1).toEqual('SEVMTE8=');
});

test('Throws when additional validators are provided and the values are invalid', () => {
  expect(() => {
    Settings({
      TEST_1: getString({ validate: validateBase64 }),
    }, { overrides: { TEST_1: 'not base64' } });
  }).toThrow();
});

test('Throws when additional validators are provided and the values are invalid even if optional', () => {
  expect(() => {
    Settings({
      TEST_1: getString({ validate: validateBase64, optional: true }),
    }, { overrides: { TEST_1: 'not base64' } });
  }).toThrow();
});

test('Doesn\'t run additional validators against default values', () => {
  const settings = Settings({
    TEST_1: getString({ validate: validateBase64, defaultValue: 'invalid base64' }),
  });
  expect(settings.TEST_1).toEqual('invalid base64');
});
