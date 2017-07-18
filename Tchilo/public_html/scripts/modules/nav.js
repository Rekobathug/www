import func from "./functionx";



function  renderNavigation(request){

  const {username, orgname} = request;
  const navItem = document.querySelectorAll(".nav-item");
  const array = [...navItem];
  array.forEach((each) => each.style.display = "block");
  document.getElementById("nav6").style.display = "none";
  document.getElementById("nav9").style.display = "none";
  document.getElementById("username").innerHTML = "welcome " + username;

  if (orgname !== undefined) {
      document.getElementById("nav9").style.display = "block";
      document.getElementById("nav9").childNodes[0].innerHTML = orgname;
  }

}

function Navigation(request){
  if(request === false) {
    return;
  }
  return renderNavigation(request);
}

export default Navigation;
