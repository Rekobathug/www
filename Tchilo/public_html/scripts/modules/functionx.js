import axios from "axios";
var userlog, usrID, orgID;
userlog = false;


function getUserDetails(request){
  return{
    orgname: request.data.orgname,
    username: request.data.username
  }
}


function check_session(){
  return axios.get("PHP_User/check_session.php")
        .then((request) => getUserDetails(request))
        .then(username => console.log(username))
}


const func = {
  checkLogin: check_session
}


export default func;
