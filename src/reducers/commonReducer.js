import * as types from './../actions/constants';

const INITIAL_STATE = {
  likes : [],
  comments : [],
  commentData : [],
  totalComment: ''
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "LIKE_SUCCESS" :
        return {
            ...state,
            likes : action.payload
        }
    case "COMMENT_SUCCESS" :
        return {
            ...state,
            comments : action.payload
        }
    case "CLEAR_COMMENTS" :
        return {
            ...state,
            commentData : []
        }    
    case "GET_COMMENTS" :
        return {
            ...state,
            commentData : [...state.commentData , ...action.payload]
        }
    case "TOTAL_COMMENTS":
        return {
            ...state,
            totalComment : action.payload
        }
    default:
      return state;
  }
}
