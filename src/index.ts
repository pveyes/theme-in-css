type ThemeValueMap = {
  [key: string]: string | number;
};

type ThemeConfig = {
  [key: string]: ThemeValueMap | ThemeConfig;
};

type ThemeCSSObject = {
  css: {
    string: string;
    properties: Array<[string, string]>;
  };
};

type ThemeVariables<T> = {
  [ck in keyof T]: {
    [p in keyof T[ck]]: T[ck][p] extends Record<string, any>
      ? ThemeVariables<T[ck][p]>
      : string;
  };
};

type Theme<T> = ThemeVariables<T> & ThemeCSSObject;

export function createTheme<T extends ThemeConfig>(config: T): Theme<T> {
  const cssEntries = generateCSSEntries(config);
  const variables = createThemeVariables(config);

  const theme = {
    css: {
      string: cssEntries
        .flatMap(({ key, value }) => `${key}: ${value};`)
        .join('\n'),
      properties: cssEntries.map(({ key, value }) => [key, value]) as Array<
        [string, string]
      >,
    },
  };

  return Object.assign(theme, variables);
}

function generateCSSEntries<T extends ThemeConfig>(
  config: T
): Array<{ key: string; value: string }> {
  return Object.keys(config).flatMap(configKey => {
    return createCSSEntries(config[configKey], configKey);
  });
}

function createCSSEntries<T extends ThemeConfig | ThemeValueMap>(
  map: T,
  prefix = ''
): Array<{ key: string; value: string }> {
  return Object.keys(map)
    .map(prop => {
      const value = map[prop];
      if (typeof value === 'string' || typeof value === 'number') {
        const key = toCSSProperty(prop, prefix);
        return { key, value: toCSSValue(value) };
      }

      return createCSSEntries(value, prefix + '-' + prop) as any;
    })
    .flat(Infinity);
}

function createThemeVariables<T extends ThemeConfig | ThemeValueMap>(
  config: T,
  prefix = ''
): ThemeVariables<T> {
  const variables = Object.create(null);

  for (const key in config) {
    const v = config[key];
    if (typeof v === 'number' || typeof v === 'string') {
      variables[key] = toCSSVariable(key, prefix);
    } else {
      variables[key] = createThemeVariables(
        // @ts-ignore
        v,
        prefix === '' ? key : prefix + '-' + key
      );
    }
  }

  return variables;
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
