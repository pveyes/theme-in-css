import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createTheme } from '../.';

const Theme = createTheme({
  color: {
    lightPrimary: '#fff',
    darkPrimary: '#000',
  }
});

const DarkTheme = createTheme({
  color: {
    lightPrimary: '#000',
    darkPrimary: '#fff',
  }
})

const style = document.createElement('style');
style.innerHTML = `
  :root {
    ${Theme.css.string}
  }
  
  @media (prefers-color-scheme: dark) {
    :root {
      ${DarkTheme.css.string}
    }
  }
`

document.head.appendChild(style)

const App = () => {
  return (
    <div style={{ backgroundColor: Theme.color.lightPrimary, color: Theme.color.darkPrimary }}>
      <h1>It Works</h1>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
