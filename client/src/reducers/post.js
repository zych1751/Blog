export default (state={}, action) => {
    switch(action.type) {
        case 'POST_LIST_LOADED':
            const result = {
                ...state,
                list: action.data.posts,
                currentPage: action.data.currentPage,
                endPage: action.data.endPage,
                postNumInPage: action.data.postNumInPage
            }
            if(typeof action.data.categoryId !== "undefined")
                result["categoryId"] = action.data.categoryId;
            return result;
        case 'POST_CHANGED':
            return {
                ...state,
                title: action.data.title,
                contents: action.data.contents,
                category: action.data.category,
                date: action.data.date.created
            };
        case 'DELETE_POST':
            return {
                ...state,
                list: state.list.filter((post) => (post._id !== action.id))
            };
        case 'SUBMIT_POST':
            return {
                ...state,
                list: ([action.data].concat(state.list))
            };
        case 'EDIT_POST':
            return {
                ...state,
                list: state.list.map((post) => {
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
