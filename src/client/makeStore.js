import {createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {routerMiddleware} from 'react-router-redux';
import {browserHistory} from 'react-router';
import makeReducer from './makeReducer';
// import optimisticMiddleware from './middleware/optimisticMiddleware';
// import fetchMiddleware from './middleware/fetchMiddleware';
// import errorMiddleware from './middleware/errorMiddleware';

export default initialState => {
  let store;
  const reducer = makeReducer();
  const reduxRouterMiddleware = routerMiddleware(browserHistory);
  const middlewares = [
    reduxRouterMiddleware,
    thunkMiddleware,
    // optimisticMiddleware,
    // fetchMiddleware,
    // errorMiddleware
  ];

  if (__PRODUCTION__) {
    store = createStore(reducer, initialState, applyMiddleware(...middlewares));
  } else {
    const createLogger = require('redux-logger');
    const logger = createLogger({
      level: 'info',
      collapsed: true
    });

    middlewares.push(logger);
    store = createStore(reducer, initialState, applyMiddleware(...middlewares));
  }

  return store;
};







// const createStoreWithMiddleware = compose(
//   applyMiddleware(...Middlewares),
//   persistState(['application']),
// )(createStore);

// const store = createStoreWithMiddleware(rootReducer, initialState);






// import persistState, { mergePersistedState } from 'redux-localstorage';
// import sessionStorageAdapter from 'redux-localstorage/lib/adapters/sessionStorage';
// import localStorageAdapter from 'redux-localstorage/lib/adapters/localStorage';
// import reduxLocalstorageFilter from 'redux-localstorage-filter';

// // const middlewares = [thunk];

// const localStorage = compose(
//   reduxLocalstorageFilter(['ローカルストレージで保存したい部分ステート名'])
// )(localStorageAdapter(window.localStorage));

// const sessionStorage = compose(
//   reduxLocalstorageFilter(['セッションストレージで保存したい部分ステート名'])
// )(sessionStorageAdapter(window.sessionStorage));

// const finalCreateStore = compose(
//   persistState(localStorage, 'キー名を指定したければそのキー名'),
//   persistState(sessionStorage, 'キー名を指定したければそのキー名'),
//   // applyMiddleware(...middlewares),
//   // reduxReactRouter({ routes, createHistory })
// )(createStore);

// export default function configureStore(initialState) {
//   const reducer = compose(mergePersistedState())(rootReducer);
//   return finalCreateStore(reducer, initialState);
// }