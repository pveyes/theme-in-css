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
