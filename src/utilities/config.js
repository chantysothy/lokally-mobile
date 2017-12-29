var baseurl = "https://api.lokally.in/";


var authenticateUserToken = (phoneNo,fbToken) => {
    return new Promise((res,rej)=>{
        fetch(baseurl+"oauth/token", {
            method: 'POST',
            body:JSON.stringify({
                "mobile_number" : phoneNo,
                "fb_access_token": fbToken
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            return res(response.json());
        })
        .catch((error) => {
            console.warn("err",error);
        });
    })
}
var refreshAccessToken = (token) => {
    //console.warn("2",token)
    return new Promise((res,rej)=>{
        fetch(baseurl+"oauth/refresh_token", {
            method: 'POST',
            headers: {
                'Authorization': token
            }
        })
        .then((response) => {
            //console.warn("3",response)
            return res(response.json());
        })
        .catch((error) => {
            console.warn("err",error);
        });
    })
}

var insertLike = (obj,token) => {
    return new Promise((res,rej)=>{
        fetch(baseurl+"profile/like", {
            method: 'POST',
            body:JSON.stringify(obj),
            headers: {
                'Authorization': token
            }
        })
        .then((response) => {
            //console.warn("like",response)
            return res(response.json());
        })
        .catch((error) => {
            console.warn("err",error);
        });
    })
}  

var getUserLike = (id,token) => {
    return new Promise((res,rej)=>{
        fetch(baseurl+"profile/getlike?id="+id, {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        })
        .then((response) => {
            return res(response.json());
        })
        .catch((error) => {
            console.warn("err",error);
        });
    })
}  


var insertComments = (obj,token) => {
    return new Promise((res,rej)=>{
        fetch(baseurl+"/profile/comment", {
            method: 'POST',
            body:JSON.stringify(obj),
            headers: {
                'Authorization': token
            }
        })
        .then((response) => {
            return res(response.json());
        })
        .catch((error) => {
            console.warn("err",error);
        });
    })
}
/*var login = (phoneNo,token) => {
    return new Promise((res,rej)=>{
        fetch(baseurl+"user/login", {
            method: 'POST',
            body:JSON.stringify({
                "mobile_number" : phoneNo
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            return res(response.json());
        })
        .catch((error) => {
            console.warn("err",error);
        });
    })
}*/

var registration = (obj,token) =>{
    //console.warn("2",obj,token)
    return new Promise((res,rej)=>{
        fetch(baseurl+"profile/update", {
            method: 'POST',
            body:JSON.stringify(obj),
            headers: {
                'Authorization': token
            }
        })
        .then((response) => {
            //console.warn("3",response.json())
            return res(response.json());
        })
        .catch((error) => {
            console.warn("err",error);
        });
    })
}

var getUserById = (token) => {
    return new Promise((res, rej) => {
		fetch(baseurl+"profile/user", {
            method: 'POST',
            headers: {
                'Authorization': token
            }
        })
        .then((response) => {
            return res(response.json());
        })
        .catch((error) => {
            console.warn("err",error);
        });
	})  
}

var category = (category) => {
    return new Promise((res, rej) => {
		fetch(baseurl+"get/top-hits?category="+category, {
            method: 'POST'
        })
        .then((response) => {
            return res(response.json());
        })
        .catch((error) => {
            console.warn("err",error);
        });
	})  
}
var notification = (id) => {
	return new Promise((res, rej) => {
		fetch(baseurl+"get/by-query?index=*&type=list", {
            method: 'POST',
            body:JSON.stringify({
                "query" : {
                    "match" : {
                        "_id" : id
                    }
                }
            })
        })
        .then((response) => {
            return res(response.json());
        })
        .catch((error) => {
            console.warn("err",error);
        });
	})
}

var findEvents = (tagName,count) => {
	return new Promise((res, rej) => {        
		fetch(baseurl+"get/esrecordbyfield?index=event&fieldname=tags&fieldvalue="+tagName+"&from="+count+"&size=5", {
            method: 'GET'
        })
        .then((response) => {
            return res(response.json());
        })
        .catch((error) => {
            console.warn("err",error);
        });
	})
}

var findNews = (tagName,count) => {
	return new Promise((res, rej) => {
		fetch(baseurl+"get/esrecordbyfield?index=news&fieldname=tags&fieldvalue="+tagName+"&from="+count+"&size=5", {
            method: 'GET'
        })
        .then((response) => {
            return res(response.json());
        })
        .catch((error) => {
            console.warn("err",error);
        });
	})
}


var findDeal = (tagName,count) => {
	return new Promise((res, rej) => {
		fetch(baseurl+"get/esrecordbyfield?index=deals&fieldname=tags&fieldvalue="+tagName+"&from="+count+"&size=5", {
            method: 'GET'
        })
        .then((response) => {
            return res(response.json());
        })
        .catch((error) => {
            console.warn("err",error);
        });
	})
}

var eventsLike = (id) => {
    return new Promise((res,rej)=>{
        fetch(baseurl+"get/esrecordbyid?id="+id,{
            method:'GET'
        })
        .then((response) => {
            return res(response.json());
        })
        .catch((error) => {
            console.warn("err",error);
        });
    })
}

var getCommentsById=(id,count)=>{
    return new Promise((res,rej)=>{
        fetch(baseurl+" /get/commentbyitemid?id="+id+"&from="+count+"&size=5",{
            method:'GET'
        })
        .then((response) => {
            return res(response.json());
        })
        .catch((error) => {
            console.warn("err",error);
        });
    })
}

var deleteCommentById=(id,token)=>{
    return new Promise((res, rej) => {
		fetch(baseurl+"/profile/deletecomment?id="+id, {
            method: 'POST',
            headers: {
                'Authorization': token
            }
        })
        .then((response) => {
            //console.warn("res",response.json())
            return res(response.json());
        })
        .catch((error) => {
            console.warn("err",error);
        });
	})
}

var getAllTags = () => { 
    return new Promise((res,rej)=>{
        fetch(baseurl+"get/tags",{
            method:'GET'
        })
        .then((response) => {
            return res(response.json());
        })
        .catch((error) => {
            console.warn("err",error);
        });
    })
}



var findEventsTrend = () => {
	return new Promise((res, rej) => {
		fetch(baseurl+"get/eventdata?from=0&size=5", {
            method: 'GET'
        })
        .then((response) => {
            return res(response.json());
        })
        .catch((error) => {
            console.warn("err",error);
        });
	})
}

var findNewsTrend = () => {
	return new Promise((res, rej) => {
		fetch(baseurl+"get/newsdata?from=0&size=5", {
            method: 'GET'
        })
        .then((response) => {
            return res(response.json());
        })
        .catch((error) => {
            console.warn("err",error);
        });
	})
}

var findDealTrend = () => {
	return new Promise((res, rej) => {
		fetch(baseurl+"get/dealsdata?from=0&size=5", {
            method: 'GET'
        })
        .then((response) => {
            return res(response.json());
        })
        .catch((error) => {
            console.warn("err",error);
        });
	})
}
exports.authenticateUserToken = authenticateUserToken;


exports.findEvents = findEvents;
exports.findNews = findNews;
exports.findDeal = findDeal;
exports.findNewsTrend = findNewsTrend;
exports.findEventsTrend = findEventsTrend;
exports.findDealTrend = findDealTrend;
exports.category = category;
//exports.login = login;
exports.registration = registration
exports.getUserById = getUserById;
exports.notification = notification;
exports.eventsLike = eventsLike;
exports.getAllTags = getAllTags;
exports.refreshAccessToken = refreshAccessToken;
exports.insertLike = insertLike;
exports.getUserLike = getUserLike;
exports.insertComments = insertComments;
exports.getCommentsById = getCommentsById;
exports.deleteCommentById = deleteCommentById;