
export const validateBase64 = (s: string): void => {
  if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(s)) {
    throw new Error('Invalid base64 string: ' + s);
  }
};

export const restrictValues = <T>(values: T[]) => (value: T): void => {
  if (!values.includes(value)) {
    throw new Error(`Invalid value: ${value}`);
  }
};

export interface Range {
  min?: number|BigInt;
  max?: number|BigInt;
}

export const validateRange = ({ min, max }: Range) =>
  (value: number|BigInt): void => {
    if (min !== undefined && value < min) {
      throw new Error(`Value ${value} less than minimum ${min}`);
    }
    if (max !== undefined && value > max) {
      throw new Error(`Value ${value} greater than maximum ${max}`);
    }
  };

export const validatePort = validateRange({min: 0, max: 65535});
