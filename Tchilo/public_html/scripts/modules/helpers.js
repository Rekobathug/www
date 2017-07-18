
import axios from "axios";

function get(...selector){
  if(selector.length > 1){
    return document.querySelectorAll(selector[0])
  }
  return document.querySelector(selector[0]);
}

function validate(array, callback) {
    let validility;
  try {
      validility = array.every(callback);
      if(!validity) throw new Error("");
  }catch(e){
      const isEmpty = array.filter((each) => each.value === "");
      isEmpty.forEach(each => each.style.border = "1px solid rgba(190, 0,0, 0.6)")
      const isFill = array.filter((each) => each.value !== "");
      isFill.forEach(each => each.style.border = "1px solid grey")

  }
  finally {

    return validility
  }
}

async function postData(url, data) {
  var Querystring = require('querystring');
  var strdata = Querystring.stringify(data);
  var data2;
  var config = {
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  };
  const request = await axios.post(url, strdata, config).then(response => response.data)
  return await request
}
function getDomElement(array) {

  return array.map((domItem) => {
    return get(domItem);
  });
}

function isNotEmpty(element, array) {
  return element.value !== "";
}


function validate_leters(element) {
    var string = element.value;
    string = string.replace(/[^a-zA-Z]/g, "");
    element.value = string;
}
function validate_numbers(field) {
    var string = element.value;
    string = string.replace(/[^0-9]/g, "");
    element.value = string;
}
function validate_chars(field) {
    var string = element.value;
    string = string.replace(/[^a-zA-Z0-9@._-]/g, "");
    element.value = string;
}

function disabel_input(item, index, arr) {
    document.getElementById(arr[index]).disabled = true;
}
function enabel_input(item, index, arr) {
    document.getElementById(arr[index]).disabled = false;
}

function formdata(args) {
  const values = args.map((each) => {
    return each.value;
  })
  return values;
}

function visibility(panel) {
    for (var i = 0; i < panel.length; i++) {
        if (i === 0) {
            document.getElementById(panel[i]).style.display = 'block';
        } else {
            document.getElementById(panel[i]).style.display = 'none';
        }
    }
}

function visibility2(panel) {
    for (var i = 0; i < panel.length; i++) {
        if (i === 0) {
            if (document.getElementById(panel[i]).style.display === 'block') {
                document.getElementById(panel[i]).style.display = 'none';

            } else {
                document.getElementById(panel[i]).style.display = 'block';
            }
        } else {
            document.getElementById(panel[i]).style.display = 'none';
        }
    }
}


function checkForm(arg, callback) {
  return validate(getDomElement(arg), callback)
}

export  {get, validate,postData,getDomElement,isNotEmpty,formdata, checkForm,visibility,visibility2};
