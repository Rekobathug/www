"use strict";

import axios from "axios";
import Navigation from "./nav";
import {
  get,
  validate,
  postData,
  getDomElement,
  isNotEmpty,
  formdata,
  checkForm,
  visibility,
  visibility2
} from "./helpers";


const str = {
  userLog: false,
  usrID: null,
  orgID: null,
  formUserLogin: ["#emailaddress", "#password"],
  formUserRegister: ["#firstname", "#lastname", "#date-of-birth", "#emailaddress", "#confirmemailaddress", "#password"],
  formOrgRegister: ["#organizationname", "#org-description", "#org-email", "#org-phonenumber"]
}


function getUserDetails(request) {
  return {
    orgname: request.data.orgname,
    username: request.data.username
  }
}

function authenticatePage(request) {
  const username = request.username;
  const path = window.location.pathname.split('/').pop() === "home.html";
  const path2 = window.location.pathname.split('/').pop() === "myorg.html";
  if (username && path) {
    return request;
  } else {
    str.userlog = false;
    return false;
  }
}

function user_check_session() {
  return axios.get("PHP_User/check_session.php")
    .then((request) => getUserDetails(request))
    .then((request) => authenticatePage(request))
    .then((request) => Navigation(request))
    .catch(e => console.log(e))
}


function initLogout() {
  return axios.get("PHP_User/logout.php")
}

function user_terminateSession() {
  initLogout()
    .then(() => window.location.reload())
}
async function user_login(arr, checker, url) {
  const form = checkForm(arr, checker);
  if (form) {
    const [userEmail, userPassword] = formdata(getDomElement(arr))
    const params = {
      emailaddress: userEmail,
      password: userPassword
    }
    const response = await postData(url, params)
    if (response.message === "Login successfull") {
      return window.location = "home.html"
    }
    return
  }
  return console.log("form error");

}

async function user_register(arr, checker, url) {
  const form = checkForm(arr, checker);
  if (form) {
    const [usrFirstName, usrLastName, usrDateOfBirth, usrEmailAddress, usrPassword, usrSex] = formdata(getDomElement(arr))
    const params = {
      firstname: usrFirstName,
      lastname: usrLastName,
      dateofbirth: usrDateOfBirth,
      emailaddress: usrEmailAddress,
      password: usrPassword,
      sex: usrSex
    }
    const response = await postData(url, params)
    console.log(response)
    if (response === 'Registration successfully') {
      login(["#emailaddress", "#password"], isNotEmpty, "PHP_user/login.php")
    }
    get('#response-message').innerHTML = response;
    return
  }
  return get('#response-message').innerHTML = ("form error");

}

async function org_register(arr, checker, url) {
  const form = checkForm(arr, checker);
  if (form) {
    const [orgName, orgDescription, orgEmail, orgPhonenumber] = formdata(getDomElement(arr))
    const params = {
      orgname: orgName,
      description: orgDescription,
      email: orgEmail,
      phonenumber: orgPhonenumber
    }
    const response = await postData(url, params)
    console.log(response)
    if (response === 'Registration successfully') {
      get('#create-response').innerHTML = response;
      visibility(['create-icon', 'create-details'])
    }
    return
  }
  return get('#create-response').innerHTML = ("form error");

}


function createTablelist(data, element) {
  const table = document.createElement('table')

  if (data.hasOwnProperty("headers")) {
    const headersnames = data.headers
    const row = document.createElement('tr');
    for (var i = 0; i < headersnames.length; i++) {
      const th = document.createElement('th');
      th.innerHTML = headersnames[i];
      row.appendChild(th)
    }
    table.appendChild(row)
  }
  const info = data.info
  const del = data.del
  console.log(info.length)
  for (var i = 0; i < info.length; i++) {
    console.log(i)
    const obj = info[i]
    var row = table.insertRow(0);
    var properties = Object.keys(obj)
    console.log(properties);
    for (var z = 0; z < properties.length; z++) {
      var cell = row.insertCell(z);
      cell.innerHTML = obj[properties[z]]
    }
    if (del) {
      var btn = document.createElement("button"); // Create a <button> element
      btn.setAttribute("onclick", '');
      btn.setAttribute("value", "X");
      console.log(properties.length)
      var cell = row.insertCell(properties.length);
      cell.appendChild(btn)
    }
  }
}

function createTableImage(data, element) {
  const table = document.createElement('table')
  const info = data.info
  console.log(info.length)
  const colnum = 0;
  for (var i = 0; i < info.length; i++) {
    if (colnum === 0) {
      var row = table.insertRow();
    }
    const obj = info[i]
    var properties = Object.keys(obj)
    console.log(obj);
    console.log(properties);
    var title = document.createTextNode(properties[0]);
    if (obj.hasOwnProperty("image")){
      var image = document.createElement("IMG");
    image.setAttribute("src", obj['image']);
    image.setAttribute("width", "200");
    image.setAttribute("alt", org['orgname']);
  }

}

console.log(table);
get(element).appendChild(table)
}

async function get_organizations(orgname) {
  const params = {
    orgname: orgname
  }
  const response = await postData("PHP_Organizations/get_organizations.php", params)
  const data = {
    info: response,
    del: false
    type: 2
  }
  createTablelist(data, '#orgs')


}



if (window.location.pathname.split('/').pop() === "login.html") {
  get("#login").addEventListener("click", (e) => {
    e.preventDefault();
    func.Ulogin(func.str.formUserLogin, isNotEmpty, "PHP_user/login.php")
  });
}
if (window.location.pathname.split('/').pop() === "home.html") {
  get("#logout").addEventListener("click", (e) => {
    e.preventDefault();
    func.Ulogout()
  });
}

if (window.location.pathname.split('/').pop() === "register.html") {
  get("#register").addEventListener("click", (e) => {
    e.preventDefault();
    func.Uregister(func.str.formUserRegister, isNotEmpty, "PHP_user/add_user.php")
  });
}

if (window.location.pathname.split('/').pop() === "organization.html") {
  get("#register").addEventListener("click", (e) => {
    e.preventDefault();
    func.Oregister(func.str.formOrgRegister, isNotEmpty, "PHP_Org/add_org.php")
  });
  get("#create").addEventListener("click", (e) => {
    e.preventDefault();
    visibility(['createorg', 'vieworgs'])
  });
  (function() {
    get_organizations("ALL")
  })()
}




const func = {
  UcheckLogin: user_check_session,
  Ulogout: user_terminateSession,
  Ulogin: user_login,
  Uregister: user_register,
  Oregister: org_register,
  str: str
}


export default func;
