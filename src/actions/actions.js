import * as types from "./constants";
import {authenticateUserToken,refreshAccessToken,insertLike,insertComments,getCommentsById,getAllTags,notification,getUserById,findEvents,findNews,findDeal,findEventsTrend,registration,findDealTrend,findNewsTrend,category} from "../utilities/config.js";

export function authenticate(number,token) {
  return dispatch => { 
    return new Promise((resolve, reject) => {
      dispatch({ type:"CLEAR_TOKEN"});
      dispatch({ type:"CLEAR_ERROR_TOKEN"});
      resolve(
        authenticateUserToken(number,token).then(accessToken => {
            dispatch({ type:"TOKEN", payload: accessToken.access_token});
            dispatch({ type: "AUTHENTICATE", payload: accessToken });            
        })
      );
    }).catch(err => {
      dispatch({ type: "GET_ERROR", payload: err });
    });
  };
}

export function loginSuccess(id) {
  return dispatch => {
    dispatch({ type: "LOGIN_SUCCESS"});            
  }
}

/*export function loginAction(number) {
  return dispatch => { 
    return new Promise((resolve, reject) => {
      resolve(
        login(number).then(login => {
            dispatch({ type: "INITIAL_LOGIN", payload: login });            
        })
      );
    }).catch(err => {
      dispatch({ type: "GET_ERROR", payload: err });
    });
  };
}
export function getCookie() {
  return dispatch => {
        fetch("https://api.lokally.in/api/test-cookie", {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          dispatch({ type:"COOKIE", payload: response.json()});
        })
        .catch(err => {
          dispatch({ type:"GET_ERROR", payload: err });
    });
  };
}*/  

export function userLike(obj,token) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      resolve(
        insertLike(obj,token).then(res=> {
            dispatch({ type:"LIKE_SUCCESS", payload: res });
            dispatch({ type:"CLEAR_ERROR_TOKEN"});
        })
      );
    }).catch(err => {
      dispatch({ type:"CLEAR_ERROR_TOKEN"});
      dispatch({type: "TOKEN_ERROR", payload :err})
    });
  };
} 

export function userComments(obj,token) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      resolve(
        insertComments(obj,token).then(res=> {
            dispatch({ type:"COMMENT_SUCCESS", payload: res });
            dispatch({ type:"CLEAR_ERROR_TOKEN"});
        })
      );
    }).catch(err => {
      dispatch({ type:"CLEAR_ERROR_TOKEN"});
      dispatch({type: "TOKEN_ERROR", payload :err})
    });
  };
}

export function getUser(token) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      resolve(
          getUserById(token).then(profile=> {
            dispatch({ type:"PROFILE", payload: profile });
            dispatch({ type:"CLEAR_ERROR_TOKEN"});
        })
      );
    }).catch(err => {
      dispatch({ type:"CLEAR_ERROR_TOKEN"});
      dispatch({type: "TOKEN_ERROR", payload :err})
    });
  };
}

export function tokenRenual(token) {
  //console.warn("1",token)
  return dispatch => { 
    return new Promise((resolve, reject) => {
      dispatch({ type:"CLEAR_TOKEN"});
      resolve(
        refreshAccessToken(token).then(token=> {
            //console.warn("toke4",token)
            dispatch({ type:"TOKEN", payload: token.access_token});
            dispatch({ type:"CLEAR_ERROR_TOKEN"});
        })
      );
    }).catch(err => {
      dispatch({ type:"CLEAR_ERROR_TOKEN"});
      dispatch({type: "TOKEN_ERROR", payload :err})
    });
  };
}

export function logOutUser(){
  return dispatch => {
      dispatch({ type: "LOGOUT"});
  };
}

export function getComments(id,count,value) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      if(count === 0){
        dispatch({type:"CLEAR_COMMENTS"})
        resolve(
          getCommentsById(id,count,value).then(comments => {
            //console.warn("1",comments)
            dispatch({ type: "GET_COMMENTS", payload: comments.hits.hits });
            dispatch({type:"TOTAL_COMMENTS",payload: comments.hits.total})
          })
        );
      }else{
      resolve(
        getCommentsById(id,count,value).then(comments => {
          dispatch({ type: "GET_COMMENTS", payload: comments.hits.hits });
          dispatch({type:"TOTAL_COMMENTS",payload: comments.hits.total})
        })
      );
    }
    }).catch(err => {
      dispatch({ type: "GET_ERROR", payload: err });
    });
  };
}


export function getAllEventsCategories() {
  return dispatch => {
    return new Promise((resolve, reject) => {
      resolve(
        //findEventCategory.then(eventsTag =>{
        category("event").then(eventsTag => {
          dispatch({ type: "GET_EVENTS_CATEGORY", payload: eventsTag });
        })
      );
    }).catch(err => {
      dispatch({ type: "GET_ERROR", payload: err });
    });
    return events;
  };
}

export function getAllEvents(tagName,count) {
  //console.warn(tagName,count)
  return dispatch => {
    return new Promise((resolve, reject) => {
      if(count === 0){
        dispatch({type:"CLEAR_EVENTS"})
        resolve(
          findEvents(tagName,count).then(events => {
            //console.warn("action", events.hits.total, events.hits.hits.length, events)
            dispatch({ type: "GET_EVENTS", payload: events.hits.hits });
            dispatch({type:"TOTAL_EVENTS",payload: events.hits.total})
          })
        );
      }else{
      resolve(
        findEvents(tagName,count).then(events => {
          //console.warn("action", events.hits.total, events.hits.hits.length, events)
          dispatch({ type: "GET_EVENTS", payload: events.hits.hits });
          dispatch({type:"TOTAL_EVENTS",payload: events.hits.total})
        })
      );
    }
    }).catch(err => {
      dispatch({ type: "GET_ERROR", payload: err });
    });
  };
}

export function getAllEventsTrend() {
  return dispatch => {
    return new Promise((resolve, reject) => {
       resolve(
        findEventsTrend().then(events => {
          dispatch({ type: "EVENTS", payload: events });
        })
      );
    }).catch(err => {
      dispatch({ type: "GET_ERROR", payload: err });
    });
  };
}

export function getAllNewsCategories() {
  return dispatch => {
    return new Promise((resolve, reject) => {
      resolve(
        //findNewsCategory().then(newsTag => {
        category("news").then(newsTag => {
          dispatch({ type: "GET_NEWS_CATEGORY", payload: newsTag });
        })
      );
    }).catch(err => {
      dispatch({ type: "GET_ERROR", payload: err });
    });
    return events;
  };
}

export function getAllNews(tagName,count) {
  //console.warn(tagName,count)
  return dispatch => {
    return new Promise((resolve, reject) => {
      if(count === 0){
        dispatch({type:"CLEAR_NEWS"})
        resolve(
          findNews(tagName,count).then(news => {
            dispatch({ type: "GET_NEWS", payload: news.hits.hits });
            dispatch({type:"TOTAL_NEWS",payload: news.hits.total})
          })
        );
      }else{
      resolve(
        findNews(tagName,count).then(news => {
          dispatch({ type: "GET_NEWS", payload: news.hits.hits });
          dispatch({type:"TOTAL_NEWS",payload: news.hits.total})
        })
      );
    }
    }).catch(err => {
      dispatch({ type: "GET_ERROR", payload: err });
    });
  };
}
export function getAllDeal(tagName,count) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      if(count === 0){
        dispatch({type:"CLEAR_DEAL"})
        resolve(
          findDeal(tagName,count).then(deal => {
            dispatch({ type: "GET_DEAL", payload: deal.hits.hits });
            dispatch({type:"TOTAL_DEAL",payload: deal.hits.total})
          })
        );
      }else{
      resolve(
        findDeal(tagName,count).then(deal => {
          dispatch({ type: "GET_DEAL", payload: deal.hits.hits });
          dispatch({type:"TOTAL_DEAL",payload: deal.hits.total})
        })
      );
    }
    }).catch(err => {
      dispatch({ type: "GET_ERROR", payload: err });
    });
  };
}

export function getAllNewsTrend() {
  return dispatch => {
    return new Promise((resolve, reject) => {
      resolve(
        findNewsTrend().then(news => {
          dispatch({ type: "NEWS", payload: news });
        })
      );
    }).catch(err => {
      dispatch({ type: "GET_ERROR", payload: err });
    });
  };
}

export function getAllDealCategories() {
  return dispatch => {
    return new Promise((resolve, reject) => {
      resolve(
        //findDealCategory().then(deaTag =>{
        category("deals").then(deaTag => {
          dispatch({ type: "GET_DEAL_CATEGORY", payload: deaTag });
        })
      );
    }).catch(err => {
      dispatch({ type: "GET_ERROR", payload: err });
    });
    return events;
  };
}

export function getAllDealTtrend() {
  return dispatch => {
    return new Promise((resolve, reject) => {
      resolve(
        findDealTrend().then(deal => {
          dispatch({ type: "DEAL", payload: deal });
        })
      );
    }).catch(err => {
      dispatch({ type: "GET_ERROR", payload: err });
    });
  };
}


export function userregister(obj,token) {
  //console.warn("1",obj,token)
  return dispatch => {
    return new Promise((resolve, reject) => {
      resolve(
        registration(obj,token).then(register => {
            //console.warn("4",register)
            dispatch({ type: "REGISTER", payload: register });            
        })
      );
    }).catch(err => {
      dispatch({ type: "GET_ERROR", payload: err });
    });
  };
}

export function updateUserValue(obj,token) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      resolve(
        registration(obj,token).then(updateregister => {
            dispatch({ type: "PROFILE_EDIT_SUCCESS", payload: updateregister });
            dispatch({ type:"CLEAR_ERROR_TOKEN"});            
        })
      );
    }).catch(err => {
      dispatch({ type:"CLEAR_ERROR_TOKEN"});
      dispatch({type: "TOKEN_ERROR", payload :err})
    });
  };
}

export function pushNotification(id) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      resolve(
        notification(id).then(notificationData => {
            dispatch({ type: "NOTIFY", payload: notificationData });            
        })
      );
    }).catch(err => {
      dispatch({ type: "GET_ERROR", payload: err });
    });
  };
}

export function getAllTag(){
  return dispatch => {
    return new Promise((resolve, reject) => {
      resolve(
        getAllTags().then(tag => {
            dispatch({ type: "TAGS", payload: tag.hits.hits });            
        })
      );
    }).catch(err => {
      dispatch({ type: "GET_ERROR", payload: err });
    });
  };
}



export function configDetails() {
  return dispatch => {
    fetch("https://s3.ap-south-1.amazonaws.com/lokally-mobile-app/config.json", {
      method: 'GET'
      })
      .then((response) => {
          return response.json();
      })
      .then((data)=>{
        dispatch({ type: "GET_CONFIG", payload: JSON.parse(data) });
      })
      .catch((error) => {
          console.warn(error);
      });
  };
}
