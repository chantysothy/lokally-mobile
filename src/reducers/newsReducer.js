import * as types from './../actions/constants';

const INITIAL_STATE = {
  newsCategory: [],
  news:[],
  NewsTrend:[],
  error:'',
  newsCount:0
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "GET_NEWS_CATEGORY":
      return {
        ...state,
        newsCategory: action.payload
      };
    case "TOTAL_NEWS":
      return {
        ...state,
        newsCount: action.payload
      };
    case "CLEAR_NEWS":
      return {
        ...state,
        news: []
      };
    case "GET_NEWS":
      return {
        ...state,
        news: [...state.news , ...action.payload]
      };
    case "NEWS":
      return {
        ...state,
        NewsTrend:action.payload
      }
    case "GET_ERROR":
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
}
