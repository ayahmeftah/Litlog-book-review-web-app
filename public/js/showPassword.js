function init() {
  const passwordInputElem = document.querySelector("#password");
  const showBtnElem = document.querySelector("#show-password");

  if (passwordInputElem && showBtnElem) {
    showBtnElem.addEventListener("click", function (e) {
      e.preventDefault();

      if (passwordInputElem.type === "password") {
        passwordInputElem.type = "text"
        showBtnElem.textContent = "Hide"
      } else {
        passwordInputElem.type = "password"
        showBtnElem.textContent = "Show"
      }
    })
  }
}


document.addEventListener("DOMContentLoaded", init);
