type ThemeConfig = Record<string, Record<string, string | number>>;

type ThemeCSSObject = {
  css: {
    string: string;
    properties: Array<[string, string]>;
  };
};

type ThemeVariables<T> = {
  [ck in keyof T]: {
    [p in keyof T[ck]]: string;
  };
};

type Theme<T> = ThemeVariables<T> & ThemeCSSObject;

export function createTheme<T extends ThemeConfig>(config: T): Theme<T> {
  const cssEntries = Object.keys(config).flatMap(configKey =>
    Object.keys(config[configKey]).map(prop => {
      const key = toCSSProperty(prop, configKey);
      const value = toCSSValue(config[configKey][prop]);
      return [key, value] as [string, string];
    })
  );

  const theme = {
    css: {
      string: cssEntries
        .flatMap(([key, value]) => `${key}: ${value};`)
        .join('\n'),
      properties: cssEntries,
    },
  };

  const value: ThemeVariables<T> = Object.keys(config).reduce(
    (result, configKey) => {
      result[configKey] = Object.keys(config[configKey]).reduce(
        (vars, prop) => {
          vars[prop] = toCSSVariable(prop, configKey);
          return vars;
        },
        Object.create(null)
      );
      return result;
    },
    Object.create(null)
  );

  return Object.assign(theme, value);
}

function toCSSVariable(key: string, prefix: string) {
  return `var(${toCSSProperty(key, prefix)})`;
}

function camelCaseToHypen(str: string) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function toCSSProperty(key: string, prefix: string) {
  return `--${prefix + '-' + camelCaseToHypen(key)}`;
}

function toCSSValue(value: string | number) {
  if (typeof value === 'string') {
    return value;
  }

  return value + 'px';
}
