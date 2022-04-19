import { createTheme } from '../src';

describe('it', () => {
  const themeConfig = {
    color: {
      lightPrimary: '#fff',
      darkPrimary: '#000',
    },
  };

  const theme = createTheme(themeConfig);

  it('returns css variable', () => {
    expect(theme.color.lightPrimary).toBe('var(--color-light-primary)');
    expect(theme.color.darkPrimary).toBe('var(--color-dark-primary)');
  });

  it('outputs css string', () => {
    expect(theme.css.string).toBe(
      `
--color-light-primary: #fff;
--color-dark-primary: #000;
    `.trim()
    );
  });

  it('outputs css properties', () => {
    expect(theme.css.properties).toEqual([
      ['--color-light-primary', '#fff'],
      ['--color-dark-primary', '#000'],
    ]);
  });

  it('allow single depth', () => {
    const theme = createTheme({
      firstItem: 'lalalala',
      secondItem: 12345
    });

    expect(theme.firstItem).toBe('var(--first-item)');
    expect(theme.secondItem).toBe('var(--second-item)');
    expect(theme.css.properties).toEqual([
      ['--first-item', 'lalalala'],
      ['--second-item', '12345px'],
    ]);
  })

  it('allow arbitrary depth', () => {
    const theme = createTheme({
      a: {
        b: {
          c: {
            d: {
              e: 'abcde',
            },
          },
          f: {
            g: 'abfg',
          },
        },
        h: {
          i: {
            j: {
              k: 'ahijk',
            },
          },
        },
      },
    });

    expect(theme.a.b.c.d.e).toEqual('var(--a-b-c-d-e)');
    expect(theme.a.b.f.g).toEqual('var(--a-b-f-g)');
    expect(theme.a.h.i.j.k).toEqual('var(--a-h-i-j-k)');

    expect(theme.css.string.split('\n')).toEqual(
      expect.arrayContaining(['--a-b-c-d-e: abcde;'])
    );
    expect(theme.css.string.split('\n')).toEqual(
      expect.arrayContaining(['--a-b-f-g: abfg;'])
    );
    expect(theme.css.string.split('\n')).toEqual(
      expect.arrayContaining(['--a-h-i-j-k: ahijk;'])
    );
  });

  // TODO enable using jest 25, jsdom 16, and cssstyle v2
  it.skip('matches between CSS string and variable', () => {
    const root = document.documentElement;
    theme.css.properties.forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    root.style.setProperty('color', theme.color.darkPrimary);
    const computedStyle = window.getComputedStyle(root);

    expect(computedStyle.color).toBe(themeConfig.color.darkPrimary);
  });
});
