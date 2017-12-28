import * as types from './../actions/constants';

const INITIAL_STATE = {
  dealCategory: [],
  deal:[],
  dealTrend:[],
  error:'',
  dealCount:0
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "GET_DEAL_CATEGORY":
      return {
        ...state,
        dealCategory: action.payload
      };
    case "CLEAR_DEAL":
      return {
        ...state,
        deal:[]
      };
    case "TOTAL_DEAL":
      return {
        ...state,
        dealCount: action.payload
      };
    case "GET_DEAL":
      return {
        ...state,
        deal: [...state.deal , ...action.payload]
      };
    case "DEAL":
      return {
        ...state,
        dealTrend: action.payload
      };
    case "GET_ERROR":
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
}
