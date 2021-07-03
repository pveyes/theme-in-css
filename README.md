<!-- markdownlint-disable MD026 MD033 MD041 -->

<div align="center">

[![theme-in-css](https://user-images.githubusercontent.com/1614415/80961549-5ba25e80-8e35-11ea-8ee3-0a709439f15a.png)](.)

[![npm](https://badgen.net/npm/v/theme-in-css)](https://www.npmjs.com/package/theme-in-css)
[![npm-dl](https://badgen.net/npm/dt/theme-in-css)](https://www.npmjs.com/package/theme-in-css)

</div>

---

- [Why?](#why)
- [Usage](#usage)
- [CSS Integration](#css-integration)
  - [.css.string: `string`](#cssstring-string)
  - [.css.properties: `Array<[key: string, value: string]>`](#cssproperties-arraykey-string-value-string)
- [License](#license)

---

## Why?

- **Strictly-typed design token, no more typo**. As you might know: CSS is forgiving, but in this case we don't want that. We want it to fail at compile time and this library gives you that
- **Works in CSS and JS**. Using CSS custom properties means you can reference your design token in both CSS and JS. Separation of concern!
- **UI Library agnostic**. The only purpose of this library is to provide type-safe CSS custom properties in your TS modules, nothing less, nothing more.

## Usage

First create your theme object, you can group theme variables by its function (color, spacing, etc). Think of it as design token

```ts
import { createTheme } from 'theme-in-css';

export const Theme = createTheme({
  color: {
    lightPrimary: '#fff',
    darkPrimary: '#000',
  },
  spacing: {
    xs: 2,
    s: 4,
    m: 8,
    l: 16,
    xl: 32,
  },
  typography: {
    family: {
      serif: 'Times New Roman',
      sans: 'Calibri',
      mono: 'Menlo',
    },
  }
});

// If you hate typing you can also use a shorter property name
// const t = createTheme({ c: { l1: '#fff', d1: '#000' } });
```

You can use any any UI libraries/framework that can define style in JS/TS, for example [React](https://reactjs.org) and [Lit](https://lit.dev/).

```tsx
// React
import React from 'react';
import { Theme } from './theme';

export default function Component() {
  // use css prop via emotion/styled-components
  // of course inline style works as well
  return (
    <div
      css={{
        backgroundColor: Theme.color.darkPrimary,
        color: Theme.color.lightPrimary,
        margin: Theme.spacing.m,
        fontFamily: Theme.typography.family.serif,
      }}
    >
      <h1>It works</h1>
    </div>
  );
}

// Lit
// You need to wrap Theme inside `unsafeCSS`
import { LitElement, html, css, unsafeCSS as cv } from 'lit';
import { Theme } from './theme';

export default class Component extends LitElement {
  static styles = css`
    div {
      background-color: ${cv(Theme.color.darkPrimary)};
      color: ${cv(Theme.color.lightPrimary)};
      margin: ${cv(Theme.spacing.m)};
      font-family: ${cv(Theme.typography.family.serif)};
    }
  `;

  render() {
    return html`
      <div>
        <h1>It works</h1>
      </div>
    `;
  }
}
```

## CSS Integration

If you only create theme and use them in your app, you'll notice that your app now uses CSS variables to reference a value, but it doesn't work properly yet because you need to add the CSS into your stylesheet.

### .css.string: `string`

`theme-in-css` provides `.css.string` property to dump all theme values as CSS properties. You can create 2 themes light and dark and output them in different style declaration, like this:

```ts
import { Theme, DarkTheme } from './theme';

const html = `
<!doctype head>
<html>
  <head>
    <style>
      :root {
        ${Theme.css.string}
      }

      @media (prefers-color-scheme: dark) {
        ${DarkTheme.css.string}
      }
    </style>
  </head>
  <body>
  </body>
</html>
`;
```

You can open [example](example) to see it in action.

### .css.properties: `Array<[key: string, value: string]>`

You can also use `.css.properties` if you want to update the CSS custom property manually using JS.

```js
const root = document.documentElement;

theme.css.properties.forEach(([key, value]) => {
  root.style.setProperty(key, value);
});
```

If you prefer `Record<string, string>` instead, you can use `Object.fromEntries`

```js
const obj = Object.fromEntries(theme.css.properties);
```

## License

MIT
