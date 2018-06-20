export default (state={}, action) => {
    switch(action.type) {
        case 'HOME_PAGE_LOADED':
            return {
                ...state,
                posts: action.data
            };
        case 'SUBMIT_POST':
            return {
                ...state,
                posts: ([action.data].concat(state.posts))
            };
        case 'DELETE_POST':
            return {
                ...state,
                posts: state.posts.filter((post) => (post._id !== action.id))
            };
        case 'SET_EDIT':
            return {
                ...state,
                postToEdit: action.post
            };
        case 'EDIT_POST':
            return {
                ...state,
                posts: state.posts.map((post) => {
                    if(post._id == action.data._id) {
                        return {
                            ...action.data
                        };
                    }
                    return post;
                }),
                postToEdit: undefined
            }
        default:
            return state;
    }
};
