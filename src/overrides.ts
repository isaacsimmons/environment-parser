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

// Warning: This probably won't do what you want if you pass it an an async callback fn
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
