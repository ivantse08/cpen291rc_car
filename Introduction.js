
//Taking username as a variable and store it passing on to the next page to display as well as
//displaying on LCD pico
function startFunction() {
  var username = document.getElementById("username").value;

  localStorage.setItem("username", username);

  var welcome_msg = document.createElement("div");
  welcome_msg.setAttribute("id", "welcome-message");
  welcome_msg.textContent = "Welcome " + username + " !";

  var container = document.getElementsByClassName("container")[0];
  container.appendChild(welcome_msg);

  setTimeout(function() {
  window.location.href = "MainPage.html?username=" + encodeURIComponent(username);
  }, 1000);
}