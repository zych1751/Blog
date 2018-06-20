export default (state={}, action) => {
    switch(action.type) {
        case 'HEADER_LOADED':
            return {
                ...state,
                login: action.data.login,
                admin: action.data.admin
            };
        case 'LOGIN':
            return {
                ...state,
                login: action.data.login,
                admin: action.data.admin
            };
        case 'LOGOUT':
            return {
                ...state,
                login: false,
                admin: false
            };
        default:
            return state;
    }
};
