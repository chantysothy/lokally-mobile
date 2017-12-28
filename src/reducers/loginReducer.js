import * as types from './../actions/constants';

const INITIAL_STATE = {
  acessTokenValue:[],
  loginSuccess:false,
  loginData:[],
  error:[],
  registerData:[],
  userData:[],
  cookie:[],
  notificationData:[],
  userUpdatedData:[],
  tags:[]
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "AUTHENTICATE":
      return {
        ...state,
        loginSuccess:false,
        acessTokenValue:action.payload
      }
    case "INITIAL_LOGIN":
      return {
        ...state,
        loginSuccess:false,
        loginData: action.payload
      };
    case "TAGS":
      return {
        ...state,
        tags:action.payload
      };
    case "REGISTER":
      return {
        ...state,
        registerData: action.payload
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        loginSuccess:true
      };
    case "PROFILE":
      return{
        ...state,
        userData:action.payload
      }
    case "PROFILE_EDIT_SUCCESS":
      return{
        ...state,
        userUpdatedData:action.payload
      }
  case "LOGOUT":
      return {
        ...state,
        userData: [],
        loginSuccess:false
      };
  case "COOKIE":
      return {
        ...state,
        cookie:action.payload
      };
  case "NOTIFY":
    return {
      ...state,
      notificationData:action.payload
    }
  case "GET_ERROR" :
    return {
      ...state,
      error:action.payload
    }
    default:
      return state;
  }
}
