import { getBool, getInt, getString, requireBool, requireString } from './getters';
import { Settings } from './main';
import { clearConfigOverrides, setConfigOverrides } from './overrides';

const overrides = { TEST_1: '3', TEST_2: 'foo' };

beforeEach(() => {
  setConfigOverrides(overrides);
});

afterEach(() => {
  clearConfigOverrides();
});

test('basic eager settings test', () => {
  const settings = Settings({
    TEST_1: getInt(),
    TEST_2: requireString({defaultValue: '123'}),
    TEST_3: getString(),
  }, {lazy: false});
  expect(settings.TEST_1).toEqual(3);
  expect(settings.TEST_2).toEqual('foo');
});

test('eager settings throw when missing required field', () => {
  expect(() => {
    Settings({
      TEST_1: getInt(),
      TEST_2: getString(),
      TEST_3: requireBool(),
    }, {lazy: false});
  }).toThrow();
});

test('eager settings don\'t throw when missing optional field', () => {
  Settings({
    TEST_1: getInt(),
    TEST_2: getString(),
    TEST_3: getBool(),
  }, {lazy: false});
});

test('basic lazy settings test', () => {
  const settings = Settings({
    TEST_1: getInt(),
    TEST_2: getString(),
  }, {lazy: true});
  expect(settings.TEST_1).toEqual(3);
  expect(settings.TEST_2).toEqual('foo');
});

test('lazy settings don\'t throw when not accessed', () => {
  const settings = Settings({
    TEST_1: getInt(),
    TEST_2: getString(),
    TEST_3: getBool(),
  }, {lazy: true});
  expect(settings.TEST_1).toEqual(3);
  expect(settings.TEST_2).toEqual('foo');
});

test('individual lazy settings don\'t throw when not accessed', () => {
  const settings = Settings({
    TEST_1: getInt(),
    TEST_2: getString(),
    TEST_3: getBool({lazy: true}),
  }, {lazy: false});
  expect(settings.TEST_1).toEqual(3);
  expect(settings.TEST_2).toEqual('foo');
});

test('lazy settings throws when missing required value accessed', () => {
  expect(() => {
    const settings = Settings({
      TEST_1: getInt(),
      TEST_2: getString(),
      TEST_3: requireBool(),
    }, {lazy: true});
      // Just access the value without doing anything to it
    settings.TEST_3;
  }).toThrow();
});

test('lazy settings don\'t throw when missing optional value accessed', () => {
  const settings = Settings({
    TEST_1: getInt(),
    TEST_2: getString(),
    TEST_3: getBool(),
  }, {lazy: true});
  // Just access the value without doing anything to it
  settings.TEST_3;
});

test('key rename test', () => {
  const settings = Settings({
    test1: getInt(),
    test2: getString(),
  }, {lazy: false, envStyle: 'UPPER_SNAKE'});
  expect(settings.test1).toEqual(3);
  expect(settings.test2).toEqual('foo');
});
