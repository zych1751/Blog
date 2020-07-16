export default (state={}, action) => {
  switch(action.type) {
    case 'POST_LIST_LOADED':
      const result = {
        ...state,
        list: action.data.posts,
        currentPage: action.data.currentPage,
        endPage: action.data.endPage,
        postNumInPage: action.data.postNumInPage
      };
      if(typeof action.data.categoryId !== 'undefined')
        result['categoryId'] = action.data.categoryId;
      else if(typeof result.categoryId !== 'undefined')
        delete result['categoryId'];
      if(typeof action.data.categoryName !== "undefined")
        result["categoryName"] = action.data.categoryName;
      else if(typeof result.categoryName !== 'undefined')
        delete result['categoryName'];

      return result;
    case 'POST_CHANGED':
      return {
        ...state,
        title: action.data.post.title,
        contents: action.data.post.contents,
        category: action.data.category,
        date: action.data.post.createdAt
      };
    case 'DELETE_POST':
      return {
        ...state,
        list: state.list.filter((post) => (post.id !== action.id))
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
          if(post.id == action.data.id) {
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
