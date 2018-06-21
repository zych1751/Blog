import { createStore, combineReducers } from 'redux';

import { admin, account, post } from './reducers';

const reducers = combineReducers({
    admin,
    account,
    post
});

const store = createStore(reducers);

export default store;
