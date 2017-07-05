import func from "./functionx";

(function(){
  func.checkLogin();
})()


function resizeIframe(obj) {
    obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
}
