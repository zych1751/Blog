export default (state={}, action) => {
    switch(action.type) {
        case 'POST_LIST_LOADED':
            return {
                ...state,
                list: action.data
            };
        case 'POST_CHANGED':
            return {
                ...state,
                title: action.data.title,
                contents: action.data.contents,
                category: action.data.category
            };
        default:
            return state;
    }
};
