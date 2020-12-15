import { getBool, getInt, getString } from './getters';
import { Settings } from './main';
import { withConfigOverrides } from './overrides';

const overrides = { TEST_1: '3', TEST_2: 'foo' };

test('basic eager settings test', () => {
  withConfigOverrides(overrides, () => {
    const settings = Settings({
      TEST_1: getInt(),
      TEST_2: getString(),
    }, {lazy: false});
    expect(settings.TEST_1).toEqual(3);
    expect(settings.TEST_2).toEqual('foo');
  });
});

test('eager settings throw when missing', () => {
  expect(() => {
    withConfigOverrides(overrides, () => {
      Settings({
        TEST_1: getInt(),
        TEST_2: getString(),
        TEST_3: getBool(),
      }, {lazy: false});
    });
  }).toThrow();
});

test('basic lazy settings test', () => {
  withConfigOverrides(overrides, () => {
    const settings = Settings({
      TEST_1: getInt(),
      TEST_2: getString(),
    }, {lazy: true});
    expect(settings.TEST_1).toEqual(3);
    expect(settings.TEST_2).toEqual('foo');
  });
});

test('lazy settings don\'t throw when not accessed', () => {
  withConfigOverrides(overrides, () => {
    const settings = Settings({
      TEST_1: getInt(),
      TEST_2: getString(),
      TEST_3: getBool(),
    }, {lazy: true});
    expect(settings.TEST_1).toEqual(3);
    expect(settings.TEST_2).toEqual('foo');
  });
});

// test('individual lazy settings don\'t throw when not accessed', () => {
//   withConfigOverrides(overrides, () => {
//     const settings = Settings({
//       TEST_1: getInt(),
//       TEST_2: getString(),
//       TEST_3: getBool({lazy: true}),
//     }, {lazy: false});
//     expect(settings.TEST_1).toEqual(3);
//     expect(settings.TEST_2).toEqual('foo');
//   });
// });

test('lazy settings throws when missing value accessed', () => {
  expect(() => {
    withConfigOverrides(overrides, () => {
      const settings = Settings({
        TEST_1: getInt(),
        TEST_2: getString(),
        TEST_3: getBool(),
      }, {lazy: false});
      // FIXME: better way to access this without "doing" anything with it
      console.log(settings.TEST_3);
    });
  }).toThrow();

});

test('key rename test', () => {
  withConfigOverrides(overrides, () => {
    const settings = Settings({
      test1: getInt(),
      test2: getString(),
    }, {lazy: false, envStyle: 'UPPER_SNAKE'});
    expect(settings.test1).toEqual(3);
    expect(settings.test2).toEqual('foo');
  });
});
