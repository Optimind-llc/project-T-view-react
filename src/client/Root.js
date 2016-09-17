import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { ensureState } from 'redux-optimistic-ui';
import AppContainer from './containers/App/AppContainer';
import LandingContainer from './modules/landing/containers/Landing/LandingContainer';
import Home from './modules/landing/components/Home/Home';

export default class Root extends Component {
  static propTypes = {
    store: React.PropTypes.object.isRequired
  }

  render() {
    const {store} = this.props;
    const history = syncHistoryWithStore(
      browserHistory,
      store,
      { selectLocationState: state => ensureState(state).get('routing') }
    );

    return (
      <Provider store={store}>
        <Router history={history}>
          <Route component={AppContainer}>
            <Route path="/" component={LandingContainer}>
              <IndexRoute component={Home} />
              <Route path="home" component={Home}/>
            </Route>
            <Route path="about" component={Home}/>
          </Route>
        </Router>
      </Provider>
    );
  }
}

