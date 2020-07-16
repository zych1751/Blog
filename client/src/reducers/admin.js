export default (state={}, action) => {
    switch(action.type) {
        case 'SET_EDIT':
            return {
                ...state,
                postToEdit: action.post
            };
        case 'POST_FORM_LOAD':
            return {
                ...state,
                categoryList: action.data.categoryList
            }
        case 'EDIT_POST':
            return {
                ...state,
                postToEdit: undefined
            }
        case 'SUBMIT_CATEGORY':
            return {
                ...state,
                categoryList: ([action.data].concat(state.categoryList))
            };
        default:
            return state;
    }
};
