import { createStore, combineReducers } from 'redux';

import { admin, account, post, category } from './reducers';

const reducers = combineReducers({
    admin,
    account,
    post,
    category
});

const store = createStore(reducers);

export default store;
