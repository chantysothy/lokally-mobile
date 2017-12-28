import * as types from './../actions/constants';

const INITIAL_STATE = {
  eventsCategory: [],
  events:[],
  EventTrend:[],
  error:'',
  eventsCount:0,
  likes:[]
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "GET_EVENTS_CATEGORY":
      return {
        ...state,
        eventsCategory: action.payload
      };
    case "TOTAL_EVENTS":
      return {
        ...state,
       eventsCount : action.payload
      };
    case "CLEAR_EVENTS":
      return {
        ...state,
       events : []
      };
    case "GET_EVENTS":
      return {
        ...state,
        events:  [...state.events , ...action.payload]
       //events : action.payload
      };
    case "EVENTS":
      return {
        ...state,
        EventTrend: action.payload
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
