export type BuiltInCapitalizationStyle = 'UpperCamel' | 'lowerCamel' | 'UPPER_SNAKE' | 'lower_snake' | 'UPPER-KEBAB' | 'lower-kebab';

// Split snake, kebab, camel etc variable names into words.
// Single consecutive captials are treated as separate words BugInARug, but more than that are lumped together HTTPAndURLParser
const splitKeyIntoWords = (s: string): string[] =>
  s.split(/([A-Z]?[a-z]+)|(\d+)|[-_]/g).filter(segment => segment !== undefined && segment.length > 0);

const capitalizeFirst = (s: string): string =>
  s[0].toUpperCase() + s.substring(1).toLowerCase();

// TODO: locale-specific rules for upperCase/lowerCase? how to specify?
const combineWords = (words: string[], style: BuiltInCapitalizationStyle) => {
  switch (style) {
  case 'UPPER_SNAKE':
    return words.join('_').toUpperCase();
  case 'lower_snake':
    return words.join('_').toLowerCase();
  case 'UPPER-KEBAB':
    return words.join('-').toUpperCase();
  case 'lower-kebab':
    return words.join('-').toLowerCase();
  case 'lowerCamel': {
    const [first, ...rest] = words;
    return first.toLowerCase() + rest.map(capitalizeFirst).join('');
  }
  case 'UpperCamel':
    return words.map(capitalizeFirst).join('');
  default:
    throw new Error(`Unknown capitalization style: ${style}`);
  }
};

export const fixCapitalization = (s: string, style: BuiltInCapitalizationStyle): string =>
  combineWords(splitKeyIntoWords(s), style);
