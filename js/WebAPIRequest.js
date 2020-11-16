/*
    Méthodes d'accès aux services Web API_Server/bookmarks
 */

const apiBaseURL= "http://localhost:5000/api/";
const apiAccountURL = "http://localhost:5000/accounts";
const tokenURL = "http://localhost:5000/token";
//const apiBaseURL= "https://blushing-imaginary-streetcar.glitch.me/api/bookmarks";

function getBearerToken(){
    return sessionStorage.getItem("token");
}

function webAPI_GET_ALL(queryString, successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL + "bookmarks" + queryString,
        type: 'GET',
        contentType:'text/plain',
        data:{},
        success: data => { successCallBack(data); console.log("webAPI_GET_ALL - success", data); },
        error: function(jqXHR, textStatus, errorThrown) {
            errorCallBack(errorThrown);
            console.log("webAPI_GET_ALL - error");
        }
    });
}

function webAPI_GET( id, successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL + "bookmarks/" + id,
        type: 'GET',
        contentType:'text/plain',
        data:{},
        success: data  => { successCallBack(data); console.log("webAPI_GET - success", data);},
        error: function(jqXHR, textStatus, errorThrown) {
            errorCallBack(errorThrown);
            console.log("webAPI_GET - error");
        }
    });
}

function webAPI_POST( data, controller, successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL + controller,
        type: 'POST',
        contentType:'application/json',
        data: JSON.stringify(data),
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("authorization", getBearerToken());
        },
        success: (data) => {successCallBack();  console.log("webAPI_POST - success", data); },
        error: function(jqXHR, textStatus, errorThrown) {
            errorCallBack(errorThrown);
            console.log("webAPI_POST - error");
        }
    });
}

function webAPI_PUT(data, controller, successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL + controller + "/" + data.Id,
        type: 'PUT',
        contentType:'application/json',
        data: JSON.stringify(data),
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("authorization", getBearerToken());
        },
        success:(s) => {successCallBack();  console.log("webAPI_PUT - success", s); },
        error: function(jqXHR, textStatus, errorThrown) {
            errorCallBack(errorThrown);
            console.log("webAPI_PUT - error");
        }
    });
}

function webAPI_DELETE( id, controller, successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL + controller + "/" + id,
        contentType:'text/plain',
        type: 'DELETE',
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("authorization", getBearerToken());
        },
        success:() => {successCallBack();  console.log("webAPI_DELETE - success"); },
        error: function(jqXHR, textStatus, errorThrown) {
            errorCallBack(errorThrown);
            console.log("webAPI_DELETE - error");
        }
    });
}

function webAPI_LOGIN(email, password, successCallBack, errorCallback){
    $.ajax({
        url: tokenURL,
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify({"Email" : email, "Password" : password}),
        success: (data) => {
            successCallBack(data);
            console.log("WebAPI_login - success");
        },
        error : function(jqXHR, textStatus, errorThrown) {
            errorCallback(errorThrown);
            console.log("webAPI_login - error");
        }
    });
}

function webAPI_ChangeProfil(profil, successCallBack, errorCallback){
    $.ajax({
        url: apiAccountURL + "/change",
        contentType: 'application/json',
        type: 'PUT',
        data: JSON.stringify(profil),
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("authorization", getBearerToken());
        },
        success: (data) => {
            successCallBack(data);
            console.log("WebAPI_ChangeProfil - success");
        },
        error : function(jqXHR, textStatus, errorThrown) {
            errorCallback(errorThrown);
            console.log("webAPI_ChangeProfil - error");
        }
    })
}

function webAPI_Register(profil, successCallBack, errorCallback){
    $.ajax({
        url: apiAccountURL + "/register",
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify(profil),
        success: () => {
            successCallBack();
            console.log("WebAPI_Register - success");
        },
        error : function(jqXHR, textStatus, errorThrown) {
            errorCallback(errorThrown);
            console.log("webAPI_Register - error");
        }
    })
}