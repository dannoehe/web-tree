import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// import { AppContainer } from 'react-hot-loader'; // eslint-disable-line import/no-extraneous-dependencies

// const rootEl = document.getElementById('app');
// console.log(`1.` + rootEl);
// const render = Component => {
//   ReactDOM.render(
//     <Component/>,
//     document.getElementById('root')
//   );
// };

// /* eslint-disable global-require, import/newline-after-import */
// render(require('./app').default);

ReactDOM.render(
      <App />,
  document.getElementById('root')
);

// if (module.hot)
//   module.hot.accept('./app', () => render(require('./app').default));
/* eslint-enable global-require, import/newline-after-import */