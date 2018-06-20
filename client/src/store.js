import { createStore, combineReducers } from 'redux';

import { admin, account } from './reducers';

const reducers = combineReducers({
    admin,
    account
});

const store = createStore(reducers);

export default store;
