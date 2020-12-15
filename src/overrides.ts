export interface ConfigOverrides {
  [envKey: string]: string;
}

let overrides: ConfigOverrides | null = null;

export const setConfigOverrides = (values: ConfigOverrides): void => {
  if (overrides !== null) {
    throw new Error('already overridden');
  }
  overrides = values;
};

export const clearConfigOverrides = (): void => {
  overrides = null;
};

export const withConfigOverrides = (values: ConfigOverrides, callback: () => unknown): void => {
  setConfigOverrides(values);
  try {
    callback();
  } finally {
    clearConfigOverrides();
  }
};

export const readEnvValue = (key: string): string|undefined =>
  (overrides && overrides[key]) ?? process.env[key];
