import * as types from './../actions/constants';

const INITIAL_STATE = {
  config:[],
  error:'',
  token :[],
  tokenError:[]
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "GET_CONFIG":
      return {
        ...state,
        config: action.payload
      };
    case "TOKEN" :
      return {
        ...state,
        token:action.payload
      } 
    case "CLEAR_TOKEN" : 
      return {
        ...state,
        token:[]
      }
    case "CLEAR_ERROR_TOKEN":
      return{
        ...state,
        tokenError:[]
      } 
    // case "TOKEN_RENUAL": {
    //   return {
    //     ...state,
    //     token: action.payload
    //   }
    // }
    case "TOKEN_ERROR": {
      return {
        tokenError: action.payload
      }
    } 
    default:
      return state;
  }
}
