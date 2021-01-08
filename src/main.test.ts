import { envType } from './getters';
import { clearEnvironmentCache, Settings } from './main';
import { validateBase64, validateRange } from './validators';

const overrides = { TEST_1: '3', TEST_2: 'foo' };

test('basic eager settings test', () => {
  const settings = Settings({
    TEST_1: envType.int(),
    TEST_2: envType.string({ defaultValue: '123' }),
  }, { lazy: false, overrides });
  expect(settings.TEST_1).toEqual(3);
  expect(settings.TEST_2).toEqual('foo');
});

test('eager settings throw when missing required field', () => {
  expect(() => {
    Settings({
      TEST_1: envType.int({ optional: false }),
      TEST_2: envType.string({ optional: true }),
      TEST_3: envType.bool(),
    }, { lazy: false, overrides });
  }).toThrow();
});

test('eager settings don\'t throw when missing optional field', () => {
  const settings = Settings({
    TEST_1: envType.int({ }),
    TEST_2: envType.string({ optional: true }),
    TEST_3: envType.bool({ optional: true }),
  }, { lazy: false, overrides });
  expect(settings.TEST_3).toBeUndefined();
});

test('basic lazy settings test', () => {
  const settings = Settings({
    TEST_1: envType.int({ optional: false }),
    TEST_2: envType.string({ optional: true }),
  }, { lazy: true, overrides });
  expect(settings.TEST_1).toEqual(3);
  expect(settings.TEST_2).toEqual('foo');
});

test('lazy settings don\'t throw when not accessed', () => {
  const settings = Settings({
    TEST_1: envType.int({ optional: false }),
    TEST_2: envType.string({ optional: true }),
    TEST_3: envType.bool({ optional: true }),
  }, { lazy: true, overrides });
  expect(settings.TEST_1).toEqual(3);
  expect(settings.TEST_2).toEqual('foo');
});

test('individual lazy settings don\'t throw when not accessed', () => {
  const settings = Settings({
    TEST_1: envType.int({ optional: false }),
    TEST_2: envType.string({ optional: true }),
    TEST_3: envType.bool({ lazy: true, optional: true }),
  }, { lazy: false, overrides });
  expect(settings.TEST_1).toEqual(3);
  expect(settings.TEST_2).toEqual('foo');
});

test('individual eager settings throw when not accessed', () => {
  expect(() => {
    Settings({
      TEST_1: envType.int({ optional: false }),
      TEST_2: envType.string(),
      TEST_3: envType.bool({ lazy: false, optional: false }),
    }, { lazy: true, overrides });
  }).toThrow();
});

test('individual settings default to eager and throw when not accessed', () => {
  expect(() => {
    Settings({
      TEST_1: envType.int({ optional: false }),
      TEST_2: envType.string(),
      TEST_3: envType.bool({ lazy: false, optional: false }),
    }, { overrides });
  }).toThrow();
});

test('lazy settings throws when missing required value accessed', () => {
  const settings = Settings({
    TEST_1: envType.int(),
    TEST_2: envType.string({ optional: true }),
    TEST_3: envType.bool({ optional: false }),
  }, { lazy: true, overrides });
  expect(() => {
    // Just access the value without doing anything to it
    settings.TEST_3;
  }).toThrow();
});

test('lazy settings don\'t throw when missing optional value accessed', () => {
  const settings = Settings({
    TEST_1: envType.int({ optional: false }),
    TEST_2: envType.string({ optional: true }),
    TEST_3: envType.bool({ optional: true }),
  }, { lazy: true, overrides });
  expect(settings.TEST_3).toBeUndefined();
});

test('lazy settings don\'t throw when missing required value has default', () => {
  const settings = Settings({
    TEST_1: envType.int(),
    TEST_2: envType.string({ optional: true }),
    TEST_3: envType.bool({ defaultValue: true }),
  }, { lazy: true, overrides });
  expect(settings.TEST_3).toEqual(true);
});

test('Renames environment keys in bulk', () => {
  const settings = Settings({
    test1: envType.int(),
    test2: envType.string({ optional: true }),
  }, { envStyle: 'UPPER_SNAKE', overrides });
  expect(settings.test1).toEqual(3);
  expect(settings.test2).toEqual('foo');
});

test('Renames individual environment keys', () => {
  const settings = Settings({
    TEST_1: envType.int(),
    foo: envType.string({ optional: true, envName: 'TEST_2' }),
  }, { overrides });
  expect(settings.TEST_1).toEqual(3);
  expect(settings.foo).toEqual('foo');
});

test('env values are cached', ()=> {
  const OLD_ENV = process.env;
  process.env = { ...OLD_ENV };
  process.env.TEST_1 = '3';
  try {
    const settings = Settings({ TEST_1: envType.int({ optional: false }) });
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
      TEST_1: envType.int({ optional: false }),
      TEST_2: envType.string({ optional: true }),
      TEST_3: envType.bool(),
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
    TEST_1: envType.string({ validate: validateBase64 }),
  }, { overrides: { TEST_1: 'SEVMTE8=' } });
  expect(settings.TEST_1).toEqual('SEVMTE8=');
});

test('Throws when additional validators are provided and the values are invalid', () => {
  expect(() => {
    Settings({
      TEST_1: envType.string({ validate: validateBase64 }),
    }, { overrides: { TEST_1: 'not base64' } });
  }).toThrow();
});

test('Throws when additional validators are provided and the values are invalid even if optional', () => {
  expect(() => {
    Settings({
      TEST_1: envType.string({ validate: validateBase64, optional: true }),
    }, { overrides: { TEST_1: 'not base64' } });
  }).toThrow();
});

test('Doesn\'t run additional validators against default values', () => {
  const settings = Settings({
    TEST_1: envType.string({ validate: validateBase64, defaultValue: 'invalid base64' }),
  });
  expect(settings.TEST_1).toEqual('invalid base64');
});

test('README example accepts valid port range', () => {
  const settings = Settings({
    JWT_SECRET: envType.string({optional:true}),
    DB_PORT: envType.int({validate: validateRange({min: 0, max: 65535})}),
    USE_SSL: envType.bool({defaultValue: false}),
    DEFAULT_CATEGORIES: {parser: s => s.split(' '), defaultValue: ['foo', 'bar']},
  }, {overrides: {DB_PORT: '5432'}});
  expect(settings.DB_PORT).toEqual(5432);      
});

test('README example rejects invalid port range', () => {
  expect(() => {
    Settings({
      JWT_SECRET: envType.string({optional:true}),
      DB_PORT: envType.int({validate: validateRange({min: 0, max: 65535})}),
      USE_SSL: envType.bool({defaultValue: false}),
      DEFAULT_CATEGORIES: {parser: s => s.split(' '), defaultValue: ['foo', 'bar']},
    }, {overrides: {DB_PORT: '543210'}});
    }).toThrow();

});

test('README example parses default categories', () => {
  const settings = Settings({
    JWT_SECRET: envType.string({optional:true}),
    DB_PORT: envType.int({validate: validateRange({min: 0, max: 65535})}),
    USE_SSL: envType.bool({defaultValue: false}),
    DEFAULT_CATEGORIES: {parser: s => s.split(' '), defaultValue: ['foo', 'bar']},
  }, {overrides: {DB_PORT: '5432', DEFAULT_CATEGORIES: 'abc def ghi'}});
  expect(settings.DEFAULT_CATEGORIES).toEqual(['abc', 'def', 'ghi']);    
});

test('README example uses defaults correctly', () => {
  const settings = Settings({
    JWT_SECRET: envType.string({optional:true}),
    DB_PORT: envType.int({validate: validateRange({min: 0, max: 65535})}),
    USE_SSL: envType.bool({defaultValue: false}),
    DEFAULT_CATEGORIES: {parser: s => s.split(' '), defaultValue: ['foo', 'bar']},
  }, {overrides: {DB_PORT: '5432'}});
  expect(settings.DEFAULT_CATEGORIES).toEqual(['foo', 'bar']);  
});
