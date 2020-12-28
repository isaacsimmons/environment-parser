import { getBool, getString, requireBool, requireInt, requireString } from './getters';
import { clearEnvironnentCache, Settings } from './main';

const overrides = { TEST_1: '3', TEST_2: 'foo' };

test('basic eager settings test', () => {
  const settings = Settings({
    TEST_1: requireInt(),
    TEST_2: requireString({ defaultValue: '123' }),
  }, { lazy: false, overrides });
  expect(settings.TEST_1).toEqual(3);
  expect(settings.TEST_2).toEqual('foo');
});

test('eager settings throw when missing required field', () => {
  expect(() => {
    Settings({
      TEST_1: requireInt(),
      TEST_2: getString(),
      TEST_3: requireBool(),
    }, { lazy: false, overrides });
  }).toThrow();
});

test('eager settings don\'t throw when missing optional field', () => {
  const settings = Settings({
    TEST_1: requireInt(),
    TEST_2: getString(),
    TEST_3: getBool(),
  }, { lazy: false, overrides });
  expect(settings.TEST_3).toBeUndefined();
});

test('basic lazy settings test', () => {
  const settings = Settings({
    TEST_1: requireInt(),
    TEST_2: getString(),
  }, { lazy: true, overrides });
  expect(settings.TEST_1).toEqual(3);
  expect(settings.TEST_2).toEqual('foo');
});

test('lazy settings don\'t throw when not accessed', () => {
  const settings = Settings({
    TEST_1: requireInt(),
    TEST_2: getString(),
    TEST_3: getBool(),
  }, { lazy: true, overrides });
  expect(settings.TEST_1).toEqual(3);
  expect(settings.TEST_2).toEqual('foo');
});

test('individual lazy settings don\'t throw when not accessed', () => {
  const settings = Settings({
    TEST_1: requireInt(),
    TEST_2: getString(),
    TEST_3: getBool({ lazy: true }),
  }, { lazy: false, overrides });
  expect(settings.TEST_1).toEqual(3);
  expect(settings.TEST_2).toEqual('foo');
});

test('individual eager settings throw when not accessed', () => {
  expect(() => {
    Settings({
      TEST_1: requireInt(),
      TEST_2: getString(),
      TEST_3: requireBool({ lazy: false }),
    }, { lazy: true, overrides });
  }).toThrow();
});

test('lazy settings throws when missing required value accessed', () => {
  expect(() => {
    const settings = Settings({
      TEST_1: requireInt(),
      TEST_2: getString(),
      TEST_3: requireBool(),
    }, { lazy: true, overrides });
      // Just access the value without doing anything to it
    settings.TEST_3;
  }).toThrow();
});

test('lazy settings don\'t throw when missing optional value accessed', () => {
  const settings = Settings({
    TEST_1: requireInt(),
    TEST_2: getString(),
    TEST_3: getBool(),
  }, { lazy: true, overrides });
  expect(settings.TEST_3).toBeUndefined();
});

test('lazy settings don\'t throw when missing required value has default', () => {
  const settings = Settings({
    TEST_1: requireInt(),
    TEST_2: getString(),
    TEST_3: requireBool({ defaultValue: true }),
  }, { lazy: true, overrides });
  expect(settings.TEST_3).toEqual(true);
});

test('key rename test', () => {
  const settings = Settings({
    test1: requireInt(),
    test2: getString(),
  }, { lazy: false, envStyle: 'UPPER_SNAKE', overrides });
  expect(settings.test1).toEqual(3);
  expect(settings.test2).toEqual('foo');
});

test('env values are cached', ()=> {
  const OLD_ENV = process.env;
  process.env = { ...OLD_ENV };
  process.env.TEST_1 = '3';
  try {
    const settings = Settings({ TEST_1: requireInt() });
    expect(settings.TEST_1).toEqual(3);

    process.env.TEST_1 = '4';
    expect(settings.TEST_1).toEqual(3);

    clearEnvironnentCache();
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
      TEST_1: requireInt(),
      TEST_2: getString(),
      TEST_3: requireBool(),
    }, { lazy: false, overrides });
    expect(settings.TEST_1).toEqual(3);
    expect(settings.TEST_2).toEqual('foo');
    expect(() => settings.TEST_3).toThrow();
  } finally {
    process.env = OLD_ENV;
  }
});

// TODO: test individual field envKey overrides
// TODO: validation does not run against default values
