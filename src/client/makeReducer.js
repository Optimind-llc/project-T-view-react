import { combineReducers } from 'redux-immutablejs';
import { reducer as form } from 'redux-form';
//my reducers
// import application from './reducer/application';
// import alert from './reducer/alert';
// import disposable from './reducer/disposable';

		import {LOCATION_CHANGE} from 'react-router-redux';

		const initialState = {locationBeforeTransitions: null};

		// TODO: may be possible to hold this in an immutable Map in the state now
		// export const routing = (state = initialState, {type, payload}) => {
		//  switch (type) {
		//    case LOCATION_CHANGE:
		//      return state.set('locationBeforeTransitions', payload);
		//    default:
		//      return state
		//  }
		// }

		const routing = (state = initialState, {type, payload}) => {
		  if (type === LOCATION_CHANGE) {
		    return {...state, locationBeforeTransitions: payload};
		  }
		  return state;
		};

const currentReducers = {
  routing,
  form
};

export default (newReducers, reducerEnhancers) => {
  Object.assign(currentReducers, newReducers);
  const reducer = combineReducers({...currentReducers});
  if (reducerEnhancers) {
    return Array.isArray(reducerEnhancers) ? compose(...reducerEnhancers)(reducer) : reducerEnhancers(reducer);
  }

  return reducer;
};

