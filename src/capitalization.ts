export type CapitalizationStyle = 'UpperCamel' | 'lowerCamel' | 'UPPER_SNAKE' | 'lower_snake';

// Split snake, kebab, camel etc variable names into words.
// Single consecutive captials are treated as separate words BugInARug, but more than that are lumped together HTTPAndURLParser
const splitKeyIntoWords = (s: string): string[] =>
  s.split(/([A-Z]?[a-z]+)|(\d+)|[-_]/g).filter(segment => segment !== undefined && segment.length > 0);

const capitalizeFirst = (s: string): string =>
  s[0].toUpperCase() + s.substring(1).toLowerCase();

const combineWords = (words: string[], style: CapitalizationStyle) => {
  switch (style) {
  case 'UPPER_SNAKE':
    return words.join('_').toUpperCase();
  case 'lower_snake':
    return words.join('_').toLowerCase();
  case 'lowerCamel': {
    const [ first, ...rest ] = words;
    return first.toLowerCase() + rest.map(capitalizeFirst).join('');
  }
  case 'UpperCamel':
    return words.map(capitalizeFirst).join('');
  default:
    throw new Error(`Unknown capitalization style: ${style}`);
  }
};

export const fixCapitalization = (s: string, style: CapitalizationStyle): string =>
  combineWords(splitKeyIntoWords(s), style);
