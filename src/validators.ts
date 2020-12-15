export interface NumericOptions {
  min?: number|BigInt;
  max?: number|BigInt;
}

export interface StringOptions {
  allowedValues?: string[];
  length?: number;
  minLength?: number;
  maxLength?: number;
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

export const stringValidator = ({allowedValues, length, maxLength, minLength}: StringOptions) =>
  (value: string): void => {
    if (allowedValues !== undefined) {
      restrictValues(allowedValues)(value);
    }
    if (length !== undefined && value.length !== length) {
      throw new Error(`Value "${value}" not required length ${length}`);
    }
    if (minLength !== undefined && value.length < minLength) {
      throw new Error(`Value "${value}" shorter than minimum length ${minLength}`);
    }
    if (maxLength !== undefined && value.length > maxLength) {
      throw new Error(`Value "${value}" longer than maximum length ${maxLength}`);
    }
  };
