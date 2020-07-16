export default (state={}, action) => {
    switch(action.type) {
        case 'CATEGORY_LOADED':
            return {
                ...state,
                list: action.data.categoryList
            };
        default:
            return state;
    }
};
