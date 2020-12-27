export interface NumericOptions {
  min?: number|BigInt;
  max?: number|BigInt;
}

export const TRUE_VALUES = ['1', 'TRUE', 'true'];
export const FALSE_VALUES = ['0', 'FALSE', 'false'];

export const validateIntString = (s: string): void => {
  if (!/^[-+]?(\d+)$/.test(s)) {
    throw new Error('Invalid integer' + s);
  }
};

export const validateIntValue = (n: number): void => {
  if (!Number.isSafeInteger(n)) {
    throw new Error('Bad integer value: ' + n);
  }
};

export const validateFloatString = (s: string): void => {
  if (!/^[-+]?[0-9]*\.?[0-9]+$/.test(s)) {
    throw new Error('Invalid float' + s);
  }
};

export const validateFloatValue = (n: number): void => {
  if (Number.isNaN(n) || !Number.isFinite(n)) {
    throw new Error('Bad float value: ' + n);
  }
};

export const validateBase64String = (s: string): void => {
  if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(s)) {
    throw new Error('Invalid base64 string: ' + s);
  }
};

export const restrictValues = <T>(values: T[]) => (value: T): void => {
  if (!values.includes(value)) {
    throw new Error(`Invalid value: ${value}`);
  }
};

export const validateBoolString = restrictValues([...TRUE_VALUES, ...FALSE_VALUES]);

export const numericValidator = ({min, max}: NumericOptions) =>
  (value: number|BigInt): void => {
    if (min !== undefined && value < min) {
      throw new Error(`Value ${value} less than minimum ${min}`);
    }
    if (max !== undefined && value > max) {
      throw new Error(`Value ${value} greater than maximum ${max}`);
    }
  };
