// import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Map as iMap, fromJS } from 'immutable';
import makeStore from './makeStore';
import Root from './Root';

const initialState = iMap([
  ['auth', fromJS({error: {}, isAuthenticated: false, isAuthenticating: false, authToken: null, user: {}})],
  ['routing', {locationBeforeTransitions: null}],
]);

const store = makeStore(initialState);
render(
  <AppContainer>
    <Root store={store}/>
  </AppContainer>
  , document.getElementById('root')
);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./Root', () => {
    const Root = require('./Root');
    render(
      <AppContainer>
        <Root store={store}/>
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
